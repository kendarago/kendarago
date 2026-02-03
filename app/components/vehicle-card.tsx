import type { Vehicle } from "~/lib/vehicles/schema";
import { formatRupiah } from "~/lib/utils/format-rupiah";
import { Button } from "./ui/button";
import { Link } from "react-router";
interface VehicleCardProps {
  vehicle: Vehicle;
}

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.toUpperCase() === w ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link
      to={`/vehicle-detail/${vehicle.rentalCompanySlug}/${vehicle.slug}`}
      className="block w-full bg-card rounded-2xl border border-border overflow-hidden text-left hover:border-primary/50 hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="relative aspect-4/3 bg-muted">
        <img
          src={vehicle.imageUrl || "/images/vehicle_no_img.png"}
          alt={vehicle.name}
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
          <span>{vehicle.rentalCompany.name}</span>
        </div>
        <h3 className="font-semibold text-foreground">{vehicle.name}</h3>
        <p className="text-lg font-bold text-primary mt-2">
          {formatRupiah(vehicle.pricePerDay)}
          <span className="text-sm font-normal text-muted-foreground">
            /day
          </span>
        </p>
      </div>
    </Link>
  );
}
