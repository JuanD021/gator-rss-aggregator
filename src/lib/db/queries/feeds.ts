import { db } from "../index";
import { eq, sql } from "drizzle-orm";
import { feeds } from "../schema";

export async function createFeed(
  feedName: string,
  url: string,
  userId: string,
) {
  const [result] = await db
    .insert(feeds)
    .values({ name: feedName, url, userId })
    .returning();
  return result;
}

export async function getAllFeeds() {
  const results = await db.select().from(feeds);
  return results;
}

export async function getFeedByURL(feedURL: string) {
  const [feedData] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, feedURL));

  return feedData;
}

export async function markFeedFetched(feedID: string) {
  await db
    .update(feeds)
    .set({ lastFetchedAt: new Date() })
    .where(eq(feeds.id, feedID));
}

export async function getNextFeedToFetch() {
  const [nextFeedToFetch] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} asc nulls first`)
    .limit(1);
  return nextFeedToFetch;
}
