import { useEffect, useState } from 'react'
import { API, auth, ApiError } from './api'
import Login from './components/Login'
import CarForm from './components/CarForm'
import CarList from './components/CarList'
import type { Voiture, VoitureRequest } from './types'

export default function App() {
  const [token, setToken] = useState<string | null>(auth.getToken())
  const [voitures, setVoitures] = useState<Voiture[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 👇 nouvel état : voiture en cours d’édition (ou null si création)
  const [editing, setEditing] = useState<Voiture | null>(null)

  const loggedIn = !!token

  const load = async () => {
    setLoading(true); setError(null)
    try {
      setVoitures(await API.list())
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setError("Vous n'avez pas les droits ou votre session a expiré. Merci de vous reconnecter.")
        auth.clear(); setToken(null); return
      }
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (loggedIn) void load() }, [loggedIn])

  if (!loggedIn) {
    return (
      <>
        {error && <div className="alert error" style={{ maxWidth: 680, margin: '16px auto' }}>{error}</div>}
        <Login onLoggedIn={() => { setError(null); setToken(auth.getToken()) }} />
      </>
    )
  }

  const create = async (req: VoitureRequest) => {
    try { await API.create(req); await load() }
    catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setError("Vous n'avez pas les droits pour créer. Veuillez vous reconnecter.")
        auth.clear(); setToken(null)
      } else setError('Création impossible')
    }
  }

  const saveUpdate = async (req: VoitureRequest) => {
    if (!editing) return
    try {
      await API.update(editing.id, req)
      setEditing(null)
      await load()
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setError("Vous n'avez pas les droits pour modifier. Veuillez vous reconnecter.")
        auth.clear(); setToken(null)
      } else setError('Mise à jour impossible')
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Supprimer cette voiture ?')) return
    try { await API.remove(id); await load() }
    catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setError("Vous n'avez pas les droits pour supprimer. Veuillez vous reconnecter.")
        auth.clear(); setToken(null)
      } else setError('Suppression impossible')
    }
  }

  const logout = () => { auth.clear(); setToken(null) }

  return (
    <div className="container">
      <header className="header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1>🚗 Gestion des Voitures</h1>
        <div style={{display:'flex', gap:8}}>
          {editing && (
            <button className="btn" onClick={() => setEditing(null)}>+ Nouvelle voiture</button>
          )}
          <button className="btn ghost" onClick={logout}>Se déconnecter</button>
        </div>
      </header>

      {error && <div className="alert error">{error}</div>}

      <section className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <h3 style={{margin:0}}>{editing ? 'Modifier la voiture' : 'Ajouter une voiture'}</h3>
          {!editing && <small style={{color:'var(--muted)'}}>Remplis le formulaire puis “Créer”.</small>}
        </div>

        {/* 👇 même composant pour création ET édition */}
        <CarForm
          initial={editing ?? undefined}
          onSubmit={editing ? saveUpdate : create}
          onCancel={editing ? () => setEditing(null) : undefined}
        />
      </section>

      <section className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h3 style={{margin:0}}>Liste des voitures</h3>
          <button className="btn ghost" onClick={() => void load()} disabled={loading}>
            {loading ? 'Actualisation…' : 'Rafraîchir'}
          </button>
        </div>

        {loading ? <p>Chargement…</p> :
          <CarList items={voitures} onEdit={setEditing} onDelete={remove} />
        }
      </section>
    </div>
  )
}
