import { Person, PersonFormData } from '@/types/person';
import { httpRequest, withQuery } from './http';

function toApiBodyFromForm(data: PersonFormData | Partial<PersonFormData>) {
  return {
    nome: data.nome,
    sexo: data.sexo,
    email: data.email,
    dataDeNascimento: data.dataNascimento,
    naturalidade: data.naturalidade,
    nacionalidade: data.nacionalidade,
    cpf: data.cpf,
    endereco: data.endereco,
  } as Record<string, unknown>;
}

function fromApiToPerson(api: Record<string, unknown>): Person {
  return {
    id: String(api.id),
    nome: String(api.nome || ''),
    sexo: api.sexo as 'masculino' | 'feminino' | 'outro' | undefined,
    email: api.email ? String(api.email) : undefined,
    dataNascimento: String((api.dataDeNascimento ?? api.dataNascimento) || ''),
    naturalidade: api.naturalidade ? String(api.naturalidade) : undefined,
    nacionalidade: api.nacionalidade ? String(api.nacionalidade) : undefined,
    cpf: String(api.cpf || ''),
    endereco: api.endereco ? String(api.endereco) : undefined,
    dataCadastro: String((api.dataCriacao ?? api.dataCadastro) || ''),
    dataAtualizacao: String(api.dataAtualizacao || ''),
  };
}

export type ListPeopleQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function listPeopleV1(query?: ListPeopleQuery): Promise<{ items: Person[]; page: number; limit: number; totalItems: number; totalPages: number; }> {
  const path = withQuery('/api/v1/pessoas', query);
  const res = await httpRequest<Record<string, unknown>>(path);
  if (Array.isArray(res)) {
    return { items: res.map(fromApiToPerson), page: 1, limit: res.length, totalItems: res.length, totalPages: 1 };
  }
  const items = ((res.items as Record<string, unknown>[]) ?? (res.data as Record<string, unknown>[]) ?? []);
  const page = Number(res.page) || 1;
  const limit = Number(res.limit ?? res.size) || items.length || 10;
  const totalItems = Number(res.totalItems ?? res.total) || items.length;
  const totalPages = Number(res.totalPages) || Math.ceil(totalItems / limit);
  
  return {
    items: items.map(fromApiToPerson),
    page,
    limit,
    totalItems,
    totalPages,
  };
}

export async function getPersonByIdV1(id: string | number): Promise<Person> {
  const res = await httpRequest<Record<string, unknown>>(`/api/v1/pessoas/${id}`);
  return fromApiToPerson(res);
}

export async function getPersonByCpfV1(cpf: string): Promise<Person> {
  const res = await httpRequest<Record<string, unknown>>(`/api/v1/pessoas/cpf/${encodeURIComponent(cpf)}`);
  return fromApiToPerson(res);
}

export async function createPersonV1(data: PersonFormData): Promise<Person> {
  const body = toApiBodyFromForm(data);
  const res = await httpRequest<Record<string, unknown>, typeof body>(`/api/v1/pessoas`, {
    method: 'POST',
    body,
  });
  return fromApiToPerson(res);
}

export async function updatePersonV1(id: string | number, data: Partial<PersonFormData>): Promise<Person> {
  const body = toApiBodyFromForm(data);
  const res = await httpRequest<Record<string, unknown>, typeof body>(`/api/v1/pessoas/${id}`, {
    method: 'PATCH',
    body,
  });
  return fromApiToPerson(res);
}

export async function deletePersonV1(id: string | number): Promise<void> {
  await httpRequest<void>(`/api/v1/pessoas/${id}`, { method: 'DELETE' });
}


