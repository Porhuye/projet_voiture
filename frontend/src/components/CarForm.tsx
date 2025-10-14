import { useEffect, useState } from 'react'
import type { CarType, Voiture, VoitureRequest } from '../types'

const CAR_TYPES: CarType[] = ['BERLINE','SUV','COUPE','BREAK','UTILITAIRE','AUTRE']

type Props = {
  initial?: Voiture | null
  onSubmit: (data: VoitureRequest) => Promise<void>
  onCancel?: () => void
}

export default function CarForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<VoitureRequest>({
    carName: '', couleur: '', immatriculation: '', carType: 'BERLINE'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initial) {
      const { carName, couleur, immatriculation, carType } = initial
      setForm({ carName, couleur, immatriculation, carType })
    }
  }, [initial])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setLoading(true)
    try { await onSubmit(form) }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Erreur') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="row">
      {error && <div className="alert error">{error}</div>}

      <input className="input" placeholder="Nom (carName)"
             value={form.carName}
             onChange={e => setForm({ ...form, carName: e.target.value })} required />

      <div className="row" style={{gridTemplateColumns:'1fr 1fr', gap:12}}>
        <input className="input" placeholder="Couleur"
               value={form.couleur}
               onChange={e => setForm({ ...form, couleur: e.target.value })} required />

        <input className="input" placeholder="Immatriculation"
               value={form.immatriculation}
               onChange={e => setForm({ ...form, immatriculation: e.target.value })} required />
      </div>

      <select className="select"
              value={form.carType}
              onChange={e => setForm({ ...form, carType: e.target.value as CarType })}>
        {CAR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      <div className="actions">
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'En cours…' : (initial ? 'Enregistrer' : 'Créer')}
        </button>
        {onCancel && <button type="button" className="btn ghost" onClick={onCancel}>Annuler</button>}
      </div>
    </form>
  )
}
