"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useTopPicks } from "@/context/TopPicksContext";

interface PreviewCardProps {
  product: Product;
  size: "small" | "large";
}

export function PreviewCard({ product, size }: PreviewCardProps) {
  const { activeRegion } = useTopPicks();
  if (size === "small") {
    return (
      <div className="flex w-[100px] shrink-0 flex-col gap-1">
        <div className="relative aspect-[638/1011] w-full overflow-hidden rounded-md bg-gray-800">
          <Image
            src={product.imgSet.sm.src || product.images[0]?.url || ""}
            alt={product.title}
            fill
            className="object-cover"
            sizes="100px"
          />
        </div>
        <div className="flex items-center gap-1">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
            <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-[8px] text-gray-300">Preview audio</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500">
            <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-[8px] font-medium text-white">
            {formatPrice(product.price, activeRegion)}
          </span>
        </div>
        {product.clubCredits > 0 && (
          <span className="text-[7px] pl-5 text-orange-400">
            or {product.clubCredits} credits
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative aspect-[638/1011] w-full overflow-hidden rounded-lg bg-gray-800">
        <Image
          src={product.imgSet.sm.src || product.images[0]?.url || ""}
          alt={product.title}
          fill
          className="object-cover"
          sizes="150px"
        />
      </div>
      <div className="flex items-center gap-1">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="text-[9px] text-gray-300">Preview audio</span>
      </div>
      <p className="line-clamp-2 text-[10px] font-medium leading-tight text-white">
        {product.title}
      </p>
      <p className="text-[9px] text-gray-400">{product.author}</p>
      <div className="flex items-center gap-1">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <span className="text-[10px] font-medium text-white">
          {formatPrice(product.price, activeRegion)}
        </span>
      </div>
      {product.clubCredits > 0 && (
        <span className="text-[8px] pl-6 text-orange-400">
          or {product.clubCredits} credits
        </span>
      )}
    </div>
  );
}
