
import React, { useState, useEffect } from 'react';
import type { Album, SubscriptionPlan, AlbumColorTheme, FAQItem, Testimonial } from '../types';
import { SpotifyIcon } from './icons/SocialIcons';
import TestimonialsCarousel from './TestimonialsCarousel';

// --- EPAYCO CONFIGURATION ---
// Llave Pública proporcionada por el usuario
const EPAYCO_PUBLIC_KEY = '33f7e5111dee3da701fc8a078bb7288c'; 

interface AlbumDetailPageProps {
  album: Album;
  testimonials: Testimonial[];
  onBack: () => void;
}

interface SubscriptionOptionCardProps {
    plan: SubscriptionPlan;
    theme: AlbumColorTheme;
    albumName: string;
    onEpaycoCheckout: (plan: SubscriptionPlan) => void;
    onContact: (plan: SubscriptionPlan) => void;
}

// V2 Component to bust Vercel/Browser cache issues
const SubscriptionOptionCardV2: React.FC<SubscriptionOptionCardProps> = ({ plan, theme, albumName, onEpaycoCheckout, onContact }) => {
    
    return (
    <div className={`relative flex flex-col bg-[#111] p-6 rounded-lg border transition-all duration-300 hover:scale-105 ${plan.popular ? theme.borderClass : 'border-gray-800'} ${plan.popular ? theme.neonGlowClass : ''}`}>
        {plan.popular && (
            <span className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-bl-lg rounded-tr-lg">
                Popular
            </span>
        )}
        <h3 className="font-anton text-2xl mb-2 text-white">{plan.plan}</h3>
        <p className={`font-anton text-4xl my-4 ${theme.accentTextClass}`}>{plan.price}</p>
        <p className="text-gray-400 mb-6">{plan.duration}</p>
        
        <div className="mt-auto flex flex-col gap-3">
            <button 
                onClick={() => onEpaycoCheckout(plan)}
                id={`plan-pay-${plan.plan.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center justify-center w-full font-bold uppercase tracking-widest py-3 px-6 rounded-md transition-all duration-300 ${theme.buttonClasses}`}
            >
                {/* Credit Card Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pagar en Línea
            </button>
            <button 
                onClick={() => onContact(plan)}
                id={`plan-contact-${plan.plan.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center justify-center w-full font-bold uppercase tracking-widest py-3 px-6 rounded-md transition-all duration-300 border-2 bg-transparent hover:bg-white hover:text-black text-white"
                style={{ borderColor: theme.hex }}
            >
                {/* Envelope Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contactar Asesor
            </button>
        </div>
    </div>
)};

const FAQAccordion: React.FC<{ faqs: FAQItem[]; theme: AlbumColorTheme }> = ({ faqs, theme }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-[#111] border border-gray-800 rounded-lg overflow-hidden transition-all duration-300">
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex justify-between items-center text-left p-6 hover:bg-white/5 focus:outline-none"
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
          >
            <span className="text-lg font-semibold text-white">{faq.pregunta}</span>
            <span className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-45' : 'rotate-0'}`} style={{ color: theme.hex }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </button>
          <div
            id={`faq-answer-${index}`}
            className="grid transition-all duration-500 ease-in-out"
            style={{ gridTemplateRows: openIndex === index ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
                <div className="px-6 pb-6 text-gray-300 leading-relaxed border-t border-gray-800 pt-4">
                  <p className="whitespace-pre-wrap">{faq.respuesta}</p>
                </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


const AlbumDetailPage: React.FC<AlbumDetailPageProps> = ({ album, testimonials, onBack }) => {
  const theme = album.colorTheme;
  const [activeTrackUrl, setActiveTrackUrl] = useState<string | null>(null);
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);
  
  // AGGRESSIVE CACHE BUSTING LOGIC
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
        // If user navigated back (persisted) OR if we marked the session as 'dirty' (needs_reload)
        if (event.persisted || sessionStorage.getItem('force_reload_on_back') === 'true') {
            // Clear the flag so we don't infinite loop
            sessionStorage.removeItem('force_reload_on_back');
            // Force a hard reload from server
            window.location.reload();
        }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const getSpotifyEmbedUrl = (url: string | null): string | undefined => {
    if (!url) return undefined;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'open.spotify.com' && urlObj.pathname.includes('/track/')) {
        const pathParts = urlObj.pathname.split('/');
        const trackIndex = pathParts.findIndex(part => part === 'track');
        if (trackIndex !== -1 && pathParts.length > trackIndex + 1) {
            const trackId = pathParts[trackIndex + 1].split('?')[0]; // Clean query params
            return `https://open.spotify.com/embed/track/${trackId}`;
        }
      }
    } catch (e) {
      console.error("Invalid Spotify URL provided:", url);
    }
    return undefined;
  };

  const spotifyEmbedUrl = getSpotifyEmbedUrl(activeTrackUrl);
  
  const handleTrackSelect = (url: string) => {
    setIsPlayerLoading(true);
    setActiveTrackUrl(url);
  };

  // --- MANEJO DE CONTACTO MANUAL (MAILTO) ---
  const handleContact = (plan: SubscriptionPlan) => {
      const mailtoEmail = 'mikmusic2356@gmail.com';
      const subject = encodeURIComponent(`Interés en Suscripción: ${album.name} - ${plan.plan}`);
      const body = encodeURIComponent(`Hola,\n\nEstoy interesado/a en el plan "${plan.plan}" del álbum "${album.name}".\n\nPor favor, indíquenme los siguientes pasos para adquirirlo.\n\nGracias.`);
      window.location.href = `mailto:${mailtoEmail}?subject=${subject}&body=${body}`;
  };

  // --- EPAYCO CHECKOUT LOGIC ---
  const handleEpaycoCheckout = (plan: SubscriptionPlan) => {
      // Set flag for aggressive reload on return
      sessionStorage.setItem('force_reload_on_back', 'true');

      const priceString = plan.price.toUpperCase();
      
      // 1. Detectar Moneda
      let currency = "usd";
      if (priceString.includes("COP") || priceString.includes("PESO")) {
          currency = "cop";
      }

      // 2. Limpiar el precio
      let cleanPriceString = plan.price.replace(/[^0-9.]/g, '');
      if (currency === 'cop' && cleanPriceString.includes('.') && cleanPriceString.split('.')[1].length === 3) {
           cleanPriceString = cleanPriceString.replace(/\./g, '');
      }
      const amount = parseFloat(cleanPriceString);
      
      if (isNaN(amount) || amount === 0) {
          alert("Este plan no tiene un precio automático. Por favor usa el botón de 'Contactar Asesor'.");
          handleContact(plan);
          return;
      }

      // 3. Cargar ePayco Dinámicamente si no existe
      const startCheckout = () => {
           const ePayco = (window as any).ePayco;
           if (!ePayco) {
              alert("Error cargando la pasarela. Por favor intenta de nuevo o usa el botón de contacto.");
              return;
           }

           const handler = ePayco.checkout.configure({
              key: EPAYCO_PUBLIC_KEY,
              test: false
           });

           const data = {
              name: `${album.name} - ${plan.plan}`,
              description: `${album.name} - Plan ${plan.plan} (${plan.duration})`,
              invoice: `MIK-${album.id}-${Date.now().toString().slice(-6)}`,
              currency: currency,
              amount: amount.toString(),
              tax_base: "0",
              tax: "0",
              country: "co",
              lang: "es",
              external: "true",
              methodsDisable: []
           };

           handler.open(data);
      };

      if (!(window as any).ePayco) {
          // Intentar recargar el script si se perdió por navegación
          const script = document.createElement('script');
          script.src = 'https://checkout.epayco.co/checkout.js';
          script.async = true;
          script.onload = () => startCheckout();
          document.body.appendChild(script);
      } else {
          startCheckout();
      }
  };

  return (
    <div className="relative bg-[#0a0a0a] text-white min-h-screen overflow-hidden">
       <div 
        className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${theme.hex}40, transparent 70%)`}}
      ></div>

      <div className="relative z-10 container mx-auto px-6 py-24 md:py-32">
        <button onClick={onBack} className={`${theme.accentTextClass} uppercase tracking-widest hover:underline mb-12 inline-block`}>
          ← Volver al catálogo de beats
        </button>

        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-anton" style={{ color: theme.hex }}>
            Oferta de Suscripción – {album.name}
          </h1>
        </header>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-20 max-w-6xl mx-auto">
          <div className={`w-full md:w-1/3 max-w-sm rounded-lg p-1 ${theme.neonGlowClass}`}>
            <img src={album.coverArtUrl} alt={`Cover art for ${album.name}`} className="rounded-lg shadow-2xl shadow-black/40 w-full aspect-square object-cover" />
          </div>
          <div className="w-full md:w-2/3">
            <div className="border-l-4 pl-6 space-y-3 text-lg" style={{ borderColor: theme.hex }}>
              <p className="text-gray-300"><strong className="font-semibold text-white">Álbum:</strong> {album.name}</p>
              <p className="text-gray-300"><strong className="font-semibold text-white">Sello:</strong> {album.label}</p>
              {album.genre && <p className="text-gray-300"><strong className="font-semibold text-white">Género:</strong> {album.genre}</p>}
              {album.volume && <p className="text-gray-300"><strong className="font-semibold text-white">Volumen:</strong> {album.volume}</p>}
              {album.subscriptionTypes && album.subscriptionTypes.length > 0 && <p className="text-gray-300"><strong className="font-semibold text-white">Tipos de Suscripción:</strong> {album.subscriptionTypes.join(', ')}</p>}
              {album.emotion && album.emotion.length > 0 && <p className="text-gray-300"><strong className="font-semibold text-white">Emociones:</strong> {album.emotion.join(', ')}</p>}
              <p className="text-gray-300"><strong className="font-semibold text-white">Cantidad de pistas:</strong> {album.trackCount}</p>
              <p className="text-gray-300"><strong className="font-semibold text-white">Creado:</strong> {album.creationDate}</p>
            </div>
            {album.spotifyUrl && (
              <a
                href={album.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-8 inline-flex items-center gap-3 font-bold uppercase tracking-widest py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105 ${theme.buttonClasses}`}
              >
                <SpotifyIcon className="w-6 h-6" />
                <span>Escuchar en Spotify</span>
              </a>
            )}
          </div>
        </div>
        
        <section id="pricing" className="mb-20">
            <h2 className="text-3xl md:text-4xl font-anton mb-12 text-center" style={{ color: theme.hex }}>
                Planes de suscripción y precios
            </h2>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {album.plans.map((plan, index) => (
                    <SubscriptionOptionCardV2 
                        key={index} 
                        plan={plan} 
                        theme={theme} 
                        albumName={album.name}
                        onEpaycoCheckout={handleEpaycoCheckout}
                        onContact={handleContact}
                    />
                ))}
            </div>
        </section>

        <div className="grid md:grid-cols-2 gap-16 max-w-7xl mx-auto">
            <section id="tracklist">
              <h2 className="text-3xl md:text-4xl font-anton mb-8 text-center" style={{ color: theme.hex }}>
                Lista de canciones
              </h2>
              <div className="bg-[#111] p-6 sm:p-8 rounded-lg border border-gray-800 h-full">
                <ol className="text-gray-200 space-y-4">
                  {album.tracks.map((track, index) => {
                    const isCurrentlyActive = activeTrackUrl === track.spotifyTrackUrl;
                    const canPlay = !!track.spotifyTrackUrl;
                    
                    return (
                      <li key={index} className={`flex justify-between items-center text-base sm:text-lg border-b border-gray-800 pb-2 last:border-b-0 last:pb-0 transition-colors duration-300 ${isCurrentlyActive ? 'bg-white/5' : ''}`}>
                        <span className="flex items-center gap-4">
                          {canPlay ? (
                            <button onClick={() => handleTrackSelect(track.spotifyTrackUrl!)} className={`${theme.accentTextClass} p-2 rounded-full hover:bg-white/10`}>
                               <SpotifyIcon className="w-5 h-5" />
                            </button>
                          ) : (
                            <div className="w-9 h-9 flex-shrink-0"></div> // Placeholder for alignment
                          )}
                          <span className={`font-mono ${isCurrentlyActive ? theme.accentTextClass : 'text-gray-500'}`}>{String(index + 1).padStart(2, '0')}</span>
                          <span className={isCurrentlyActive ? 'text-white' : ''}>{track.name}</span>
                        </span>
                        <span className="text-gray-400 font-mono">{track.duration}</span>
                      </li>
                    );
                  })}
                </ol>
                <div id="preview-player" className="mt-6">
                  {spotifyEmbedUrl ? (
                    <>
                      {isPlayerLoading && (
                        <div className="flex items-center justify-center h-20 bg-black/30 rounded-lg border border-gray-800/50 text-gray-500">
                           <p>Cargando reproductor...</p>
                        </div>
                      )}
                      <iframe
                        key={spotifyEmbedUrl}
                        title="Spotify Preview Player"
                        src={spotifyEmbedUrl}
                        width="100%"
                        height="80"
                        frameBorder="0"
                        allow="encrypted-media"
                        onLoad={() => setIsPlayerLoading(false)}
                        className={`rounded-lg shadow-lg ${isPlayerLoading ? 'hidden' : 'block'}`}
                      ></iframe>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-20 bg-black/30 rounded-lg border border-gray-800/50 text-gray-500">
                      <p>Selecciona una canción para escuchar una muestra.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section id="benefits">
              <h2 className="text-3xl md:text-4xl font-anton mb-8 text-center" style={{ color: theme.hex }}>
                Beneficios de la suscripción
              </h2>
              <div className="space-y-4 h-full">
                {album.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors duration-300">
                    <svg className={`w-6 h-6 mr-4 ${theme.accentTextClass} flex-shrink-0 mt-1`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
            </section>
        </div>
        
        {album.preguntasFrecuentes && album.preguntasFrecuentes.length > 0 && (
          <section id="faq" className="mt-20 pt-16 border-t" style={{ borderColor: `${theme.hex}20` }}>
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-anton mb-12 text-center" style={{ color: theme.hex }}>
                Preguntas Frecuentes
              </h2>
              <FAQAccordion faqs={album.preguntasFrecuentes} theme={theme} />
            </div>
          </section>
        )}

        <section id="testimonials" className="mt-20 pt-16 border-t" style={{ borderColor: `${theme.hex}20` }}>
            <div className="max-w-5xl mx-auto">
                 <h2 className="text-3xl md:text-4xl font-anton mb-12 text-center" style={{ color: theme.hex }}>
                    Lo que dicen nuestros creadores
                </h2>
                <TestimonialsCarousel testimonials={testimonials} theme={theme} />
            </div>
        </section>

        {album.cta && (
          <section id="cta" className="mt-20 pt-16 border-t" style={{ borderColor: `${theme.hex}20` }}>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-anton mb-6" style={{ color: theme.hex }}>
                Un Último Paso Hacia la Grandeza
              </h2>
              {/* Using whitespace-pre-wrap to respect line breaks from Contentful */}
              <div className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
                {album.cta}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default AlbumDetailPage;
