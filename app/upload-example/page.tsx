"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { TodoImage } from "@/components/TodoImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { UploadImageResult } from "@/actions/upload/upload-image-action";

/**
 * Página de exemplo demonstrando como usar o componente ImageUpload
 * e integrar com uploads para Cloudinary
 */
export default function UploadExamplePage() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadImageResult | null>(null);

  const handleImageUpload = (result: UploadImageResult) => {
    setUploadedImageUrl(result.url);
    setUploadResult(result);
    console.log("Upload result:", result);
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
  };

  const handleClear = () => {
    setUploadedImageUrl(null);
    setUploadResult(null);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Exemplo de Upload com Cloudinary</h1>
        <p className="text-gray-500 mb-8">
          Esta página demonstra como fazer upload de imagens usando a API do Cloudinary.
        </p>

        {/* Card de Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload de Imagem</CardTitle>
            <CardDescription>
              Selecione uma imagem e faça upload para o Cloudinary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onUploadComplete={handleImageUpload}
              onUploadError={handleUploadError}
              folder="examples"
              maxSize={10 * 1024 * 1024} // 10MB
            />
          </CardContent>
        </Card>

        {/* Card de Resultado */}
        {uploadResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Resultado do Upload</CardTitle>
              <CardDescription>Informações da imagem enviada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview da imagem usando CldImage */}
              {uploadedImageUrl && (
                <div>
                  <Label className="mb-2 block">Preview (usando CldImage):</Label>
                  <TodoImage
                    imageUrl={uploadedImageUrl}
                    alt="Uploaded image"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                </div>
              )}

              {/* Informações da imagem */}
              <div className="space-y-2">
                <Label className="font-semibold">Informações:</Label>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">URL:</span>{" "}
                    <a
                      href={uploadResult.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline break-all"
                    >
                      {uploadResult.url}
                    </a>
                  </p>
                  <p>
                    <span className="font-medium">Public ID:</span> {uploadResult.publicId}
                  </p>
                  <p>
                    <span className="font-medium">Dimensões:</span> {uploadResult.width} x{" "}
                    {uploadResult.height}px
                  </p>
                  <p>
                    <span className="font-medium">Formato:</span> {uploadResult.format}
                  </p>
                  <p>
                    <span className="font-medium">Tamanho:</span>{" "}
                    {(uploadResult.bytes / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              {/* Botão para limpar */}
              <Button variant="outline" onClick={handleClear} className="w-full">
                Limpar Resultado
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Instruções */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Como usar</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Configure as variáveis de ambiente no arquivo <code className="bg-gray-100 px-1 rounded">.env.local</code></li>
              <li>Selecione uma imagem usando o botão de upload</li>
              <li>Visualize o preview antes de enviar</li>
              <li>Clique em &quot;Enviar Imagem&quot; para fazer o upload</li>
              <li>A URL da imagem será retornada e pode ser salva no banco de dados</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

