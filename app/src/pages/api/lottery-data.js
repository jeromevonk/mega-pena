import path from 'path';
import { promises as fs } from 'fs';

import { parseLotteryData } from 'src/helpers'

export default async function handler(req, res) {

  // Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'src/data');

  // Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + '/resultados.json', 'utf8');
  const lotteryData = parseLotteryData(JSON.parse(fileContents));

  // Return the content of the data file in json format
  res.status(200).json(lotteryData);
}