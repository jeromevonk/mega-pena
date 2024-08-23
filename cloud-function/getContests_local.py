import json

import requests
from aux import moneyfmt, get_locale_prize, parse_contest


def run(_event, _context):

    try:
        lottery_data = []

        with open('app/src/data/resultados.json') as reader:
            lottery_data = json.loads(reader.read())

        # How many results?
        print('There are {} contests, last is {} in {}'.format(
            len(lottery_data), lottery_data[0]['contestNumber'], lottery_data[0]['date']))

        # Check if there is new data
        last = lottery_data[0]['contestNumber']
        look_for = last + 1

        keep_looking = True
        found_something = False

        while keep_looking:
            print(f'Trying to get contest numer {look_for}')
            r = requests.get(f'https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/{look_for}')
            data = r.json()

            if 'numero' in data:
                print(f'Got contest number {look_for}')
                new_item = parse_contest(data)

                # Insert in list
                found_something = True
                lottery_data.insert(0, new_item)

                # Increment
                look_for += 1

            else:
                print(f'No contest number {look_for} found. End.')
                keep_looking = False

        # If new contests were found, update the file
        if found_something:
            with open('app/src/data/resultados_new.json', 'w') as writer:
                writer.write(json.dumps(lottery_data))
    except Exception as e:
        print(e)


run(None, None)
