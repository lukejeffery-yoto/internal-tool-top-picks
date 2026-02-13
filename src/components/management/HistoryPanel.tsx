"use client";

import { useEffect, useState } from "react";
import { useTopPicks } from "@/context/TopPicksContext";
import { formatRelativeTime } from "@/lib/format";
import { copyIdsToClipboard, downloadIdsJson } from "@/lib/export";

export function HistoryPanel({ onClose }: { onClose: () => void }) {
  const {
    history,
    isLoadingHistory,
    loadHistory,
    restoreVersion,
    isRestoring,
    activeRegion,
    getShopifyIds,
  } = useTopPicks();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleCopy = async (versionId: number, ids: string[]) => {
    await copyIdsToClipboard(ids);
    setCopiedId(versionId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Submission History — {activeRegion}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(100vh - 65px)" }}>
          {isLoadingHistory ? (
            <p className="text-center text-sm text-gray-400">Loading...</p>
          ) : history.length === 0 ? (
            <p className="text-center text-sm text-gray-400">
              No submissions yet
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((version) => (
                <div
                  key={version.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {formatRelativeTime(version.publishedAt)}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            version.syncedAt
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {version.syncedAt ? "Live" : "Pending"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {version.productIds.length} picks
                        {version.publishedBy && ` by ${version.publishedBy}`}
                      </p>
                      {version.note && (
                        <p className="mt-1 text-xs text-gray-600 italic">
                          {version.note}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col gap-1">
                      <button
                        onClick={() => restoreVersion(version.id)}
                        disabled={isRestoring}
                        className="rounded-md px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        {isRestoring ? "Restoring..." : "Restore to Draft"}
                      </button>
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            handleCopy(version.id, getShopifyIds(version.productIds))
                          }
                          className="rounded-md px-2 py-1 text-[11px] font-medium text-gray-500 hover:bg-gray-100"
                        >
                          {copiedId === version.id ? "Copied!" : "Copy IDs"}
                        </button>
                        <button
                          onClick={() =>
                            downloadIdsJson(
                              getShopifyIds(version.productIds),
                              activeRegion,
                              version.publishedAt.slice(0, 10)
                            )
                          }
                          className="rounded-md px-2 py-1 text-[11px] font-medium text-gray-500 hover:bg-gray-100"
                        >
                          JSON
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
