"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useTopPicks } from "@/context/TopPicksContext";
import { SortablePickItem } from "./SortablePickItem";

export function SelectedPicksList() {
  const { selectedPicks, removePick, reorderPicks } = useTopPicks();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderPicks(String(active.id), String(over.id));
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          Selected Top Picks ({selectedPicks.length})
        </h2>
      </div>
      {selectedPicks.length === 0 ? (
        <p className="rounded-lg border-2 border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
          No picks selected yet. Add cards from the catalog below.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={selectedPicks.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-1">
              {selectedPicks.map((product, index) => (
                <SortablePickItem
                  key={product.id}
                  product={product}
                  index={index}
                  onRemove={() => removePick(product.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
