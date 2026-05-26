import { db } from "../index";
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
