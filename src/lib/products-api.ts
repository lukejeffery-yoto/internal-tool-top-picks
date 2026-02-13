import { Product } from "./types";

const API_BASE = "https://api.yotoplay.com/products/v2";
const API_KEY = process.env.YOTO_PRODUCTS_API_KEY ?? "";

interface WebsiteProduct {
  handle: string;
  title: string;
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

export async function fetchProductsForRegion(
  regionCode: string
): Promise<Product[]> {
  const region = regionCode.toLowerCase();

  try {
    const url = `${API_BASE}/${region}?collection=library&pageSize=1500`;
    const res = await fetch(url, {
      headers: { authorization: API_KEY },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`Products API returned ${res.status} for ${region}`);
      return [];
    }

    const json = await res.json();
    const products: WebsiteProduct[] = json.data?.products ?? [];
    return products.map(mapWebsiteProduct);
  } catch (err) {
    console.error(`Failed to fetch products for ${region}:`, err);
    return [];
  }
}
