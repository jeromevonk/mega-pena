from gcloud import storage
import json

from aux import moneyfmt, get_locale_prize, parse_contest, get_new_data

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

        # Is there new data?
        found_something = get_new_data(lottery_data)

        # If new contests were found, update the file
        if found_something:
            blob = bucket.blob(FILE_NAME)
            blob.upload_from_string(json.dumps(lottery_data, separators=(',', ':')), content_type='application/json')
    except Exception as e:
        print(e)
