import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  projectId?: string;
}

export const PromptInput = ({ onSubmit, isLoading, projectId }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;

    try {
      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: { prompt, projectId }
      });

      if (error) throw error;

      if (data.code) {
        onSubmit(data.code);
        setPrompt("");
        
        toast({
          title: "Код успешно сгенерирован",
          description: "Результат отображен в редакторе кода",
        });
      }
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сгенерировать код. Попробуйте снова.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Опишите, какой код вы хотите сгенерировать..."
        className="min-h-[100px] flex-1"
      />
      <Button type="submit" disabled={isLoading || !prompt.trim()}>
        <Send className="h-4 w-4 mr-2" />
        {isLoading ? "Генерация..." : "Отправить"}
      </Button>
    </form>
  );
};