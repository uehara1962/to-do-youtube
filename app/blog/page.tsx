import { getPostsAction } from "@/actions/posts/get-posts-action";
import { PostForm } from "@/components/PostForm";
import { PostCard } from "@/components/PostCard";
import { getCurrentUser } from "@/lib/auth-server";
import { Card } from "@/components/ui/card";

export default async function BlogPage() {
  const user = await getCurrentUser();
  const postsResult = await getPostsAction(20, 0);

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      {/* {user && (
        <Card className="p-6 mb-6">
          <PostForm />
        </Card>
      )} */}

      <div className="space-y-4">
        {postsResult.success ? (
          postsResult.posts.length > 0 ? (
            postsResult.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Nenhum post ainda. Seja o primeiro a compartilhar!</p>
            </div>
          )
        ) : (
          <div className="text-center py-12 text-red-500">
            <p>Erro ao carregar posts: {postsResult.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

