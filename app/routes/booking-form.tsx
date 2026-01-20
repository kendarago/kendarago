import type { Route } from "./+types/booking-form";
import { useState } from "react";
import { differenceInDays } from "date-fns";
import { z } from "zod";
import { redirect, Link, useLoaderData } from "react-router";
import { getSession } from "../sessions";
import { VehicleRentalPicker } from "../components/vehicle-rental-picker";
import type { UserAuthMe } from "../modules/user";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { formatRupiah } from "../lib/utils/format-rupiah";

const rentalSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must not exceed 50 characters"),
  phone: z
    .string()
    .regex(/^(\+62|62|0)[\d\s-]{9,15}$/, "Invalid phone number format")
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 13;
    }, "WhatsApp number must be 10–13 digits"),
});

type RentalFormData = z.infer<typeof rentalSchema>;

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  year: number;
  imageUrl: string;
  pricePerDay: number;
  rentalCompany?: {
    name: string;
  };
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  // Check if user is authenticated
  let user: UserAuthMe | null = null;
  if (token) {
    const authResponse = await fetch(
      `${import.meta.env.VITE_BACKEND_API_URL}/auth/me`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (authResponse.ok) {
      user = await authResponse.json();
    }
  }

  // Redirect to signin if not authenticated
  if (!user) {
    return redirect("/signin");
  }

  // Get vehicle details
  const { rentalCompanySlug, vehicleSlug } = params;
  const vehicleResponse = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/rental-companies/${rentalCompanySlug}/vehicles/${vehicleSlug}`,
  );

  if (!vehicleResponse.ok) {
    throw new Response("Vehicle not found", { status: 404 });
  }

  const vehicleData = (await vehicleResponse.json()).data;
  console.log({ vehicleData });

  return { user, vehicle: vehicleData as Vehicle };
}

export default function RentalForm({ loaderData }: Route.ComponentProps) {
  const { user, vehicle } = loaderData;

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
  const [agreed, setAgreed] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof RentalFormData, string>> & {
      date?: string;
      file?: string;
      agreed?: string;
    }
  >({});

  const pricePerDay = vehicle?.pricePerDay || 360000;
  const days =
    startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const totalPrice = days * pricePerDay;

  // Check if form is valid
  const isFormValid = startDate && endDate && days > 0 && agreed;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          file: "File size must not exceed 5 MB",
        }));
        return;
      }
      setFileName(file.name);
      setErrors((prev) => ({ ...prev, file: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const zodResult = rentalSchema.safeParse({ fullName, phone });
    if (!zodResult.success) {
      const formatted = zodResult.error.format();
      setErrors({
        fullName: formatted.fullName?._errors[0],
        phone: formatted.phone?._errors[0],
      });
      return;
    }

    if (!startDate || !endDate) {
      setErrors((prev) => ({
        ...prev,
        date: "Please select start & end date",
      }));
      return;
    }
    if (fileName === "No file chosen") {
      setErrors((prev) => ({
        ...prev,
        file: "ID photo (KTP/SIM) is required",
      }));
      return;
    }
    if (!agreed) {
      setErrors((prev) => ({
        ...prev,
        agreed: "You must agree to the terms & conditions",
      }));
      return;
    }

    alert("Form submitted successfully! Proceeding to payment");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-4">
        <Link to={-1 as any}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Booking Form</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>
      {/* Vehicle Details Card */}
      <div>
        <div className="bg-gradient-to-br from-gray-50 to-white p-4">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={vehicle?.imageUrl || "/placeholder-vehicle.png"}
                  alt={vehicle?.name || "Vehicle"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
                {vehicle?.name}
              </h1>
              <p className="text-xs text-gray-600 mb-2">Toko Yamaha Rental</p>
              <p className="text-xl font-bold text-teal-600">
                {formatRupiah(vehicle.pricePerDay)}
                <span className="text-sm font-semibold">/day</span>
              </p>
            </div>
          </div>
        </div>

        {/* Rental Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rental Period */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Rental Period
            </h3>
            <div className="flex gap-2">
              <VehicleRentalPicker
                onDateChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
              />
            </div>
            {errors.date && (
              <p className="text-red-500 text-sm mt-2">{errors.date}</p>
            )}
            {/* Price Calculation */}
            {days > 0 && (
              <div className="mt-4 bg-teal-50 rounded-xl p-4">
                <p className="text-base font-medium text-gray-700">
                  {formatRupiah(pricePerDay)}/day x {days} days ={" "}
                  <span className="font-bold text-teal-600">
                    {formatRupiah(totalPrice)} total
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Agreement */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary"
            />
            <label className="text-sm text-muted-foreground">
              I agree to the{" "}
              <a href="#" className="text-primary underline">
                rental terms and cancellation policy
              </a>
            </label>
          </div>
          {errors.agreed && (
            <p className="text-red-500 text-sm">{errors.agreed}</p>
          )}
        </form>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="flex items-center justify-between gap-4">
          <Button
            size="lg"
            className="px-8 w-full"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {isFormValid
              ? "Confirmation & Pay"
              : "Please fill all fields correctly"}
          </Button>
        </div>
      </div>
    </div>
  );
}
