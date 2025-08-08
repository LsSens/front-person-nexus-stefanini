import { httpRequest } from './http';

export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginResponse = {
    access_token: string;
};

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const res = await httpRequest<LoginResponse, LoginCredentials>(`/auth/login`, {
    method: 'POST',
    body: credentials,
  });
  if (!res?.access_token) throw new Error('Token não retornado pelo servidor');
  return res;
}


