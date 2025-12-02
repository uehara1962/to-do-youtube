"use client";

import { PostMedia } from "@/components/PostMedia";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { deletePostAction } from "@/actions/posts/delete-post-action";
import { toast } from "sonner";
import { Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PostCardProps {
  post: {
    id: string;
    userId: string;
    content: string;
    imageUrl: string | null;
    videoUrl: string | null;
    mediaType: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  currentUserId?: string;
  onDelete?: () => void;
}

function formatDate(date: Date): string {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "agora mesmo";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""} atrás`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hora${diffInHours > 1 ? "s" : ""} atrás`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} dia${diffInDays > 1 ? "s" : ""} atrás`;
  }

  return postDate.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PostCard({ post, currentUserId, onDelete }: PostCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = currentUserId === post.userId;

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar este post?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deletePostAction(post.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Post deletado com sucesso!");
      onDelete?.();
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Erro ao deletar post");
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              {getInitials(post.user.name)}
            </div>
            <div>
              <div className="font-semibold">{post.user.name}</div>
              <div className="text-sm text-gray-500">
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deletar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <PostMedia
          imageUrl={post.imageUrl}
          videoUrl={post.videoUrl}
          mediaType={post.mediaType}
        />
        {post.content && (
          <div className="whitespace-pre-wrap wrap-break-words">{post.content}</div>
        )}
      </CardContent>
    </Card>
  );
}

