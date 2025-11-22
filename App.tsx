
import React, { useState, useEffect } from 'react';

// Components
import Loader from './components/Loader';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import BeatsSection from './components/BeatsSection';
import ArtistSection from './components/ArtistSection';
import LicensingSection from './components/LicensingSection';
import NewArtistSection from './components/NewArtistSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import CatalogPage from './components/CatalogPage';
import AlbumDetailPage from './components/AlbumDetailPage';
import ServicesListPage from './components/ServicesListPage';
import MikUniversePage from './components/MikUniversePage';
import DiscountModal from './components/DiscountModal';
import ThankYouPage from './components/ThankYouPage';

// Services and Types
import { initClient, fetchAllData } from './services/contentfulService';
import type { Album, Service, Release, Testimonial, MikUniverseService, MikaiRelease } from './types';

// --- Contentful API Keys ---
const CONTENTFUL_SPACE_ID = 'x89oyftevv1f';
const CONTENTFUL_ACCESS_TOKEN = 'glb0_eY7fy2_YFoKaDhxb7v3j08WTvuopy6Wy5ybm1M';

interface AppData {
  albums: Album[];
  services: Service[];
  latestRelease: Release | null;
  testimonials: Testimonial[];
  mikUniverseServices: MikUniverseService[];
  mikaiRelease: MikaiRelease | null;
}

type View = 'home' | 'catalog' | 'albumDetail' | 'services' | 'universe' | 'thankYou';

const HomePage: React.FC<{
    appData: AppData;
    onNavigateToCatalog: () => void;
    onNavigateToServices: () => void;
    onNavigateToUniverse: () => void;
}> = ({ appData, onNavigateToCatalog, onNavigateToServices, onNavigateToUniverse }) => (
    <>
        <HeroSection onNavigateToCatalog={onNavigateToCatalog} onNavigateToUniverse={onNavigateToUniverse} />
        <ServicesSection onNavigateToServices={onNavigateToServices} />
        <BeatsSection onNavigateToCatalog={onNavigateToCatalog} />
        {appData.latestRelease && <ArtistSection release={appData.latestRelease} />}
        <LicensingSection onNavigateToCatalog={onNavigateToCatalog} />
        <NewArtistSection release={appData.latestRelease} />
        <ContactSection />
    </>
);

const App: React.FC = () => {
    // Helper to determine initial state from URL
    const getViewFromPath = (): { view: View, albumId: string | null } => {
        const path = window.location.pathname;
        if (path === '/catalogo') return { view: 'catalog', albumId: null };
        if (path === '/servicios') return { view: 'services', albumId: null };
        if (path === '/universo-mikai') return { view: 'universe', albumId: null };
        if (path.startsWith('/album/')) return { view: 'albumDetail', albumId: path.split('/album/')[1] };
        // Keep home as default
        return { view: 'home', albumId: null };
    };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appData, setAppData] = useState<AppData | null>(null);
    
    // Initialize state based on current URL
    const initialState = getViewFromPath();
    const [currentView, setCurrentView] = useState<View>(initialState.view);
    const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(initialState.albumId);
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        initClient(CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN);

        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchAllData();
                if (data.albums.length === 0 && data.services.length === 0 && !data.latestRelease) {
                    setError('Connection successful, but no content was found. Please ensure you have created and **published** at least one entry for each content type in your Contentful space.');
                } else {
                    setAppData(data);
                }
            } catch (err) {
                console.error(err);
                setError('A critical error occurred while fetching data. Please check the browser console for details.');
            } finally {
                setLoading(false);
            }
        };

        loadData();

        // Check for payment redirect
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get('ref_payco')) {
            setCurrentView('thankYou');
        } else if (initialState.view === 'home') {
            // Show modal only on home and if not returning from payment
             const timer = setTimeout(() => {
                setIsModalOpen(true);
            }, 500); 
            return () => clearTimeout(timer);
        }
        
        // Handle Browser Back/Forward Buttons
        const handlePopState = () => {
             const queryParams = new URLSearchParams(window.location.search);
             if (queryParams.get('ref_payco')) {
                 setCurrentView('thankYou');
             } else {
                 const { view, albumId } = getViewFromPath();
                 setCurrentView(view);
                 setSelectedAlbumId(albumId);
             }
        };
        window.addEventListener('popstate', handlePopState);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // --- ROUTING HELPER ---
    const navigateWithUrl = (view: View, albumId: string | null = null) => {
        setCurrentView(view);
        if (albumId) setSelectedAlbumId(albumId);

        let path = '/';
        switch (view) {
            case 'catalog': path = '/catalogo'; break;
            case 'services': path = '/servicios'; break;
            case 'universe': path = '/universo-mikai'; break;
            case 'albumDetail': path = albumId ? `/album/${albumId}` : '/catalogo'; break;
            case 'home': path = '/'; break;
            default: path = '/';
        }

        // Push to history if path is different and not 'thankYou' (which uses query params)
        if (view !== 'thankYou' && window.location.pathname !== path) {
            window.history.pushState(null, '', path);
        }
        
        window.scrollTo(0, 0);
        
        // Clean URL query params if navigating away from Thank You page
        if (window.location.search.includes('ref_payco')) {
             // Use replaceState to just clean the query string but keep the new path
             const newUrl = window.location.protocol + "//" + window.location.host + path;
             window.history.replaceState(null, '', newUrl);
        }
    };

    // Navigation handlers wrappers
    const handleNavigateToHome = () => navigateWithUrl('home');
    const handleNavigateToCatalog = () => navigateWithUrl('catalog');
    const handleNavigateToServices = () => navigateWithUrl('services');
    const handleNavigateToUniverse = () => navigateWithUrl('universe');

    const handleSelectAlbum = (albumId: string) => {
        if (albumId === 'catalog_redirect') {
            navigateWithUrl('catalog');
            return;
        }
        navigateWithUrl('albumDetail', albumId);
    };

    // Modal handlers
    const closeModal = () => setIsModalOpen(false);
    const handleModalCtaClick = () => {
      closeModal();
      navigateWithUrl('catalog');
    };

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center text-center p-6">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Connection Notice</h1>
                <p className="text-gray-300 max-w-2xl leading-relaxed" dangerouslySetInnerHTML={{ __html: error.replace(/\*\*(.*?)\*\*/g, '<strong class="text-yellow-400">$1</strong>') }} />
            </div>
        );
    }

    if (!appData) return <div className="bg-black text-white min-h-screen flex items-center justify-center">No data was loaded.</div>;
    
    const selectedAlbum = appData.albums.find(album => album.id === selectedAlbumId);

    return (
        <div className="bg-black text-white font-sans">
            <Header
                onNavigateToHome={handleNavigateToHome}
                onNavigateToCatalog={handleNavigateToCatalog}
                onNavigateToServices={handleNavigateToServices}
                onNavigateToUniverse={handleNavigateToUniverse}
            />
            <main>
                {currentView === 'home' && (
                    <HomePage
                        appData={appData}
                        onNavigateToCatalog={handleNavigateToCatalog}
                        onNavigateToServices={handleNavigateToServices}
                        onNavigateToUniverse={handleNavigateToUniverse}
                    />
                )}
                {currentView === 'catalog' && (
                    <CatalogPage
                        albums={appData.albums}
                        onSelectAlbum={handleSelectAlbum}
                        onBack={handleNavigateToHome}
                    />
                )}
                {currentView === 'albumDetail' && selectedAlbum && (
                    <AlbumDetailPage
                        album={selectedAlbum}
                        testimonials={appData.testimonials}
                        onBack={handleNavigateToCatalog}
                    />
                )}
                 {currentView === 'services' && (
                    <ServicesListPage
                        services={appData.services}
                        onBack={handleNavigateToHome}
                    />
                )}
                 {currentView === 'universe' && (
                    <MikUniversePage
                        mikaiRelease={appData.mikaiRelease}
                        mikUniverseServices={appData.mikUniverseServices}
                        onBack={handleNavigateToHome}
                    />
                )}
                {currentView === 'thankYou' && (
                    <ThankYouPage
                        albums={appData.albums}
                        onNavigateToAlbum={handleSelectAlbum}
                        onBackToHome={handleNavigateToHome}
                    />
                )}
            </main>
            {(currentView === 'home' || currentView === 'thankYou') && <Footer />}

            {currentView === 'home' && !isModalOpen && (
              <DiscountModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onCtaClick={handleModalCtaClick}
              />
            )}
        </div>
    );
};

export default App;
