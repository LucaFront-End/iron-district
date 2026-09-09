import { createClient, OAuthStrategy, media, EMPTY_TOKENS } from '@wix/sdk';
import { products } from '@wix/stores';
import { currentCart } from '@wix/ecom';
import { redirects } from '@wix/redirects';
import { items } from '@wix/data';

export const WIX_CLIENT_ID = '8d22ac43-bd56-44f9-a4a3-0ab3e0a37492';
export const WIX_STORES_APP_ID = '215238eb-22a5-4c36-9e7b-e7c08025e04e';
export const TOKEN_KEY = 'station_metalworks_wix_session';

function createTokenStorage() {
  return {
    getTokens() {
      if (typeof window === 'undefined') return EMPTY_TOKENS;
      try {
        const raw = localStorage.getItem(TOKEN_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.accessToken?.value && parsed?.refreshToken?.value) {
            return parsed;
          }
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      }
      return EMPTY_TOKENS;
    },
    setTokens(tokens) {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
      } catch {}
    },
  };
}

export const wixClient = createClient({
  modules: {
    products,
    currentCart,
    redirects,
    items,
  },
  auth: OAuthStrategy({
    clientId: WIX_CLIENT_ID,
    tokenStorage: createTokenStorage(),
  }),
});

/**
 * Normalizes Wix media objects and wix:image:// URIs to standard https://static.wixstatic.com/ URLs
 */
export function formatWixImage(imgSource, width = 800, height = 600) {
  if (!imgSource) return '/logo.png';

  if (typeof imgSource === 'string') {
    if (imgSource.startsWith('http://') || imgSource.startsWith('https://')) {
      return imgSource;
    }
    if (imgSource.startsWith('wix:image://v1/')) {
      try {
        const parsed = media.getImageUrl(imgSource);
        if (parsed?.url) return parsed.url;
      } catch {
        const match = imgSource.match(/wix:image:\/\/v1\/([^/#]+)/);
        if (match && match[1]) {
          return `https://static.wixstatic.com/media/${match[1]}`;
        }
      }
    }
    return imgSource;
  }

  if (imgSource.url) {
    return formatWixImage(imgSource.url, width, height);
  }

  if (imgSource.image?.url) {
    return formatWixImage(imgSource.image.url, width, height);
  }

  return '/logo.png';
}

/**
 * Extracts a category name from product name or tags for structured filtering
 */
export function deriveProductCategory(product) {
  const name = (product.name || '').toLowerCase();
  
  if (name.includes('handrail') || name.includes('pasamanos') || name.includes('barandal')) {
    return 'handrails';
  }
  if (name.includes('bracket') || name.includes('mount') || name.includes('holder') || name.includes('soporte')) {
    return 'brackets';
  }
  if (name.includes('post') || name.includes('flange') || name.includes('base') || name.includes('poste') || name.includes('brida')) {
    return 'posts';
  }
  if (name.includes('tube') || name.includes('sample') || name.includes('tubo') || name.includes('muestras')) {
    return 'tubes';
  }
  return 'accessories';
}
