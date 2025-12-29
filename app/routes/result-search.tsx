import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLoaderData } from "react-router";
import { VehicleCard } from "~/components/vehicle-card";
import type { Vehicle } from "~/lib/types";
import { ChevronLeftIcon, FilterIcon, MapPinIcon } from "lucide-react";
import { FilterModal } from "~/components/filter-modal";
import { format } from "date-fns";
import type { Route } from "./+types/result-search";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const apiParams = new URLSearchParams({
    location: url.searchParams.get("location") || "",
    startDate: url.searchParams.get("startDate") || "",
    endDate: url.searchParams.get("endDate") || "",
    category: url.searchParams.get("category") || "",
  });

  try {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_API_URL +
        "/vehicles?" +
        apiParams.toString(),
    );
    const data = await response.json();
    console.log("response data", data);
    return { vehicles: data.vehicles || data || [] };
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return { vehicles: [] };
  }
}

export default function ResultSearch({ loaderData }: Route.ComponentProps) {
  const { vehicles } = loaderData as { vehicles: Vehicle[] };
  const navigate = useNavigate();
  // const {
  //   currentLocation,
  //   filters,
  //   setFilters,
  //   resetFilters,
  //   setSelectedVehicle,
  //   selectedCategory,
  //   rentalDateRange,
  // } = useAppStore();

  // const [isLoading, setIsLoading] = useState(false);
  // const [showFilters, setShowFilters] = useState(false);
  // const [showMap, setShowMap] = useState(true);

  // Apply filters to loaded vehicles
  // const applyFilters = useCallback(() => {
  //   if (!loaderData?.vehicles) return [];
  //
  //   let filtered = [...loaderData.vehicles];
  //
  //   // Apply price range filter
  //   filtered = filtered.filter(
  //     (v) =>
  //       v.pricePerDay >= filters.priceRange[0] &&
  //       v.pricePerDay <= filters.priceRange[1],
  //   );
  //
  //   // Apply vehicle type filter
  //   if (filters.vehicleType) {
  //     filtered = filtered.filter((v) => v.type === filters.vehicleType);
  //   }
  //
  //   // Apply sorting
  //   if (filters.sortBy === "cheapest") {
  //     filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
  //   } else if (filters.sortBy === "closest") {
  //     filtered.sort((a, b) => a.distance - b.distance);
  //   }
  //
  //   return filtered;
  // }, [loaderData?.vehicles, filters]);
  //
  // Update vehicles when filters change
  // useEffect(() => {
  //   const filtered = applyFilters();
  //   setVehicles(filtered);
  // }, [applyFilters]);

  const handleVehicleClick = (vehicle: Vehicle) => {
    // setSelectedVehicle(vehicle);
    navigate(`/vehicle/${vehicle.id}`);
  };

  // const activeFilterCount = [
  //   filters.priceRange[0] > 0 || filters.priceRange[1] < 100,
  //   filters.vehicleType !== null,
  //   filters.sortBy !== "closest",
  // ].filter(Boolean).length;

  // Build header display
  const locationName = "Anywhere";
  // const locationName = currentLocation?.name || "Anywhere";
  const dateDisplay =
    rentalDateRange.startDate && rentalDateRange.endDate
      ? `${format(rentalDateRange.startDate, "MMM d")} – ${format(rentalDateRange.endDate, "MMM d")}`
      : "Any dates";
  const vehicleDisplay =
    selectedCategory === "motorcycle" ? "Motorbikes" : "Cars";

  // Calculate days for total price
  const rentalDays = useMemo(() => {
    if (!rentalDateRange.startDate || !rentalDateRange.endDate) return 1;
    const diff =
      Math.ceil(
        (rentalDateRange.endDate.getTime() -
          rentalDateRange.startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;
    return diff;
  }, [rentalDateRange]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="flex items-center gap-2 px-3 py-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 text-foreground" />
          </button>

          {/* Search Summary Button */}
          <button
            onClick={() => navigate("/")}
            className="flex-1 flex flex-col items-center py-1 px-3 rounded-full border border-border hover:shadow-md transition-shadow bg-card"
          >
            <span className="text-sm font-semibold text-foreground">
              {vehicleDisplay} in {locationName}
            </span>
            <span className="text-xs text-muted-foreground">{dateDisplay}</span>
          </button>

          {/* <button */}
          {/*   onClick={() => setShowFilters(true)} */}
          {/*   className="relative p-2 rounded-full border border-border hover:shadow-md transition-shadow" */}
          {/* > */}
          {/*   <FilterIcon className="h-5 w-5 text-foreground" /> */}
          {/*   {activeFilterCount > 0 && ( */}
          {/*     <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center"> */}
          {/*       {activeFilterCount} */}
          {/*     </span> */}
          {/*   )} */}
          {/* </button> */}
        </div>
      </header>

      {/* Map Section */}
      {showMap && (
        <div className="relative h-[35vh] bg-muted">
          {/* Map Background */}
          <div className="absolute inset-0 bg-[#e8e4dc]">
            {/* Map grid lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#ccc"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Price pins on map */}
            <div className="absolute inset-0">
              {vehicles.slice(0, 6).map((vehicle, index) => {
                // Position pins in different areas
                const positions = [
                  { top: "20%", left: "30%" },
                  { top: "35%", left: "60%" },
                  { top: "50%", left: "25%" },
                  { top: "45%", left: "70%" },
                  { top: "65%", left: "45%" },
                  { top: "30%", left: "80%" },
                ];
                const pos = positions[index] || { top: "50%", left: "50%" };

                return (
                  <button
                    key={vehicle.id}
                    onClick={() => handleVehicleClick(vehicle)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-card px-2 py-1 rounded-full shadow-lg border border-border hover:bg-primary hover:text-primary-foreground transition-colors text-xs font-semibold"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    ${vehicle.pricePerDay * rentalDays}
                  </button>
                );
              })}

              {/* Location marker */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                <MapPinIcon className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  {locationName}
                </span>
              </div>
            </div>
          </div>

          {/* Drag handle */}
          <button
            onClick={() => setShowMap(false)}
            className="absolute bottom-0 left-0 right-0 flex justify-center py-2 bg-gradient-to-t from-background to-transparent"
          >
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </button>
        </div>
      )}

      {/* Show Map Toggle (when hidden) */}
      {!showMap && (
        <button
          onClick={() => setShowMap(true)}
          className="mx-4 mt-3 py-2 px-4 bg-card border border-border rounded-full text-sm font-medium text-foreground flex items-center justify-center gap-2"
        >
          <MapPinIcon className="h-4 w-4" />
          Show map
        </button>
      )}

      {/* Prices Include All Fees Banner */}
      <div className="flex items-center justify-center gap-2 py-3 px-4">
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
          <span className="text-xs">🏷️</span>
        </div>
        <span className="text-sm font-medium text-foreground">
          Prices include all fees
        </span>
      </div>

      {/* Results Grid */}
      <main className="flex-1 px-4 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-square rounded-xl bg-muted animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <MapPinIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No vehicles found
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Try adjusting your filters or search in a different area
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm"
            >
              Change search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                rentalDays={rentalDays}
                onClick={() => handleVehicleClick(vehicle)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Filter Modal */}
      {/* <FilterModal */}
      {/*   isOpen={showFilters} */}
      {/*   onClose={() => setShowFilters(false)} */}
      {/*   filters={filters} */}
      {/*   onApply={setFilters} */}
      {/*   onReset={resetFilters} */}
      {/* /> */}
    </div>
  );
}
