import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatFormProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}

export const ChatForm = ({ onSubmit, isLoading }: ChatFormProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSubmit(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Опишите, какой код вы хотите сгенерировать..."
        className="flex-1"
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || !message.trim()}
        aria-label="Отправить сообщение"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};