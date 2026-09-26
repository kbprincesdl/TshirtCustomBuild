export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'streetwear' | 'vintage' | 'script' | 'minimal' | 'bold' | 'display';
  previewText: string;
}

export const TYPOGRAPHY_FONTS: FontOption[] = [
  {
    id: 'bebas',
    name: 'Bebas Neue (Heavy Streetwear)',
    family: "'Bebas Neue', sans-serif",
    category: 'streetwear',
    previewText: 'STREET CULTURE',
  },
  {
    id: 'syne',
    name: 'Syne (Futuristic Editorial)',
    family: "'Syne', sans-serif",
    category: 'bold',
    previewText: 'AVANT GARDE',
  },
  {
    id: 'oswald',
    name: 'Oswald (Athletic Block)',
    family: "'Oswald', sans-serif",
    category: 'bold',
    previewText: 'VARISTY CREW',
  },
  {
    id: 'montserrat',
    name: 'Montserrat (Modern Bold)',
    family: "'Montserrat', sans-serif",
    category: 'minimal',
    previewText: 'ESSENTIALS',
  },
  {
    id: 'righteous',
    name: 'Righteous (Retro Disco)',
    family: "'Righteous', cursive",
    category: 'display',
    previewText: 'PACIFIC SOUND',
  },
  {
    id: 'permanent_marker',
    name: 'Permanent Marker (Graffiti / Grunge)',
    family: "'Permanent Marker', cursive",
    category: 'vintage',
    previewText: 'UNDERGROUND',
  },
  {
    id: 'pacifico',
    name: 'Pacifico (Retro Surf Script)',
    family: "'Pacifico', cursive",
    category: 'script',
    previewText: 'Endless Summer',
  },
  {
    id: 'dancing_script',
    name: 'Dancing Script (Handwritten Cursive)',
    family: "'Dancing Script', cursive",
    category: 'script',
    previewText: 'Customized Vibe',
  },
  {
    id: 'cinzel',
    name: 'Cinzel (Luxury Roman Serif)',
    family: "'Cinzel', serif",
    category: 'minimal',
    previewText: 'HERITAGE MMXXIV',
  },
  {
    id: 'playfair',
    name: 'Playfair Display (Vogue Editorial)',
    family: "'Playfair Display', serif",
    category: 'minimal',
    previewText: 'High Fashion',
  },
  {
    id: 'press_start',
    name: 'Press Start (8-Bit Arcade Y2K)',
    family: "'Press Start 2P', cursive",
    category: 'display',
    previewText: 'GAME OVER',
  },
];

export const TEXT_COLOR_PALETTES = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Pitch Black', hex: '#000000' },
  { name: 'Flame Amber', hex: '#F59E0B' },
  { name: 'Crimson Red', hex: '#EF4444' },
  { name: 'Cyber Neon Cyan', hex: '#06B6D4' },
  { name: 'Harajuku Pink', hex: '#EC4899' },
  { name: 'Vintage Cream', hex: '#F5EEDC' },
  { name: 'Forest Moss', hex: '#10B981' },
  { name: 'Royal Gold', hex: '#EAB308' },
  { name: 'Deep Lavender', hex: '#8B5CF6' },
  { name: 'Charcoal Smoke', hex: '#374151' },
  { name: 'Warm Terracotta', hex: '#D97706' },
];

export const QUICK_TEXT_TEMPLATES = [
  { text: 'TOKYO NIGHTS', font: "'Bebas Neue', sans-serif", effect: 'curved' as const },
  { text: 'VINTAGE 1994', font: "'Oswald', sans-serif", effect: 'vintage_distressed' as const },
  { text: 'LIMITED EDITION', font: "'Syne', sans-serif", effect: 'outline' as const },
  { text: 'Original Sound', font: "'Pacifico', cursive", effect: 'shadow' as const },
  { text: 'NO BAD DAYS', font: "'Permanent Marker', cursive", effect: 'none' as const },
  { text: 'CYBERPUNK 2088', font: "'Press Start 2P', cursive", effect: 'neon_glow' as const },
];
