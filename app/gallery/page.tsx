import { listImagesAction } from "@/actions/cloudinary/list-images-action";
import { Gallery } from "@/components/Gallery";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { trackServerEvent } from "@/lib/mixpanel";

export const metadata = {
  title: "Galeria de Imagens - Home",
  description: "Galeria de imagens da pasta Home do Cloudinary",
};
const folder = "blog";

async function GalleryContent() {
  const result = await listImagesAction(folder, 100);
  
  trackServerEvent("gallery_page_viewed", {
    page: "gallery",
  });

  if ("error" in result) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erro ao carregar imagens</h1>
          <p className="text-red-500">{result.error}</p>
          <p className="text-sm text-gray-500 mt-4">
            Verifique se a pasta &quot;Home&quot; existe no Cloudinary e se as
            variáveis de ambiente estão configuradas corretamente.
          </p>
        </div>
      </div>
    );
  }

  return <Gallery images={result.images} total={result.total} folder={folder} />;
}

export default function GalleryPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Galeria de Imagens</h1>
        <p className="text-gray-500">
          Imagens da pasta &quot;{folder}&quot; do Cloudinary
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner className="w-8 h-8" />
          </div>
        }
      >
        <GalleryContent />
      </Suspense>
    </div>
  );
}

