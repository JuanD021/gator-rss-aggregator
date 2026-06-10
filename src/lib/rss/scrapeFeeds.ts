import type { Feed, NewPost } from "../db/schema";
import { fetchFeed } from "./aggregator";
import { getNextFeedToFetch, markFeedFetched } from "../db/queries/feeds";
import { createPost } from "../db/queries/posts";

export async function scrapeFeeds() {
  console.log("Getting next feed to fetch");
  const nextFeedToFetch = await getNextFeedToFetch();
  if (!nextFeedToFetch) {
    throw new Error("There are not feeds pending.");
  }
  console.log(`Next feed at ${nextFeedToFetch.url}`);
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
    console.log(`Found post: ${post.title}`);

    const now = new Date();
    const newPost = await createPost({
      title: post.title,
      url: post.link,
      description: post.description,
      createdAt: now,
      updatedAt: now,
      publishedAt: new Date(post.pubDate),
      feedId: feed.id,
    } satisfies NewPost);

    if (!newPost) {
      console.log(`Error storing post: ${post.title}`);
      continue;
    }
  }

  console.log(`Feed ${feed.name} collected, ${feedPosts.length} posts found`);
}
