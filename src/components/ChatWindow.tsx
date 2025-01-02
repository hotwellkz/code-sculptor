import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useMessageParser } from "@/hooks/use-message-parser";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "./chat/ChatMessage";
import { TechnologySelect } from "./chat/TechnologySelect";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [technology, setTechnology] = useState<string>("react");
  const [currentProjectId, setCurrentProjectId] = useState<string | undefined>(projectId);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  useEffect(() => {
    if (currentProjectId) {
      loadMessages();
    }
  }, [currentProjectId]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('project_id', currentProjectId)
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

  const createNewProject = async () => {
    try {
      if (!userId) throw new Error("Пользователь не авторизован");

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: `Проект ${new Date().toLocaleString('ru')}`,
          user_id: userId,
          description: `Технология: ${technology}`
        })
        .select()
        .single();

      if (projectError) throw projectError;

      setCurrentProjectId(project.id);
      return project.id;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось создать новый проект",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !userId) return;

    try {
      const projectId = currentProjectId || await createNewProject();
      if (!projectId) return;

      const userMessage = {
        project_id: projectId,
        content: message,
        is_ai_response: false,
        user_id: userId
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

      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: { 
          prompt: message, 
          projectId,
          technology 
        }
      });

      if (error) throw error;

      if (data) {
        const aiMessage = {
          project_id: projectId,
          content: data.response,
          is_ai_response: true,
          user_id: userId
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

  return (
    <div className="h-full flex flex-col">
      <TechnologySelect value={technology} onChange={setTechnology} />

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              {...msg}
              parsedContent={parsedMessages[msg.id]}
            />
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
        <Button type="submit" size="icon" aria-label="Отправить">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};