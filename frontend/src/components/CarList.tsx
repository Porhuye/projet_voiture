import type { Voiture } from '../types'

type Props = {
  items: Voiture[]
  onEdit: (v: Voiture) => void
  onDelete: (id: number) => void
}

export default function CarList({ items, onEdit, onDelete }: Props) {
  if (!items.length) return <p style={{color:'var(--muted)'}}>Aucune voiture pour le moment.</p>

  return (
    <table className="table">
      <thead>
      <tr>
        <th>Nom</th><th>Couleur</th><th>Immat.</th><th>Type</th><th></th>
      </tr>
      </thead>
      <tbody>
      {items.map(v => (
        <tr key={v.id}>
          <td>{v.carName}</td>
          <td>{v.couleur}</td>
          <td>{v.immatriculation}</td>
          <td><span className="tag">{v.carType}</span></td>
          <td style={{textAlign:'right'}}>
            <div className="actions" style={{justifyContent:'flex-end'}}>
              <button className="btn" onClick={() => onEdit(v)}>Éditer</button>
              <button className="btn danger" onClick={() => onDelete(v.id)}>Supprimer</button>
            </div>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}
