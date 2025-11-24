"use server";

import { v2 as cloudinary } from "cloudinary";
import { getCurrentUser } from "@/lib/auth-server";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Tipos de retorno
export type UploadImageResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

export type UploadImageError = {
  error: string;
};

/**
 * Server Action para fazer upload de imagem para o Cloudinary
 *
 * @param formData - FormData contendo o arquivo de imagem
 * @param folder - (Opcional) Pasta no Cloudinary para organizar as imagens
 * @returns URL da imagem e informações adicionais
 */
export async function uploadImageAction(
  formData: FormData,
  folder?: string
): Promise<UploadImageResult | UploadImageError> {
  try {
    // 1. Verificar autenticação
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Usuário não autenticado" };
    }

    // 2. Obter arquivo do FormData
    const file = formData.get("image") as File;
    if (!file) {
      return { error: "Nenhum arquivo enviado" };
    }

    // 3. Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return { error: "Arquivo deve ser uma imagem" };
    }

    // 4. Validar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { error: "Arquivo muito grande. Máximo: 10MB" };
    }

    // 5. Converter File para Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 6. Fazer upload para Cloudinary
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: folder || `uploads/${user.id}`,
        resource_type: "auto" as const, // Detecta automaticamente se é imagem, vídeo, etc.
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      };

      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject({ error: "Erro ao fazer upload da imagem" });
          } else if (!result) {
            reject({ error: "Upload concluído mas sem resultado" });
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width || 0,
              height: result.height || 0,
              format: result.format || "",
              bytes: result.bytes || 0,
            });
          }
        })
        .end(buffer);
    });
  } catch (error) {
    console.error("Upload error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao fazer upload",
    };
  }
}

/**
 * Server Action para deletar imagem do Cloudinary
 *
 * @param publicId - Public ID da imagem no Cloudinary
 */
export async function deleteImageAction(
  publicId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Usuário não autenticado" };
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return { success: true };
    } else {
      return { success: false, error: "Erro ao deletar imagem" };
    }
  } catch (error) {
    console.error("Delete image error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao deletar imagem",
    };
  }
}

