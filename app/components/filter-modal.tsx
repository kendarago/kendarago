import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { FilterState, SortOption } from "~/lib/types";
// import { XIcon } from "./icons";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
}

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const { selectedCategory, setModalOpen } = useAppStore();

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    setModalOpen(isOpen);
    return () => setModalOpen(false);
  }, [isOpen, setModalOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  const vehicleTypes =
    selectedCategory === "motorcycle" ? motorcycleTypes : carTypes;
  const maxPrice = selectedCategory === "motorcycle" ? 100 : 150;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl animate-in slide-in-from-bottom duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              {/* <XIcon className="h-5 w-5 text-muted-foreground" /> */}
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-foreground mb-4 block">
              Price per day: ${localFilters.priceRange[0]} - $
              {localFilters.priceRange[1]}
            </Label>
            <Slider
              value={localFilters.priceRange}
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  priceRange: value as [number, number],
                })
              }
              min={0}
              max={maxPrice}
              step={5}
              className="mt-2"
            />
          </div>

          <div className="mb-6">
            <Label className="text-sm font-medium text-foreground mb-2 block">
              Vehicle Type
            </Label>
            <Select
              value={localFilters.vehicleType || "all"}
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  vehicleType: value === "all" ? null : value,
                })
              }
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="mb-8">
            <Label className="text-sm font-medium text-foreground mb-2 block">
              Sort by
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(["closest", "cheapest", "newest"] as SortOption[]).map(
                (option) => (
                  <button
                    key={option}
                    onClick={() =>
                      setLocalFilters({ ...localFilters, sortBy: option })
                    }
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                      localFilters.sortBy === option
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 h-12 rounded-xl bg-transparent"
            >
              Reset
            </Button>
            <Button onClick={handleApply} className="flex-1 h-12 rounded-xl">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
