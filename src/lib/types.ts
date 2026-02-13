export interface PickVersion {
  id: number;
  regionCode: string;
  productIds: string[];
  note: string;
  publishedBy: string;
  publishedAt: string;
  syncedAt: string | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  price: string;
  comparePrice: string;
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
