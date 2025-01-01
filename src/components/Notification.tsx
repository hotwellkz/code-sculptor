import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import { ReactNode } from "react";

interface NotificationProps {
  title: string;
  description?: string;
  type?: "success" | "error";
}

export const Notification = ({ title, description, type = "success" }: NotificationProps) => {
  const { toast } = useToast();

  const showNotification = () => {
    const titleContent = (
      <div className="flex items-center gap-2">
        {type === "success" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        <span>{title}</span>
      </div>
    );

    toast({
      variant: type === "error" ? "destructive" : "default",
      title: titleContent,
      description,
    });
  };

  return null; // Этот компонент не рендерит UI, он только показывает уведомления
};