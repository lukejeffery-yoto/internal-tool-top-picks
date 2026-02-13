"use client";

import { useState } from "react";
import { useTopPicks } from "@/context/TopPicksContext";
import { copyIdsToClipboard, downloadIdsJson } from "@/lib/export";

export function PublishedIdsList() {
  const { publishedProductIds, activeRegion, getShopifyIds } = useTopPicks();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!publishedProductIds || publishedProductIds.length === 0) return null;

  const shopifyIds = getShopifyIds(publishedProductIds);

  const handleCopy = async () => {
    await copyIdsToClipboard(shopifyIds);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadIdsJson(shopifyIds, activeRegion);
  };

  return (
    <div className="border-b bg-gray-50 px-6 py-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-gray-900"
        >
          <span className="text-[10px]">{expanded ? "▼" : "▶"}</span>
          Submitted Product IDs
          <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
            {publishedProductIds.length}
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
          >
            Download JSON
          </button>
        </div>
      </div>
      {expanded && (
        <pre className="mt-2 max-h-40 overflow-y-auto rounded bg-white p-2 font-mono text-xs text-gray-800 border border-gray-200">
          {shopifyIds.join("\n")}
        </pre>
      )}
    </div>
  );
}
