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
  created_at: string;
  image_url?: string | null;
  last_updated_at: string;
}

export interface LocationFilters {
  type?: ActivityType | 'todos';
  crowd_level?: CrowdLevel | 'todos';
}