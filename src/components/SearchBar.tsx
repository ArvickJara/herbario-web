import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({ placeholder = "Buscar plantas medicinales...", onSearch, className }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="query"
          placeholder={placeholder}
          className="pl-10 bg-card/80 backdrop-blur-sm border-border/50 focus:border-primary focus:bg-card"
          aria-label="Buscar plantas medicinales"
        />
      </div>
      <Button type="submit" variant="botanical" size="default">
        Buscar
      </Button>
    </form>
  );
}