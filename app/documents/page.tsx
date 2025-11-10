import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDBClient } from "@/lib/db-config";
import { Calendar, File, FileAudio, FileCode, FileImage, FileText, FileVideo } from "lucide-react";

interface FileTypes {
  id: string;
  filename: string;
  file_type: string;
  uploaded_at: Date;
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return FileImage;
  if (fileType.startsWith('video/')) return FileVideo;
  if (fileType.startsWith('audio/')) return FileAudio;
  if (fileType.includes('code') || fileType.includes('javascript') || fileType.includes('typescript')) return FileCode;
  if (fileType.includes('pdf') || fileType.includes('document')) return FileText;
  return File;
}

function formatDate(date: Date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getFileTypeColor(fileType: string) {
  if (fileType.startsWith('image/')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  if (fileType.startsWith('video/')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
  if (fileType.startsWith('audio/')) return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
  if (fileType.includes('pdf')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
}

export default async function DocumentsPage() {
  const client = await getDBClient();
  const { rows, rowCount } = await client.query<FileTypes>("SELECT * FROM files ORDER BY uploaded_at DESC");
  
  if (!rowCount) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 mx-auto mb-4">
            <FileText className="size-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">No Documents Yet</h1>
          <p className="text-muted-foreground">
            Upload your first document to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            {rowCount} {rowCount === 1 ? 'document' : 'documents'} uploaded
          </p>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((file) => {
            const FileIcon = getFileIcon(file.file_type);
            return (
              <Card key={file.id} className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50 min-w-0">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 shrink-0">
                        <FileIcon className="size-5 text-primary" />
                      </div>
                        <CardTitle className="text-base truncate block w-full" title={file.filename}>
                          {file.filename}
                        </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={getFileTypeColor(file.file_type)}>
                        {file.file_type.split('/')[1]?.toUpperCase() || file.file_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="size-4" />
                      <span>{formatDate(file.uploaded_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

