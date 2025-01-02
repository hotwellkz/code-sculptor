import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TechnologySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const TechnologySelect = ({ value, onChange }: TechnologySelectProps) => {
  return (
    <div className="border-b p-4">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Выберите технологию" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="nodejs">Node.js</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};