import { MapPinIcon, SearchIcon } from "lucide-react";
import { VehicleCard } from "~/components/vehicle-card";
import type { Route } from "./+types/home";
import { useState } from "react";
import { UnifiedSearchModal } from "~/components/unified-search-modal";
import type { Vehicle } from "~/lib/vehicles/schema";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const response = await fetch(
    import.meta.env.VITE_BACKEND_API_URL + "/vehicles",
  );
  console.log(response);
  if (response.ok) {
    const vehicles = (await response.json()).data as Vehicle[];
    console.log("Fetched Vehicles:", vehicles);
    return { vehicles };
  }
  return null;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { vehicles } = loaderData as { vehicles: Vehicle[] };
  const [showSearchModal, setShowSearchModal] = useState(false);
  const dateDisplay = "Any dates";
  const vehicleDisplay = "Vehicles";
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold text-foreground">
          Vehicle Rentals Near You
        </h1>
        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
          <span className="text-sm">Find You Vehicles</span>
        </div>
      </header>
      <div className="flex flex-col pb-4">
        {/* Search Bar */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => setShowSearchModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <SearchIcon className="h-5 w-5 text-primary" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">
                Where to?
                {/* {locationLoading ? "Getting location..." : locationDisplay} */}
              </p>
              <p className="text-xs text-muted-foreground">
                {dateDisplay} · {vehicleDisplay}
              </p>
            </div>
          </button>
        </div>
        <UnifiedSearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
        />
      </div>
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
    </div>
  );
}
