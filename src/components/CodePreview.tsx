import { ScrollArea } from "@/components/ui/scroll-area";
import { useCodeGeneration } from "@/hooks/use-code-generation";
import { useToast } from "@/hooks/use-toast";

export const CodePreview = () => {
  const { error } = useCodeGeneration();
  const { toast } = useToast();

  // Показываем ошибку, если она есть
  if (error) {
    toast({
      variant: "destructive",
      title: "Ошибка",
      description: error,
    });
  }

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