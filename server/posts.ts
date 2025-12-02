"use server";

import { db } from "@/db/drizzle";
import {
  posts as postsTable,
  PostTableInsertModel,
  PostTableSelectModel,
  users as usersTable,
} from "@/db/drizzle/schema";
import { getSession } from "@/lib/auth-server";
import { eq, desc, and, isNull } from "drizzle-orm";

export async function createPost(
  post: Omit<PostTableInsertModel, "userId">
): Promise<PostTableSelectModel> {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  try {
    const [newPost] = await db
      .insert(postsTable)
      .values({ ...post, userId: session.user.id })
      .returning();
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

export async function getPostById(
  id: string
): Promise<(PostTableSelectModel & { user: { id: string; name: string; email: string } }) | null> {
  try {
    const [post] = await db
      .select({
        id: postsTable.id,
        userId: postsTable.userId,
        content: postsTable.content,
        imageUrl: postsTable.imageUrl,
        videoUrl: postsTable.videoUrl,
        mediaType: postsTable.mediaType,
        deletedAt: postsTable.deletedAt,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt,
        user: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        },
      })
      .from(postsTable)
      .innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
      .where(and(eq(postsTable.id, id), isNull(postsTable.deletedAt)));

    if (!post) {
      return null;
    }

    return post as PostTableSelectModel & {
      user: { id: string; name: string; email: string };
    };
  } catch (error) {
    console.error("Error getting post by id:", error);
    throw new Error("Failed to get post by id");
  }
}

export async function getAllPosts(
  limit: number = 20,
  offset: number = 0
): Promise<(PostTableSelectModel & { user: { id: string; name: string; email: string } })[]> {
  try {
    const posts = await db
      .select({
        id: postsTable.id,
        userId: postsTable.userId,
        content: postsTable.content,
        imageUrl: postsTable.imageUrl,
        videoUrl: postsTable.videoUrl,
        mediaType: postsTable.mediaType,
        deletedAt: postsTable.deletedAt,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt,
        user: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        },
      })
      .from(postsTable)
      .innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
      .where(isNull(postsTable.deletedAt))
      .orderBy(desc(postsTable.createdAt))
      .limit(limit)
      .offset(offset);

    return posts as (PostTableSelectModel & {
      user: { id: string; name: string; email: string };
    })[];
  } catch (error) {
    console.error("Error getting all posts:", error);
    throw new Error("Failed to get all posts");
  }
}

export async function updatePost(
  id: string,
  post: Partial<Omit<PostTableInsertModel, "userId" | "id">>
): Promise<PostTableSelectModel> {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  try {
    // Verificar se o post pertence ao usuário
    const [existingPost] = await db
      .select()
      .from(postsTable)
      .where(and(eq(postsTable.id, id), eq(postsTable.userId, session.user.id)));

    if (!existingPost) {
      throw new Error("Post not found or you don't have permission to edit it");
    }

    const [updatedPost] = await db
      .update(postsTable)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(postsTable.id, id))
      .returning();

    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error instanceof Error ? error : new Error("Failed to update post");
  }
}

export async function deletePost(id: string): Promise<PostTableSelectModel> {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  try {
    // Verificar se o post pertence ao usuário
    const [existingPost] = await db
      .select()
      .from(postsTable)
      .where(and(eq(postsTable.id, id), eq(postsTable.userId, session.user.id)));

    if (!existingPost) {
      throw new Error("Post not found or you don't have permission to delete it");
    }

    // Soft delete
    const [deletedPost] = await db
      .update(postsTable)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(postsTable.id, id))
      .returning();

    return deletedPost;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error instanceof Error ? error : new Error("Failed to delete post");
  }
}

