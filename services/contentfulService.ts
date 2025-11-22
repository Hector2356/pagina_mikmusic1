
// FIX: Implemented the Contentful service to fetch and process data from the CMS.
import { createClient, ContentfulClientApi, EntryCollection, Entry } from 'contentful';
import {
  mapContentfulEntryToAlbum,
  mapContentfulEntryToService,
  mapContentfulEntryToRelease,
  mapContentfulEntryToTestimonial,
  mapContentfulEntryToMikUniverseService,
  mapContentfulEntryToMikaiRelease,
} from '../utils/dataMapper';
import type { Album, Service, Release, Testimonial, MikUniverseService, MikaiRelease } from '../types';
import { MOCK_TESTIMONIALS } from '../constants';


let client: ContentfulClientApi<any> | null = null;

export const initClient = (spaceId: string, accessToken: string) => {
  client = createClient({
    space: spaceId,
    accessToken: accessToken,
  });
};

const getClient = (): ContentfulClientApi<any> => {
  if (!client) {
    throw new Error('Contentful client not initialized. Call initClient() first.');
  }
  return client;
};

// Generic fetch function
async function fetchEntries<T>(contentType: string, mapper: (entry: Entry<any>) => T): Promise<T[]> {
  try {
    const client = getClient();
    const response: EntryCollection<any> = await client.getEntries({
      content_type: contentType,
      order: ['-sys.createdAt'],
    });
    if (response.items) {
      return response.items.map(mapper);
    }
    return [];
  } catch (error) {
    console.error(`Error fetching ${contentType}:`, error);
    return [];
  }
}

// Specific fetch functions
export const fetchAlbums = (): Promise<Album[]> => fetchEntries('album', mapContentfulEntryToAlbum);
export const fetchServices = (): Promise<Service[]> => fetchEntries('servicio', mapContentfulEntryToService);
export const fetchTestimonials = (): Promise<Testimonial[]> => fetchEntries('testimonio', mapContentfulEntryToTestimonial);
export const fetchMikUniverseServices = (): Promise<MikUniverseService[]> => fetchEntries('servicioUniversoMikai', mapContentfulEntryToMikUniverseService);
// Fetch specific Mikai Release
export const fetchMikaiRelease = async (): Promise<MikaiRelease | null> => {
    try {
        const releases = await fetchEntries('lanzamientoMikai', mapContentfulEntryToMikaiRelease);
        return releases.length > 0 ? releases[0] : null;
    } catch (error) {
        console.error('Error fetching mikai release:', error);
        return null;
    }
};

// Fetch single entry functions
export const fetchLatestRelease = async (): Promise<Release | null> => {
    try {
        const releases = await fetchEntries('artistaPrincipal', mapContentfulEntryToRelease);
        return releases.length > 0 ? releases[0] : null;
    } catch (error) {
        console.error('Error fetching latest release:', error);
        return null;
    }
};

export const fetchAllData = async () => {
  try {
    const [
      albums,
      services,
      latestRelease,
      testimonials,
      mikUniverseServices,
      mikaiRelease,
    ] = await Promise.all([
      fetchAlbums(),
      fetchServices(),
      fetchLatestRelease(),
      fetchTestimonials(),
      fetchMikUniverseServices(),
      fetchMikaiRelease(),
    ]);

    // Use mock testimonials if fetch fails or returns none, to ensure UI is populated.
    const finalTestimonials = (testimonials && testimonials.length > 0) ? testimonials : MOCK_TESTIMONIALS;

    return {
      albums,
      services,
      latestRelease,
      testimonials: finalTestimonials,
      mikUniverseServices,
      mikaiRelease,
    };
  } catch (error) {
    console.error("Failed to fetch all data from Contentful:", error);
    // Provide a fallback structure to prevent app crash
    return {
      albums: [],
      services: [],
      latestRelease: null,
      testimonials: MOCK_TESTIMONIALS,
      mikUniverseServices: [],
      mikaiRelease: null,
    };
  }
};
