"use server";

import { getAllPosts } from "@/server/posts";

export type PostWithUser = {
  id: string;
  userId: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  mediaType: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type GetPostsResult = {
  success: true;
  posts: PostWithUser[];
};

export type GetPostsError = {
  success: false;
  error: string;
};

export async function getPostsAction(
  limit: number = 20,
  offset: number = 0
): Promise<GetPostsResult | GetPostsError> {
  try {
    const posts = await getAllPosts(limit, offset);

    return {
      success: true,
      posts: posts.map((post) => ({
        id: post.id,
        userId: post.userId,
        content: post.content,
        imageUrl: post.imageUrl,
        videoUrl: post.videoUrl,
        mediaType: post.mediaType,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: post.user,
      })),
    };
  } catch (error) {
    console.error("Error getting posts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get posts",
    };
  }
}

