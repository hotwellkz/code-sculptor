import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarProvider, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { FileManager } from "@/components/FileManager";
import { ChatWindow } from "@/components/ChatWindow";
import { CodePreview } from "@/components/CodePreview";
import { ProjectsDialog } from "@/components/ProjectsDialog";

const Index = () => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Генератор Кода</h1>
        <Button onClick={() => setIsProjectsOpen(true)}>Проекты</Button>
      </header>

      <SidebarProvider>
        <div className="flex-1 flex">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} minSize={20}>
              <ChatWindow />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={20} minSize={15}>
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