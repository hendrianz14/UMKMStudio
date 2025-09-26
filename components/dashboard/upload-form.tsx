"use client";

import { useState } from "react";
import { useSupabaseSession } from "@/components/providers/supabase-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface UploadResponse {
  type: "json" | "image" | "text";
  data: unknown;
}

export function UploadForm() {
  const session = useSupabaseSession();
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile ?? null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!session?.access_token) {
      toast.error("You need to be signed in to upload.");
      return;
    }

    if (!caption.trim()) {
      toast.error("Please add a caption.");
      return;
    }

    if (!file) {
      toast.error("Please select an image file.");
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("file", file);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to process request");
      }

      const contentType = response.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        const json = await response.json();
        const imageUrl = json?.imageUrl || json?.image || json?.url;
        if (typeof imageUrl === "string") {
          setResult({ type: "image", data: imageUrl });
        } else {
          setResult({ type: "json", data: json });
        }
      } else {
        const text = await response.text();
        if (/^https?:\/\//.test(text)) {
          setResult({ type: "image", data: text });
        } else {
          setResult({ type: "text", data: text });
        }
      }

      toast.success("Upload sent successfully");
      setCaption("");
      setFile(null);
      form.reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-dashed border-brand-200 bg-white/70 p-6 shadow-inner"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="space-y-2">
          <Label htmlFor="caption" className="text-base">
            Caption / Keywords
          </Label>
          <Input
            id="caption"
            name="caption"
            placeholder="Describe your photo or give context"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file" className="text-base">
            Upload image
          </Label>
          <Input
            id="file"
            name="file"
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
          />
          <p className="text-xs text-slate-500">Accepted formats: .jpg, .png (max 10MB)</p>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="border-slate-200" />
              Sending...
            </span>
          ) : (
            "Send to workflow"
          )}
        </Button>
      </motion.form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg"
        >
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-900">Response</h3>
          {result.type === "image" && typeof result.data === "string" ? (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <img src={result.data} alt="Generated" className="h-auto w-full object-cover" />
            </div>
          ) : result.type === "json" ? (
            <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900/90 p-4 text-xs text-slate-100">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-slate-700">{String(result.data)}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
