import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PromptInput } from "@/components/PromptInput";
import { CodePreview } from "@/components/CodePreview";
import { FileManager } from "@/components/FileManager";
import { useCodeGeneration } from "@/hooks/use-code-generation";

export const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { generateCode } = useCodeGeneration();

  const handlePromptSubmit = async (prompt: string) => {
    setIsLoading(true);
    try {
      await generateCode(prompt);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                {/* Здесь будет история чата */}
              </div>
              <div className="p-4 border-t">
                <PromptInput onSubmit={handlePromptSubmit} isLoading={isLoading} />
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={20} minSize={15}>
            <FileManager />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50}>
            <CodePreview />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      <Footer />
    </div>
  );
};

export default Home;