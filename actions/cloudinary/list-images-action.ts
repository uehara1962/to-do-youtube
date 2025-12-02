"use server";

import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Tipo para representar uma imagem da galeria
export type GalleryImage = {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
  folder?: string;
};

export type ListImagesResult = {
  images: GalleryImage[];
  total: number;
  nextCursor?: string;
};

export type ListImagesError = {
  error: string;
};

// Tipo para as opções da API de recursos do Cloudinary
interface CloudinaryResourcesOptions {
  type: "upload";
  prefix: string;
  max_results: number;
  sort_by: Array<{ created_at: "desc" | "asc" }>;
  next_cursor?: string;
}

// Tipo para um recurso retornado pela API do Cloudinary
interface CloudinaryResource {
  public_id: string;
  url: string;
  secure_url: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  created_at?: string;
  folder?: string;
}

/**
 * Server Action para listar imagens de uma pasta específica no Cloudinary
 *
 * @param folder - Nome da pasta no Cloudinary (ex: "Home")
 * @param maxResults - Número máximo de resultados (padrão: 50)
 * @param nextCursor - Cursor para paginação (opcional)
 * @returns Lista de imagens e informações de paginação
 */
export async function listImagesAction(
  folder: string = "Home",
  maxResults: number = 50,
  nextCursor?: string
): Promise<ListImagesResult | ListImagesError> {
  try {
    // Buscar recursos na pasta especificada usando api.resources
    const options: CloudinaryResourcesOptions = {
      type: "upload",
      prefix: `${folder}/`,
      max_results: maxResults,
      sort_by: [{ created_at: "desc" }],
    };

    if (nextCursor) {
      options.next_cursor = nextCursor;
    }

    const result = await cloudinary.api.resources(options);

    // Transformar os resultados em formato mais simples
    const images: GalleryImage[] = (
      (result.resources as CloudinaryResource[]) || []
    ).map((resource) => ({
      publicId: resource.public_id,
      url: resource.url,
      secureUrl: resource.secure_url,
      width: resource.width || 0,
      height: resource.height || 0,
      format: resource.format || "",
      bytes: resource.bytes || 0,
      createdAt: resource.created_at || "",
      folder: resource.folder || folder,
    }));

    return {
      images,
      total: result.total_count || images.length,
      nextCursor: result.next_cursor,
    };
  } catch (error) {
    console.error("List images error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao listar imagens",
    };
  }
}

/**
 * Server Action para buscar todas as imagens de uma pasta (com paginação automática)
 *
 * @param folder - Nome da pasta no Cloudinary (ex: "Home")
 * @returns Todas as imagens da pasta
 */
export async function getAllImagesFromFolderAction(
  folder: string = "Home"
): Promise<ListImagesResult | ListImagesError> {
  try {
    let allImages: GalleryImage[] = [];
    let currentCursor: string | undefined = undefined;
    let hasMore = true;

    // Buscar todas as imagens usando paginação
    while (hasMore) {
      const result = await listImagesAction(folder, 500, currentCursor);

      if ("error" in result) {
        return result;
      }

      allImages = [...allImages, ...result.images];
      currentCursor = result.nextCursor;
      hasMore = !!currentCursor && result.images.length > 0;

      // Limite de segurança: máximo 5000 imagens
      if (allImages.length >= 5000) {
        break;
      }
    }

    return {
      images: allImages,
      total: allImages.length,
    };
  } catch (error) {
    console.error("Get all images error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao buscar todas as imagens",
    };
  }
}
