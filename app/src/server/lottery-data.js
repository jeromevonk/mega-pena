import fallbackLotteryData from 'src/data/resultados.json';

const LOTTERY_DATA_URL = 'https://storage.googleapis.com/lottery-data/lottery-data.json';
const FETCH_TIMEOUT_MS = 5_000;

export async function getLotteryData() {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  console.info('[lottery-data] Fetching upstream data');

  try {
    const response = await fetch(LOTTERY_DATA_URL, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Lottery data request failed with status ${response.status}`);
    }

    const lotteryData = await response.json();
    console.info('[lottery-data] Upstream data loaded', {
      contests: lotteryData.length,
      durationMs: Date.now() - startedAt,
    });
    return lotteryData;
  } catch (error) {
    console.error('[lottery-data] Using bundled fallback data', {
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return fallbackLotteryData;
  } finally {
    clearTimeout(timeout);
  }
}
