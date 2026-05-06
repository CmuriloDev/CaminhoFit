export type ActivityType =
  | 'corrida'
  | 'academia'
  | 'luta'
  | 'calistenia'
  | 'crossfit'
  | 'funcional'
  | 'esportes_coletivos';

export type CrowdLevel = 'baixo' | 'medio' | 'alto';

export interface Location {
  id: string;
  name: string;
  type: ActivityType;
  latitude: number;
  longitude: number;
  description: string | null;
  busiest_time: string | null;
  crowd_level: CrowdLevel | null;
  tags: string[];
  image_url: string | null;
  created_at: string;
  last_updated_at: string;
}

export interface LocationFilters {
  type?: ActivityType | 'todos';
  crowd_level?: CrowdLevel | 'todos';
}

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
}