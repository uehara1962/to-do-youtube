import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { PostForm } from "@/components/PostForm";
import { Card } from "@/components/ui/card";

export default async function NewPostPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Criar Novo Post</h1>
      <Card className="p-6">
        <PostForm redirectTo="/blog" />
      </Card>
    </div>
  );
}

