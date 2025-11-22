
// FIX: Populated the file with type definitions used throughout the application.
export interface AlbumColorTheme {
  hex: string;
  neonGlowClass: string;
  borderClass: string;
  buttonClasses: string;
  accentTextClass: string;
}

export interface SubscriptionPlan {
  plan: string;
  price: string;
  duration: string;
  popular: boolean;
  paymentUrl: string | null;
}

export interface Track {
  name: string;
  duration: string;
  spotifyTrackUrl: string | null;
}

export interface FAQItem {
  pregunta: string;
  respuesta: string;
}

export interface Album {
  id: string;
  name: string;
  description: string;
  coverArtUrl: string;
  spotifyUrl: string | null;
  label: string;
  genre: string | null;
  volume: string | null;
  subscriptionTypes: string[] | null;
  emotion: string[] | null;
  trackCount: number;
  creationDate: string;
  rawCreationDate: string; // Keep the original date string for sorting
  tracks: Track[];
  plans: SubscriptionPlan[];
  benefits: string[];
  preguntasFrecuentes: FAQItem[];
  cta: string | null;
  colorTheme: AlbumColorTheme;
}

export interface ServiceColorClass {
  button: string;
  buttonText: string;
  shadow: string;
  bgColor: string;
  checkColor: string;
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  price: string;
  features: string[];
  popular: boolean;
  colorClass: ServiceColorClass;
  imageUrl?: string;
  purchaseUrl?: string;
}

export interface Release {
  artworkUrl: string;
  title: string;
  artist: string;
  spotifyUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
}

export interface MikaiRelease {
    title: string;
    spotifyUrl: string;
    artworkUrl: string;
    description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  comment_es: string;
  comment_en: string;
}

export interface MikUniverseService {
  id: string;
  title: string;
  description: string;
  price: number;
  backgroundImageUrl: string;
  ctaText: string;
  ctaLink: string;
  currency: string;
}