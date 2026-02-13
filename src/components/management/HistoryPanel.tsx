"use client";

import { useEffect } from "react";
import { useTopPicks } from "@/context/TopPicksContext";
import { formatRelativeTime } from "@/lib/format";

export function HistoryPanel({ onClose }: { onClose: () => void }) {
  const {
    history,
    isLoadingHistory,
    loadHistory,
    restoreVersion,
    isRestoring,
    activeRegion,
  } = useTopPicks();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Publish History — {activeRegion}
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
              No published versions yet
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
                      <p className="text-sm font-medium text-gray-900">
                        {formatRelativeTime(version.publishedAt)}
                      </p>
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
                    <button
                      onClick={() => restoreVersion(version.id)}
                      disabled={isRestoring}
                      className="shrink-0 rounded-md px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      {isRestoring ? "Restoring..." : "Restore to Draft"}
                    </button>
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
