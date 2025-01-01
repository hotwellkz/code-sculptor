import { ScrollArea } from "@/components/ui/scroll-area";
import { useCodeGeneration } from "@/hooks/use-code-generation";
import { useToast } from "@/hooks/use-toast";
import { CopyButton } from "./CopyButton";

interface CodePreviewProps {
  code?: string;
}

export const CodePreview = ({ code }: CodePreviewProps) => {
  const { error } = useCodeGeneration();
  const { toast } = useToast();

  if (error) {
    toast({
      variant: "destructive",
      title: "Ошибка",
      description: error,
    });
  }

  return (
    <ScrollArea className="h-full">
      <div className="relative">
        {code && (
          <div className="absolute right-2 top-2">
            <CopyButton text={code} />
          </div>
        )}
        <pre className="p-4 text-sm">
          <code>
            {code || "// Здесь будет отображаться сгенерированный код"}
          </code>
        </pre>
      </div>
    </ScrollArea>
  );
};