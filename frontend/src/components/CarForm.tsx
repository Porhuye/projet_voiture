import { useEffect, useState } from 'react'
import type { Voiture, VoitureRequest } from '../types'

type Props = {
  initial?: Voiture            // présent = mode édition
  onSubmit: (data: VoitureRequest) => Promise<void> | void
  onCancel?: () => void        // affiché seulement en édition
}

const empty: VoitureRequest = {
  carName: '',
  couleur: '',
  immatriculation: '',
  carType: 'BERLINE',
}

export default function CarForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<VoitureRequest>(initial ? {
    carName: initial.carName,
    couleur: initial.couleur,
    immatriculation: initial.immatriculation,
    carType: initial.carType,
  } : empty)

  // si on change de voiture à éditer, on recharge le formulaire
  useEffect(() => {
    if (initial) {
      setForm({
        carName: initial.carName,
        couleur: initial.couleur,
        immatriculation: initial.immatriculation,
        carType: initial.carType,
      })
    } else {
      setForm(empty)
    }
  }, [initial])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.carName.trim() || !form.couleur.trim() || !form.immatriculation.trim()) return
    await onSubmit({
      carName: form.carName.trim(),
      couleur: form.couleur.trim(),
      immatriculation: form.immatriculation.trim(),
      carType: form.carType,
    })
  }

  return (
    <form onSubmit={submit} style={{display:'grid', gap:12, marginTop:12}}>
      <div className="grid-2">
        <div>
          <label className="label">Nom</label>
          <input
            className="input"
            value={form.carName}
            onChange={e => setForm({ ...form, carName: e.target.value })}
            placeholder="Ex: Clio"
            required
          />
        </div>
        <div>
          <label className="label">Couleur</label>
          <input
            className="input"
            value={form.couleur}
            onChange={e => setForm({ ...form, couleur: e.target.value })}
            placeholder="Ex: Rouge"
            required
          />
        </div>
      </div>

      <div className="grid-2">
        <div>
          <label className="label">Immatriculation</label>
          <input
            className="input"
            value={form.immatriculation}
            onChange={e => setForm({ ...form, immatriculation: e.target.value })}
            placeholder="AA-123-AA"
            required
          />
        </div>
        <div>
          <label className="label">Type</label>
          <select
            className="input"
            value={form.carType}
            onChange={e => setForm({ ...form, carType: e.target.value as Voiture['carType'] })}
          >
            <option value="BERLINE">Berline</option>
            <option value="SUV">SUV</option>
            <option value="SPORT">Sport</option>
            <option value="UTILITAIRE">Utilitaire</option>
          </select>
        </div>
      </div>

      <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:4}}>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Annuler
          </button>
        )}
        <button className="btn primary" type="submit">
          {initial ? 'Enregistrer' : 'Créer'}
        </button>
      </div>
    </form>
  )
}
