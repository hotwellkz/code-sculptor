import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header className="border-b p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">AI Генератор Кода</h1>
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate("/projects")}>Проекты</Button>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};