import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DeployButtonProps {
  onDeploy: () => Promise<void>;
  isLoading?: boolean;
}

export const DeployButton = ({ onDeploy, isLoading }: DeployButtonProps) => {
  const { toast } = useToast();

  const handleDeploy = async () => {
    try {
      await onDeploy();
      toast({
        title: "Успешно!",
        description: "Проект успешно развернут",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось развернуть проект",
      });
    }
  };

  return (
    <Button onClick={handleDeploy} disabled={isLoading}>
      {isLoading ? "Развертывание..." : "Развернуть"}
    </Button>
  );
};