import { scrapeFeeds } from "../lib/rss/scrapeFeeds";
import { parseDuration, handleError } from "../lib/utils";

export async function handlerAggregator(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <time_between_reqs> `);
  }
  const timeArg = args[0];
  const timeBetweenRequests = parseDuration(timeArg);

  console.log(`Collecting feeds every ${timeBetweenRequests}ms`);

  console.log("First immediate request");
  scrapeFeeds().catch(handleError);
  const aggregator = setInterval(() => {
    console.log("Requesting with interval...");
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
