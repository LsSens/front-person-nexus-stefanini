import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  onClear: () => void;
}

export interface FilterOptions {
  sexo?: 'masculino' | 'feminino' | 'outro';
  naturalidade?: string;
  nacionalidade?: string;
}

export function SearchFilter({ onSearch, onFilter, onClear }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilters({});
    setShowFilters(false);
    onClear();
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF ou email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`${showFilters || hasActiveFilters ? 'bg-primary text-primary-foreground' : ''} flex-shrink-0`}
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filtros</span>
            <span className="sm:hidden">Filtro</span>
          </Button>
          {(searchQuery || hasActiveFilters) && (
            <Button variant="outline" onClick={handleClear} className="flex-shrink-0">
              <X className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Limpar</span>
              <span className="sm:hidden">Limpar</span>
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
          <div>
            <label className="text-sm font-medium mb-2 block">Sexo</label>
            <Select value={filters.sexo || 'todos'} onValueChange={(value) => handleFilterChange('sexo', value === 'todos' ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="feminino">Feminino</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Naturalidade</label>
            <Input
              placeholder="Filtrar por naturalidade"
              value={filters.naturalidade || ''}
              onChange={(e) => handleFilterChange('naturalidade', e.target.value)}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-sm font-medium mb-2 block">Nacionalidade</label>
            <Input
              placeholder="Filtrar por nacionalidade"
              value={filters.nacionalidade || ''}
              onChange={(e) => handleFilterChange('nacionalidade', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}