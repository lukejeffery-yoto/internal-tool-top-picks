"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useTopPicks } from "@/context/TopPicksContext";

interface SortablePickItemProps {
  product: Product;
  index: number;
  onRemove: () => void;
}

export function SortablePickItem({
  product,
  index,
  onRemove,
}: SortablePickItemProps) {
  const { activeRegion } = useTopPicks();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border bg-white p-2 ${
        isDragging ? "z-10 shadow-lg opacity-90" : "border-gray-200"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="flex shrink-0 cursor-grab touch-none items-center text-gray-400 hover:text-gray-600 active:cursor-grabbing"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm6 0a2 2 0 10.001 4.001A2 2 0 0013 2zM7 8a2 2 0 10.001 4.001A2 2 0 007 8zm6 0a2 2 0 10.001 4.001A2 2 0 0013 8zM7 14a2 2 0 10.001 4.001A2 2 0 007 14zm6 0a2 2 0 10.001 4.001A2 2 0 0013 14z" />
        </svg>
      </button>
      <span className="w-6 shrink-0 text-center text-xs font-medium text-gray-400">
        {index + 1}
      </span>
      <div className="relative h-10 w-7 shrink-0 overflow-hidden rounded bg-gray-100">
        <Image
          src={product.imgSet.sm.src || product.images[0]?.url || ""}
          alt={product.title}
          fill
          className="object-cover"
          sizes="28px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">
          {product.title}
        </p>
        <p className="text-xs text-gray-500">{formatPrice(product.price, activeRegion)}</p>
      </div>
      <button
        onClick={onRemove}
        className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
