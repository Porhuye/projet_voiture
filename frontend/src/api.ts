import type { Voiture, VoitureRequest } from './types'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

/* ----------------------------- Gestion du token ----------------------------- */
const TOKEN_KEY = 'auth_token'

export const auth = {
  // lit d'abord sessionStorage (session courte), sinon localStorage
  getToken: (): string | null =>
    sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY),

  // remember=true -> localStorage ; false -> sessionStorage
  setToken: (t: string, remember = true) => {
    if (remember) localStorage.setItem(TOKEN_KEY, t)
    else sessionStorage.setItem(TOKEN_KEY, t)
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  },
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

  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = auth.getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined })

  if (!res.ok) {
    let payload: unknown
    try { payload = await res.clone().json() } catch { payload = await res.text().catch(() => undefined) }
    // 👉 on NE vide PAS le token ici : on laisse l'appelant décider (pour afficher un message avant de déconnecter)
    throw new ApiError(`API ${res.status} ${res.statusText}`, res.status, payload)
  }

  return res.status === 204 ? (undefined as T) : await res.json() as T
}

/* ----------------------------- Routes API ----------------------------- */
const BASE = '/api'

export const API = {
  // 🔐 Authentification — renvoie le token ; le composant décide où le stocker (remember)
  login: async (username: string, password: string): Promise<string> => {
    const data = await request<{ token: string }>(
      `${BASE}/auth/login`,
      'POST',
      { username, password }
    )
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
