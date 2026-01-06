import type { Vehicle } from "~/lib/vehicles/schema";
import { formatRupiah } from "~/lib/utils/format-rupiah";
interface VehicleCardProps {
  vehicle: Vehicle;
  // onClick: () => void;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <button
      // onClick={onClick}
      className="w-full bg-card rounded-2xl border border-border overflow-hidden text-left hover:border-primary/50 hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] bg-muted">
        <img
          src={vehicle.imageUrl || "/placeholder.svg"}
          alt={vehicle.name}
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
          <span>{vehicle.rentalCompanySlug}</span>
        </div>
        <h3 className="font-semibold text-foreground">{vehicle.name}</h3>
        <p className="text-lg font-bold text-primary mt-2">
          {formatRupiah(vehicle.pricePerDay)}
          <span className="text-sm font-normal text-muted-foreground">
            /day
          </span>
        </p>
      </div>
    </button>
  );
}
