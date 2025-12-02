"use client";

import { CldImage } from "next-cloudinary";

interface PostMediaProps {
  imageUrl?: string | null;
  videoUrl?: string | null;
  mediaType: string;
  className?: string;
}

export function PostMedia({
  imageUrl,
  videoUrl,
  mediaType,
  className = "",
}: PostMediaProps) {
  if (mediaType === "image" || mediaType === "image_text") {
    if (!imageUrl) return null;

    // Se for URL do Cloudinary, usar CldImage
    if (imageUrl.includes("cloudinary.com")) {
      // Extrair public_id da URL do Cloudinary
      const publicIdMatch = imageUrl.match(/\/v\d+\/(.+)$/);
      const publicId = publicIdMatch ? publicIdMatch[1].replace(/\.[^.]+$/, "") : imageUrl;

      return (
        <div className={`w-full ${className}`}>
          <CldImage
            src={publicId}
            width={800}
            height={600}
            crop="fill"
            gravity="auto"
            alt="Post image"
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      );
    }

    // URL externa normal
    return (
      <div className={`w-full ${className}`}>
        <img
          src={imageUrl}
          alt="Post image"
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>
    );
  }

  if (mediaType === "video" || mediaType === "video_text") {
    if (!videoUrl) return null;

    return (
      <div className={`w-full ${className}`}>
        <video
          src={videoUrl}
          controls
          className="w-full h-auto rounded-lg"
          preload="metadata"
        >
          Seu navegador não suporta o elemento de vídeo.
        </video>
      </div>
    );
  }

  return null;
}

