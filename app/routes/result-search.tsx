import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLoaderData } from "react-router";
import { VehicleCard } from "../components/vehicle-card";
import type { Vehicle } from "../lib/types";
import { ChevronLeftIcon, FilterIcon, MapPinIcon } from "lucide-react";
import { FilterModal } from "../components/filter-modal";
import { format } from "date-fns";
import type { Route } from "./+types/result-search";

type ApiParams = {
  location: string;
  startDate: string;
  endDate: string;
  category: string;
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const params = {
    location: url.searchParams.get("location") || "",
    startDate: url.searchParams.get("startDate") || "",
    endDate: url.searchParams.get("endDate") || "",
    available:
      url.searchParams.get("startDate") && url.searchParams.get("endDate")
        ? "true"
        : "false",
    category: url.searchParams.get("category") || "",
  };
  const queryString = new URLSearchParams(params).toString();
  try {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_API_URL + "/vehicles?" + queryString
    );
    console.log({ response });

    const vehicles = await response.json();

    return { vehicles: vehicles, params };
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return { vehicles: [] };
  }
}

export default function ResultSearch({ loaderData }: Route.ComponentProps) {
  const { vehicles, params } = loaderData;

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
  const [showFilters, setShowFilters] = useState(false);
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
    params?.startDate && params?.endDate
      ? `${format(params?.startDate, "MMM d")} – ${format(params?.endDate, "MMM d")}`
      : "Any dates";
  const vehicleDisplay =
    params?.category === "motorcycle" ? "Motorbikes" : "Cars";

  // Calculate days for total price
  // const rentalDays = useMemo(() => {
  //   if (!params?.startDate || !params?.endDate) return 1;
  //   const diff =
  //     Math.ceil(
  //       (params?.endDate.getTime() - params?.startDate.getTime()) /
  //         (1000 * 60 * 60 * 24),
  //     ) + 1;
  //   return diff;
  // }, [params]);
  //
  console.log("length vehicles", vehicles);

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

          <button
            onClick={() => setShowFilters(true)}
            className="relative p-2 rounded-full border border-border hover:shadow-md transition-shadow"
          >
            {/* <FilterIcon className="h-5 w-5 text-foreground" /> */}
            {/* {activeFilterCount > 0 && ( */}
            {/*   <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center"> */}
            {/*     {activeFilterCount} */}
            {/*   </span> */}
            {/* )} */}
          </button>
        </div>
      </header>

      {/* Vehicle List */}
      <main className="flex-1 px-4 py-4">
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <MapPinIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No vehicles found
            </h2>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or check a different location.
            </p>
            <button
              // onClick={() => {
              //   setVehicleType("all");
              //   setPriceRange("all");
              //   setSortBy("nearest");
              // }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {vehicles.length} available{" "}
              {vehicles.length === 1 ? "vehicle" : "vehicles"} within 15 km
            </p>
            {vehicles.map((vehicle: Vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                // onClick={() => handleVehicleClick(vehicle)}
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
