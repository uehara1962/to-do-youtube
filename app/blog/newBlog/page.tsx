"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { createTodoAction } from "@/actions/todo/create-todo-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { UploadImageResult } from "@/actions/upload/upload-image-action";

export default function NewBlogPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = (result: UploadImageResult) => {
    setImageUrl(result.url);
  };

  const handleSubmit = async (formData: FormData) => {
    if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }
    await createTodoAction(formData);
    toast.success("Todo criado com sucesso!");
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="pb-2">Título</Label>
        <Input id="title" name="title" required />
      </div>

      <div>
        <Label htmlFor="description" className="pb-2">Descrição</Label>
        <Input id="description" name="description" />
      </div>

      <div>
        <Label className="pb-2">Imagem</Label>
        <ImageUpload
          onUploadComplete={handleImageUpload}
          folder="blog"
        />
      </div>

      <Button type="submit">Criar Todo</Button>
    </form>
  );
}