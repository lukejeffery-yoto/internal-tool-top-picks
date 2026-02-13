import { Product } from "./types";

const API_BASE = "https://api.yotoplay.com/products/v2";

// Per-region API keys and region codes — these are public keys embedded
// in the client-side JS of each Yoto regional storefront.
const REGION_CONFIG: Record<string, { apiRegion: string; apiKey: string }> = {
  UK: { apiRegion: "uk", apiKey: "e3c1d0abb70c59ad66f689f3b3d2d43c" },
  US: { apiRegion: "us", apiKey: "8b816ad8f551677a2cae0a85354130c2" },
  CA: { apiRegion: "ca", apiKey: "5b05fea89eaf2b5e9adaf97db33bc311" },
  AU: { apiRegion: "au", apiKey: "2daeb3cef2e34962954d1cf5fcf221a1" },
  EU: { apiRegion: "eu", apiKey: "80a91027d8b857cd2f0e94ece03887a1" },
  FR: { apiRegion: "eu-fr", apiKey: "80a91027d8b857cd2f0e94ece03887a1" },
};

interface WebsiteProduct {
  handle: string;
  title: string;
  variants?: Array<{ sku?: string }>;
  price: string;
  comparePrice?: number | string | null;
  ageRange: [number | null, number | null];
  author: string;
  contentType: string[];
  flag: string;
  availableForSale: boolean;
  cardCount: number;
  clubCredits: number;
  runtime: number;
  blurb: string;
  images: Array<{ url: string; altText: string | null }>;
  imgSet: {
    sm: { src: string };
    md: { src: string };
    lg: { src: string };
    alt: string | null;
  };
}

function mapWebsiteProduct(p: WebsiteProduct): Product {
  return {
    id: p.handle,
    handle: p.handle,
    sku: p.variants?.[0]?.sku ?? "",
    title: p.title,
    price: p.price,
    comparePrice: p.comparePrice?.toString() ?? "",
    ageRange: p.ageRange,
    author: p.author,
    contentType: p.contentType,
    flag: p.flag,
    availableForSale: p.availableForSale,
    cardCount: p.cardCount,
    clubCredits: p.clubCredits,
    runtime: p.runtime,
    blurb: p.blurb,
    images: p.images,
    imgSet: p.imgSet,
  };
}

export async function fetchCollectionHandles(
  regionCode: string,
  collection: string
): Promise<Set<string>> {
  const config = REGION_CONFIG[regionCode.toUpperCase()];
  if (!config) return new Set();

  try {
    const url = `${API_BASE}/${config.apiRegion}?collection=${encodeURIComponent(collection)}&pageSize=2000`;
    const res = await fetch(url, {
      headers: { authorization: config.apiKey },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return new Set();

    const json = await res.json();
    const products: Array<{ handle: string }> = json.data?.products ?? [];
    return new Set(products.map((p) => p.handle));
  } catch {
    return new Set();
  }
}

export async function fetchProductsForRegion(
  regionCode: string
): Promise<Product[]> {
  const config = REGION_CONFIG[regionCode.toUpperCase()];
  if (!config) {
    console.warn(`No API config for region: ${regionCode}`);
    return [];
  }

  try {
    const url = `${API_BASE}/${config.apiRegion}?collection=library&pageSize=2000`;
    const res = await fetch(url, {
      headers: { authorization: config.apiKey },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`Products API returned ${res.status} for ${config.apiRegion}`);
      return [];
    }

    const json = await res.json();
    const products: WebsiteProduct[] = json.data?.products ?? [];
    return products.map(mapWebsiteProduct);
  } catch (err) {
    console.error(`Failed to fetch products for ${config.apiRegion}:`, err);
    return [];
  }
}
