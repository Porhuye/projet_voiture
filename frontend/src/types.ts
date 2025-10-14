export type CarType = 'BERLINE' | 'SUV' | 'COUPE' | 'BREAK' | 'UTILITAIRE' | 'AUTRE';

export interface Voiture {
  id: number;
  carName: string;
  couleur: string;
  immatriculation: string;
  carType: CarType;
}

export interface VoitureRequest {
  carName: string;
  couleur: string;
  immatriculation: string;
  carType: CarType;
}
