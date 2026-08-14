import { getLotteryData } from 'src/server/lottery-data';

export default async function handler(req, res) {
  const startedAt = Date.now();
  console.info('[api/lottery-data] Request started');
  const lotteryData = await getLotteryData();
  console.info('[api/lottery-data] Request completed', {
    contests: lotteryData.length,
    durationMs: Date.now() - startedAt,
  });
  res.status(200).json(lotteryData);
}