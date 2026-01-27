export enum CelestialId {
  EARTH = 'earth',
  MOON = 'moon',
  MARS = 'mars',
  SUN = 'sun',
  HELIOPAUSE = 'heliopause',
  ALPHA_CENTAURI = 'alpha_centauri'
}

export enum CosmicZone {
  CPU = 'cpu',
  RAM = 'ram',
  SSD = 'ssd',
  NETWORK = 'network'
}

export interface ComponentIdentity {
  name: string; // e.g. "L1 Cache"
  role: string; // e.g. "System Memory"
  latency_real: string; // e.g. "100 ns"
  latency_human: string; // e.g. "2 Minutes"
  analogy: string; // Description of the metaphor
}

export interface CelestialData {
  id: CelestialId;
  name: string;
  type: 'planet' | 'moon' | 'star' | 'boundary';
  diameter_km: number;
  distance_km: number;
  light_latency_ms: number;
  human_readable_latency: string;
  color: string;
  description: string;
  component?: ComponentIdentity; // The twist data
  facts: string[]; // Detailed astronomical facts
}

export interface CosmicZoneData {
  id: CosmicZone;
  name: string;
  metaphor: string;
  latencyNs: number;
  latencyNative: string;
  distance: string;
  color: string;
  description: string;
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
}