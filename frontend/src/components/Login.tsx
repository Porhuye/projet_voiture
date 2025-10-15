import { useState } from 'react'
import { API, auth } from '../api'

type Props = { onLoggedIn: () => void }

export default function Login({ onLoggedIn }: Props) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const token = await API.login(username.trim(), password)
      auth.setToken(token, remember)    // ← stockage (localStorage ou sessionStorage)
      onLoggedIn()                      // ← remonte l’info au parent (App)
    } catch (e) {
      setError('Identifiants invalides ou serveur indisponible')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="card" style={{maxWidth:380, margin:'48px auto', display:'grid', gap:12}}>
      <h2>Connexion</h2>
      {error && <div className="alert error">{error}</div>}

      <label className="label">Nom d’utilisateur</label>
      <input className="input" placeholder="Nom d’utilisateur"
             value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" />

      <label className="label">Mot de passe</label>
      <div style={{ position:'relative' }}>
        <input className="input" type={showPwd ? 'text' : 'password'}
               placeholder="Mot de passe" value={password}
               onChange={e=>setPassword(e.target.value)} autoComplete="current-password" />
        <button type="button" className="btn ghost"
                onClick={() => setShowPwd(s => !s)}
                style={{ position:'absolute', right:6, top:6, padding:'6px 10px' }}>
          {showPwd ? '🙈' : '👁️'}
        </button>
      </div>

      <label style={{ display:'flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} />
        Se souvenir de moi
      </label>

      <button className="btn primary" type="submit" disabled={loading}>
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  )
}
