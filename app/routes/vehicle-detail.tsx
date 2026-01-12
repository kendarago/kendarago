import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/vehicle-detail";
import { ArrowLeft, Users, Fuel, Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export async function loader({ params }: Route.LoaderArgs) {
  const { rentalCompanySlug, vehicleSlug } = params;
  const response = await fetch(
    import.meta.env.VITE_BACKEND_API_URL +
      `/rental-companies/${rentalCompanySlug}/vehicles/${vehicleSlug}`,
  );

  const vehicleData = (await response.json()).data;
  return vehicleData;
}
export default function VehicleDetail({ loaderData }: Route.ComponentProps) {
  const vehicle = loaderData;
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-4">
        <Link to="/result-search">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Vehicle's Detail</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Vehicle Image */}
      <div className="flex justify-center bg-background px-8 py-8">
        <img
          src={vehicle.imageUrl}
          alt={vehicle.name}
          className="h-auto w-full max-w-md object-contain"
        />
      </div>

      {/* Vehicle Info */}
      <div className="space-y-4 px-4">
        {/* Vehicle Name */}
        <h2 className="text-xl font-bold">{vehicle.name}</h2>

        {/* Brand and Year */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{vehicle.brand}</span>
          <span>•</span>
          <span>{vehicle.year}</span>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">{vehicle.seatCapacity} Seats</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <Fuel className="h-4 w-4" />
            <span className="text-sm">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <Settings className="h-4 w-4" />
            <span className="text-sm">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <Settings className="h-4 w-4" />
            <span className="text-sm">{vehicle.engineCapacity}</span>
          </div>
        </div>

        {/* Stock Info */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Available Stock
            </span>
            <span className="text-lg font-semibold">{vehicle.stock} units</span>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Rent Price</p>
            <p className="text-xl font-bold">
              {/* IDR {vehicle.pricePerDay.toLocaleString("id-ID")}/day */}
            </p>
          </div>
          <Button size="lg" className="px-8" asChild>
            <Link to="/booking-form">Let's Book!</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
