import { ne } from "drizzle-orm";
import { readConfig } from "../config";
import { createFeed, getAllFeeds } from "../lib/db/queries/feeds";
import { getUser } from "../lib/db/queries/users";
import type { SelectUser, InsertFeed } from "../lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }
  const config = readConfig();
  const user = await getUser(config.currentUserName);

  const userId = user.id;
  const [feedName, feedURL] = args;
  const newFeed = await createFeed(feedName, feedURL, userId);

  console.log("Feed created succesfully:");
  printFeed(user, newFeed);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error(`Usage: ${cmdName}`);
  }

  const feeds = await getAllFeeds();
  console.table(feeds);
}

function printFeed(user: SelectUser, feed: InsertFeed) {
  console.table(user);
  console.table(feed);
}
