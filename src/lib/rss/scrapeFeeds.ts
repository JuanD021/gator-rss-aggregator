import type { Feed } from "../db/schema";
import { getNextFeedToFetch, markFeedFetched } from "../db/queries/feeds";
import { fetchFeed } from "./aggregator";

export async function scrapeFeeds() {
  const nextFeedToFetch = await getNextFeedToFetch();
  if (!nextFeedToFetch) {
    throw new Error("There are not feeds pending.");
  }
  await scrapeFeed(nextFeedToFetch);
}

async function scrapeFeed(feed: Feed) {
  const feedFetched = await fetchFeed(feed.url);
  if (!feedFetched) {
    throw new Error(`Error trying to fetch feed at "${feed.url}"`);
  }
  await markFeedFetched(feed.id);

  const feedPosts = feedFetched.channel.item;
  for (const post of feedPosts) {
    console.log(post.title);
  }
}
