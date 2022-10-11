import requests
from gcloud import storage
import json

def run(_event, _context):
    try:
        r = requests.get('https://loteriascaixa-api.herokuapp.com/api/mega-sena')
        original_data = r.json()
        lottery_data = []

        print('Got {} contests to parse'.format(len(original_data)))

        for item in original_data:
            contest = {
                "contestNumber": item['concurso'],
                "date": item["data"],
                "drawnNumbers": list(map(lambda num: int(num), item["dezenas"])),
                "prizeForNextContest": item["acumuladaProxConcurso"],
                "awards": {
                    "sena": {
                        "winners": item["premiacoes"][0]["vencedores"],
                        "prize": item["premiacoes"][0]["premio"],
                    },
                    "quina": {
                        "winners": item["premiacoes"][1]["vencedores"],
                        "prize": item["premiacoes"][1]["premio"],
                    },
                    "quadra": {
                        "winners": item["premiacoes"][2]["vencedores"],
                        "prize": item["premiacoes"][2]["premio"],
                    }
                },
            }
            lottery_data.append(contest)
        
        # Connect
        client = storage.Client(project='mega-pena')
        bucket = client.get_bucket('lottery-data')

        
        # Upload
        print('Upload')
        blob = bucket.blob('lottery-data.json')
        blob.upload_from_string(json.dumps(lottery_data, separators=(',', ':')), content_type='application/json')
    except Exception as e:
        print(e)