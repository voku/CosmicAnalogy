import React from 'react';
import { CelestialId, CelestialData, CosmicZone, CosmicZoneData } from './types';
import { Circle, Globe, Sun, Disc, Star, Zap } from 'lucide-react';

export const CELESTIAL_DATA: Record<CelestialId, CelestialData> = {
  [CelestialId.EARTH]: {
    id: CelestialId.EARTH,
    name: "Earth",
    type: "planet",
    diameter_km: 12742,
    distance_km: 0,
    light_latency_ms: 0,
    human_readable_latency: "0ms (Local)",
    color: "#3b82f6", // Blue 500
    description: "The origin point. 0.5 ns access time. Perfect cache hit. All data is immediately available.",
    component: {
        name: "L1 Cache / Registers",
        role: "localhost",
        latency_real: "0.5 ns",
        latency_human: "1 sec",
        analogy: "Instant data availability. No context switching required."
    },
    facts: [
      "System Uptime: 4.54 Billion Years (Stable Release).",
      "The only node running the active 'Life' process.",
      "Atmosphere: A 100km thick firewall against solar radiation.",
      "Surface is 71% liquid cooling (Water)."
    ]
  },
  [CelestialId.MOON]: {
    id: CelestialId.MOON,
    name: "The Moon",
    type: "moon",
    diameter_km: 3474,
    distance_km: 384400,
    light_latency_ms: 1282,
    human_readable_latency: "1.28 sec",
    color: "#60a5fa", // Sky 400 - Matches RAM/Network Blue metaphor
    description: "100 ns latency. A context switch away. Data is close, but requires a bus transfer.",
    component: {
        name: "DRAM Cluster",
        role: "Main Memory",
        latency_real: "100 ns",
        latency_human: "~3.5 min",
        analogy: "Fetching from RAM is like walking to the coffee machine and back."
    },
    facts: [
      "Tidally Locked: We always see the same side because rotation syncs with orbit.",
      "Cache Locality: 384,400 km away (You can fit 30 Earths in the gap).",
      "Legacy Impact: Craters are logs of previous system collisions.",
      "Drifting: Moving away at 3.8cm/year (Slow memory leak)."
    ]
  },
  [CelestialId.MARS]: {
    id: CelestialId.MARS,
    name: "Mars",
    type: "planet",
    diameter_km: 6779,
    distance_km: 54600000,
    light_latency_ms: 182126,
    human_readable_latency: "3.0 min",
    color: "#ef4444", // Red 500
    description: "The Inner Network. Controlling a rover here is not real-time; you are debugging the past.",
    component: {
        name: "LAN Gateway",
        role: "Local Network",
        latency_real: "20 µs",
        latency_human: "~11 hours",
        analogy: "Sending packet over 1Gbps LAN is like a full work day in CPU time."
    },
    facts: [
      "Relativity Patch: Software clocks must adjust for different time flow vs Earth.",
      "Latency Jitter: Signal takes 3 to 22 minutes depending on orbit.",
      "Surface: Covered in Iron Oxide (Rust) - signs of legacy corrosion.",
      "Gravity: 38% of Earth (Low power environment)."
    ]
  },
  [CelestialId.SUN]: {
    id: CelestialId.SUN,
    name: "The Sun",
    type: "star",
    diameter_km: 1392700,
    distance_km: 149600000,
    light_latency_ms: 499012,
    human_readable_latency: "8.3 min",
    color: "#f59e0b", // Amber 500
    description: "Heavy Infrastructure. 150 µs read time. Massive bandwidth, but high latency initiation.",
    component: {
        name: "NVMe Storage Array",
        role: "Persistent Store",
        latency_real: "150 µs",
        latency_human: "~3.5 days",
        analogy: "Reading from a fast SSD is like a long weekend trip relative to the CPU."
    },
    facts: [
      "Capacity: You could fit 1.3 million Earths inside the chassis.",
      "Throughput: Consumes 600 million tons of hydrogen per second.",
      "Mass: 99.8% of the entire system's hardware weight.",
      "Light Delay: Photons take 8 min to reach Earth, but 100k years to escape the core."
    ]
  },
  [CelestialId.HELIOPAUSE]: {
    id: CelestialId.HELIOPAUSE,
    name: "Heliopause",
    type: "boundary",
    diameter_km: 0,
    distance_km: 18100000000,
    light_latency_ms: 60375101,
    human_readable_latency: "16.8 hours",
    color: "#8b5cf6", // Violet 500
    description: "Voyager 1 Distance. Signals take nearly a day. This is the edge of the local filesystem.",
    component: {
        name: "Tape Archive / HDD",
        role: "Cold Storage",
        latency_real: "10 ms",
        latency_human: "~8 months",
        analogy: "Seeking on a physical disk head is like waiting for seasons to change."
    },
    facts: [
      "The Firewall: The boundary where solar wind meets interstellar space.",
      "Voyager 1: The only probe to penetrate the external network (Interstellar Medium).",
      "Distance: ~120 AU. The absolute edge of the local file system.",
      "Temperature: Drop-off indicates exit from the thermal management zone."
    ]
  },
  [CelestialId.ALPHA_CENTAURI]: {
    id: CelestialId.ALPHA_CENTAURI,
    name: "Proxima Centauri",
    type: "star",
    diameter_km: 214000,
    distance_km: 40207975000000,
    light_latency_ms: 134119368006,
    human_readable_latency: "4.25 years",
    color: "#ec4899", // Pink 500
    description: "The Deep Web. 4+ Years Ping. The edge of the reachable network. Packets may never return.",
    component: {
        name: "Public WAN / Cloud",
        role: "The Internet",
        latency_real: "150 ms",
        latency_human: "~9.5 years",
        analogy: "A ping from SF to Amsterdam takes nearly a decade in CPU time."
    },
    facts: [
      "Nearest Neighbor: A Red Dwarf node 4.24 light years away.",
      "Packet Loss: A ping sent today returns in 8.5 years.",
      "Concurrency: A triple star system (The Three-Body Problem).",
      "Proxima b: A potential mirror site for the 'Life' process."
    ]
  }
};

export const ZONES: Record<CosmicZone, CosmicZoneData> = {
  [CosmicZone.CPU]: {
    id: CosmicZone.CPU,
    name: "The Local Stack",
    metaphor: "L1 Cache",
    latencyNs: 0.5,
    latencyNative: "0.5 ns",
    distance: "0 m",
    color: "#34d399", // Emerald 400
    description: "Instantaneous execution. Data is in the registers."
  },
  [CosmicZone.RAM]: {
    id: CosmicZone.RAM,
    name: "The Inner Network",
    metaphor: "RAM / LAN",
    latencyNs: 100,
    latencyNative: "100 ns",
    distance: "100 m",
    color: "#60a5fa", // Sky 400
    description: "Fast, but requires bus travel. The local neighborhood."
  },
  [CosmicZone.SSD]: {
    id: CosmicZone.SSD,
    name: "The Outer Edge",
    metaphor: "SSD / HDD",
    latencyNs: 150000,
    latencyNative: "150 µs",
    distance: "150 km",
    color: "#fbbf24", // Amber 400
    description: "Persistent storage. High capacity, slow retrieval."
  },
  [CosmicZone.NETWORK]: {
    id: CosmicZone.NETWORK,
    name: "Interstellar WAN",
    metaphor: "The Internet",
    latencyNs: 50000000,
    latencyNative: "50 ms",
    distance: "384,000 km",
    color: "#f87171", // Red 400
    description: "Global routing. Massive latency. The 'Cloud'."
  }
};

export const ZONE_ICONS: Record<string, React.ReactNode> = {
  [CelestialId.EARTH]: <Globe className="w-6 h-6" />,
  [CelestialId.MOON]: <Disc className="w-6 h-6" />,
  [CelestialId.MARS]: <Circle className="w-6 h-6" />,
  [CelestialId.SUN]: <Sun className="w-6 h-6" />,
  [CelestialId.HELIOPAUSE]: <Zap className="w-6 h-6" />,
  [CelestialId.ALPHA_CENTAURI]: <Star className="w-6 h-6" />,
  [CosmicZone.CPU]: <Zap className="w-6 h-6" />,
  [CosmicZone.RAM]: <Disc className="w-6 h-6" />,
  [CosmicZone.SSD]: <Sun className="w-6 h-6" />,
  [CosmicZone.NETWORK]: <Globe className="w-6 h-6" />,
};

export const CELESTIAL_ANGLES: Record<CelestialId, number> = {
    [CelestialId.EARTH]: 0,
    [CelestialId.MOON]: -Math.PI / 4,
    [CelestialId.MARS]: Math.PI / 3,
    [CelestialId.SUN]: Math.PI, // Opposite side
    [CelestialId.HELIOPAUSE]: -Math.PI / 2,
    [CelestialId.ALPHA_CENTAURI]: Math.PI / 6,
};

export const PHP_CODE = `// Calculating Light Latency
const C = 299792.458; // km/s (Speed of Light)

function ping(distanceKm) {
    const latency = distanceKm / C;
    return latency; // in seconds
}

// localhost (Earth)
ping(0); // 0s

// RAM Cluster (Moon)
ping(384400); // 1.28s

// NVMe Array (Sun)
ping(149600000); // 499s (8.3min)

// External WAN (Alpha Centauri)
ping(40207975000000); // 134,119,368s (4.25 years)`;