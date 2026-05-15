import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";

interface CreatePostProps {
  onPostCreated: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await api.post("/posts", {
        title,
        description,
        userId: Number(user.id),
      });
      setTitle("");
      setDescription("");
      setOpen(false);
      onPostCreated();
    } catch (error: any) {
      console.error("Failed to create post", error);
      const message = error.response?.data?.message;
      alert(`Failed to create post: ${Array.isArray(message) ? message.join(", ") : message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-lg shadow-cyan-500/20">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] border-white/10 bg-white/5 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts with the BriefNest community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Give your post a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-black/20 border-white/10 focus-visible:ring-cyan-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Content
            </Label>
            <Textarea
              id="description"
              placeholder="What's on your mind?"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-black/20 border-white/10 focus-visible:ring-cyan-500 resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Now"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
