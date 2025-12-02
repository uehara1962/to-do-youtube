"use server";

import { deletePost } from "@/server/posts";

export type DeletePostResult = {
  success: true;
};

export type DeletePostError = {
  success: false;
  error: string;
};

export async function deletePostAction(
  postId: string
): Promise<DeletePostResult | DeletePostError> {
  try {
    await deletePost(postId);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete post",
    };
  }
}

