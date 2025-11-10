import { Metadata } from "next";
import UploadComponent from "./Upload.component";

export const metadata: Metadata = {
  title: "Upload | AI Assistant",
  description: "Upload Your Documents",
};

const UploadPage = async () => {
  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Upload Document
        </h2>
        <p className="text-sm text-muted-foreground">Upload a PDF file</p>
      </div>
      <UploadComponent />
    </div>
  );
};

export default UploadPage;
