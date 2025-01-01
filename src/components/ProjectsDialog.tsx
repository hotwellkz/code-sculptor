import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectsDialog = ({ open, onOpenChange }: ProjectsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Проекты</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {/* TODO: Implement projects list */}
          <p className="text-muted-foreground">Список проектов пуст</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};