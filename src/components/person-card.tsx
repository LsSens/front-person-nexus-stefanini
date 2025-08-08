import { Person } from "@/types/person";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, User, Mail, Calendar, MapPin } from "lucide-react";
import { formatCPF } from "@/utils/validations";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PersonCardProps {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (id: string) => void;
}

export function PersonCard({ person, onEdit, onDelete }: PersonCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return format(date, "dd/MM/yyyy", { locale: ptBR });
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <Card className="group hover:shadow-card transition-smooth border-0 bg-gradient-subtle">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base sm:text-lg leading-none truncate">{person.nome}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                CPF: {formatCPF(person.cpf)}
              </p>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-smooth flex-shrink-0">
            <Button
              size="icon"
              variant="outline"
              onClick={() => onEdit(person)}
              className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-primary hover:text-primary-foreground"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => onDelete(person.id)}
              className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 sm:space-y-3">
        {person.email && (
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{person.email}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          <span>Nascimento: {formatDate(person.dataNascimento)}</span>
        </div>

        {(person.naturalidade || person.nacionalidade) && (
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">
              {person.naturalidade && `${person.naturalidade}`}
              {person.naturalidade && person.nacionalidade && ' - '}
              {person.nacionalidade}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          {person.sexo && (
            <Badge variant="secondary" className="text-xs">
              {person.sexo.charAt(0).toUpperCase() + person.sexo.slice(1)}
            </Badge>
          )}
          {person.dataCadastro && (
            <span className="text-xs text-muted-foreground truncate">
              Cadastrado: {formatDate(person.dataCadastro)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}