import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useMessageParser } from "@/hooks/use-message-parser";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { parsedMessages, parseMessages } = useMessageParser();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    try {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage("");

      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: { prompt: message }
      });

      if (error) throw error;

      if (data) {
        const aiResponse: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.response,
          created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, aiResponse]);
        parseMessages([...messages, aiResponse]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отправить сообщение. Попробуйте снова.",
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]' 
                  : 'bg-muted max-w-[80%]'
              }`}
            >
              <div className="text-sm mb-1 text-muted-foreground">
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
              {msg.role === 'assistant' 
                ? parsedMessages[msg.id] || msg.content 
                : msg.content}
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t p-4 bg-card">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Опишите, какой код вы хотите сгенерировать..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};