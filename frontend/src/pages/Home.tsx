import { useState, useEffect } from "react";
import api from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Share2, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CreatePost } from "@/components/posts/CreatePost";
import { EditPost } from "@/components/posts/EditPost";
import { useToast } from "@/components/hooks/use-toast";

interface Post {
  id: number;
  title: string;
  description: string;
  user: { id: number; name: string };
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user: currentUser } = useAuth();
  const { toast } = useToast();

  const handleSoon = () => {
    toast({
      title: "Coming Soon!",
      description: "This feature is currently under development. Stay tuned!",
    });
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      // Fallback to mock data for demonstration
      setPosts([
        { id: 1, title: "Welcome to BriefNest", description: "This is the first post on the platform!", user: { id: 1, name: "admin" }, createdAt: new Date().toISOString() },
        { id: 2, title: "Modern Web Design", description: "Exploring the beauty of Northern Lights theme and Shadcn UI.", user: { id: 2, name: "jules" }, createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      fetchPosts();
      toast({
        title: "Post Deleted",
        description: "Your post has been removed successfully.",
      });
    } catch (error) {
      console.error("Failed to delete post", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100svh-160px)]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <main className="container max-w-4xl py-8 px-4">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
            Recent <span className="text-cyan-400">Posts</span>
          </h1>
          <p className="text-muted-foreground">Discover what the community is sharing.</p>
        </div>
        {isAuthenticated && <CreatePost onPostCreated={fetchPosts} />}
      </header>

      <div className="grid gap-6">
        {posts.length === 0 ? (
          <Card className="border-dashed border-white/10 bg-white/5 py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-xl font-medium">No posts yet</p>
              <p className="text-muted-foreground mt-1">Be the first one to share something!</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold">
                      {post.user.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-cyan-300">@{post.user.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{post.description}</p>
              </CardContent>
              <CardFooter className="border-t border-white/5 pt-4 flex items-center justify-between">
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSoon}
                    className="gap-2 hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Heart className="w-4 h-4" />
                    Like
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSoon}
                    className="gap-2 hover:text-cyan-400 hover:bg-cyan-400/10"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Comment
                  </Button>
                </div>

                {currentUser && currentUser.id === post.user.id && (
                  <div className="flex gap-2">
                    <EditPost post={post} onPostUpdated={fetchPosts} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
