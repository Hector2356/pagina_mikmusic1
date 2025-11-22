
import type { Entry, Asset } from 'contentful';
import type { Album, Service, SubscriptionPlan, Track, FAQItem, Release, Testimonial, MikUniverseService, MikaiRelease } from '../types';
import { THEME_MAP, SERVICE_THEME_MAP } from './colorThemes';
import { getSafeField, getSafeAssetUrl, richTextToString } from './contentfulUtils';
import { FALLBACK_AVATARS } from '../constants';

/**
 * Generates a consistent, pseudo-random avatar from a fallback list based on a unique ID.
 * @param id - The unique identifier (e.g., Contentful entry ID).
 * @returns A URL for a fallback avatar image.
 */
const getFallbackAvatar = (id: string): string => {
  // A simple hashing function to get a consistent index
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % FALLBACK_AVATARS.length;
  return FALLBACK_AVATARS[index];
};


export const mapContentfulEntryToAlbum = (entry: Entry<any>): Album => {
    const { fields, sys } = entry;

    const rawDate = getSafeField<string>(fields, 'fechaDeCreacion', sys.createdAt);
    const creationDate = new Date(rawDate).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    
    const themeKey = getSafeField<string>(fields, 'colorDeAcento', 'default').toLowerCase();
    
    const faqsField = getSafeField<any[]>(fields, 'preguntasFrecuentes', []);
    const preguntasFrecuentes = (Array.isArray(faqsField) ? faqsField : [])
        .filter(faq => faq && faq.pregunta) // Filter out invalid entries
        .map((faq: any): FAQItem => ({
            pregunta: faq.pregunta,
            respuesta: faq.respuesta ?? 'Respuesta no disponible',
        }));

    // Correctly parse the nested plans object from Contentful
    const plansField = getSafeField<any>(fields, 'planesDeSuscripcin', { plans: [] });
    const plansArray = (plansField && Array.isArray(plansField.plans)) ? plansField.plans : [];
    
    const plans = plansArray.map((plan: any): SubscriptionPlan => {
        let priceDisplay = 'Consultar';
        
        // ROBUST PRICE HANDLING:
        // Contentful might send a number (10) or a string ("10 USD").
        // We ensure it is always formatted as a string with currency for the UI.
        if (plan?.price !== undefined && plan?.price !== null) {
            const rawPrice = String(plan.price);
            // If it already has letters (USD, COP), keep it. If it's just numbers, add USD.
            priceDisplay = rawPrice.match(/[a-zA-Z]/) 
                ? rawPrice 
                : `${rawPrice} USD`;
        }

        return {
            plan: plan?.type ?? 'Plan Desconocido',
            price: priceDisplay,
            duration: plan?.period ?? 'N/A',
            popular: plan?.bestValue ?? false,
            paymentUrl: plan?.paymentUrl ?? null,
        };
    });

    const tracksField = getSafeField<any[]>(fields, 'listaDeCanciones', []);
    const tracks = (Array.isArray(tracksField) ? tracksField : []).map((track: any): Track => ({
        name: track?.title ?? 'Pista Desconocida',
        duration: track?.duration ?? '0:00',
        spotifyTrackUrl: track?.spotifyTrackUrl ?? null,
    }));

    const subscriptionTypes = plans.map(p => p.plan).filter(Boolean);
    
    const name = getSafeField<string>(fields, 'ttuloDelAlbum', 'Sin Título');
    // FIX: Cast asset field to Asset | undefined to match expected type.
    let coverArtUrl = getSafeAssetUrl(fields.portada as Asset | undefined);

    // Specific override for the "Dark Realms" album as requested visually by the user.
    if (name.includes('Dark Realms') && !fields.portada) {
         coverArtUrl = 'https://i.imgur.com/z4g7xmf.png';
    }


    return {
        id: sys.id,
        name: name,
        description: getSafeField<string>(fields, 'descripcionOferta', 'Sin Descripción'),
        coverArtUrl: coverArtUrl,
        spotifyUrl: getSafeField<string | null>(fields, 'linkDeSpotify', null),
        label: getSafeField<string>(fields, 'sello', 'MIK MUSIC'),
        genre: getSafeField<string | null>(fields, 'generoMusical', null),
        volume: getSafeField<string | null>(fields, 'formato', null),
        subscriptionTypes: subscriptionTypes,
        emotion: getSafeField<string[] | null>(fields, 'emocion', []),
        trackCount: getSafeField<number>(fields, 'numeroDePistas', 0),
        creationDate: creationDate,
        rawCreationDate: rawDate,
        tracks: tracks,
        plans: plans,
        benefits: getSafeField<string[]>(fields, 'beneficios', []),
        preguntasFrecuentes: preguntasFrecuentes,
        cta: getSafeField<string | null>(fields, 'ctaLlamadoALaAccin', null),
        colorTheme: THEME_MAP[themeKey] || THEME_MAP.default,
    };
};

export const mapContentfulEntryToService = (entry: Entry<any>): Service => {
    const { fields, sys } = entry;

    const themeKey = getSafeField<string>(fields, 'colorDelTema', 'default').toLowerCase();

    return {
        id: sys.id,
        title: getSafeField<string>(fields, 'ttuloDelServicio', 'Servicio sin título'),
        tagline: getSafeField<string>(fields, 'taglineLema', ''),
        price: getSafeField<string>(fields, 'precio', 'Consultar'),
        features: getSafeField<string[]>(fields, 'caracteristicas', []),
        popular: getSafeField<boolean>(fields, 'esPopular', false),
        colorClass: SERVICE_THEME_MAP[themeKey] || SERVICE_THEME_MAP.default,
        // FIX: Cast asset field to Asset | undefined to match expected type.
        imageUrl: getSafeAssetUrl(fields.imagen as Asset | undefined),
        purchaseUrl: getSafeField<string | undefined>(fields, 'linkDeCompra', undefined),
    };
};

export const mapContentfulEntryToRelease = (entry: Entry<any>): Release => {
    const { fields } = entry;
    return {
        // FIX: Cast asset field to Asset | undefined to match expected type.
        artworkUrl: getSafeAssetUrl(fields.artwork as Asset | undefined),
        title: getSafeField<string>(fields, 'title', 'Sin Título'),
        artist: getSafeField<string>(fields, 'artist', 'Artista Desconocido'),
        spotifyUrl: getSafeField<string>(fields, 'spotifyUrl', '#'),
        youtubeUrl: getSafeField<string>(fields, 'youTubeUrl', '#'),
        instagramUrl: getSafeField<string>(fields, 'instagramUrl', '#'),
    };
};

export const mapContentfulEntryToMikaiRelease = (entry: Entry<any>): MikaiRelease => {
    const { fields } = entry;
    // Map fields based on the JSON preview provided for 'lanzamientoMikai'
    return {
        title: getSafeField<string>(fields, 'titulo', ''), // JSON ID: titulo
        spotifyUrl: getSafeField<string>(fields, 'spotifyUrl', ''), // JSON ID: spotifyUrl
        artworkUrl: getSafeAssetUrl(fields.artwork as Asset | undefined), // JSON ID: artwork
        description: getSafeField<string>(fields, 'descripcion', ''), // JSON ID: descripcion
    };
};

export const mapContentfulEntryToTestimonial = (entry: Entry<any>): Testimonial => {
    const { fields, sys } = entry;
    
    let avatarUrl = getSafeAssetUrl(fields.avatarUrl as Asset | undefined);

    if (avatarUrl.includes('placehold.co')) {
        avatarUrl = getFallbackAvatar(sys.id);
    }

    return {
        id: sys.id,
        name: getSafeField<string>(fields, 'name', 'Anónimo'),
        avatarUrl: avatarUrl,
        rating: getSafeField<number>(fields, 'rating', 5),
        comment_es: richTextToString(getSafeField<any>(fields, 'commentEs', null)),
        comment_en: richTextToString(getSafeField<any>(fields, 'commentEn', null)),
    };
};

export const mapContentfulEntryToMikUniverseService = (entry: Entry<any>): MikUniverseService => {
    const { fields, sys } = entry;
    return {
        id: sys.id,
        title: getSafeField<string>(fields, 'titulo', 'Servicio Exclusivo'),
        description: getSafeField<string>(fields, 'descripcion', ''),
        price: getSafeField<number>(fields, 'precio', 0),
        // FIX: Cast asset field to Asset | undefined to match expected type.
        backgroundImageUrl: getSafeAssetUrl(fields.imagenDeFondo as Asset | undefined),
        ctaText: getSafeField<string>(fields, 'ctaTexto', 'Comprar'),
        ctaLink: getSafeField<string>(fields, 'ctaLink', '#'),
        currency: getSafeField<string>(fields, 'divisa', 'USD'),
    };
};
