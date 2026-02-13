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
    publishPicks,
    selectedPicks,
  } = useTopPicks();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b bg-white px-6 py-2">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              hasUnpublishedChanges
                ? "bg-amber-100 text-amber-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {hasUnpublishedChanges ? "Draft" : "Published"}
          </span>
          <span className="text-xs text-gray-500">
            {lastPublishedAt
              ? `Last published ${formatRelativeTime(lastPublishedAt)}${lastPublishedBy ? ` by ${lastPublishedBy}` : ""}`
              : "Never published"}
          </span>
        </div>
        <div className="flex items-center gap-2">
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
            {isPublishing ? "Publishing..." : "Publish"}
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
