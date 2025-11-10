"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Upload, FileText, X } from "lucide-react";

import { useState } from "react";
import { uploadFile } from "./upload.action";

const UploadComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please select a file to upload");
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadFile(formData);
      if (result.success) {
        toast.success("File uploaded successfully");
        setFile(null);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while uploading the file");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Upload Card */}
      <div className="bg-card rounded-xl border shadow-sm p-6">
        <div className="space-y-6">
          {/* Drop Zone */}
          <div className="relative">
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                file
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {!file ? (
                  <>
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
                      <Upload className="size-8 text-primary" />
                    </div>
                    <p className="mb-2 text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF files only (Max 10MB)
                    </p>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-12 rounded-full bg-primary/10">
                      <FileText className="size-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={loading}
              />
            </label>

            {/* Remove file button */}
            {file && !loading && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 size-8"
                onClick={(e) => {
                  e.preventDefault();
                  setFile(null);
                }}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>

          {/* Upload Button */}
          <Button
            disabled={loading}
            className="w-full h-11"
            onClick={handleUpload}
            variant="outline"
          >
            {loading ? (
              <>
                <Spinner className="mr-2" />
                Uploading...
              </>
            ) : (
              <>Upload Document</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadComponent;
