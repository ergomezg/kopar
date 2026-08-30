const TRM_API_URL = 'https://www.datos.gov.co/resource/32sa-8pi3.json';
const CACHE_KEY = 'kopar_trm_cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface TRMResponse {
  valor: string;
  vigenciadesde: string;
  vigenciahasta: string;
}

interface TRMCache {
  value: number;
  timestamp: number;
}

/**
 * Fetches the official TRM (Tasa Representativa del Mercado) from the Colombian government's Open Data API.
 * Uses a 24-hour localStorage cache to minimize network requests.
 * @returns The current TRM value in COP.
 */
export async function getOfficialTRM(): Promise<number> {
  try {
    // 1. Check Cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsedCache: TRMCache = JSON.parse(cached);
      if (Date.now() - parsedCache.timestamp < CACHE_TTL_MS) {
        return parsedCache.value;
      }
    }

    // 2. Fetch from SODA API
    // We request the most recent 1 record ordered by vigenciadesde descending
    const response = await fetch(`${TRM_API_URL}?$limit=1&$order=vigenciadesde%20DESC`);
    
    if (!response.ok) {
      throw new Error(`SODA API responded with status ${response.status}`);
    }

    const data: TRMResponse[] = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error('No TRM data found');
    }

    const trmValue = parseFloat(data[0].valor);

    // 3. Update Cache
    const cacheData: TRMCache = {
      value: trmValue,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

    return trmValue;

  } catch (error) {
    console.error('Failed to fetch official TRM. Using fallback value.', error);
    
    // Fallback if network fails, try to use old cache even if expired
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached).value;
    }

    // Ultimate fallback if no cache at all
    return 4000; 
  }
}
