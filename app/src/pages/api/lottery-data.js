import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {

  let lotteryData;

  if (process.env.NODE_ENV === 'development') {
    // Find the absolute path of the json directory
    const jsonDirectory = path.join(process.cwd(), 'src/data');

    // Read the json data file data.json
    const fileContents = await fs.readFile(jsonDirectory + '/resultados.json', 'utf8');
    lotteryData = JSON.parse(fileContents);
  } else {
    // Get data from the server
    const res = await fetch('https://storage.googleapis.com/lottery-data/lottery-data.json');
    const data = await res.text();
    lotteryData = JSON.parse(data);
  }

  res.status(200).json(lotteryData);
}