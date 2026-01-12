import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/vehicle-detail";
import {
  ArrowLeft,
  Users,
  Fuel,
  Settings,
  MapPin,
  Clock,
  Map,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { useState } from "react";

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
  const [termsExpanded, setTermsExpanded] = useState(false);
  const [addonsExpanded, setAddonsExpanded] = useState(false);

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

        {/* Rental Company Info */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold">Langit Senja</h3>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Gg. VI Langgar No.16, Gubeng, Surabaya</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>07:00 AM - 10:00 PM</span>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Map className="h-5 w-5" />
            </Button>
          </div>
        </Card>

        {/* Facilities */}
        <Card className="py-2 px-4">
          <h3 className="font-semibold mb-3">Facilities</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span>⛑️</span>
              <span>2 Helmets</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🧥</span>
              <span>2 Raincoats</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📱</span>
              <span>1 Holder</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🛞</span>
              <span>1 Disc Brake</span>
            </div>
          </div>
        </Card>

        {/* Terms & Policies */}
        <Card className="overflow-hidden">
          <button
            onClick={() => setTermsExpanded(!termsExpanded)}
            className="w-full flex items-center justify-between px-4 py-2 text-left"
          >
            <h3 className="font-semibold">Terms & Policies</h3>
            {termsExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {termsExpanded && (
            <div className="px-4 pb-4 space-y-4">
              <div className="flex gap-3">
                <span className="text-xl">🪪</span>
                <div>
                  <h4 className="font-medium">Original ID (KTP) or Passport</h4>
                  <p className="text-sm text-muted-foreground">
                    Must be deposited as a security guarantee during the rental
                    period.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">✅</span>
                <div>
                  <h4 className="font-medium">Valid Driver's License</h4>
                  <p className="text-sm text-muted-foreground">
                    You must hold a valid driving license (SIM A / SIM C or
                    International Permit) for the vehicle type.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">📄</span>
                <div>
                  <h4 className="font-medium">Secondary ID</h4>
                  <p className="text-sm text-muted-foreground">
                    Please provide at least one extra document (e.g., Employee
                    ID, National ID, or Credit Card).
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">🎫</span>
                <div>
                  <h4 className="font-medium">Round-trip Travel Ticket</h4>
                  <p className="text-sm text-muted-foreground">
                    Proof of arrival and return flight/train tickets. We
                    exclusively serve travelers/tourists.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">🏨</span>
                <div>
                  <h4 className="font-medium">Proof of Accommodation</h4>
                  <p className="text-sm text-muted-foreground">
                    Valid hotel or villa booking voucher. We do not accept local
                    residents or long-term boarding (Kos).
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">💰</span>
                <div>
                  <h4 className="font-medium">Booking Fee (IDR 50k)</h4>
                  <p className="text-sm text-muted-foreground">
                    A down payment is required to secure your schedule.
                    Remaining balance to be paid upon delivery. Booking fees are
                    non-refundable in case of cancellation.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">⛽</span>
                <div>
                  <h4 className="font-medium">"Return as Received" Fuel</h4>
                  <p className="text-sm text-muted-foreground">
                    The vehicle must be returned with the same fuel level as
                    when it was handed over.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">🧭</span>
                <div>
                  <h4 className="font-medium">Usage Area Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    Vehicle must remain within city limits. Crossing city
                    borders will incur an additional fee.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Add-Ons */}
        <Card className="overflow-hidden">
          <button
            onClick={() => setAddonsExpanded(!addonsExpanded)}
            className="w-full flex items-center justify-between px-4 py-2 text-left"
          >
            <h3 className="font-semibold">Add-Ons</h3>
            {addonsExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {addonsExpanded && (
            <div className="px-4 pb-4 space-y-4">
              <div className="flex gap-3">
                <span className="text-xl">🚚</span>
                <div>
                  <h4 className="font-medium">Delivery & Pickup Service</h4>
                  <p className="text-sm text-muted-foreground">
                    IDR 30k per trip. We deliver and collect the vehicle at your
                    hotel/station.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">✅</span>
                <div>
                  <h4 className="font-medium">
                    Out-of-Town Pass (e.g., Bromo)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    IDR 100k/day. Required for trips outside city limits (e.g.,
                    Bromo, Lumajang).
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">⏱️</span>
                <div>
                  <h4 className="font-medium">Overtime / Late Return</h4>
                  <p className="text-sm text-muted-foreground">
                    {
                      "< 1 hour free. IDR 20k/hour for the next 3 hours. > 3 hours charged as full day"
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Stock Info */}
      {/* <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Available Stock
            </span>
            <span className="text-lg font-semibold">{vehicle.stock} units</span>
          </div>
        </Card>
      </div> */}

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Rent Price</p>
            <p className="text-xl font-bold">IDR 150,000/day</p>
          </div>
          <Button size="lg" className="px-8" asChild>
            <Link to="/booking-form">Let's Book!</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
