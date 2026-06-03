import { scrapeFeeds } from "../lib/rss/scrapeFeeds";
import { parseDuration, handleError } from "../lib/utils";

export async function handlerAggregator(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <time_between_reqs> `);
  }
  const timeArg = args[0];
  const timeBetweenRequests = parseDuration(timeArg);

  console.log(`Collecting feeds every ${timeBetweenRequests}ms`);

  scrapeFeeds().catch(handleError);
  const aggregator = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(aggregator);
      resolve();
    });
  });
}
