import type { Route } from "./+types/rental-profile";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Rental Company Profile" }];
}

export default function RentalProfile() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Rental Company Profile</h1>
      <p>Profile management coming soon...</p>
    </div>
  );
}
