
import React, { useEffect } from 'react';
import type { Service } from '../types';
import { PaymentIcons } from './icons/PaymentIcons';

// Llave Pública proporcionada por el usuario (Misma que en AlbumDetailPage)
const EPAYCO_PUBLIC_KEY = '33f7e5111dee3da701fc8a078bb7288c';

// V2 Component to bust Vercel/Browser cache issues
const ServiceOfferingCardV2: React.FC<{ service: Service; onEpaycoCheckout: (service: Service) => void; onContact: (service: Service) => void }> = ({ service, onEpaycoCheckout, onContact }) => {
    const { title, tagline, price, features, popular, colorClass, imageUrl } = service;
    
    const isComboRocket = title.includes('Combo Rocket');

    if (isComboRocket) {
        return (
            <div className="relative group flex flex-col bg-gray-900/50 rounded-2xl p-0.5 bg-gradient-to-br from-cyan-400 via-violet-500 to-red-500 transition-all duration-300 hover:scale-105">
                <div className="bg-gray-900 rounded-[14px] flex flex-col flex-grow h-full overflow-hidden">
                    {popular && (
                         <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden z-10">
                            <div className="absolute top-8 right-[-34px] w-full transform rotate-45 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-center font-bold uppercase tracking-wider py-1.5 text-sm shadow-lg">
                                Más Popular
                            </div>
                        </div>
                    )}
                    
                    {imageUrl && (
                        <img src={imageUrl} alt={title} className="w-full h-56 object-cover" />
                    )}

                    <div className="p-8 flex flex-col flex-grow">
                        <h3 className="font-anton text-3xl text-white">{title}</h3>
                        <p className="text-gray-400 mt-2 mb-6">{tagline}</p>
                        <p className="font-anton text-5xl my-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">{price}</p>
                        
                        <ul className="space-y-3 mb-8 text-gray-300">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                    <svg className="w-6 h-6 mr-3 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto flex flex-col gap-3">
                            <button
                                onClick={() => onEpaycoCheckout(service)}
                                className="flex items-center justify-center w-full font-bold uppercase tracking-widest py-4 px-6 rounded-md transition-all duration-300 text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-lg shadow-violet-500/30"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Pagar en Línea
                            </button>
                            <button
                                onClick={() => onContact(service)}
                                className="flex items-center justify-center w-full font-bold uppercase tracking-widest py-4 px-6 rounded-md transition-all duration-300 text-white border border-white/30 hover:bg-white/10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Contactar Asesor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default card styling
    return (
        <div className={`relative flex flex-col bg-gray-900/50 rounded-2xl border border-gray-800 transition-all duration-300 hover:scale-105`}>
             {popular && (
                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden z-10">
                    <div className="absolute top-8 right-[-34px] w-full transform rotate-45 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-center font-bold uppercase tracking-wider py-1.5 text-sm shadow-lg">
                        Más Popular
                    </div>
                </div>
            )}
            
            {imageUrl && (
                <img src={imageUrl} alt={title} className="w-full h-56 object-cover rounded-t-2xl" />
            )}

            <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-anton text-3xl text-white">{title}</h3>
                <p className="text-gray-400 mt-2 mb-6">{tagline}</p>
                <p className="font-anton text-5xl my-4 text-white">{price}</p>
                
                <ul className="space-y-3 mb-8 text-gray-300">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <svg className={`w-6 h-6 mr-3 ${colorClass.checkColor} flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-auto flex flex-col gap-3">
                    <button
                        onClick={() => onEpaycoCheckout(service)}
                        className={`flex items-center justify-center w-full font-bold uppercase tracking-widest py-4 px-6 rounded-md transition-all duration-300 ${colorClass.button} ${colorClass.buttonText} ${colorClass.shadow}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Pagar en Línea
                    </button>
                    <button
                        onClick={() => onContact(service)}
                        className="flex items-center justify-center w-full font-bold uppercase tracking-widest py-4 px-6 rounded-md transition-all duration-300 border border-gray-600 text-gray-300 hover:border-white hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contactar Asesor
                    </button>
                </div>
            </div>
        </div>
    );
};

const StudioSection = () => {
    const mailtoEmail = 'mikmusic2356@gmail.com';
    const subject = encodeURIComponent('Consulta sobre el Estudio de Grabación');
    const body = encodeURIComponent('Hola,\n\nEstoy interesado/a en saber más sobre el estudio y cómo podemos trabajar juntos.\n\nGracias.');
    const contactLink = `mailto:${mailtoEmail}?subject=${subject}&body=${body}`;
    
    return (
     <section id="studio-welcome" className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 rounded-lg overflow-hidden shadow-lg shadow-black/50">
                    <img src="https://i.postimg.cc/Wpf6Gmn9/Whats-App-Image-2025-03-31-at-19-03-34.jpg" alt="MIK MUSIC Studio 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"/>
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg shadow-black/50">
                    <img src="https://i.postimg.cc/YCfCfLjn/estudio.jpg" alt="MIK MUSIC Studio 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"/>
                </div>
                 <div className="rounded-lg overflow-hidden shadow-lg shadow-black/50">
                    <img src="https://i.postimg.cc/R0d9yZsy/Whats-App-Image-2025-11-09-at-23-34-45.jpg" alt="MIK MUSIC Studio 3" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"/>
                </div>
            </div>

            {/* Info */}
            <div className="text-left">
                <h3 className="font-anton text-4xl md:text-5xl">Bienvenido al Lugar Donde Nace Tu Estrella</h3>
                 <div className="w-24 h-1.5 bg-gradient-to-r from-violet-500 to-mikai-red my-6"></div>
                <p className="text-gray-300 leading-relaxed mb-8">
                    Aquí no vienes a un estudio… aquí entras a tu inicio. A ese espacio donde tus ideas se transforman en algo real, grande y con identidad propia. Llevo años creando, mezclando, puliendo y entendiendo lo que hace que una canción se sienta viva, que conecte y que suene “wow”. Y quiero poner todo ese conocimiento a tu servicio.
                    <br/><br/>
                    Entra, vibra, suelta tu sonido… y juntos construimos el camino que te va a llevar a lo más alto. 🚀🔥
                </p>
                {/* CTA Card */}
                 <div className="bg-[#fefe79] border border-black/20 p-6 rounded-lg shadow-lg">
                    <h4 className="text-xl font-bold text-center text-black mb-4">
                       👉 ¿Listo para empezar a sonar como un artista de verdad?
                    </h4>
                    <a 
                      href={contactLink}
                      className="w-full block text-center bg-black text-[#fefe79] font-bold uppercase tracking-widest py-3 px-8 rounded-md hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                    >
                      Hablemos
                    </a>
                </div>
            </div>
        </div>
      </div>
    </section>
)};

const ServicesListPage: React.FC<{ services: Service[], onBack: () => void }> = ({ services, onBack }) => {

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

  // MANEJO DE CONTACTO MANUAL
  const handleContact = (service: Service) => {
        const mailtoEmail = 'mikmusic2356@gmail.com';
        const subject = encodeURIComponent(`Interés en Servicio: ${service.title}`);
        const body = encodeURIComponent(`Hola,\n\nEstoy interesado/a en el servicio "${service.title}".\n\nPor favor, indíquenme los siguientes pasos para contratarlo.\n\nGracias.`);
        window.location.href = `mailto:${mailtoEmail}?subject=${subject}&body=${body}`;
  };

  // MANEJO DE PAGO ONLINE
  const handleServiceCheckout = (service: Service) => {
      // Set flag for aggressive reload on return
      sessionStorage.setItem('force_reload_on_back', 'true');

      const priceString = service.price.toUpperCase();
      
      // 1. Detectar Moneda
      let currency = "usd";
      if (priceString.includes("COP") || priceString.includes("PESO")) {
          currency = "cop";
      }

      // 2. Limpiar el precio
      let cleanPriceString = service.price.replace(/[^0-9.]/g, '');
      if (currency === 'cop' && cleanPriceString.includes('.') && cleanPriceString.split('.')[1].length === 3) {
           cleanPriceString = cleanPriceString.replace(/\./g, '');
      }
      const amount = parseFloat(cleanPriceString);
      
      if (isNaN(amount) || amount === 0) {
          alert("Este servicio no tiene un precio fijo. Por favor usa el botón de 'Contactar Asesor'.");
          handleContact(service);
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
              name: `Servicio: ${service.title}`,
              description: `Contratación de: ${service.title} - ${service.tagline}`,
              invoice: `MIK-SERV-${service.id}-${Date.now().toString().slice(-6)}`,
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
    <div className="relative bg-[#0a0a0a] text-white min-h-screen">
      <div className="absolute top-0 right-0 -translate-y-1/2 w-[150%] h-full bg-gradient-to-l from-green-900/30 via-transparent to-transparent opacity-30 blur-3xl pointer-events-none z-0"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-24 md:py-32">
        <button onClick={onBack} className="text-green-400 uppercase tracking-widest hover:underline mb-12 inline-block">
          ← Volver al inicio
        </button>

        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-anton text-white text-shadow">
            Servicios de Producción Musical
          </h1>
          <p className="text-lg text-gray-400 font-light mt-2 max-w-3xl mx-auto">
            Soluciones completas para artistas, productores y creadores de contenido. Calidad profesional para llevar tu música al siguiente nivel de la industria.
          </p>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
                <ServiceOfferingCardV2 
                    key={service.id} 
                    service={service} 
                    onEpaycoCheckout={handleServiceCheckout}
                    onContact={handleContact}
                />
            ))}
        </div>
        
        <StudioSection />

        <section className="mt-24 text-center">
            <h2 className="text-2xl font-anton text-gray-400 tracking-wider mb-6">Métodos de Pago Aceptados</h2>
            <div className="flex justify-center items-center gap-4 flex-wrap">
                <PaymentIcons />
            </div>
            <p className="text-gray-500 mt-6 text-sm">
                Aceptamos transferencias y pagos a través de las principales plataformas.
            </p>
        </section>

      </div>
    </div>
  );
};

export default ServicesListPage;
