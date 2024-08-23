import json
from aux import moneyfmt, get_locale_prize, parse_contest, get_new_data


def run(_event, _context):

    try:
        lottery_data = []

        with open('app/src/data/resultados.json') as reader:
            lottery_data = json.loads(reader.read())

        # Is there new data?
        found_something = get_new_data(lottery_data)

        # If new contests were found, update the file
        if found_something:
            with open('app/src/data/resultados_new.json', 'w') as writer:
                writer.write(json.dumps(lottery_data))
    except Exception as e:
        print(e)


run(None, None)
