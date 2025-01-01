import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

interface NotificationProps {
  title: string;
  description?: string;
  type?: "success" | "error";
}

export const Notification = ({ title, description, type = "success" }: NotificationProps) => {
  const { toast } = useToast();

  const showNotification = () => {
    toast({
      variant: type === "error" ? "destructive" : "default",
      title: (
        <div className="flex items-center gap-2">
          {type === "success" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          {title}
        </div>
      ),
      description,
    });
  };

  return null; // Этот компонент не рендерит UI, он только показывает уведомления
};