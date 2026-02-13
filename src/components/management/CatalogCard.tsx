"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, formatAgeRange } from "@/lib/format";

interface CatalogCardProps {
  product: Product;
  isSelected: boolean;
  onToggle: () => void;
}

export function CatalogCard({ product, isSelected, onToggle }: CatalogCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`group relative flex flex-col overflow-hidden rounded-lg border-2 text-left transition-all ${
        isSelected
          ? "border-green-500 shadow-md"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className="relative aspect-[638/1011] w-full bg-gray-100">
        <Image
          src={product.imgSet.md.src || product.images[0]?.url || ""}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {isSelected ? (
          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        )}
        {product.flag && (
          <span className="absolute top-2 left-2 rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {product.flag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2">
        <h3 className="line-clamp-2 text-xs font-medium leading-tight text-gray-900">
          {product.title}
        </h3>
        <p className="text-xs font-semibold text-gray-900">
          {formatPrice(product.price)}
        </p>
        <div className="flex flex-wrap gap-1">
          {product.contentType.map((ct) => (
            <span
              key={ct}
              className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600"
            >
              {ct}
            </span>
          ))}
        </div>
        {formatAgeRange(product.ageRange) && (
          <p className="text-[10px] text-gray-500">
            {formatAgeRange(product.ageRange)}
          </p>
        )}
      </div>
    </button>
  );
}
