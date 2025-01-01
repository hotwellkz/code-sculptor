import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DeployButtonProps {
  onDeploy: () => Promise<void>;
  isLoading?: boolean;
}

export const DeployButton = ({ onDeploy, isLoading }: DeployButtonProps) => {
  const { toast } = useToast();

  const handleDeploy = async () => {
    try {
      await onDeploy();
      
      // Показываем уведомление об успешном деплое
      toast({
        title: "Успешно!",
        description: "Проект успешно развернут. Вы можете найти его по предоставленному URL.",
      });
    } catch (error) {
      console.error('Ошибка при деплое:', error);
      
      // Показываем уведомление об ошибке
      toast({
        variant: "destructive",
        title: "Ошибка при деплое",
        description: "Не удалось развернуть проект. Пожалуйста, попробуйте снова.",
      });
    }
  };

  return (
    <Button 
      onClick={handleDeploy} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "Развертывание..." : "Развернуть проект"}
    </Button>
  );
};