"use client";

import { useState, useRef } from "react";
import { uploadImageAction, type UploadImageResult } from "@/actions/upload/upload-image-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete?: (result: UploadImageResult) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  maxSize?: number; // em bytes
  accept?: string;
  disabled?: boolean;
}

export function ImageUpload({
  onUploadComplete,
  onUploadError,
  folder,
  maxSize = 10 * 1024 * 1024, // 10MB padrão
  accept = "image/*",
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validar arquivo antes de fazer upload
  const validateFile = (file: File): string | null => {
    // Verificar tipo
    if (!file.type.startsWith("image/")) {
      return "Arquivo deve ser uma imagem";
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
    formData.append("image", selectedFile);

    try {
      const result = await uploadImageAction(formData, folder);

      if ("error" in result) {
        toast.error(result.error);
        onUploadError?.(result.error);
      } else {
        toast.success("Imagem enviada com sucesso!");
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

      {/* Preview da imagem */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          {selectedFile && (
            <div className="mt-2 text-sm text-gray-500">
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
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
              Enviar Imagem
            </>
          )}
        </Button>
      )}
    </div>
  );
}

