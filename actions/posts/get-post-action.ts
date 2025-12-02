"use server";

import { getPostById } from "@/server/posts";

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

export type GetPostResult = {
  success: true;
  post: PostWithUser;
};

export type GetPostError = {
  success: false;
  error: string;
};

export async function getPostAction(
  postId: string
): Promise<GetPostResult | GetPostError> {
  try {
    const post = await getPostById(postId);

    if (!post) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    return {
      success: true,
      post: {
        id: post.id,
        userId: post.userId,
        content: post.content,
        imageUrl: post.imageUrl,
        videoUrl: post.videoUrl,
        mediaType: post.mediaType,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: post.user,
      },
    };
  } catch (error) {
    console.error("Error getting post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get post",
    };
  }
}

