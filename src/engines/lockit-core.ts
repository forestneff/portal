export interface PlanetDef {
  name: string;
  period: number; // in days
  r: number; // orbital radius multiplier
  color: string;
  size: number;
  glow?: boolean;
}

export const CELESTIAL_PLANETS: PlanetDef[] = [
  { name: 'Moon', period: 27.3, r: 0.35, color: '#e5e7eb', size: 5 },
  { name: 'Mercury', period: 87.97, r: 0.45, color: '#9ca3af', size: 4 },
  { name: 'Venus', period: 224.7, r: 0.55, color: '#facc15', size: 5 },
  { name: 'Sun', period: 365.25, r: 0.65, color: '#fbbf24', size: 9, glow: true },
  { name: 'Mars', period: 686.98, r: 0.75, color: '#ef4444', size: 5 },
  { name: 'Jupiter', period: 4332.59, r: 0.9, color: '#fb923c', size: 8 },
  { name: 'Saturn', period: 10759.22, r: 1.05, color: '#eab308', size: 7 }
];

export function calculatePlanetPosition(planet: PlanetDef, date: Date, baseRadius: number) {
  const orbitR = baseRadius * planet.r;
  const dayOfYear = date.getTime() / (1000 * 3600 * 24);
  const ang = (dayOfYear / planet.period) * 2 * Math.PI;
  return {
    x: Math.cos(ang) * orbitR,
    y: Math.sin(ang) * orbitR,
    orbitRadius: orbitR,
    angle: ang
  };
}
