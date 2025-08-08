import { useState } from "react";
import { Person, PersonFormData } from "@/types/person";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { validateCPF, validateEmail, validateBirthDate, validateName, validateText, validateAddress, formatCPF } from "@/utils/validations";

interface PersonFormProps {
  person?: Person;
  onSubmit: (data: PersonFormData) => void;
  onCancel: () => void;
}

export function PersonForm({ person, onSubmit, onCancel }: PersonFormProps) {
  const [formData, setFormData] = useState<PersonFormData>({
    nome: person?.nome || '',
    sexo: person?.sexo,
    email: person?.email || '',
    dataNascimento: person?.dataNascimento || '',
    naturalidade: person?.naturalidade || '',
    nacionalidade: person?.nacionalidade || '',
    cpf: person?.cpf || '',
    endereco: person?.endereco || '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof PersonFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PersonFormData, string>> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (!validateName(formData.nome)) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres e conter apenas letras e espaços';
    } else if (formData.nome.trim().length > 100) {
      newErrors.nome = 'Nome não pode ter mais de 100 caracteres';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else if (!validateBirthDate(formData.dataNascimento)) {
      newErrors.dataNascimento = 'Data de nascimento inválida ou no futuro';
    }

    if (!formData.sexo) {
      newErrors.sexo = 'Sexo é obrigatório';
    }

    if (formData.email && formData.email.trim()) {
      if (!validateEmail(formData.email)) {
        newErrors.email = 'Email inválido';
      } else if (formData.email.length > 100) {
        newErrors.email = 'Email não pode ter mais de 100 caracteres';
      }
    }

    if (formData.naturalidade && !validateText(formData.naturalidade, 2, 50)) {
      newErrors.naturalidade = 'Naturalidade deve ter entre 2 e 50 caracteres';
    }

    if (formData.nacionalidade && !validateText(formData.nacionalidade, 2, 50)) {
      newErrors.nacionalidade = 'Nacionalidade deve ter entre 2 e 50 caracteres';
    }

    if (formData.endereco && !validateAddress(formData.endereco)) {
      newErrors.endereco = 'Endereço deve ter entre 5 e 255 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await Promise.resolve(onSubmit(formData));
    }
  };

  const handleCPFChange = (value: string) => {
    const formatted = formatCPF(value);
    setFormData({ ...formData, cpf: formatted });
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="person-form-description">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          {person ? 'Editar Pessoa' : 'Cadastrar Nova Pessoa'}
        </DialogTitle>
        <p id="person-form-description" className="text-sm text-muted-foreground">
          {person ? 'Edite os dados da pessoa selecionada.' : 'Preencha os dados para cadastrar uma nova pessoa.'}
        </p>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: João Silva Santos"
              maxLength={100}
              className={errors.nome ? "border-destructive" : ""}
            />
            {errors.nome && <p className="text-sm text-destructive mt-1">{errors.nome}</p>}
          </div>

          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              value={formData.cpf}
              onChange={(e) => handleCPFChange(e.target.value)}
              placeholder="000.000.000-00"
              maxLength={14}
              className={errors.cpf ? "border-destructive" : ""}
            />
            {errors.cpf && <p className="text-sm text-destructive mt-1">{errors.cpf}</p>}
          </div>

          <div>
            <Label htmlFor="sexo">Sexo *</Label>
            <Select value={formData.sexo || ''} onValueChange={(value: 'masculino' | 'feminino' | 'outro') => setFormData({ ...formData, sexo: value })}>
              <SelectTrigger className={errors.sexo ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione o sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="feminino">Feminino</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            {errors.sexo && <p className="text-sm text-destructive mt-1">{errors.sexo}</p>}
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Ex: joao@email.com"
              maxLength={100}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
            <Input
              id="dataNascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              className={errors.dataNascimento ? "border-destructive" : ""}
            />
            {errors.dataNascimento && <p className="text-sm text-destructive mt-1">{errors.dataNascimento}</p>}
          </div>

          <div>
            <Label htmlFor="naturalidade">Naturalidade</Label>
            <Input
              id="naturalidade"
              value={formData.naturalidade}
              onChange={(e) => setFormData({ ...formData, naturalidade: e.target.value })}
              placeholder="Ex: São Paulo"
              maxLength={50}
              className={errors.naturalidade ? "border-destructive" : ""}
            />
            {errors.naturalidade && <p className="text-sm text-destructive mt-1">{errors.naturalidade}</p>}
          </div>

          <div>
            <Label htmlFor="nacionalidade">Nacionalidade</Label>
            <Input
              id="nacionalidade"
              value={formData.nacionalidade}
              onChange={(e) => setFormData({ ...formData, nacionalidade: e.target.value })}
              placeholder="Ex: Brasileira"
              maxLength={50}
              className={errors.nacionalidade ? "border-destructive" : ""}
            />
            {errors.nacionalidade && <p className="text-sm text-destructive mt-1">{errors.nacionalidade}</p>}
          </div>

          <div className="col-span-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              placeholder="Ex: Rua das Flores, 123 - Centro - São Paulo/SP"
              maxLength={255}
              className={errors.endereco ? "border-destructive" : ""}
            />
            {errors.endereco && <p className="text-sm text-destructive mt-1">{errors.endereco}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-gradient-primary">
            {person ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}