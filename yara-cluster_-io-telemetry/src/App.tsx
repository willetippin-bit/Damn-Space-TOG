/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  Globe, 
  ShieldAlert, 
  Cpu, 
  Layers, 
  Navigation,
  Database,
  Terminal,
  Loader2,
  AlertTriangle,
  ChevronRight,
  Wifi,
  Radio,
  Menu,
  X,
  ArrowDownAZ,
  Hash,
  Network
} from 'lucide-react';

// --- Constants & Types ---

const IO_CYAN = "#00f2ff";
const IO_AMBER = "#ff9d00";
const IO_RED = "#ff3c3c";
const IO_TEXT_DIM = "#8a9cb0";
const IO_BG_PANEL = "rgba(10, 15, 25, 0.85)";
const IO_TEXT_GLOW = `0 0 10px ${IO_CYAN}`;

interface StratificationLayer {
  layer: string;
  metric: string;
  status: string;
  perils: string;
}

interface Planet {
  id: string;
  name: string;
  system: string;
  ideal: string;
  yearColonized: string;
  orbitalOrder: string;
  sizeClass: string;
  moons: string;
  industry: string;
  jurisdiction: string;
  cGate: string;
  description: string;
  layers: StratificationLayer[];
  orbitalLogs: string[];
}

const CLUSTERS: Planet[] = [
  {
    id: 'tarillia',
    name: 'Tarillia',
    system: 'Axarus System',
    ideal: '97%',
    yearColonized: '1pX',
    orbitalOrder: '7/11',
    sizeClass: '2',
    moons: '0',
    industry: 'Developed and urbanized; arctic and desert biomes. Exports crystal fuel cells.',
    jurisdiction: 'Yara Collective Body (YCB)',
    cGate: 'A',
    description: 'High-albedo urbanized sphere with dense oceanic cloud cover. Surface luminescence indicates massive energy signatures from mega-city clusters. Atmospheric hazes consistent with heavy industrial exhaust.',
    layers: [
      { layer: 'Exosphere', metric: 'Radiation 30mSv', status: 'STABLE', perils: 'Low-orbit debris' },
      { layer: 'Thermosphere', metric: '1500K', status: 'NOMINAL', perils: 'Solar flares' },
      { layer: 'Mesosphere', metric: '-90C', status: 'STABLE', perils: 'Meteoric dust' },
      { layer: 'Stratosphere', metric: 'Nitrogen 80%', status: 'STABLE', perils: 'U-Move constraints' },
      { layer: 'Troposphere', metric: 'Oxygen 21%', status: 'NOMINAL', perils: 'Smog density' }
    ],
    orbitalLogs: ["C-Gate Concurrence established.", "Defensive Zone active.", "OSER schedule sync complete."]
  },
  {
    id: 'heitou',
    name: 'Heitou',
    system: 'Axarus System',
    ideal: '97%',
    yearColonized: '73pX',
    orbitalOrder: '9/11',
    sizeClass: '6',
    moons: '0',
    industry: 'Lush tropical vegetation. Higher learning and vast agricultural industry.',
    jurisdiction: 'Yara Collective Body (YCB)',
    cGate: 'B',
    description: 'Dense chlorophyll-rich planetary canopy with 85% cloud coverage. Infrared scans reveal sprawling agri-monasteries beneath the mist. Atmospheric humidity at saturation levels.',
    layers: [
      { layer: 'Exosphere', metric: 'Density 1.2e-9', status: 'NOMINAL', perils: 'None' },
      { layer: 'Thermosphere', metric: '1200K', status: 'NOMINAL', perils: 'Static discharge' },
      { layer: 'Mesosphere', metric: '-80C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'Vapor 12%', status: 'STABLE', perils: 'Cyclonic mists' },
      { layer: 'Troposphere', metric: 'Oxygen 24%', status: 'LUSH', perils: 'Spore saturates' }
    ],
    orbitalLogs: ["Agri-hub permissions validated.", "Biological scan negative for pathogens.", "OSER block 14 assigned."]
  },
  {
    id: 'ioyama',
    name: 'Ioyama',
    system: 'Axarus System',
    ideal: '89%',
    yearColonized: '75pX',
    orbitalOrder: '3/11',
    sizeClass: '3',
    moons: '4',
    industry: 'Temperate and scenic. Luxurious materials, spiritual heritage, monasteries.',
    jurisdiction: 'Recognized Nonaligned',
    cGate: 'C',
    description: 'Earth-analog visual profile with distinct sapphire oceans and emerald landmass clusters. Minimal industrial pollution detected. Orbital monastery rings maintain stable geo-position.',
    layers: [
      { layer: 'Exosphere', metric: 'Grav +0.02', status: 'STABLE', perils: 'Moon perturbations' },
      { layer: 'Thermosphere', metric: '1000K', status: 'NOMINAL', perils: 'Low solar interference' },
      { layer: 'Mesosphere', metric: '-85C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'Ozone Thick', status: 'CRYSTAL', perils: 'None' },
      { layer: 'Troposphere', metric: 'Oxygen 21%', status: 'PRISTINE', perils: 'Occasional turbulence' }
    ],
    orbitalLogs: ["Spiritual zone protocol active.", "Nonaligned status recognized.", "Visual clear for descent."]
  },
  {
    id: 'vuiyama',
    name: 'Vuiyama',
    system: 'Axarus System',
    ideal: '85%',
    yearColonized: '78pX',
    orbitalOrder: '2/11',
    sizeClass: '6',
    moons: '0',
    industry: 'Harsh desert landscape. Temples and spiritual sanctuaries.',
    jurisdiction: 'Recognized Nonaligned',
    cGate: 'D',
    description: 'High-visibility arid world with ochre and vermillion surface hues. Significant sandstorm activity detected in the southern hemisphere. Low atmospheric particulate count at high altitudes.',
    layers: [
      { layer: 'Exosphere', metric: 'Dry', status: 'NOMINAL', perils: 'Heat spikes' },
      { layer: 'Thermosphere', metric: '1800K', status: 'WARNING', perils: 'Extreme solar gain' },
      { layer: 'Mesosphere', metric: '-70C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'Nitrogen-Heavy', status: 'STABLE', perils: 'Supersonic winds' },
      { layer: 'Troposphere', metric: 'Sand-rich', status: 'HARSH', perils: 'Si-particulates' }
    ],
    orbitalLogs: ["Sanctuary silence protocol observed.", "Heat shield check suggested.", "Navigation: Dead-zone active."]
  },
  {
    id: 'reclov',
    name: 'Reclov',
    system: 'Ovena System',
    ideal: '94%',
    yearColonized: '103pX',
    orbitalOrder: '4/8',
    sizeClass: '3',
    moons: '0',
    industry: 'Picturesque, fertile; agricultural heart. Aquatic, tropical, and temperate biomes.',
    jurisdiction: 'Contested (YCB and others)',
    cGate: 'E',
    description: 'Vibrant patchwork of agricultural monocultures and native tropical biomes. Large surface bodies of water exhibit high nutrient signatures. Orbital traffic density high due to agri-ship activity.',
    layers: [
      { layer: 'Exosphere', metric: 'Traffic High', status: 'BUSY', perils: 'Collision risk' },
      { layer: 'Thermosphere', metric: '1100K', status: 'NOMINAL', perils: 'None' },
      { layer: 'Mesosphere', metric: '-88C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'Stable', status: 'STABLE', perils: 'Jet streams' },
      { layer: 'Troposphere', metric: 'Oxygen 22%', status: 'FERTILE', perils: 'Rain cycles' }
    ],
    orbitalLogs: ["Agri-clearance pending.", "Conflict zone warning: Contested orbit.", "C-Gate E concurrence 99%."]
  },
  {
    id: 'saoter',
    name: 'Saoter',
    system: 'Ovena System',
    ideal: '85%',
    yearColonized: '105pX',
    orbitalOrder: '5/8',
    sizeClass: '2',
    moons: '3',
    industry: 'Mountainous biome. Ship-building factories and metallic ores.',
    jurisdiction: 'Corp controlled',
    cGate: 'F',
    description: 'Rugged mountainous world with extensive orbital drydocks and shipyard superstructures. Surface atmosphere is thin and particulate-heavy. Massive metallic ore veins visible from orbit.',
    layers: [
      { layer: 'Exosphere', metric: 'Metal Scraps', status: 'CAUTION', perils: 'Orbital debris' },
      { layer: 'Thermosphere', metric: '1300K', status: 'NOMINAL', perils: 'Signal noise' },
      { layer: 'Mesosphere', metric: '-95C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'Ar-Heavy', status: 'INDUSTRIAL', perils: 'Atmospheric drag' },
      { layer: 'Troposphere', metric: 'Oxygen 15%', status: 'THIN', perils: 'Dust storms' }
    ],
    orbitalLogs: ["Docking bay 12 reserved.", "Corp-Auth Level 8 required.", "Shipyard proximity alert."]
  },
  {
    id: 'aostea',
    name: 'Aostea',
    system: 'Edos System',
    ideal: '93%',
    yearColonized: '138pX',
    orbitalOrder: '3/6',
    sizeClass: '6',
    moons: '4',
    industry: 'Temperate biome. Lacking mixture of essential resources.',
    jurisdiction: 'Unmanaged',
    cGate: 'G',
    description: 'Lush emerald landmasses isolated by vast, deep-blue oceans. Scans show minimal infrastructure development despite ideal conditions. Resource poverty restricts large-scale colonization.',
    layers: [
      { layer: 'Exosphere', metric: 'Low Grav', status: 'STABLE', perils: 'None' },
      { layer: 'Thermosphere', metric: '900K', status: 'STABLE', perils: 'None' },
      { layer: 'Mesosphere', metric: '-82C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'Ozone Good', status: 'PRISTINE', perils: 'None' },
      { layer: 'Troposphere', metric: 'Oxygen 21%', status: 'CLEAN', perils: 'Resource scarcity' }
    ],
    orbitalLogs: ["Resource-starved status alert.", "Long-term hab not recommended.", "C-Gate G stable."]
  },
  {
    id: 'shosera',
    name: 'Shosera',
    system: 'Edos System',
    ideal: '72%',
    yearColonized: '162pX',
    orbitalOrder: '6/6',
    sizeClass: '4',
    moons: '0',
    industry: 'Temperate biome. Lacking basics.',
    jurisdiction: 'Unmanaged',
    cGate: 'H',
    description: 'Stark, tundra-dominated landscape with large ice-crusted lakes. Low industrial luminescence suggests subsistence-level colonies. Atmospheric clarity is high due to lack of heavy fabrication.',
    layers: [
      { layer: 'Exosphere', metric: 'Cold', status: 'NOMINAL', perils: 'None' },
      { layer: 'Thermosphere', metric: '800K', status: 'STABLE', perils: 'None' },
      { layer: 'Mesosphere', metric: '-110C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'CO2-Heavy', status: 'COLD', perils: 'None' },
      { layer: 'Troposphere', metric: 'Oxygen 18%', status: 'FRIGID', perils: 'Ice mists' }
    ],
    orbitalLogs: ["Survival gear mandatory.", "Basics poverty reported.", "Scanned: 0 megastructures."]
  },
  {
    id: 'bruacarro',
    name: 'Bruacarro',
    system: 'Jotux System',
    ideal: '65%',
    yearColonized: '196pX',
    orbitalOrder: '3/7',
    sizeClass: '1',
    moons: '0',
    industry: 'Frozen rock full of minable ores.',
    jurisdiction: 'Unmanaged',
    cGate: 'I',
    description: 'Desolate, red-rock world with deep geometric scarring from massive mining excavations. Almost zero surface atmosphere. Subterranean warmth signatures indicate deep hive habitats.',
    layers: [
      { layer: 'Exosphere', metric: 'Vacuum', status: 'THIN', perils: 'Meteorites' },
      { layer: 'Thermosphere', metric: '500K', status: 'STABLE', perils: 'None' },
      { layer: 'Mesosphere', metric: '-150C', status: 'COLD', perils: 'Frozen N2' },
      { layer: 'Stratosphere', metric: 'Static', status: 'NOMINAL', perils: 'None' },
      { layer: 'Troposphere', metric: 'Dust 90%', status: 'LHO', perils: 'Dust toxicity' }
    ],
    orbitalLogs: ["Miner-Cert Required.", "Sub-Earth pressure warning.", "Ore caches pinging."]
  },
  {
    id: 'lestophus',
    name: 'Lestophus',
    system: 'Rila System',
    ideal: '99%',
    yearColonized: '209pX',
    orbitalOrder: '4/4',
    sizeClass: '4',
    moons: '0',
    industry: 'Heavily aquatic. Luxury goods, exports organics.',
    jurisdiction: 'Unmanaged',
    cGate: 'J',
    description: 'Bioluminescent aquatic world with 98% surface water coverage. Deep-sea alloy forges produce distinct sub-surface light patterns. Atmosphere is rich and oxygen-heavy.',
    layers: [
      { layer: 'Exosphere', metric: 'Water Vapor', status: 'WET', perils: 'None' },
      { layer: 'Thermosphere', metric: '950K', status: 'STABLE', perils: 'None' },
      { layer: 'Mesosphere', metric: '-75C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'H2O-Rich', status: 'PRISTINE', perils: 'None' },
      { layer: 'Troposphere', metric: 'Oxygen 23%', status: 'LUXURY', perils: 'Mega-hurricanes' }
    ],
    orbitalLogs: ["Luxury tag confirmed.", "Marine traffic high.", "Organics export authorized."]
  },
  {
    id: 'hafrion',
    name: 'Hafrion',
    system: 'Rila System',
    ideal: '86%',
    yearColonized: '215pX',
    orbitalOrder: '3/4',
    sizeClass: '4',
    moons: '3',
    industry: 'Desert planet. Rich in metallic alloy ores; luxurious wares.',
    jurisdiction: 'Unmanaged',
    cGate: 'K',
    description: 'Scorched-earth desert profile with prominent crystalline mountain ranges. Scans detect high-value alloy caches in the equatorial regions. Atmospheric lightning frequent due to metallic dust.',
    layers: [
      { layer: 'Exosphere', metric: 'Ionized', status: 'CAUTION', perils: 'Static' },
      { layer: 'Thermosphere', metric: '2000K', status: 'DANGER', perils: 'Solar gain' },
      { layer: 'Mesosphere', metric: '-60C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'Metallic 5%', status: 'CONDUCTIVE', perils: 'L-bolts' },
      { layer: 'Troposphere', metric: 'Oxygen 19%', status: 'HARSH', perils: 'Razor-sand' }
    ],
    orbitalLogs: ["Alloy export active.", "Ground-temp critical.", "Lightning evasion active."]
  },
  {
    id: 'sethides',
    name: 'Sethides',
    system: 'Otar System',
    ideal: '97%',
    yearColonized: '264pX',
    orbitalOrder: '1/1',
    sizeClass: '6',
    moons: '0',
    industry: 'Aquatic biome. Produces "living materials" for construction and tech.',
    jurisdiction: 'Unmanaged',
    cGate: 'L',
    description: 'Deep-shadow aquatic world crisscrossed by massive organic superstructures. Surface albedo is unusually low. Genetic architecture yields high-density bio-material exports.',
    layers: [
      { layer: 'Exosphere', metric: 'Bio-Dust', status: 'STABLE', perils: 'None' },
      { layer: 'Thermosphere', metric: '1100K', status: 'STABLE', perils: 'None' },
      { layer: 'Mesosphere', metric: '-85C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'Chloride 4%', status: 'STABLE', perils: 'None' },
      { layer: 'Troposphere', metric: 'Oxygen 22%', status: 'BIO-SAFE', perils: 'Viral mist' }
    ],
    orbitalLogs: ["Bio-suit protocol suggested.", "Living material sync complete.", "C-Gate L pulse stable."]
  },
  {
    id: 'uplosie',
    name: 'Uplosie',
    system: 'Uplo System',
    ideal: '82%',
    yearColonized: '307pX',
    orbitalOrder: '6/6',
    sizeClass: '6',
    moons: '0',
    industry: 'High-G industrial testing; specialized research.',
    jurisdiction: 'Unmanaged',
    cGate: 'M',
    description: 'Swirling high-pressure atmosphere with visible ammonia-ice storm systems. Scans detect deep-gravity industrial test range active. Extreme atmospheric density observed in lower strata.',
    layers: [
      { layer: 'Exosphere', metric: 'G-Force 3.1x', status: 'EXTREME', perils: 'Crushing orbit' },
      { layer: 'Thermosphere', metric: '1400K', status: 'STABLE', perils: 'None' },
      { layer: 'Mesosphere', metric: '-120C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'NH3 12%', status: 'TOXIC', perils: 'Corrosive mist' },
      { layer: 'Troposphere', metric: 'Oxygen 14%', status: 'DENSE', perils: 'Pressure hulls req' }
    ],
    orbitalLogs: ["High-G warning active.", "Weapon-test in progress.", "C-Gate M concurrent."]
  },
  {
    id: 'sperenerth',
    name: 'Sperenerth',
    system: 'Zabus System',
    ideal: '96%',
    yearColonized: '339pX',
    orbitalOrder: '2/6',
    sizeClass: '4',
    moons: '0',
    industry: 'High-security repositories; deep-earth ore vaults.',
    jurisdiction: 'Unmanaged',
    cGate: 'N',
    description: 'Cracked, silver-veined surface profile with high-security repository grids visible under scan. Minimal orbital presence beyond defense turrets. Surface albedo highly reflective due to ore deposits.',
    layers: [
      { layer: 'Exosphere', metric: 'Lethal-Auto', status: 'RED', perils: 'Turrets' },
      { layer: 'Thermosphere', metric: '700K', status: 'STABLE', perils: 'None' },
      { layer: 'Mesosphere', metric: '-130C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'Rare Gases', status: 'STABLE', perils: 'None' },
      { layer: 'Troposphere', metric: 'Oxygen 20%', status: 'VAULTED', perils: 'None' }
    ],
    orbitalLogs: ["Vault-Cert validated.", "Defense Zone: Active.", "OSER schedule 4096."]
  },
  {
    id: 'doebos',
    name: 'Doebos',
    system: 'Uplo System',
    ideal: '67%',
    yearColonized: '1329pX',
    orbitalOrder: '5/6',
    sizeClass: '3',
    moons: '1',
    industry: 'Resource auxiliary; secondary research.',
    jurisdiction: 'Unmanaged',
    cGate: 'N/A',
    description: 'Smooth, white planetary shell indicating massive subterranean ice cavities. Low-intensity research signals detected. Scans confirm a 1,329pX settlement date with minimal expansion.',
    layers: [
      { layer: 'Exosphere', metric: 'Thin', status: 'NOMINAL', perils: 'None' },
      { layer: 'Thermosphere', metric: '600K', status: 'STABLE', perils: 'None' },
      { layer: 'Mesosphere', metric: '-140C', status: 'COLD', perils: 'None' },
      { layer: 'Stratosphere', metric: 'H2-Rich', status: 'STABLE', perils: 'None' },
      { layer: 'Troposphere', metric: 'Oxygen 16%', status: 'FRIGID', perils: 'None' }
    ],
    orbitalLogs: ["Auxiliary status confirm.", "Research channel open.", "Transit vectors synced."]
  },
  {
    id: 'ruogava',
    name: 'Ruogava',
    system: 'Ovena System',
    ideal: '55%',
    yearColonized: '1544pX',
    orbitalOrder: '7/11',
    sizeClass: '5',
    moons: '5',
    industry: 'Tropical, harsh, toxic; lacking luxury.',
    jurisdiction: 'Unmanaged',
    cGate: 'N/A',
    description: 'Rust-colored world with prominent polar ice caps and a toxic, chlorine-heavy atmosphere. Five moons create complex orbital tidal patterns. Significant biological hazards detected in surface tropics.',
    layers: [
      { layer: 'Exosphere', metric: 'Multi-Moon', status: 'CHAOTIC', perils: 'Tidal drag' },
      { layer: 'Thermosphere', metric: '1000K', status: 'NOMINAL', perils: 'None' },
      { layer: 'Mesosphere', metric: '-90C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'Chl-Cloud', status: 'TOXIC', perils: 'None' },
      { layer: 'Troposphere', metric: 'Oxygen 12%', status: 'LETHAL', perils: 'Bio-toxicity' }
    ],
    orbitalLogs: ["Toxic world protocol.", "Moon-order 1-5 synced.", "Hazard-Cert Required."]
  },
  {
    id: 'scekenerth',
    name: 'Scekenerth',
    system: 'Zabus System',
    ideal: '56%',
    yearColonized: '2808pX',
    orbitalOrder: '5/6',
    sizeClass: '5',
    moons: '0',
    industry: 'Secondary mining; high-risk extraction.',
    jurisdiction: 'Unmanaged',
    cGate: 'N/A',
    description: 'Sandy world with anomalous hexagonal surface clusters and deep industrial scarring. High-risk ore extraction platforms are visible through localized atmospheric dust clouds.',
    layers: [
      { layer: 'Exosphere', metric: 'Dust-Orbit', status: 'CAUTION', perils: 'Filter clog' },
      { layer: 'Thermosphere', metric: '1200K', status: 'STABLE', perils: 'None' },
      { layer: 'Mesosphere', metric: '-100C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'Stable', status: 'NOMINAL', perils: 'None' },
      { layer: 'Troposphere', metric: 'Oxygen 14%', status: 'MINING', perils: 'Caustic dust' }
    ],
    orbitalLogs: ["Risk-level 9 reported.", "Mining ops in sectors 4-7.", "Dust-clearance pending."]
  },
  {
    id: 'weshore',
    name: 'Weshore',
    system: 'Uplo System',
    ideal: '78%',
    yearColonized: '511pX',
    orbitalOrder: '3/6',
    sizeClass: '4',
    moons: '0',
    industry: 'Industrial support hub.',
    jurisdiction: 'Unmanaged',
    cGate: 'N/A',
    description: 'Fragmented landmasses scattered across shallow, warm oceans. Scans show multi-sector industrial support hubs active. High-frequency transport patterns indicate intense logistics activity.',
    layers: [
      { layer: 'Exosphere', metric: 'Transport Den', status: 'BUSY', perils: 'Collisions' },
      { layer: 'Thermosphere', metric: '1050K', status: 'NOMINAL', perils: 'None' },
      { layer: 'Mesosphere', metric: '-85C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'H2O Vapor', status: 'WET', perils: 'None' },
      { layer: 'Troposphere', metric: 'Oxygen 19%', status: 'NOMINAL', perils: 'Cyclones' }
    ],
    orbitalLogs: ["Hub-clearance 101.", "Logistics grid active.", "C-Gate N/A available."]
  },
  {
    id: 'eclaiphus',
    name: 'Eclaiphus',
    system: 'Uplo System',
    ideal: '72%',
    yearColonized: '514pX',
    orbitalOrder: '2/6',
    sizeClass: '3',
    moons: '4',
    industry: 'Localized supply chain.',
    jurisdiction: 'Unmanaged',
    cGate: 'N/A',
    description: 'Overcast atmospheric profile with localized urban luminescence. Scans confirm secondary supply chain hub for the Axial Core. Four moons create significant gravitational stress in upper strata.',
    layers: [
      { layer: 'Exosphere', metric: 'Grav Stress', status: 'CAUTION', perils: 'Variable G' },
      { layer: 'Thermosphere', metric: '900K', status: 'STABLE', perils: 'None' },
      { layer: 'Mesosphere', metric: '-95C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'Stable', status: 'NOMINAL', perils: 'None' },
      { layer: 'Troposphere', metric: 'Oxygen 17%', status: 'SUPPLY', perils: 'Cloud-ops' }
    ],
    orbitalLogs: ["Supply priority valid.", "Moon alignment 4/4.", "Local auth synced."]
  },
  {
    id: 'snohavis',
    name: 'Snohavis',
    system: 'Ovena System',
    ideal: '68%',
    yearColonized: '1109pX',
    orbitalOrder: '7/8',
    sizeClass: '6',
    moons: '0',
    industry: 'Mountainous biome. Research facilities, self-sufficient economy.',
    jurisdiction: 'Corp controlled (Consortium)',
    cGate: 'O',
    description: 'Pale, high-mountain world with geometric research clusters visible in the high-altitude valleys. Self-sufficient economy markers are evident through localized resource loops.',
    layers: [
      { layer: 'Exosphere', metric: 'Quiet', status: 'SILENT', perils: 'None' },
      { layer: 'Thermosphere', metric: '850K', status: 'STABLE', perils: 'None' },
      { layer: 'Mesosphere', metric: '-110C', status: 'STABLE', perils: 'None' },
      { layer: 'Stratosphere', metric: 'He-Rich', status: 'STABLE', perils: 'None' },
      { layer: 'Troposphere', metric: 'Oxygen 16%', status: 'THIN', perils: 'None' }
    ],
    orbitalLogs: ["Consortium Auth Ping.", "Research black-out active.", "C-Gate O Concurrence."]
  },
  {
    id: 'fracaphus',
    name: 'Fracaphus',
    system: 'Edos System',
    ideal: '51%',
    yearColonized: '2721pX',
    orbitalOrder: '5/6',
    sizeClass: '6',
    moons: '0',
    industry: 'Arctic biome. Abundant basics; crystal exports.',
    jurisdiction: 'Unmanaged',
    cGate: 'P',
    description: 'Blinding white arctic world with extensive crystal field formations on the surface. High basic resource signatures detected in the icy crust. Minimal colonization beyond mining outpost 14.',
    layers: [
      { layer: 'Exosphere', metric: 'Albedo Peak', status: 'BRIGHT', perils: 'Sensor wash' },
      { layer: 'Thermosphere', metric: '750K', status: 'STABLE', perils: 'None' },
      { layer: 'Mesosphere', metric: '-160C', status: 'COLD', perils: 'None' },
      { layer: 'Stratosphere', metric: 'Methane 2%', status: 'HARSH', perils: 'None' },
      { layer: 'Troposphere', metric: 'Oxygen 15%', status: 'ARCTIC', perils: 'Crystal dust' }
    ],
    orbitalLogs: ["Crystal export active.", "Basic-Resource High.", "Transit: Stable."]
  }
];

interface PlanetaryReport {
  description: string;
  layers: StratificationLayer[];
  orbitalLogs: string[];
}

// --- App Component ---

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>(CLUSTERS[4]); // Default to Reclov (index 4)
  const [report, setReport] = useState<PlanetaryReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState<'alpha' | 'system' | 'gate'>('alpha');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const planetY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const atmosphereY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    addLog(`System initialized. User: WillETippin@gmail.com Access: Licensed Master-Class [CERT 8].`);
    addLog(`Dux Balance: 148,209 synced. C-Gate uplink ready.`);
    addLog(`Awaiting planetary target selection...`);
    // Auto-synthesize default target
    generateReport(CLUSTERS[4]);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const generateReport = async (planet: Planet) => {
    setIsGenerating(true);
    setReport(null);
    addLog(`INITIATING SCAN VIA C-GATE [C-${planet.cGate}]...`);

    // Fake delay for flavor, no AI calls
    setTimeout(() => {
      setReport({
        description: planet.description,
        layers: planet.layers,
        orbitalLogs: planet.orbitalLogs
      });
      addLog(`TELEMETRY CAPTURED. IO INTERFACE SYNC COMPLETE.`);
      setIsGenerating(false);
    }, 1200);
  };

  const sortedClusters = [...CLUSTERS].sort((a, b) => {
    if (sortCriteria === 'alpha') return a.name.localeCompare(b.name);
    if (sortCriteria === 'gate') return a.cGate.localeCompare(b.cGate);
    if (sortCriteria === 'system') return a.system.localeCompare(b.system);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#020408] text-[#e0e6ed] font-mono selection:bg-cyan-900 selection:text-cyan-100 scanlines overflow-x-hidden p-2 md:p-4">
      {/* --- Main Interface Frame --- */}
      <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] border-2 border-[#00f2ff]/30 flex flex-col relative bg-[#020408]">
        
        {/* Hamburger Menu / Sidebar */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 pointer-events-auto"
              />
              
              {/* Sidebar Content */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-full max-w-sm bg-[#0a0f19] border-r border-[#00f2ff]/30 z-[60] flex flex-col shadow-[20px_0_40px_rgba(0,0,0,0.5)]"
              >
                <div className="p-6 border-b border-[#00f2ff]/20 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Navigation className="w-5 h-5 text-[#00f2ff]" />
                    <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-[#00f2ff]">Cluster Registry</h2>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="text-[#8a9cb0] hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Sort Controls */}
                <div className="p-4 bg-black/40 border-b border-[#00f2ff]/10 grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setSortCriteria('alpha')}
                    className={`flex flex-col items-center gap-1 py-3 border transition-all ${sortCriteria === 'alpha' ? 'bg-[#00f2ff]/20 border-[#00f2ff] text-[#00f2ff]' : 'border-white/10 text-[#8a9cb0] hover:bg-white/5'}`}
                  >
                    <ArrowDownAZ className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold">Alpha</span>
                  </button>
                  <button 
                    onClick={() => setSortCriteria('gate')}
                    className={`flex flex-col items-center gap-1 py-3 border transition-all ${sortCriteria === 'gate' ? 'bg-[#00f2ff]/20 border-[#00f2ff] text-[#00f2ff]' : 'border-white/10 text-[#8a9cb0] hover:bg-white/5'}`}
                  >
                    <Hash className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold">Gate</span>
                  </button>
                  <button 
                    onClick={() => setSortCriteria('system')}
                    className={`flex flex-col items-center gap-1 py-3 border transition-all ${sortCriteria === 'system' ? 'bg-[#00f2ff]/20 border-[#00f2ff] text-[#00f2ff]' : 'border-white/10 text-[#8a9cb0] hover:bg-white/5'}`}
                  >
                    <Network className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold">System</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {sortedClusters.map(planet => (
                    <button
                      key={planet.id}
                      onClick={() => {
                        setSelectedPlanet(planet);
                        generateReport(planet);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full p-4 text-left transition-all border flex flex-col gap-1 group ${
                        selectedPlanet.id === planet.id 
                          ? 'bg-[#00f2ff]/10 border-[#00f2ff]/40 text-[#00f2ff]' 
                          : 'border-transparent hover:bg-[#00f2ff]/5 text-[#8a9cb0]'
                      }`}
                    >
                      <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                        <span>{planet.name}</span>
                        <span className="text-[10px] opacity-40">CG-{planet.cGate}</span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] opacity-60 uppercase">
                        <span>{planet.system}</span>
                        <span>{planet.sizeClass}S</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="p-4 border-t border-[#00f2ff]/20 bg-black/40 text-[9px] text-[#8a9cb0] uppercase tracking-tighter">
                  Total Objects Tracked: {CLUSTERS.length} // Ready for Uplink
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Header Bar */}
        <header className="border-b border-[#00f2ff]/20 bg-gradient-to-b from-[#00f2ff]/10 to-transparent p-4 flex flex-col md:flex-row justify-between items-center gap-4 relative z-40">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 border border-[#00f2ff]/30 text-[#00f2ff] hover:bg-[#00f2ff]/10 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-[#00f2ff] p-2 animate-pulse hidden sm:block">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="truncate">
                <h1 className="text-sm md:text-xl font-bold tracking-widest uppercase text-[#00f2ff]" style={{ textShadow: IO_TEXT_GLOW }}>
                  IO // PLANETARY_REGISTRY_{selectedPlanet.name.toUpperCase().replace(/\s/g, '_')}
                </h1>
                <div className="flex items-center gap-4 text-[8px] md:text-[10px] text-[#8a9cb0] uppercase font-bold tracking-widest mt-1">
                  <span className="flex items-center gap-1"><Radio className="w-3 h-3" /> UPLINK: STABLE</span>
                  <span className="hidden sm:flex items-center gap-1"><Wifi className="w-3 h-3" /> AES-4096</span>
                  <span className="text-[#ff9d00]">BALANCE: 148K DUX</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="header-stats flex gap-8 items-center text-[10px]">
            <div className="flex items-center gap-2">
              <span className="text-[#8a9cb0]">LICENSED MASTER:</span>
              <span className="text-[#00f2ff] font-bold">CERT 8/10 [UND]</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8a9cb0]">GATE [C-{selectedPlanet.cGate}]:</span>
              <span className="text-[#00ff6a] font-bold">CONCURRENCE ACTIVE</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[#8a9cb0]">OSER CYCLE:</span>
              <span className="text-[#00f2ff] font-bold">142:32:04</span>
            </div>
          </div>
        </header>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 p-3 md:p-6">
          
          {/* LEFT COLUMN: NAVIGATION & VISUALS */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Info Mini Panel */}
            <div className="grid grid-cols-1 gap-4">
              <div className="border border-[#00f2ff]/20 bg-[#0a0f19]/85 p-4 md:p-6 relative overflow-hidden group">
                <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-4xl font-extrabold mb-1 md:mb-2 uppercase tracking-tighter text-[#00f2ff]" style={{ textShadow: IO_TEXT_GLOW }}>
                      {selectedPlanet.name}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-[9px] md:text-[10px] text-[#8a9cb0] mb-3 md:mb-4 uppercase tracking-tighter">
                      <div className="flex flex-col">
                        <span className="text-[8px] opacity-50">System</span>
                        <span className="text-[#e0e6ed] truncate">{selectedPlanet.system}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] opacity-50">Hab-Ideal</span>
                        <span className="text-[#00ff6a]">{selectedPlanet.ideal}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] opacity-50">Settlement</span>
                        <span className="text-[#ff9d00]">{selectedPlanet.yearColonized}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] opacity-50">Jurisdiction</span>
                        <span className="text-[#00f2ff] truncate">{selectedPlanet.jurisdiction}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-4 text-[9px] mb-4 text-[#8a9cb0]">
                      <span className="bg-white/5 px-2 py-0.5 border border-white/10 whitespace-nowrap">SIZE: {selectedPlanet.sizeClass}</span>
                      <span className="bg-white/5 px-2 py-0.5 border border-white/10 whitespace-nowrap">ORDER: {selectedPlanet.orbitalOrder}</span>
                      <span className="bg-white/5 px-2 py-0.5 border border-white/10 whitespace-nowrap">MOONS: {selectedPlanet.moons}</span>
                    </div>
                    <p className="text-[10px] md:text-[11px] text-[#e0e6ed] leading-relaxed max-w-xl border-l-2 border-[#ff9d00] pl-3 italic opacity-80">
                      {selectedPlanet.industry}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-col gap-2 md:min-w-[150px]">
                    <button
                      onClick={() => generateReport(selectedPlanet)}
                      disabled={isGenerating}
                      className="w-full md:w-auto h-12 md:h-14 bg-[#00f2ff]/10 border border-[#00f2ff] hover:bg-[#00f2ff]/20 text-[#00f2ff] transition-all disabled:opacity-50 disabled:cursor-wait font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,242,255,0.1)] active:scale-95"
                    >
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                      SYNTHESIZE
                    </button>
                    <div className="hidden md:block text-[9px] text-center text-[#8a9cb0] uppercase">
                      Cert Grade [UND/WIL] Syncing...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Container */}
            <div className="flex-1 border border-[#00f2ff]/20 bg-[radial-gradient(circle_at_center,#101a2d_0%,#020408_100%)] relative flex flex-col items-center justify-center overflow-hidden min-h-[300px] md:min-h-[400px]">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-4"
                  >
                     <div className="w-32 h-32 rounded-full border-t-2 border-[#00f2ff] animate-spin mx-auto" />
                     <p className="text-xs font-bold animate-pulse text-[#00f2ff] tracking-[0.3em]">SYNCHRONIZING FEED...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="visual-static"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-6 text-[#8a9cb0]/30 p-8"
                  >
                    <div className="relative">
                      <Globe className="w-48 h-48 md:w-64 md:h-64 animate-[pulse_8s_ease-in-out_infinite]" />
                      <div className="absolute inset-0 bg-[#00f2ff]/5 rounded-full blur-3xl" />
                    </div>
                    <div className="text-center space-y-2 max-w-md">
                      <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff]/50 animate-pulse">
                        {report ? "Orbital Feed Offline - Telemetry Only" : "Awaiting Uplink"}
                      </p>
                      {report && (
                        <p className="text-[11px] text-[#8a9cb0] opacity-60 leading-relaxed italic border-t border-white/5 pt-4">
                          {report.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Scanline pattern for the visual area */}
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[length:100%_4px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)]" />
            </div>
          </section>

          {/* RIGHT COLUMN: DATA TABLES */}
          <section className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Climate Data Panel */}
            <div className="border border-[#00f2ff]/20 bg-[#0a0f19]/85 p-4">
              <h3 className="text-[12px] font-bold text-[#00f2ff] mb-4 flex items-center gap-3 uppercase tracking-widest">
                Real-time Climate Report <span className="h-[1px] flex-1 bg-[#00f2ff]/20" />
              </h3>
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-[#00f2ff]/20">
                    <th className="text-left text-[#8a9cb0] font-normal pb-2">LAYER</th>
                    <th className="text-left text-[#8a9cb0] font-normal pb-2">METRIC</th>
                    <th className="text-left text-[#8a9cb0] font-normal pb-2">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#00f2ff]/5">
                  {(report?.layers || [
                    { layer: 'Exosphere', metric: '---', status: 'WAIT' },
                    { layer: 'Thermosphere', metric: '---', status: 'WAIT' },
                    { layer: 'Mesosphere', metric: '---', status: 'WAIT' },
                    { layer: 'Stratosphere', metric: '---', status: 'WAIT' },
                    { layer: 'Troposphere', metric: '---', status: 'WAIT' },
                  ]).map((l, i) => (
                    <tr key={i}>
                      <td className="py-2 text-[#e0e6ed] font-bold">{l.layer}</td>
                      <td className="py-2 text-[#8a9cb0]">{l.metric}</td>
                      <td className={`py-2 font-bold ${
                        l.status.toLowerCase().includes('stable') || l.status.toLowerCase().includes('nominal') || l.status.toLowerCase().includes('ok')
                          ? 'text-[#00ff6a]' 
                          : l.status.toLowerCase().includes('wait') 
                            ? 'text-[#8a9cb0]' 
                            : l.status.toLowerCase().includes('danger') || l.status.toLowerCase().includes('alert') || l.status.toLowerCase().includes('extreme')
                              ? 'text-[#ff3c3c]'
                              : 'text-[#ff9d00]'
                      }`}>
                        {l.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Logistics Panel */}
            <div className="border border-[#00f2ff]/20 bg-[#0a0f19]/85 p-4">
              <h3 className="text-[12px] font-bold text-[#00f2ff] mb-4 flex items-center gap-3 uppercase tracking-widest">
                Orbital Logistics <span className="h-[1px] flex-1 bg-[#00f2ff]/20" />
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-white/5 border border-white/5 p-2 flex flex-col justify-between h-14">
                  <span className="text-[#8a9cb0]">Delta-V Req</span>
                  <span className="text-white font-bold">11.2 km/s</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-2 flex flex-col justify-between h-14">
                  <span className="text-[#8a9cb0]">J2 Perturbation</span>
                  <span className="text-white font-bold">0.001082</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-2 flex flex-col justify-between h-14">
                  <span className="text-[#8a9cb0]">System Load</span>
                  <span className="text-white font-bold">NOMINAL</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-2 flex flex-col justify-between h-14">
                  <span className="text-[#8a9cb0]">Efficiency</span>
                  <span className="text-white font-bold">94.2%</span>
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className="mt-auto border border-[#ff3c3c] bg-[#ff3c3c]/10 p-4 relative">
              <div className="flex gap-3">
                <ShieldAlert className="w-5 h-5 text-[#ff3c3c] shrink-0" />
                <div className="space-y-1">
                  <b className="text-[10px] text-[#ff3c3c] uppercase block">DEFENSIVE ZONE: LETHAL AUTONOMOUS</b>
                  <p className="text-[10px] text-[#e0e6ed] leading-relaxed opacity-80">
                    Deviation &gt; 0.02% from OSER-scheduled orbital path results in vaporizing turret response. Capacitance-Dread protocol engaged.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center p-1">
                <AlertTriangle className="w-4 h-4 text-[#ff3c3c]/40" />
              </div>
            </div>

          </section>
        </main>

        {/* --- Log Terminal --- */}
        <footer className="border-t border-[#00f2ff]/20 bg-[#00f2ff]/5 p-2 flex flex-col gap-2">
           <div className="flex justify-between items-center px-2 text-[9px] text-[#8a9cb0]">
              <div className="flex gap-4">
                <span>ENCRYPTION: AES-4096-YARA</span>
                <span className="text-[#00f2ff]">X: 3104.99 // Y: 12.00 // Z: -449.21</span>
              </div>
              <div>&copy; 3104 IO UNIVERSAL AI SYSTEMS</div>
           </div>
           
           <div className="bg-black/50 p-2 h-24 overflow-y-auto font-mono text-[9px] flex flex-col gap-0.5 border border-[#00f2ff]/10 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-[#00f2ff]/50 whitespace-nowrap">{log.split(']')[0]}]</span>
                <span className={log.includes('CRITICAL') ? 'text-[#ff3c3c]' : 'text-[#e0e6ed]/80'}>{log.split('] ')[1]}</span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </footer>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #020408;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00f2ff22;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00f2ff66;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
