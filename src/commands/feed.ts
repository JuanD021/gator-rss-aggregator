import { createFeed, getAllFeeds } from "../lib/db/queries/feeds";
import { createFeedFollow } from "../lib/db/queries/feedFollows";
import type { User, Feed } from "../lib/db/schema";

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }
  const [feedName, feedURL] = args;
  const newFeed = await createFeed(feedName, feedURL, user.id);
  await createFeedFollow(user.id, newFeed.id);

  console.log("Feed created succesfully:");
  printFeed(user, newFeed);
}

export async function handlerListFeeds(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error(`Usage: ${cmdName}`);
  }
  const feeds = await getAllFeeds();
  if (!feeds) {
    throw new Error("No existent feeds");
  }
  feeds.forEach((feed) =>
    console.log(`${feed.id}: ${feed.name} - <${feed.url}>`),
  );
}

function printFeed(user: User, feed: Feed) {
  console.log(`User ${user.name}, now follow: `);
  console.log(`Feed: ${feed.name} "${feed.url}"`);
}
