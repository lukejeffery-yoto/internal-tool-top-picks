import { Product } from "./types";

const API_BASE = "https://products.api.yotoplay.com/v2/store";
const PAGE_SIZE = 100;

interface ApiProduct {
  uuid: string;
  yotoHandle: string;
  title: string;
  price: number;
  originalPrice: number | null;
  credits: number | null;
  flag: { text: string; flagColour: string; textColour: string };
  headline: string;
  type: string;
  coverUrls: Array<{ url: string; text: string }>;
  cards: Array<{
    contentIds: string[];
    metaFields: { authors?: string[] };
    stockLevel: number;
  }>;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function mapApiProduct(p: ApiProduct): Product {
  const firstCover = p.coverUrls?.[0];
  const firstCard = p.cards?.[0];

  return {
    id: p.uuid,
    handle: p.yotoHandle,
    title: p.title,
    price: p.price?.toString() ?? "0",
    comparePrice: p.originalPrice?.toString() ?? "",
    ageRange: [null, null],
    author: firstCard?.metaFields?.authors?.[0] ?? "",
    contentType: p.type ? [p.type] : [],
    flag: p.flag?.text ?? "",
    availableForSale: (firstCard?.stockLevel ?? 0) > 0,
    cardCount: firstCard?.contentIds?.length ?? 0,
    clubCredits: p.credits ?? 0,
    runtime: 0,
    blurb: p.headline ? stripHtml(p.headline) : "",
    images: (p.coverUrls ?? []).map((c) => ({
      url: c.url,
      altText: c.text ?? null,
    })),
    imgSet: {
      sm: { src: firstCover?.url ?? "" },
      md: { src: firstCover?.url ?? "" },
      lg: { src: firstCover?.url ?? "" },
      alt: firstCover?.text ?? null,
    },
  };
}

export async function fetchProductsForRegion(
  regionCode: string
): Promise<Product[]> {
  const store = regionCode.toLowerCase();
  const allProducts: Product[] = [];
  let page = 1;
  let total = Infinity;

  try {
    while (allProducts.length < total) {
      const url = `${API_BASE}/${store}?pageSize=${PAGE_SIZE}&page=${page}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });

      if (!res.ok) {
        console.warn(
          `Products API returned ${res.status} for ${store} page ${page}`
        );
        break;
      }

      const json = await res.json();
      const data = json.data;

      if (!data?.products?.length) break;

      total = data.total;
      allProducts.push(...data.products.map(mapApiProduct));
      page++;
    }
  } catch (err) {
    console.error(`Failed to fetch products for ${store}:`, err);
  }

  return allProducts;
}
