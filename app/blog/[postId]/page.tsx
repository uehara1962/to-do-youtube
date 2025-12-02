import { getPostAction } from "@/actions/posts/get-post-action";
import { PostCard } from "@/components/PostCard";
import { getCurrentUser } from "@/lib/auth-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PostPageProps {
  params: Promise<{ postId: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId } = await params;
  const user = await getCurrentUser();
  const postResult = await getPostAction(postId);

  if (!postResult.success) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Link href="/blog">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Blog
        </Button>
      </Link>

      <PostCard post={postResult.post} currentUserId={user?.id} />
    </div>
  );
}

