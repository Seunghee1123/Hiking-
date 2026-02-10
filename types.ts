
export enum HikeStatus {
  COMPLETED = 'COMPLETED',
  WISH = 'WISH'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface HikeRecord {
  id: string;
  mountainName: string;
  elevation: number;
  date: string;
  description: string;
  status: HikeStatus;
  coords: Coordinates;
  rating?: number;
  image?: string;
}

export interface MountainInfo {
  name: string;
  description: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert';
  recommendedSeason: string;
  gearSuggestions: string[];
}
