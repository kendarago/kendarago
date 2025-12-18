import { z } from "zod";

export const VehicleSchema = z.object({
  id: z.string(),
  rentalCompanySlug: z.string(),
  engineCapacity: z.string(),
  imageUrl: z.string().optional(),
  brand: z.string(),
  name: z.string(),
  seatCapacity: z.number(),
  pricePerDay: z.number(),
  year: z.number(),
  vehicleTypeSlug: z.enum(["motorcycle", "car"]),
  transmission: z.enum(["Matic", "Manual"]),
  fuelType: z.enum(["Gas", "Electric"]),
});

export type Vehicle = z.infer<typeof VehicleSchema>;
