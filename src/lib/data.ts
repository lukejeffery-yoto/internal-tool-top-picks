import { Product } from "./types";
import { mockProducts } from "./mock-products";

export async function getAllProducts(): Promise<Product[]> {
  return mockProducts;
}

export async function getProductById(
  id: string
): Promise<Product | undefined> {
  return mockProducts.find((p) => p.id === id);
}
