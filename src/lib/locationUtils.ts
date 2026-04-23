import type { ActivityType, CrowdLevel } from '@/types';

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  corrida: 'Corrida / Caminhada',
  academia: 'Academia',
  luta: 'Artes Marciais',
  calistenia: 'Calistenia',
  crossfit: 'CrossFit',
  funcional: 'Funcional',
  esportes_coletivos: 'Esportes Coletivos',
};

export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  corrida: '#22c55e',
  academia: '#3b82f6',
  luta: '#ef4444',
  calistenia: '#f97316',
  crossfit: '#8b5cf6',
  funcional: '#06b6d4',
  esportes_coletivos: '#eab308',
};

export const CROWD_LEVEL_LABELS: Record<CrowdLevel, string> = {
  baixo: 'Tranquilo',
  medio: 'Moderado',
  alto: 'Movimentado',
};

export const CROWD_LEVEL_COLORS: Record<CrowdLevel, string> = {
  baixo: 'text-green-600 bg-green-50',
  medio: 'text-yellow-600 bg-yellow-50',
  alto: 'text-red-600 bg-red-50',
};