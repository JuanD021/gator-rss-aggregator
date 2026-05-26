import { db } from "../index";
import { eq } from "drizzle-orm";
import { users, feeds } from "../schema";

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
  const results = await db
    .select({
      feedName: feeds.name,
      url: feeds.url,
      userName: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id));

  return results;
}
