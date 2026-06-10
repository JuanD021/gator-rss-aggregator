import { db } from "../index";
import { eq, desc } from "drizzle-orm";
import type { NewPost } from "../schema";
import { posts, feeds, feedFollows } from "../schema";

export async function createPost(post: NewPost) {
  const [result] = await db
    .insert(posts)
    .values(post)
    .onConflictDoUpdate({
      target: posts.url,
      set: {
        title: post.title,
        description: post.description,
        publishedAt: post.publishedAt,
      },
    })
    .returning();
  return result;
}

export async function getPostsForUser(userId: string, postsNumber: number) {
  const userPosts = await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      updatedAt: posts.createdAt,
      title: posts.title,
      description: posts.description,
      url: posts.url,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
      feedName: feeds.name,
      feedUrl: feeds.url,
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feeds.id, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(postsNumber);
  return userPosts;
}
