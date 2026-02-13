"use client";

import { useState } from "react";
import { useTopPicks } from "@/context/TopPicksContext";
import { formatRelativeTime } from "@/lib/format";
import { PublishConfirmDialog } from "./PublishConfirmDialog";

export function PublishBar({ onOpenHistory }: { onOpenHistory: () => void }) {
  const {
    hasUnpublishedChanges,
    lastPublishedAt,
    lastPublishedBy,
    isPublishing,
    isLoading,
    publishPicks,
    selectedPicks,
    syncedAt,
    isSyncing,
    markAsLive,
    isNotifying,
    notifyBackend,
  } = useTopPicks();
  const [showConfirm, setShowConfirm] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState<string | null>(null);

  const handleNotify = async () => {
    const result = await notifyBackend();
    setNotifyMessage(result.message);
    setTimeout(() => setNotifyMessage(null), 4000);
  };

  const isPublished = lastPublishedAt && !hasUnpublishedChanges;

  return (
    <>
      <div className="flex items-center justify-between border-b bg-white px-6 py-2">
        <div className="flex items-center gap-3">
          {isLoading ? (
            <span className="text-xs text-gray-400">Loading...</span>
          ) : (
            <>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  hasUnpublishedChanges
                    ? "bg-amber-100 text-amber-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {hasUnpublishedChanges ? "Draft" : "Submitted"}
              </span>
              {isPublished && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    syncedAt
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {syncedAt ? "Live" : "Pending Sync"}
                </span>
              )}
              <span className="text-xs text-gray-500">
                {lastPublishedAt
                  ? `Last submitted ${formatRelativeTime(lastPublishedAt)}${lastPublishedBy ? ` by ${lastPublishedBy}` : ""}`
                  : "Never submitted"}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {notifyMessage && (
            <span className="text-xs text-gray-500">{notifyMessage}</span>
          )}
          <button
            onClick={handleNotify}
            disabled={isNotifying}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
          >
            {isNotifying ? "Notifying..." : "Notify Backend"}
          </button>
          {isPublished && !syncedAt && (
            <button
              onClick={markAsLive}
              disabled={isSyncing}
              className="rounded-md border border-green-600 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
            >
              {isSyncing ? "Syncing..." : "Mark as Live"}
            </button>
          )}
          <button
            onClick={onOpenHistory}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
          >
            History
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={
              !hasUnpublishedChanges ||
              isPublishing ||
              selectedPicks.length === 0
            }
            className="rounded-md bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPublishing ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
      {showConfirm && (
        <PublishConfirmDialog
          onConfirm={(note, publishedBy) => {
            publishPicks(note, publishedBy);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
