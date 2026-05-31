import { readConfig } from "../config";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/feedFollows";
import { getUser } from "../lib/db/queries/users";
import { getFeedByURL } from "../lib/db/queries/feeds";

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <feedURL>`);
  }
  const config = readConfig();
  const user = await getUser(config.currentUserName);

  const feedURL = args[0];
  const feedExisting = await getFeedByURL(feedURL);
  if (!feedExisting) {
    throw new Error(`Feed for "${feedURL}" not found`);
  }

  const feedFollowed = await createFeedFollow(user.id, feedExisting.id);
  console.log(
    `user <${feedFollowed.userName}> now following <${feedFollowed.feedName}> feed`,
  );
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
  if (args.length > 0) {
    throw new Error(`Usage: <${cmdName}>`);
  }
  const config = readConfig();
  const user = await getUser(config.currentUserName);

  const feedFollows = await getFeedFollowsForUser(user.id);
  console.log(`User ${config.currentUserName} following: `);
  feedFollows.forEach((feed) => console.log(`-${feed.feed}`));
}
