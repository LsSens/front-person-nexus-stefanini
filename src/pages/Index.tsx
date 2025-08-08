import { useState, useMemo } from "react";
import { Person, PersonFormData } from "@/types/person";
import { PersonCard } from "@/components/person-card";
import { PersonForm } from "@/components/person-form";
import { SearchFilter, FilterOptions } from "@/components/search-filter";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Users, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { createPersonV1, deletePersonV1, listPeopleV1, updatePersonV1 } from "@/services/persons-v1";
import { useDebounce } from "@/hooks/use-debounce";
import { useAuth } from "@/components/auth-provider";

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const { logout } = useAuth();

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, isLoading, isError, error, isFetching } = useQuery<Person[]>({
    queryKey: ['people', debouncedSearch || ''],
    queryFn: async () => {
      const response = await listPeopleV1({ search: debouncedSearch || undefined, page: 1, limit: 100 });
      return response.items;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
    placeholderData: keepPreviousData,
  });

  const people: Person[] = useMemo(() => data ?? [], [data]);

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      const matchesSearch = !searchQuery ||
        person.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.cpf.includes(searchQuery) ||
        person.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters =
        (!filters.sexo || person.sexo === filters.sexo) &&
        (!filters.naturalidade || person.naturalidade?.toLowerCase().includes(filters.naturalidade.toLowerCase())) &&
        (!filters.nacionalidade || person.nacionalidade?.toLowerCase().includes(filters.nacionalidade.toLowerCase()));

      return matchesSearch && matchesFilters;
    });
  }, [people, searchQuery, filters]);

  const createMutation = useMutation({
    mutationFn: createPersonV1,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['people'] });
      toast({ title: 'Pessoa cadastrada', description: 'Registro criado com sucesso.' });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      toast({ title: 'Erro ao cadastrar', description: msg, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PersonFormData> }) => updatePersonV1(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['people'] });
      toast({ title: 'Pessoa atualizada', description: 'Registro atualizado com sucesso.' });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      toast({ title: 'Erro ao atualizar', description: msg, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePersonV1(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['people'] });
      setDeletingPerson(null);
      toast({
        title: 'Pessoa removida',
        description: 'O registro foi removido com sucesso.',
        duration: 3000
      });
    },
    onError: (err: unknown) => {
      toast({ title: 'Erro ao remover', description: String(err), variant: 'destructive' });
    }
  });

  const handleSubmit = async (data: PersonFormData) => {
    if (editingPerson) {
      await updateMutation.mutateAsync({ id: editingPerson.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsFormOpen(false);
    setEditingPerson(null);
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleDeleteClick = (person: Person) => {
    setDeletingPerson(person);
  };

  const handleNewPerson = () => {
    setEditingPerson(null);
    setIsFormOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({});
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent truncate">
                  Person Nexus
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Sistema de gerenciamento de pessoas</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-destructive hover:text-destructive-foreground flex-shrink-0"
                title="Sair do sistema"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleNewPerson} className="bg-gradient-primary shadow-elegant flex-shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Nova Pessoa</span>
                    <span className="sm:hidden">Nova</span>
                  </Button>
                </DialogTrigger>
                {isFormOpen && (
                  <PersonForm
                    person={editingPerson}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                      setIsFormOpen(false);
                      setEditingPerson(null);
                    }}
                  />
                )}
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {isLoading && (
          <div className="text-center py-10 text-muted-foreground">Carregando pessoas...</div>
        )}
        {isError && (
          <div className="text-center py-10 text-destructive">Erro ao carregar pessoas: {String((error as Error)?.message ?? error)}</div>
        )}
        <div className="mb-6 sm:mb-8">
          <SearchFilter
            onSearch={setSearchQuery}
            onFilter={setFilters}
            onClear={handleClearFilters}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-card rounded-lg p-4 sm:p-6 shadow-card border-0">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Total de Pessoas</h3>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{people.length}</p>
          </div>
          <div className="bg-card rounded-lg p-4 sm:p-6 shadow-card border-0">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Resultados da Busca</h3>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{filteredPeople.length}</p>
          </div>
          <div className="bg-card rounded-lg p-4 sm:p-6 shadow-card border-0 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Cadastros Hoje</h3>
            <p className="text-2xl sm:text-3xl font-bold text-primary">
              {people.filter(p => p.dataCadastro && p.dataCadastro.startsWith(new Date().toISOString().split('T')[0])).length}
            </p>
          </div>
        </div>

        {filteredPeople.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredPeople.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                onEdit={handleEdit}
                onDelete={() => handleDeleteClick(person)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              {people.length === 0 ? 'Nenhuma pessoa cadastrada' : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 px-4">
              {people.length === 0
                ? 'Comece cadastrando a primeira pessoa do sistema.'
                : 'Tente ajustar os filtros ou termos de busca.'}
            </p>
            {people.length === 0 && (
              <Button onClick={handleNewPerson} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Cadastrar Primeira Pessoa</span>
                <span className="sm:hidden">Cadastrar Pessoa</span>
              </Button>
            )}
          </div>
        )}

        <AlertDialog open={!!deletingPerson} onOpenChange={(open) => !open && setDeletingPerson(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o registro de <strong>{deletingPerson?.nome}</strong>?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingPerson && handleDelete(deletingPerson.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>

      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gradient-primary flex items-center justify-center">
                <Users className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">
                Person Nexus - Sistema de gerenciamento de pessoas
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Desenvolvido por <span className="font-semibold text-primary">Lucas Sens</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
