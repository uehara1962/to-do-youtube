"use client";

import { CldImage } from "next-cloudinary";

interface TodoImageProps {
  imageUrl: string | null;
  alt?: string;
  className?: string;
}

export function TodoImage({ imageUrl, alt = "Todo image", className }: TodoImageProps) {
  if (!imageUrl) return null;

  // Extrair public_id da URL do Cloudinary
  // Exemplo: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/image.jpg
  // public_id seria: folder/image
  const extractPublicId = (url: string): string => {
    try {
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      return match ? match[1] : url;
    } catch {
      return url;
    }
  };

  const publicId = extractPublicId(imageUrl);

  return (
    <CldImage
      src={publicId}
      width={500}
      height={300}
      alt={alt}
      className={className || "w-full h-48 object-cover rounded-lg"}
      crop="fill"
      gravity="auto"
    />
  );
}

