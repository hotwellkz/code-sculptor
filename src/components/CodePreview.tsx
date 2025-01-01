import { ScrollArea } from "@/components/ui/scroll-area";

export const CodePreview = () => {
  return (
    <ScrollArea className="h-full">
      <pre className="p-4 text-sm">
        <code>
          // Здесь будет отображаться сгенерированный код
        </code>
      </pre>
    </ScrollArea>
  );
};