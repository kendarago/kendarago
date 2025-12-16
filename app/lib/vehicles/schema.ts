import z from "zod";

const vehicleSchema = z.object({
  id: z.string().uuid(),
});
