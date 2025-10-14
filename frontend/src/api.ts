import type { Voiture, VoitureRequest } from './types'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

/* ----------------------------- Gestion du token ----------------------------- */
const TOKEN_KEY = 'auth_token'

export const auth = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

/* ----------------------------- Classe d'erreur API ----------------------------- */
export class ApiError extends Error {
  status: number
  body?: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}

/* ----------------------------- Requête générique ----------------------------- */
async function request<T>(url: string, method: HttpMethod, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }

  // Corps JSON si fourni
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  // Ajout du token s’il existe
  const token = auth.getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    // si token invalide → suppression automatique du stockage
    if (res.status === 401) auth.clear()

    let payload: unknown
    try {
      payload = await res.clone().json()
    } catch {
      payload = await res.text().catch(() => undefined)
    }

    throw new ApiError(`API ${res.status} ${res.statusText}`, res.status, payload)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

/* ----------------------------- Routes API ----------------------------- */
const BASE = '/api'

export const API = {
  // 🔐 Authentification
  login: async (username: string, password: string): Promise<string> => {
    const data = await request<{ token: string }>(
      `${BASE}/auth/login`,
      'POST',
      { username, password }
    )
    auth.setToken(data.token)
    return data.token
  },

  logout: () => auth.clear(),

  // 🚗 CRUD Voitures
  list: (): Promise<Voiture[]> =>
    request<Voiture[]>(`${BASE}/voitures`, 'GET'),

  get: (id: number): Promise<Voiture> =>
    request<Voiture>(`${BASE}/voitures/${id}`, 'GET'),

  create: (data: VoitureRequest): Promise<Voiture> =>
    request<Voiture>(`${BASE}/voitures`, 'POST', data),

  update: (id: number, data: VoitureRequest): Promise<Voiture> =>
    request<Voiture>(`${BASE}/voitures/${id}`, 'PUT', data),

  remove: (id: number): Promise<void> =>
    request<void>(`${BASE}/voitures/${id}`, 'DELETE'),
}
