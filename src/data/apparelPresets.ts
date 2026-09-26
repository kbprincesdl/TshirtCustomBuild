import {
  GarmentConfig,
  GarmentColor,
  ModelPreset,
  StylePreset,
  ArtworkDesign,
  PrintPlacement,
} from '../types/apparel';

import modelMaleStreetwear from '../assets/images/model_male_streetwear_1790419038402.jpg';
import modelFemaleMinimal from '../assets/images/model_female_minimal_1790419056687.jpg';
import modelMaleAthletic from '../assets/images/model_male_athletic_1790419070545.jpg';
import modelBackView from '../assets/images/model_back_view_1790419085881.jpg';

export const GARMENTS: GarmentConfig[] = [
  {
    id: 'heavyweight_oversized',
    name: 'Heavyweight Boxy Oversized Tee',
    weightGsm: 240,
    composition: '100% Combed Compact Ring-Spun Cotton',
    fit: 'Boxy streetwear cut, dropped shoulders, thick 1.25" ribbed collar',
    basePrice: 28.0,
    description: 'Ultra-dense fabric with minimal shrink, ideal for high-density DTG and screen printing.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
  },
  {
    id: 'classic_crew',
    name: 'Pro-Standard Classic Crewneck',
    weightGsm: 180,
    composition: '100% Ring-Spun Combed Cotton',
    fit: 'Regular retail fit, side-seamed, shoulder-to-shoulder taping',
    basePrice: 22.0,
    description: 'Versatile everyday lifestyle tee with smooth surface for crisp print detail.',
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'vintage_acid_wash',
    name: 'Vintage Pigment Washed Tee',
    weightGsm: 220,
    composition: '100% Pre-Shrunk Ring-Spun Cotton (Enzyme Washed)',
    fit: 'Relaxed vintage 90s silhouette with distressed edge detailing',
    basePrice: 30.0,
    description: 'Custom mineral wash with subtle highs and lows, perfect for bootleg rock & retro aesthetics.',
    availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'organic_bamboo',
    name: 'Eco-Luxe Organic Bamboo Cotton',
    weightGsm: 195,
    composition: '70% Viscose from Organic Bamboo / 30% Organic Cotton',
    fit: 'Tailored modern drape, silky hand-feel, antimicrobial',
    basePrice: 32.0,
    description: 'Premium sustainable fabric with breathable thermal regulation.',
    availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
];

export const GARMENT_COLORS: GarmentColor[] = [
  {
    id: 'pitch_black',
    name: 'Pitch Black',
    hex: '#141416',
    pantone: 'Pantone 19-4008 TCX',
    textColor: 'light',
  },
  {
    id: 'washed_charcoal',
    name: 'Washed Charcoal',
    hex: '#2B2D31',
    pantone: 'Pantone 19-3906 TCX',
    textColor: 'light',
  },
  {
    id: 'chalk_white',
    name: 'Chalk White',
    hex: '#F4F4F2',
    pantone: 'Pantone 11-0601 TCX',
    textColor: 'dark',
  },
  {
    id: 'bone_cream',
    name: 'Bone Cream',
    hex: '#EBE5D8',
    pantone: 'Pantone 12-0804 TCX',
    textColor: 'dark',
  },
  {
    id: 'deep_forest',
    name: 'Forest Moss',
    hex: '#22382D',
    pantone: 'Pantone 19-0315 TCX',
    textColor: 'light',
  },
  {
    id: 'vintage_burgundy',
    name: 'Oxblood Burgundy',
    hex: '#4A1D24',
    pantone: 'Pantone 19-1725 TCX',
    textColor: 'light',
  },
  {
    id: 'slate_navy',
    name: 'Pacific Navy',
    hex: '#1D2736',
    pantone: 'Pantone 19-3921 TCX',
    textColor: 'light',
  },
  {
    id: 'terracotta_clay',
    name: 'Washed Terracotta',
    hex: '#8C4638',
    pantone: 'Pantone 18-1438 TCX',
    textColor: 'light',
  },
];

export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: 'male_streetwear',
    name: 'Streetwear Studio (Male)',
    category: 'streetwear',
    gender: 'male',
    imageSrc: modelMaleStreetwear,
    printBox: {
      top: 28,
      left: 31,
      width: 38,
      height: 38,
    },
    lightingBlend: 'multiply',
  },
  {
    id: 'female_minimal',
    name: 'Studio Portrait (Female)',
    category: 'studio',
    gender: 'female',
    imageSrc: modelFemaleMinimal,
    printBox: {
      top: 32,
      left: 32,
      width: 36,
      height: 36,
    },
    lightingBlend: 'multiply',
  },
  {
    id: 'male_athletic',
    name: 'Athletic Commercial (Male)',
    category: 'athletic',
    gender: 'male',
    imageSrc: modelMaleAthletic,
    printBox: {
      top: 30,
      left: 32,
      width: 37,
      height: 37,
    },
    lightingBlend: 'multiply',
  },
  {
    id: 'back_view',
    name: 'Oversized Back View',
    category: 'back',
    gender: 'male',
    imageSrc: modelBackView,
    printBox: {
      top: 26,
      left: 28,
      width: 44,
      height: 44,
    },
    lightingBlend: 'multiply',
  },
];

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'vintage_90s',
    name: '90s Bootleg Retro',
    category: 'Streetwear',
    promptSuffix: 'vintage 90s bootleg rap rock t-shirt graphic, distressed screenprint halftone, bold airbrushed aesthetic, weathered washed look, isolated on transparent background',
    sampleThumbnail: '🔥',
    description: 'Heavy airbrush shading, bold distressed typography, and retro concert merchandise feel.',
  },
  {
    id: 'cyberpunk_mecha',
    name: 'Cyberpunk Mecha',
    category: 'Futuristic',
    promptSuffix: 'cyberpunk mecha anime illustration, razor sharp vector linework, neon accents, high-contrast stencil art, silkscreen apparel print, isolated',
    sampleThumbnail: '⚡',
    description: 'Technical futuristic decals, biomechanical chassis lines, and electric glow contrasts.',
  },
  {
    id: 'japanese_kanji',
    name: 'Tokyo Ukiyo-e Typography',
    category: 'Cultural',
    promptSuffix: 'modern Japanese ukiyo-e woodblock streetwear graphic, bold kanji calligraphy, clean vector lines, traditional wave and crane motif, apparel print',
    sampleThumbnail: '⛩️',
    description: 'Traditional woodblock textures harmonized with modern Harajuku streetwear silhouettes.',
  },
  {
    id: 'minimal_bauhaus',
    name: 'Bauhaus Geometric Vector',
    category: 'Modernist',
    promptSuffix: 'Bauhaus modernist graphic art, swiss design layout, bold geometric shapes, primary colors, sharp clean vector emblem, minimalist t-shirt graphic',
    sampleThumbnail: '📐',
    description: 'Clean rationalist grids, bold planar geometry, and International Typographic Style balance.',
  },
  {
    id: 'chrome_y2k',
    name: '3D Chrome Liquid Metal',
    category: 'Y2K',
    promptSuffix: 'Y2K liquid chrome metallic 3D graphic emblem, mercury reflections, tribal futuristic spikes, sharp specular highlights, high resolution apparel artwork',
    sampleThumbnail: '💿',
    description: 'Molten mercury gradients, futuristic 2000s tribal curvature, and hyper-reflective sheen.',
  },
  {
    id: 'grunge_distressed',
    name: 'Industrial Punk Stencil',
    category: 'Grunge',
    promptSuffix: 'raw industrial punk stencil art, rough distressed texture, spray paint splatters, bold protest typography, monochrome black and white screenprint',
    sampleThumbnail: '⚡',
    description: 'High grit spray stencils, xerox noise, and raw DIY underground aesthetic.',
  },
  {
    id: 'tactical_embroidery',
    name: 'Tactical Patch Emblem',
    category: 'Badge',
    promptSuffix: 'military tactical embroidered patch design, thick woven thread texture, merrowed border edge, vector badge emblem, apparel chest graphic',
    sampleThumbnail: '🛡️',
    description: 'Structured crests with simulated thread stitch detailing and tactile borders.',
  },
];

export const SAMPLE_ARTWORKS: ArtworkDesign[] = [
  {
    id: 'art_1',
    title: 'Neon Cyber Panther',
    prompt: 'Cybernetic black panther leaping through holographic neon grids, sharp geometric vector art, high contrast streetwear graphic',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    style: 'Cyberpunk Mecha',
    engine: 'preset',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'art_2',
    title: 'Tokyo Midnight Dragon',
    prompt: 'Vintage Japanese ukiyo-e coiled dragon wrapped around geometric solar crest, bold woodblock linework, red sun contrast',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    style: 'Tokyo Ukiyo-e Typography',
    engine: 'preset',
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'art_3',
    title: 'Bauhaus Horizon 1928',
    prompt: 'Minimalist Bauhaus architectural abstraction, circular arc geometry, Swiss typography, stark black and cream contrast',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
    style: 'Bauhaus Geometric Vector',
    engine: 'preset',
    createdAt: Date.now() - 10800000,
  },
  {
    id: 'art_4',
    title: 'Liquid Silver Y2K Sigil',
    prompt: '3D liquid mercury cyber emblem, sharp aerodynamic chrome spikes, pristine reflection',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
    style: '3D Chrome Liquid Metal',
    engine: 'preset',
    createdAt: Date.now() - 14400000,
  },
];

// Curated SVG designs for instant offline / no-latency generation
export const PROCEDURAL_ICONS = [
  {
    id: 'icon_tiger',
    name: 'Bengal Tiger Stencil',
    category: 'Wild',
    prompt: 'Bengal Tiger fierce roaring head stencil, bold screenprint graphic',
    svg: `<svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="250" cy="250" r="230" stroke="#f59e0b" stroke-width="6" stroke-dasharray="12 8"/>
      <path d="M250 80 L340 180 L420 180 L380 270 L430 350 L340 370 L250 440 L160 370 L70 350 L120 270 L80 180 L160 180 Z" fill="#18181b" stroke="#f59e0b" stroke-width="8"/>
      <polygon points="250,140 280,210 220,210" fill="#f59e0b"/>
      <polygon points="180,230 230,250 190,270" fill="#ffffff"/>
      <polygon points="320,230 270,250 310,270" fill="#ffffff"/>
      <path d="M200 320 Q250 360 300 320 L280 380 Q250 410 220 380 Z" fill="#ef4444"/>
      <text x="250" y="475" font-family="'Syne', Impact, sans-serif" font-weight="900" font-size="28" fill="#f59e0b" text-anchor="middle" letter-spacing="8">SHANKAR • TIGERS</text>
    </svg>`,
  },
  {
    id: 'icon_cosmic',
    name: 'Cosmic Astrolabe',
    category: 'Astronomy',
    prompt: 'Sacred geometry celestial orbital compass, gold and midnight aesthetic',
    svg: `<svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="250" cy="250" r="210" stroke="#38bdf8" stroke-width="4"/>
      <circle cx="250" cy="250" r="170" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 4"/>
      <circle cx="250" cy="250" r="110" stroke="#818cf8" stroke-width="6"/>
      <polygon points="250,60 380,350 120,350" stroke="#f43f5e" stroke-width="5"/>
      <polygon points="250,440 120,150 380,150" stroke="#f43f5e" stroke-width="5"/>
      <circle cx="250" cy="250" r="40" fill="#38bdf8"/>
      <text x="250" y="258" font-family="'Syne', monospace" font-size="20" font-weight="800" fill="#09090b" text-anchor="middle">SOL</text>
      <text x="250" y="480" font-family="monospace" font-size="14" fill="#a1a1aa" text-anchor="middle" letter-spacing="6">CHRONOS APPAREL SPEC</text>
    </svg>`,
  },
  {
    id: 'icon_tokyo',
    name: 'Harajuku Cyber Kanji',
    category: 'Japanese',
    prompt: 'Cyberpunk Tokyo neon typography with geometric crest',
    svg: `<svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="50" width="400" height="400" rx="20" stroke="#ec4899" stroke-width="6"/>
      <circle cx="250" cy="220" r="110" fill="#ec4899" opacity="0.85"/>
      <text x="250" y="250" font-family="'Hiragino Kaku Gothic Pro', sans-serif" font-weight="900" font-size="90" fill="#ffffff" text-anchor="middle">東京</text>
      <line x1="80" y1="360" x2="420" y2="360" stroke="#06b6d4" stroke-width="4"/>
      <text x="250" y="400" font-family="'Syne', sans-serif" font-weight="800" font-size="24" fill="#06b6d4" text-anchor="middle" letter-spacing="12">NEO TOKYO 2088</text>
      <text x="250" y="430" font-family="monospace" font-size="12" fill="#a1a1aa" text-anchor="middle" letter-spacing="4">SHANKAR MANUFACTURING ARCHIVE</text>
    </svg>`,
  },
];

export function getVolumeDiscountTier(totalQuantity: number) {
  if (totalQuantity >= 1000) {
    return { discountRate: 0.60, tierName: 'Enterprise Factory Direct (1000+ units)', perUnitPriceMultiplier: 0.40 };
  } else if (totalQuantity >= 250) {
    return { discountRate: 0.48, tierName: 'Industrial Volume (250 - 999 units)', perUnitPriceMultiplier: 0.52 };
  } else if (totalQuantity >= 50) {
    return { discountRate: 0.35, tierName: 'Wholesale B2B MOQ (50 - 249 units)', perUnitPriceMultiplier: 0.65 };
  } else if (totalQuantity >= 10) {
    return { discountRate: 0.15, tierName: 'Small Batch Volume (10 - 49 units)', perUnitPriceMultiplier: 0.85 };
  }
  return { discountRate: 0, tierName: 'Standard B2C Retail (1 - 9 units)', perUnitPriceMultiplier: 1.0 };
}

export function calculateCustomItemPrice(
  garment: GarmentConfig,
  totalQuantity: number,
  printMethod: string,
  hasCustomNeckLabel?: boolean
): { unitPrice: number; totalPrice: number; discountRate: number; tierName: string } {
  const { discountRate, tierName, perUnitPriceMultiplier } = getVolumeDiscountTier(totalQuantity);

  let methodSurcharge = 0;
  if (printMethod === 'embroidery') methodSurcharge = 4.0;
  if (printMethod === 'puff_print') methodSurcharge = 2.5;

  let labelSurcharge = hasCustomNeckLabel ? 1.2 : 0;

  const baseUnit = (garment.basePrice + methodSurcharge + labelSurcharge) * perUnitPriceMultiplier;
  const roundedUnitPrice = Math.round(baseUnit * 100) / 100;
  const totalPrice = Math.round(roundedUnitPrice * totalQuantity * 100) / 100;

  return {
    unitPrice: roundedUnitPrice,
    totalPrice,
    discountRate,
    tierName,
  };
}
