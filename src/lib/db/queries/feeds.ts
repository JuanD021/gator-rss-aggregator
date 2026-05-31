import { db } from "../index";
import { eq } from "drizzle-orm";
import { feeds } from "../schema";

export async function createFeed(
  feedName: string,
  url: string,
  userId: string,
) {
  console.log("creating new feed...");
  const [result] = await db
    .insert(feeds)
    .values({ name: feedName, url, userId })
    .returning();
  console.log(result);
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
