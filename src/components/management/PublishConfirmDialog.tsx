"use client";

import { useState } from "react";
import { useTopPicks } from "@/context/TopPicksContext";

export function PublishConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: (note: string, publishedBy: string) => void;
  onCancel: () => void;
}) {
  const { activeRegion, selectedPicks } = useTopPicks();
  const [note, setNote] = useState("");
  const [publishedBy, setPublishedBy] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-base font-semibold text-gray-900">
          Publish Top Picks?
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          This will make the current {selectedPicks.length} picks live for{" "}
          {activeRegion}.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
          <div className="flex items-center rounded-md border border-gray-300 focus-within:border-gray-500">
            <input
              type="text"
              placeholder="first.last"
              value={publishedBy}
              onChange={(e) => setPublishedBy(e.target.value)}
              className="min-w-0 flex-1 rounded-l-md px-3 py-2 text-sm focus:outline-none"
            />
            <span className="whitespace-nowrap border-l border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
              @yotoplay.com
            </span>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(note, `${publishedBy}@yotoplay.com`)}
            disabled={!publishedBy.trim()}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
