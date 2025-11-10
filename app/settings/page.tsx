import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-6">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 mx-auto mb-4">
          <Settings className="size-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
    </div>
  );
}
