import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface ChatMessageProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  parsedContent?: string;
}

export const ChatMessage = ({ id, role, content, created_at, parsedContent }: ChatMessageProps) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "d MMMM, HH:mm", { locale: ru });
  };

  return (
    <div
      className={`flex flex-col ${
        role === 'user' 
          ? 'items-end' 
          : 'items-start'
      }`}
    >
      <div className={`p-4 rounded-lg max-w-[80%] ${
        role === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      }`}>
        {role === 'assistant' 
          ? parsedContent || content 
          : content}
      </div>
      <span className="text-xs text-muted-foreground mt-1">
        {formatDate(created_at)}
      </span>
    </div>
  );
};