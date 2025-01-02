import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useMessageParser } from "@/hooks/use-message-parser";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatWindowProps {
  projectId?: string;
}

export const ChatWindow = ({ projectId }: ChatWindowProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { parsedMessages, parseMessages } = useMessageParser();
  const { toast } = useToast();

  // Загрузка сообщений при монтировании компонента
  useEffect(() => {
    if (projectId) {
      loadMessages();
    }
  }, [projectId]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data.map(msg => ({
        id: msg.id,
        role: msg.is_ai_response ? 'assistant' : 'user' as 'user' | 'assistant',
        content: msg.content,
        created_at: msg.created_at
      }));

      setMessages(formattedMessages);
      parseMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить историю сообщений",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !projectId) return;

    try {
      // Сохраняем сообщение пользователя
      const userMessage = {
        project_id: projectId,
        content: message,
        is_ai_response: false
      };

      const { data: savedMessage, error: saveError } = await supabase
        .from('chat_messages')
        .insert(userMessage)
        .select()
        .single();

      if (saveError) throw saveError;

      const newUserMessage: Message = {
        id: savedMessage.id,
        role: 'user',
        content: message,
        created_at: savedMessage.created_at
      };

      setMessages(prev => [...prev, newUserMessage]);
      setMessage("");

      // Получаем ответ от ИИ
      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: { prompt: message, projectId }
      });

      if (error) throw error;

      if (data) {
        // Сохраняем ответ ИИ
        const aiMessage = {
          project_id: projectId,
          content: data.response,
          is_ai_response: true
        };

        const { data: savedAiMessage, error: aiSaveError } = await supabase
          .from('chat_messages')
          .insert(aiMessage)
          .select()
          .single();

        if (aiSaveError) throw aiSaveError;

        const newAiMessage: Message = {
          id: savedAiMessage.id,
          role: 'assistant',
          content: data.response,
          created_at: savedAiMessage.created_at
        };

        setMessages(prev => [...prev, newAiMessage]);
        parseMessages([...messages, newAiMessage]);
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

  const formatDate = (date: string) => {
    return format(new Date(date), "d MMMM, HH:mm", { locale: ru });
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' 
                  ? 'items-end' 
                  : 'items-start'
              }`}
            >
              <div className={`p-4 rounded-lg max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                {msg.role === 'assistant' 
                  ? parsedMessages[msg.id] || msg.content 
                  : msg.content}
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {formatDate(msg.created_at)}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Опишите, какой код вы хотите сгенерировать..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};