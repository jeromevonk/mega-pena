from decimal import Decimal
import requests


def moneyfmt(value, places=2, curr='', sep=',', dp='.',
             pos='', neg='-', trailneg=''):
    """Convert Decimal to a money formatted string.

    places:  required number of places after the decimal point
    curr:    optional currency symbol before the sign (may be blank)
    sep:     optional grouping separator (comma, period, space, or blank)
    dp:      decimal point indicator (comma or period)
             only specify as blank when places is zero
    pos:     optional sign for positive numbers: '+', space or blank
    neg:     optional sign for negative numbers: '-', '(', space or blank
    trailneg:optional trailing minus indicator:  '-', ')', space or blank
    """
    q = Decimal(10) ** -places      # 2 places --> '0.01'
    sign, digits, _ = value.quantize(q).as_tuple()
    result = []
    digits = list(map(str, digits))
    build, next_digit = result.append, digits.pop
    if sign:
        build(trailneg)
    for i in range(places):
        build(next_digit() if digits else '0')
    if places:
        build(dp)
    if not digits:
        build('0')
    i = 0
    while digits:
        build(next_digit())
        i += 1
        if i == 3 and digits:
            i = 0
            build(sep)
    build(curr)
    build(neg if sign else pos)
    return ''.join(reversed(result))


def get_locale_prize(prize):
    if prize == 0:
        return "-"
    else:
        return moneyfmt(Decimal(prize), places=2, sep='.', dp=',')


def parse_contest(data):
    return {
        "contestNumber": data['numero'],
        "date": data["dataApuracao"],
        "drawnNumbers": list(map(lambda num: int(num), data["listaDezenas"])),
        "prizeForNextContest": get_locale_prize(data["valorAcumuladoProximoConcurso"]),
        "awards": {
            "sena": {
                "winners": data["listaRateioPremio"][0]["numeroDeGanhadores"],
                "prize": get_locale_prize(data["listaRateioPremio"][0]["valorPremio"])
            },
            "quina": {
                "winners": data["listaRateioPremio"][1]["numeroDeGanhadores"],
                "prize": get_locale_prize(data["listaRateioPremio"][1]["valorPremio"])
            },
            "quadra": {
                "winners": data["listaRateioPremio"][2]["numeroDeGanhadores"],
                "prize": get_locale_prize(data["listaRateioPremio"][2]["valorPremio"])
            }
        }
    }


def get_new_data(lottery_data):
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

    return found_something
