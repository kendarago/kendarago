import type { Route } from "./+types/rental-vehicles";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Manage Vehicles" }];
}

export default function RentalVehicles() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Manage Vehicles</h1>
      <p>Vehicle management coming soon...</p>
    </div>
  );
}
