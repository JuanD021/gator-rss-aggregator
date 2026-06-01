import { readConfig } from "../config";
import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/feedFollows";
import { getUser } from "../lib/db/queries/users";
import { getFeedByURL } from "../lib/db/queries/feeds";
import type { User } from "../lib/db/schema";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <feedURL>`);
  }

  const feedURL = args[0];
  const feedExisting = await getFeedByURL(feedURL);
  if (!feedExisting) {
    throw new Error(`Feed for "${feedURL}" not found`);
  }

  const newFeedFollowed = await createFeedFollow(user.id, feedExisting.id);
  console.log(
    `user <${newFeedFollowed.userName}> now following <${newFeedFollowed.feedName}> feed`,
  );
}

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <feedURL>`);
  }
  const feedURL = args[0];
  const feed = await getFeedByURL(feedURL);
  if (!feed) {
    throw new Error(`Feed with url "${feedURL}" not found.`);
  }
  const deletedFeedFollow = await deleteFeedFollow(feed.id, user.id);
  if (!deletedFeedFollow) {
    throw new Error(`User ${user.name} not following "${feedURL}"`);
  }
  console.log(`Feed${feedURL} unfollowed`);
}

export async function handlerFollowingByUser(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length > 0) {
    throw new Error(`Usage: <${cmdName}>`);
  }

  const feedFollows = await getFeedFollowsForUser(user.id);
  console.log(`User ${user.name} following: `);
  feedFollows.forEach((feed) => console.log(`-${feed.feed}`));
}
