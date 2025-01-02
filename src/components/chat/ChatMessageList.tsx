import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatMessageListProps {
  messages: Message[];
  parsedMessages: Record<string, any>;
}

export const ChatMessageList = ({ messages, parsedMessages }: ChatMessageListProps) => {
  return (
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
  );
};