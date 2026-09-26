export type GarmentType = 'heavyweight_oversized' | 'classic_crew' | 'vintage_acid_wash' | 'organic_bamboo';

export interface GarmentConfig {
  id: GarmentType;
  name: string;
  weightGsm: number;
  composition: string;
  fit: string;
  basePrice: number;
  description: string;
  availableSizes: string[];
}

export interface GarmentColor {
  id: string;
  name: string;
  hex: string;
  pantone: string;
  textColor: 'light' | 'dark';
}

export type PrintPlacement = 'front_center' | 'front_chest_left' | 'back_oversized' | 'back_center';

export type GraphicShape = 'fluid' | 'organic_soft' | 'die_cut' | 'grunge_weathered' | 'natural';

export interface CustomTextLayer {
  enabled: boolean;
  text: string;
  fontFamily: string;
  fontSize: number;          // 14 - 64
  color: string;             // hex color
  letterSpacing: number;     // 0 - 16
  lineHeight: number;        // 1 - 2
  fontWeight: 'normal' | 'bold' | '900';
  fontStyle: 'normal' | 'italic';
  textTransform: 'none' | 'uppercase' | 'lowercase';
  position: 'above_image' | 'below_image' | 'overlay_center';
  textEffect: 'none' | 'curved' | 'outline' | 'shadow' | 'vintage_distressed' | 'neon_glow';
  strokeColor?: string;
  strokeWidth?: number;
  rotation: number;          // -180 to 180
  offsetX: number;           // -100 to 100
  offsetY: number;           // -100 to 100
}

export interface PrintSettings {
  scale: number;        // 50 - 200
  offsetX: number;      // -50 to 50
  offsetY: number;      // -50 to 50
  rotation: number;     // -180 to 180
  opacity: number;      // 0.2 to 1
  blendMode: 'multiply' | 'screen' | 'overlay' | 'normal' | 'color-dodge';
  printMethod: 'dtg' | 'screen_print' | 'embroidery' | 'puff_print';
  graphicShape: GraphicShape;
  featherEdges: boolean;
  removeBackground: boolean;
  textLayer?: CustomTextLayer;
}

export interface ModelPreset {
  id: string;
  name: string;
  category: 'streetwear' | 'studio' | 'athletic' | 'back';
  gender: 'male' | 'female';
  imageSrc: string;
  printBox: {
    top: number;     // % from top
    left: number;    // % from left
    width: number;   // % width
    height: number;  // % height
  };
  lightingBlend: 'multiply' | 'darken' | 'normal';
}

export interface StylePreset {
  id: string;
  name: string;
  category: string;
  promptSuffix: string;
  sampleThumbnail: string;
  description: string;
}

export interface ArtworkDesign {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  style: string;
  engine: 'gemini' | 'free' | 'preset' | 'upload';
  createdAt: number;
}

export interface SizeBreakdown {
  [size: string]: number;
}

export interface CartItem {
  id: string;
  design: ArtworkDesign;
  garment: GarmentConfig;
  color: GarmentColor;
  placement: PrintPlacement;
  printSettings: PrintSettings;
  isB2B: boolean;
  sizeBreakdown: SizeBreakdown;
  totalQuantity: number;
  unitPrice: number;
  totalPrice: number;
  customNeckLabel?: {
    enabled: boolean;
    brandText: string;
    subText: string;
  };
}

export interface ShippingAddress {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
}

export interface OrderRecord {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  grandTotal: number;
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'b2b_po';
  paymentReference: string;
  status: 'confirmed' | 'pre_press' | 'printing' | 'quality_check' | 'shipped';
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
}
