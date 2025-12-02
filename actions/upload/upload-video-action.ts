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
export type UploadVideoResult = {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  duration?: number;
  width?: number;
  height?: number;
};

export type UploadVideoError = {
  error: string;
};

/**
 * Server Action para fazer upload de vídeo para o Cloudinary
 *
 * @param formData - FormData contendo o arquivo de vídeo
 * @param folder - (Opcional) Pasta no Cloudinary para organizar os vídeos
 * @returns URL do vídeo e informações adicionais
 */
export async function uploadVideoAction(
  formData: FormData,
  folder?: string
): Promise<UploadVideoResult | UploadVideoError> {
  try {
    // 1. Verificar autenticação
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Usuário não autenticado" };
    }

    // 2. Obter arquivo do FormData
    const file = formData.get("video") as File;
    if (!file) {
      return { error: "Nenhum arquivo enviado" };
    }

    // 3. Validar tipo de arquivo
    if (!file.type.startsWith("video/")) {
      return { error: "Arquivo deve ser um vídeo" };
    }

    // 4. Validar tamanho (máximo 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return { error: "Arquivo muito grande. Máximo: 100MB" };
    }

    // 5. Validar formato
    const allowedFormats = ["mp4", "webm", "mov"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      return {
        error: `Formato não suportado. Use: ${allowedFormats.join(", ")}`,
      };
    }

    // 6. Converter File para Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 7. Fazer upload para Cloudinary
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: folder || `uploads/videos/${user.id}`,
        resource_type: "video" as const,
        allowed_formats: allowedFormats,
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
            reject({ error: "Erro ao fazer upload do vídeo" });
          } else if (!result) {
            reject({ error: "Upload concluído mas sem resultado" });
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format || "",
              bytes: result.bytes || 0,
              duration: result.duration,
              width: result.width,
              height: result.height,
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
 * Server Action para deletar vídeo do Cloudinary
 *
 * @param publicId - Public ID do vídeo no Cloudinary
 */
export async function deleteVideoAction(
  publicId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Usuário não autenticado" };
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });

    if (result.result === "ok") {
      return { success: true };
    } else {
      return { success: false, error: "Erro ao deletar vídeo" };
    }
  } catch (error) {
    console.error("Delete video error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao deletar vídeo",
    };
  }
}

