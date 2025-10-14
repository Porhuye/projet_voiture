import { useEffect, useState } from 'react'
import { API } from './api'
import type { Voiture } from './types'
import CarForm from './components/CarForm'
import CarList from './components/CarList'

export default function App() {
  const [voitures, setVoitures] = useState<Voiture[]>([])
  const [editing, setEditing] = useState<Voiture | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setError(null); setLoading(true)
    try { setVoitures(await API.list()) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Erreur') }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])

  const create = async (req: Omit<Voiture,'id'>) => { await API.create(req); await load() }
  const update = async (req: Omit<Voiture,'id'>) => {
    if (!editing) return
    await API.update(editing.id, req); setEditing(null); await load()
  }
  const remove = async (id: number) => {
    if (!confirm('Supprimer cette voiture ?')) return
    await API.remove(id); await load()
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">🚗 Gestion des Voitures</h1>
        <span className="tag">{voitures.length} véhicule(s)</span>
      </header>

      {error && <div className="alert error">{error}</div>}

      <div className="grid">
        <section className="card">
          {editing ? (
            <>
              <h3 className="m0">Modifier</h3>
              <p className="mt8" style={{color:'var(--muted)'}}>
                {editing.carName} – {editing.immatriculation}
              </p>
              <CarForm initial={editing} onSubmit={update} onCancel={() => setEditing(null)} />
            </>
          ) : (
            <>
              <h3 className="m0">Ajouter une voiture</h3>
              <p className="mt8" style={{color:'var(--muted)'}}>Renseigne les champs ci-dessous.</p>
              <CarForm onSubmit={create} />
            </>
          )}
        </section>

        <section className="card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h3 className="m0">Liste</h3>
            <button className="btn ghost" onClick={() => void load()} disabled={loading}>
              {loading ? 'Actualisation…' : 'Rafraîchir'}
            </button>
          </div>
          <div className="mt16">
            {loading ? <p>Chargement…</p> :
              <CarList items={voitures} onEdit={setEditing} onDelete={remove} />
            }
          </div>
        </section>
      </div>
    </div>
  )
}
