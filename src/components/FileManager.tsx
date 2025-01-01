import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Folder, File, ChevronRight, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

export const FileManager = () => {
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleFolder = (path: string) => {
    if (expanded.includes(path)) {
      setExpanded(expanded.filter(p => p !== path));
    } else {
      setExpanded([...expanded, path]);
    }
  };

  const renderNode = (node: FileNode, path: string = '') => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expanded.includes(currentPath);

    if (node.type === 'folder') {
      return (
        <Collapsible
          key={currentPath}
          open={isExpanded}
          onOpenChange={() => toggleFolder(currentPath)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 px-2"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <Folder className="h-4 w-4" />
              <span>{node.name}</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6">
            {node.children?.map(child => renderNode(child, currentPath))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={currentPath}
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 px-2 pl-8"
      >
        <File className="h-4 w-4" />
        <span>{node.name}</span>
      </Button>
    );
  };

  // Пример структуры файлов
  const files: FileNode[] = [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'App.tsx', type: 'file' },
            { name: 'Header.tsx', type: 'file' },
          ],
        },
        { name: 'index.tsx', type: 'file' },
      ],
    },
    {
      name: 'public',
      type: 'folder',
      children: [
        { name: 'index.html', type: 'file' },
        { name: 'style.css', type: 'file' },
      ],
    },
  ];

  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-1">
        {files.map(node => renderNode(node))}
      </div>
    </ScrollArea>
  );
};