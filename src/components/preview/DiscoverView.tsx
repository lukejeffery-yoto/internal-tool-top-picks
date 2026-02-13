"use client";

import { useTopPicks } from "@/context/TopPicksContext";
import { PreviewCard } from "./PreviewCard";

export function DiscoverView() {
  const { selectedPicks } = useTopPicks();

  return (
    <div className="flex h-full flex-col bg-[#1a1a1a]">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1">
        <span className="text-[9px] font-medium text-white">09:39</span>
        <div className="flex items-center gap-1">
          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
          </svg>
          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
          </svg>
        </div>
      </div>

      {/* Green header area */}
      <div className="bg-[#2d9d4f] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 rounded bg-white/20" />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
        {/* Category pills */}
        <div className="mb-4 flex flex-col gap-1.5">
          {["Podcasts for kids", "Radio for families"].map((label) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-gray-700 px-3 py-2"
            >
              <span className="text-[9px] text-white">{label}</span>
              <svg className="h-3 w-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>

        {/* Top Picks section */}
        <div className="mb-3 flex items-center gap-1.5">
          <h3 className="text-[11px] font-semibold text-white">
            Yoto Top Picks
          </h3>
          <div className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-500">
            <svg className="h-2.5 w-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {selectedPicks.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-gray-700">
            <p className="text-[9px] text-gray-500">
              Add cards to see the carousel preview
            </p>
          </div>
        ) : (
          <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
            {selectedPicks.map((product) => (
              <PreviewCard key={product.id} product={product} size="small" />
            ))}
          </div>
        )}

        {/* Shop all cards button */}
        <div className="mt-4 mb-4">
          <div className="flex items-center justify-center gap-1 rounded-lg bg-[#2d9d4f] py-2.5">
            <span className="text-[10px] font-medium text-white">
              Shop all cards
            </span>
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <h3 className="text-[11px] font-semibold text-white">
            Useful Timers
          </h3>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-around border-t border-gray-800 bg-[#1a1a1a] py-2">
        {["News", "Create", "Library", "Discover", "Settings"].map(
          (label) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <div
                className={`h-3.5 w-3.5 rounded-sm ${
                  label === "Discover" ? "bg-[#2d9d4f]" : "bg-gray-600"
                }`}
              />
              <span
                className={`text-[7px] ${
                  label === "Discover"
                    ? "font-medium text-[#2d9d4f]"
                    : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
