"use client";

import { useState, useRef } from "react";
import {
  uploadVideoAction,
  type UploadVideoResult,
} from "@/actions/upload/upload-video-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, X, Loader2, Video } from "lucide-react";

interface VideoUploadProps {
  onUploadComplete?: (result: UploadVideoResult) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  maxSize?: number; // em bytes
  accept?: string;
  disabled?: boolean;
}

export function VideoUpload({
  onUploadComplete,
  onUploadError,
  folder,
  maxSize = 100 * 1024 * 1024, // 100MB padrão
  accept = "video/*",
  disabled = false,
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validar arquivo antes de fazer upload
  const validateFile = (file: File): string | null => {
    // Verificar tipo
    if (!file.type.startsWith("video/")) {
      return "Arquivo deve ser um vídeo";
    }

    // Verificar formato
    const allowedFormats = ["mp4", "webm", "mov"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      return `Formato não suportado. Use: ${allowedFormats.join(", ")}`;
    }

    // Verificar tamanho
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      return `Arquivo muito grande. Máximo: ${maxSizeMB}MB`;
    }

    return null;
  };

  // Lidar com seleção de arquivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Fazer upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const result = await uploadVideoAction(formData, folder);

      if ("error" in result) {
        toast.error(result.error);
        onUploadError?.(result.error);
      } else {
        toast.success("Vídeo enviado com sucesso!");
        onUploadComplete?.(result);
        // Limpar seleção
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao fazer upload";
      toast.error(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Remover preview
  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Input de arquivo */}
      <div className="flex items-center gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="cursor-pointer"
        />
        {selectedFile && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Preview do vídeo */}
      {preview && (
        <div className="relative">
          <video
            src={preview}
            controls
            className="w-full h-48 object-cover rounded-lg border"
          />
          {selectedFile && (
            <div className="mt-2 text-sm text-gray-500">
              {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          )}
        </div>
      )}

      {/* Botão de upload */}
      {selectedFile && (
        <Button
          type="button"
          onClick={handleUpload}
          disabled={disabled || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Enviar Vídeo
            </>
          )}
        </Button>
      )}
    </div>
  );
}

