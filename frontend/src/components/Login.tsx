import { useState } from 'react'
import { API, auth } from '../api'

type Props = { onLoggedIn: () => void }

export default function Login({ onLoggedIn }: Props) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await API.login(username, password)
      onLoggedIn()
    } catch (e) {
      setError('Identifiants invalides')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="card" style={{maxWidth:360, margin:'48px auto', display:'grid', gap:12}}>
      <h3>Connexion</h3>
      {error && <div className="alert error">{error}</div>}
      <input className="input" placeholder="Nom d’utilisateur" value={username} onChange={e=>setUsername(e.target.value)} />
      <input className="input" type="password" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn primary" type="submit" disabled={loading}>{loading ? '...' : 'Se connecter'}</button>
    </form>
  )
}
