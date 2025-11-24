"use client";

import { useState } from "react";
import { CldImage } from "next-cloudinary";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ExternalLink } from "lucide-react";
import type { GalleryImage } from "@/actions/cloudinary/list-images-action";

interface GalleryProps {
  images: GalleryImage[];
  total: number;
}

export function Gallery({ images, total }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
  };

  const handleDownload = (image: GalleryImage) => {
    const link = document.createElement("a");
    link.href = image.secureUrl;
    link.download = `${image.publicId.split("/").pop()}.${image.format}`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Nenhuma imagem encontrada na pasta &quot;Home&quot;
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Faça upload de imagens no Cloudinary para vê-las aqui.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Estatísticas */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {total} {total === 1 ? "imagem encontrada" : "imagens encontradas"}
        </p>
      </div>

      {/* Grid de imagens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.publicId}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-100 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleImageClick(image)}
          >
            <CldImage
              src={image.publicId}
              width={400}
              height={400}
              alt={image.publicId}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              crop="fill"
              gravity="auto"
              loading="lazy"
            />

            {/* Overlay com informações */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center p-4">
                <p className="text-sm font-medium truncate max-w-full">
                  {image.publicId.split("/").pop()}
                </p>
                <p className="text-xs mt-1">
                  {image.width} × {image.height}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog para visualização detalhada */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle className="truncate">
                  {selectedImage.publicId.split("/").pop()}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Imagem em tamanho maior */}
                <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <CldImage
                    src={selectedImage.publicId}
                    width={1200}
                    height={800}
                    alt={selectedImage.publicId}
                    className="w-full h-full object-contain"
                    crop="limit"
                  />
                </div>

                {/* Informações da imagem */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">Dimensões</p>
                    <p className="text-gray-900">
                      {selectedImage.width} × {selectedImage.height}px
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Formato</p>
                    <p className="text-gray-900 uppercase">{selectedImage.format}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Tamanho</p>
                    <p className="text-gray-900">
                      {(selectedImage.bytes / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Pasta</p>
                    <p className="text-gray-900 truncate">
                      {selectedImage.folder || "Home"}
                    </p>
                  </div>
                </div>

                {/* Public ID completo */}
                <div>
                  <p className="text-gray-500 font-medium text-sm mb-1">Public ID</p>
                  <p className="text-xs text-gray-600 break-all font-mono bg-gray-50 p-2 rounded">
                    {selectedImage.publicId}
                  </p>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(selectedImage)}
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open(selectedImage.secureUrl, "_blank");
                    }}
                    className="flex-1"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir Original
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

