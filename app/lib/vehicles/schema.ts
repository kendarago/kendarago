// import { z } from "zod";

// export const VehicleSchema = z.object({
//   id: z.string(),
//   slug: z.string(),
//   rentalCompanySlug: z.string(),
//   engineCapacity: z.string(),
//   imageUrl: z.string(),
//   brand: z.string(),
//   name: z.string(),
//   seatCapacity: z.number(),
//   pricePerDay: z.number(),
//   year: z.number(),
//   vehicleTypeSlug: z.enum(["motorcycle", "car"]),
//   transmission: z.enum(["Matic", "Manual"]),
//   fuelType: z.enum(["Gas", "Electric"]),

//   rentalCompany: RentalCompanySchema,
// });

// export const RentalCompanySchema = z.object({
//   id: z.string(),
//   slug: z.string(),
//   name: z.string(),
//   address: z.string(),
//   city: z.string(),
//   operatingHours: z.string(),
//   contact: z.string(),
//   createdAt: z.string(),
//   updatedAt: z.string(),
// });

// export type Vehicle = z.infer<typeof VehicleSchema>;

import { z } from "zod";

export const RentalCompanySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  operatingHours: z.string(),
  contact: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const VehicleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  rentalCompanySlug: z.string(),
  engineCapacity: z.string(),
  imageUrl: z.string(),
  brand: z.string(),
  name: z.string(),
  seatCapacity: z.number(),
  pricePerDay: z.number(),
  year: z.number(),
  vehicleTypeSlug: z.enum(["motorcycle", "car"]),
  transmission: z.enum(["Matic", "Manual"]),
  fuelType: z.enum(["Gas", "Electric"]),
  rentalCompany: RentalCompanySchema,
});

export type Vehicle = z.infer<typeof VehicleSchema>;
