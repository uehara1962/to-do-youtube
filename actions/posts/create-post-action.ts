"use server";

import { createPost } from "@/server/posts";
import { z } from "zod";

const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  imageUrl: z.string().url().optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
  mediaType: z.enum(["text", "image", "video", "image_text", "video_text"]),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export type CreatePostResult = {
  success: true;
  post: {
    id: string;
    content: string;
    imageUrl: string | null;
    videoUrl: string | null;
    mediaType: string;
    createdAt: Date;
  };
};

export type CreatePostError = {
  success: false;
  error: string;
};

export async function createPostAction(
  input: CreatePostInput
): Promise<CreatePostResult | CreatePostError> {
  try {
    // Validar input
    const validatedInput = createPostSchema.parse(input);

    // Determinar mediaType automaticamente se não fornecido
    let mediaType = validatedInput.mediaType;
    if (!mediaType) {
      if (validatedInput.imageUrl && validatedInput.videoUrl) {
        mediaType = "image_text"; // Priorizar imagem se ambos existirem
      } else if (validatedInput.videoUrl) {
        mediaType = validatedInput.content.trim() ? "video_text" : "video";
      } else if (validatedInput.imageUrl) {
        mediaType = validatedInput.content.trim() ? "image_text" : "image";
      } else {
        mediaType = "text";
      }
    }

    // Criar post
    const post = await createPost({
      content: validatedInput.content,
      imageUrl: validatedInput.imageUrl || null,
      videoUrl: validatedInput.videoUrl || null,
      mediaType,
    });

    return {
      success: true,
      post: {
        id: post.id,
        content: post.content,
        imageUrl: post.imageUrl,
        videoUrl: post.videoUrl,
        mediaType: post.mediaType,
        createdAt: post.createdAt,
      },
    };
  } catch (error) {
    console.error("Error creating post:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(", "),
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    };
  }
}
