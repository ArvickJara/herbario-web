import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export const SearchBar = ({ placeholder, onSearch, className }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSearchClick = () => {
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        // --- CORRECCIÓN AQUÍ ---
        // Añadimos clases para asegurar que el texto sea oscuro y el padding no se solape con el botón.
        className="h-12 pl-4 pr-16 text-base text-foreground"
      />
      <Button
        type="submit"
        size="icon"
        onClick={handleSearchClick}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-10"
        aria-label="Buscar"
      >
        <Search className="h-5 w-5" />
      </Button>
    </div>
  );
};