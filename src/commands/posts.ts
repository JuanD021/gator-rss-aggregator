import { getPostsForUser } from "../lib/db/queries/posts";
import { User } from "../lib/db/schema";

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length > 1) {
    throw new Error(`Usage: ${cmdName} [<N posts>]`);
  }

  const limit = parseInt(args[0], 10) || 2;
  const latestPosts = await getPostsForUser(user.id, limit);
  if (latestPosts.length === 0) {
    throw new Error("User doesn't have new posts, add a new one. ");
  }

  console.log(
    `posts for user ${user.name} found, displaying ${limit} results.`,
  );
  for (const post of latestPosts) {
    console.log(
      `From ${post.feedName} in ${post.feedUrl} published at ${post.publishedAt.toLocaleString()}`,
    );
    console.log(`--- ${post.title} ---`);
    console.log(`Link: ${post.url}`);
    console.log(`   ${post.description}`);
    console.log("========================================");
  }
}
