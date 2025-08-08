export interface Person {
  id: string;
  nome: string;
  sexo?: 'masculino' | 'feminino' | 'outro';
  email?: string;
  dataNascimento: string;
  naturalidade?: string;
  nacionalidade?: string;
  cpf: string;
  endereco?: string;
  dataCadastro: string;
  dataAtualizacao: string;
}

export interface PersonFormData {
  nome: string;
  sexo?: 'masculino' | 'feminino' | 'outro';
  email?: string;
  dataNascimento: string;
  naturalidade?: string;
  nacionalidade?: string;
  cpf: string;
  endereco?: string;
}