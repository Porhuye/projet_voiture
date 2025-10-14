import { useEffect, useState } from 'react'
import { API, ApiError } from '../api'
import type { Voiture, VoitureRequest } from '../types'

export function useVoitures() {
  const [items, setItems] = useState<Voiture[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true); setError(null)
    try {
      setItems(await API.list())
    } catch (e: unknown) {
      if (e instanceof ApiError) setError(e.message)
      else if (e instanceof Error) setError(e.message)
      else setError('Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const create = async (req: VoitureRequest) => { await API.create(req); await load() }
  const update = async (id: number, req: VoitureRequest) => { await API.update(id, req); await load() }
  const remove = async (id: number) => { await API.remove(id); await load() }

  return { items, loading, error, load, create, update, remove }
}
