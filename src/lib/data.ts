import { Product } from "./types";
import { RegionCode, mockProductsByRegion, regions } from "./mock-products";

export { regions, type RegionCode };

export async function getProductsByRegion(
  regionCode: RegionCode
): Promise<Product[]> {
  return mockProductsByRegion[regionCode] || [];
}

export async function getAllRegionProducts(): Promise<
  Record<RegionCode, Product[]>
> {
  return mockProductsByRegion;
}
