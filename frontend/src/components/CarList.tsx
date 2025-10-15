import type { Voiture } from '../types'

type Props = {
  items: Voiture[]
  onEdit: (v: Voiture) => void
  onDelete: (id: number) => void
}

export default function CarList({ items, onEdit, onDelete }: Props) {
  if (items.length === 0) return <p>Aucune voiture pour le moment.</p>

  return (
    <div style={{overflowX:'auto', marginTop:12}}>
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Couleur</th>
            <th>Immatriculation</th>
            <th>Type</th>
            <th style={{width:160}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(v => (
            <tr key={v.id}>
              <td>{v.carName}</td>
              <td>{v.couleur}</td>
              <td>{v.immatriculation}</td>
              <td>{v.carType}</td>
              <td>
                <div style={{display:'flex', gap:8}}>
                  <button className="btn" onClick={() => onEdit(v)}>Modifier</button>
                  <button className="btn danger" onClick={() => onDelete(v.id)}>Supprimer</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
