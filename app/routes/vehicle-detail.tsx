import { useState } from "react";
import { Link } from "react-router";
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

// Mock data - replace with actual data from loader
const mockVehicle = {
  id: "1",
  name: "YAMAHA NMAX TURBO 2025",
  image: "/images/nmax.png",
  specs: {
    seats: 2,
    fuel: "Gas",
    transmission: "Automatic",
    engine: "155cc",
  },
  shopName: "Langit Senja",
  shopAddress: "Gg. VI Langgar No.16, Gubeng, Surabaya",
  openingHours: "07:00 AM - 10:00 PM",
  facilities: [
    { icon: "🪖", name: "2 Helmets" },
    { icon: "🧥", name: "2 Raincoats" },
    { icon: "📱", name: "1 Holder" },
    { icon: "🛡️", name: "1 Disc Brake" },
  ],
  termsAndPolicies: [
    {
      icon: "🪪",
      title: "Original ID (KTP) or Passport",
      description:
        "Must be deposited as a security guarantee during the rental period.",
    },
    {
      icon: "🪪",
      title: "Valid Driver's License",
      description:
        "You must hold a valid driving license (SIM A / SIM C or International Permit) for the vehicle type.",
    },
    {
      icon: "📄",
      title: "Secondary ID",
      description:
        "Please provide at least one extra document (e.g., Employee ID, National ID, or Credit Card).",
    },
    {
      icon: "🎫",
      title: "Round-trip Travel Ticket",
      description:
        "Proof of arrival and return flight/train tickets. We exclusively serve travelers/tourists.",
    },
    {
      icon: "🏨",
      title: "Proof of Accommodation",
      description:
        "Valid hotel or villa booking voucher. We do not accept local residents or long-term boarding (Kos).",
    },
    {
      icon: "💰",
      title: "Booking Fee (IDR 50k)",
      description:
        "A down payment is required to secure your schedule. Remaining balance to be paid upon delivery. Booking fees are non-refundable in case of cancellation.",
    },
    {
      icon: "⛽",
      title: '"Return as Received" Fuel',
      description:
        "The vehicle must be returned with the same fuel level as when it was handed over.",
    },
    {
      icon: "📍",
      title: "Usage Area Policy",
      description:
        "Vehicle must remain within city limits. Crossing city borders will incur an additional fee.",
    },
  ],
  addOns: [
    {
      icon: "🚚",
      title: "Delivery & Pickup Service",
      description:
        "IDR 30k per trip. We deliver and collect the vehicle at your hotel/station.",
    },
    {
      icon: "🗺️",
      title: "Out-of-Town Pass (e.g., Bromo)",
      description:
        "IDR 150k/day. Required for trips outside city limits (e.g., Bromo, Lumajang).",
    },
    {
      icon: "⏰",
      title: "Overtime / Late Return",
      description:
        "< 1 hour free. IDR 20k/hour for the next 3 hours. > 3 hours charged as full day rate.",
    },
  ],
  pricePerDay: 150000,
};

export async function loader({
  params,
}: {
  params: { rentalCompanySlug: string; vehicleSlug: string };
}) {
  const { rentalCompanySlug, vehicleSlug } = params;
  console.log({ rentalCompanySlug, vehicleSlug });
  const response = await fetch(
    import.meta.env.VITE_BACKEND_API_URL +
      `/rental-companies/${rentalCompanySlug}/vehicles/${vehicleSlug}`,
  );
  return;
  // Fetch vehicle data based on vehicleId
  // For now, return mock data
  // return mockVehicle;
}
export default function VehicleDetail() {
  const [termsExpanded, setTermsExpanded] = useState(false);
  const [addOnsExpanded, setAddOnsExpanded] = useState(false);
  const vehicle = mockVehicle;

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
          src={vehicle.image}
          alt={vehicle.name}
          className="h-auto w-full max-w-md object-contain"
        />
      </div>

      {/* Vehicle Info */}
      <div className="space-y-4 px-4">
        {/* Vehicle Name */}
        <h2 className="text-xl font-bold">{vehicle.name}</h2>

        {/* Specs */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">{vehicle.specs.seats} Seats</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <Fuel className="h-4 w-4" />
            <span className="text-sm">{vehicle.specs.fuel}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <Settings className="h-4 w-4" />
            <span className="text-sm">{vehicle.specs.transmission}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <Settings className="h-4 w-4" />
            <span className="text-sm">{vehicle.specs.engine}</span>
          </div>
        </div>

        {/* Shop Info Card */}
        <Card className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold">{vehicle.shopName}</h3>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{vehicle.shopAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{vehicle.openingHours}</span>
              </div>
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Facilities */}
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">Facilities</h3>
          <div className="flex flex-wrap gap-4">
            {vehicle.facilities.map((facility, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-base">{facility.icon}</span>
                <span>{facility.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Terms & Policies */}
        <Card className="p-4">
          <button
            onClick={() => setTermsExpanded(!termsExpanded)}
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="font-semibold">Terms & Policies</h3>
            {termsExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {termsExpanded && (
            <div className="mt-4 space-y-4">
              {vehicle.termsAndPolicies.map((term, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-xl">{term.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{term.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {term.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Add-Ons */}
        <Card className="p-4">
          <button
            onClick={() => setAddOnsExpanded(!addOnsExpanded)}
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="font-semibold">Add-Ons</h3>
            {addOnsExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {addOnsExpanded && (
            <div className="mt-4 space-y-4">
              {vehicle.addOns.map((addon, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-xl">{addon.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{addon.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {addon.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Rent Price</p>
            <p className="text-xl font-bold">
              IDR {vehicle.pricePerDay.toLocaleString("id-ID")}/day
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
