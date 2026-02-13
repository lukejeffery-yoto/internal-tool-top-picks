import { Product } from "./types";
import { fetchProductsForRegion } from "./products-api";

export type RegionCode = "US" | "CA" | "UK" | "AU" | "EU" | "FR";

export interface Region {
  code: RegionCode;
  name: string;
  domain: string;
}

export const regions: Region[] = [
  { code: "US", name: "United States", domain: "us.yotoplay.com" },
  { code: "CA", name: "Canada", domain: "ca.yotoplay.com" },
  { code: "UK", name: "United Kingdom", domain: "uk.yotoplay.com" },
  { code: "AU", name: "Australia", domain: "au.yotoplay.com" },
  { code: "EU", name: "Europe", domain: "eu.yotoplay.com" },
  { code: "FR", name: "France", domain: "fr.yotoplay.com" },
];

export async function getProductsByRegion(
  regionCode: RegionCode
): Promise<Product[]> {
  return fetchProductsForRegion(regionCode);
}

export async function getAllRegionProducts(): Promise<
  Record<RegionCode, Product[]>
> {
  const results = await Promise.all(
    regions.map(async (r) => ({
      code: r.code,
      products: await fetchProductsForRegion(r.code),
    }))
  );

  return Object.fromEntries(
    results.map((r) => [r.code, r.products])
  ) as Record<RegionCode, Product[]>;
}
