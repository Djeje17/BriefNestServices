import { useState } from "react";
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
import { Pencil, Loader2 } from "lucide-react";

interface EditPostProps {
  post: {
    id: number;
    title: string;
    description: string;
  };
  onPostUpdated: () => void;
}

export function EditPost({ post, onPostUpdated }: EditPostProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/posts/${post.id}`, {
        title,
        description,
      });
      setOpen(false);
      onPostUpdated();
    } catch (error: any) {
      console.error("Failed to update post", error);
      alert(`Failed to update post: ${error.response?.data?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 hover:text-cyan-400 hover:bg-cyan-400/10">
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] border-white/10 bg-white/5 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Post</DialogTitle>
          <DialogDescription>
            Modify your post details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-black/20 border-white/10 focus-visible:ring-cyan-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description" className="text-sm font-medium">
              Content
            </Label>
            <Textarea
              id="edit-description"
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
              className="w-full bg-cyan-500 hover:bg-cyan-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
