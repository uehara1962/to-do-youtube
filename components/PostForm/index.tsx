"use client";

import { useState } from "react";
import Image from "next/image";
import { createPostAction } from "@/actions/posts/create-post-action";
import { ImageUpload } from "@/components/ImageUpload";
import { VideoUpload } from "@/components/VideoUpload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { UploadImageResult } from "@/actions/upload/upload-image-action";
import type { UploadVideoResult } from "@/actions/upload/upload-video-action";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function PostForm({ onSuccess, redirectTo }: PostFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (result: UploadImageResult) => {
    setImageUrl(result.url);
    // Limpar vídeo se imagem for adicionada
    if (videoUrl) {
      setVideoUrl(null);
    }
  };

  const handleVideoUpload = (result: UploadVideoResult) => {
    setVideoUrl(result.url);
    // Limpar imagem se vídeo for adicionado
    if (imageUrl) {
      setImageUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && !imageUrl && !videoUrl) {
      toast.error("Adicione texto, imagem ou vídeo ao post");
      return;
    }

    if (content.length > 5000) {
      toast.error("O conteúdo do post não pode ter mais de 5000 caracteres");
      return;
    }

    setIsSubmitting(true);

    try {
      // Determinar tipo de mídia
      let mediaType: "text" | "image" | "video" | "image_text" | "video_text" =
        "text";

      if (imageUrl && videoUrl) {
        mediaType = "image_text"; // Priorizar imagem
      } else if (videoUrl) {
        mediaType = content.trim() ? "video_text" : "video";
      } else if (imageUrl) {
        mediaType = content.trim() ? "image_text" : "image";
      }

      const result = await createPostAction({
        content: content.trim() || "",
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        mediaType,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Post criado com sucesso!");

      // Limpar formulário
      setContent("");
      setImageUrl(null);
      setVideoUrl(null);

      // Callback ou redirecionamento
      if (redirectTo) {
        router.push(redirectTo);
      } else if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erro ao criar post. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
  };

  const handleRemoveVideo = () => {
    setVideoUrl(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <Label htmlFor="content">O que você está pensando?</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Compartilhe seus pensamentos..."
          rows={4}
          maxLength={5000}
          className="mt-2"
        />
        <div className="text-sm text-gray-500 mt-1 text-right">
          {content.length}/5000
        </div>
      </div>

      {!imageUrl && !videoUrl && (
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Adicionar Imagem</Label>
            <ImageUpload
              onUploadComplete={handleImageUpload}
              folder="blog/posts"
            />
          </div>

          <div className="space-y-3">
            <Label>Adicionar Vídeo</Label>
            <VideoUpload
              onUploadComplete={handleVideoUpload}
              folder="blog/posts"
            />
          </div>
        </div>
      )}

      {imageUrl && (
        <div className="relative w-full h-64">
          <Image
            src={imageUrl}
            alt="Preview"
            fill
            className="object-cover rounded-lg"
            unoptimized={imageUrl.includes("cloudinary.com")}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2"
          >
            Remover
          </Button>
        </div>
      )}

      {videoUrl && (
        <div className="relative">
          <video src={videoUrl} controls className="w-full rounded-lg" />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemoveVideo}
            className="absolute top-2 right-2"
          >
            Remover
          </Button>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Publicando...
          </>
        ) : (
          "Publicar"
        )}
      </Button>
    </form>
  );
}
