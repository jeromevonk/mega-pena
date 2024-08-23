from gcloud import storage
import json
import requests

from aux import moneyfmt, get_locale_prize, parse_contest

FILE_NAME = 'lottery-data.json'


def run(_event, _context):
    try:
        # Connect
        client = storage.Client(project='mega-pena')
        bucket = client.get_bucket('lottery-data')

        # Get current data
        blob = bucket.get_blob(FILE_NAME)
        data = blob.download_as_string()
        lottery_data = json.loads(data)

        # How many results?
        print(
            f"There are {len(lottery_data)} contests, last is {lottery_data[0]['contestNumber']} in {lottery_data[0]['date']}")

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
            blob = bucket.blob(FILE_NAME)
            blob.upload_from_string(json.dumps(lottery_data, separators=(',', ':')), content_type='application/json')
    except Exception as e:
        print(e)
