import { useState } from "react";
import { Header } from "@/components/Header";
import { ProjectsDialog } from "@/components/ProjectsDialog";

const Projects = () => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <ProjectsDialog open={isProjectsOpen} onOpenChange={setIsProjectsOpen} />
    </div>
  );
};

export default Projects;