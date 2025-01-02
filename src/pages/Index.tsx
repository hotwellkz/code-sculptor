import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarProvider, SidebarContent } from "@/components/ui/sidebar";
import { FileManager } from "@/components/FileManager";
import { ChatWindow } from "@/components/ChatWindow";
import { CodePreview } from "@/components/CodePreview";
import { ProjectsDialog } from "@/components/ProjectsDialog";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";

const Index = () => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b p-4 flex justify-between items-center bg-card">
        <h1 className="text-2xl font-bold">AI Генератор Кода</h1>
        <div className="flex items-center gap-4">
          <Button 
            variant="secondary"
            onClick={() => setIsProjectsOpen(true)}
            className="font-medium"
          >
            Проекты
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <SidebarProvider>
        <div className="flex-1 flex overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel 
              defaultSize={30} 
              minSize={20} 
              className="bg-card"
            >
              <ChatWindow />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel 
              defaultSize={20} 
              minSize={15}
              className="bg-card"
            >
              <Sidebar variant="inset" collapsible="icon">
                <SidebarContent>
                  <FileManager />
                </SidebarContent>
              </Sidebar>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={50}>
              <CodePreview />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SidebarProvider>

      <ProjectsDialog open={isProjectsOpen} onOpenChange={setIsProjectsOpen} />
    </div>
  );
};

export default Index;