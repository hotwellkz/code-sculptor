import { ScrollArea } from "@/components/ui/scroll-area";
import { Folder, File } from "lucide-react";

export const FileManager = () => {
  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Folder className="h-4 w-4" />
          <span>src</span>
        </div>
        <div className="ml-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <File className="h-4 w-4" />
            <span>index.js</span>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};