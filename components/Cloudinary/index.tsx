"use client";
import { CldImage } from "next-cloudinary";

/**
 * Componente Cloudinary para exibir imagens otimizadas
 *
 * IMPORTANTE: Configure as seguintes variáveis de ambiente no arquivo .env.local:
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu-cloud-name
 * - CLOUDINARY_API_KEY=sua-api-key (opcional, apenas para uploads)
 * - CLOUDINARY_API_SECRET=seu-api-secret (opcional, apenas para uploads)
 *
 * Para usar este componente:
 * 1. Faça upload da imagem no Cloudinary Media Library
 * 2. Use o public_id da imagem no prop 'src'
 * 3. Ou use uma URL externa válida
 */
export default function CloudinaryImage() {
  // Exemplo 1: Usando uma imagem de exemplo do Cloudinary (sample)
  // Substitua pelo public_id da sua imagem após fazer upload
  // const imageSrc = "sample"; // ou use uma URL externa como "https://example.com/image.jpg"

  return (
    <div className="flex flex-col gap-4 items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Cloudinary Image Example</h1>

      {/* Exemplo com imagem do Cloudinary */}
      <CldImage
        src="https://res.cloudinary.com/ddhslcvjs/image/upload/v1763234439/eduard-pretsi-ZPm77Deio00-unsplash_xzbzj7.jpg"
        width={500}
        height={500}
        crop={{
          type: "auto",
          source: true,
        }}
        alt="Sample image from Cloudinary"
        className="rounded-lg shadow-lg"
      />

      {/* Exemplo com URL externa (se necessário) */}
      {/* 
      <CldImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
        width={500}
        height={500}
        alt="External image"
        className="rounded-lg shadow-lg"
      />
      */}

      <p className="text-sm text-gray-500 mt-4">
        Para usar sua própria imagem:
        <br />
        1. Faça upload no Cloudinary Media Library
        <br />
        2. Copie o public_id da imagem
        <br />
        3. Substitua &quot;sample&quot; pelo public_id
      </p>
    </div>
  );
}
