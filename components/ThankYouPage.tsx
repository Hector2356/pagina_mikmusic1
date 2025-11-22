
import React from 'react';
import type { Album } from '../types';

interface ThankYouPageProps {
  albums: Album[];
  onNavigateToAlbum: (albumId: string) => void;
  onBackToHome: () => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ albums, onNavigateToAlbum, onBackToHome }) => {
  // Get 3 random albums for recommendation, excluding the current one if possible (simplified here)
  // We use a pseudo-random shuffle based on date or just slice for simplicity in this context
  const recommendedAlbums = [...albums]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen flex flex-col relative overflow-hidden">
       {/* Background Effects */}
       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-900/20 to-black pointer-events-none"></div>
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 py-24 relative z-10 flex-grow flex flex-col items-center">
        
        {/* Success Message */}
        <div className="text-center max-w-2xl mx-auto mb-20 animate-fade-in-up">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.6)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-anton uppercase tracking-wide text-white mb-4 text-shadow-lg">
                ¡Gracias por tu compra!
            </h1>
            <p className="text-xl text-gray-300 font-light leading-relaxed">
                Tu transacción se ha procesado. Recibirás un correo electrónico con los detalles de tu pedido y los enlaces de descarga o acceso.
            </p>
            <button 
                onClick={onBackToHome}
                className="mt-8 text-green-400 hover:text-green-300 uppercase tracking-widest font-bold hover:underline transition-all"
            >
                Volver al Inicio
            </button>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-16"></div>

        {/* Recommendations Section */}
        <div className="w-full max-w-6xl animate-fade-in-up animation-delay-300">
            <h2 className="text-3xl md:text-5xl font-anton text-center mb-12">
                <span className="text-mikai-lemon">También te puede interesar...</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recommendedAlbums.map((album) => (
                    <div 
                        key={album.id}
                        className={`group relative bg-[#111] rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-gray-600 hover:scale-105 cursor-pointer`}
                        onClick={() => onNavigateToAlbum(album.id)}
                    >
                        <div className="aspect-square overflow-hidden">
                            <img 
                                src={album.coverArtUrl} 
                                alt={album.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="font-anton text-2xl text-white mb-1 truncate">{album.name}</h3>
                            <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">{album.genre || 'Música'}</p>
                            <button className="w-full bg-white/10 hover:bg-white text-white hover:text-black font-bold uppercase tracking-widest py-3 px-4 rounded text-sm transition-colors">
                                Ver Álbum
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="text-center mt-12">
                <button 
                    onClick={() => onNavigateToAlbum('catalog_redirect')} // Logic handled in parent to go to catalog
                    className="bg-transparent border border-gray-600 text-white hover:border-white font-bold uppercase tracking-widest py-3 px-8 rounded hover:bg-white/5 transition-all duration-300"
                >
                    Ver Catálogo Completo
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
