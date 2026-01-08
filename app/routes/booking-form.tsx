import type { Route } from "./+types/booking-form";
import { useState } from "react";
import { differenceInDays } from "date-fns";
import { DatePicker } from "~/components/date-picker";
import { z } from "zod";

// ──────────────────────────────────────────────────────────────
// Zod Schema (English messages)
// ──────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────
export default function RentalForm() {
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

  const pricePerDay = 360000;
  const days =
    startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const totalPrice = days * pricePerDay;

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
    console.log({ fullName, phone, startDate, endDate, totalPrice, fileName });
  };

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-teal-500 to-teal-600 p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-white pt-8 pb-6 px-6">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-gray-200 border-2 border-dashed rounded-xl" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Nmax Turbo v3
                </h1>
                <p className="text-gray-600 text-sm">Toko Yamaha Rental</p>
                <p className="text-2xl font-bold text-teal-600 mt-2">
                  Rp 360,000/day
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-8">
            {/* Rental Period */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Rental Period
            </h3>
            <div className="flex gap-2 mb-6">
                <DatePicker label="From" />
                <DatePicker label="To" />
            </div>

            {/* Date error */}
            {errors.date && (
              <p className="text-red-500 text-sm -mt-4 mb-4">{errors.date}</p>
            )}

            {/* Total Price */}
            {days > 0 && (
              <div className="bg-teal-50 rounded-xl p-5 text-center mb-8">
                <p className="text-2xl font-bold text-teal-600">
                  Rp 360,000/day × {days} days ={" "}
                  <span className="text-3xl">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>{" "}
                  total
                </p>
              </div>
            )}

            {/* Full Name */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* WhatsApp */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62 812 3456 7890"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Upload ID */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo of ID (KTP/SIM)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="ktp"
                />
                <label htmlFor="ktp" className="cursor-pointer">
                  <span className="text-teal-600 font-medium underline">
                    Choose File
                  </span>{" "}
                  <span className="text-gray-500">{fileName}</span>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Max 5 MB | JPG, PNG or PDF
                </p>
              </div>
              {errors.file && (
                <p className="text-red-500 text-sm mt-1">{errors.file}</p>
              )}
            </div>

            {/* Agreement */}
            <div className="flex items-start gap-3 mb-6">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
              />
              <label className="text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-teal-600 underline">
                  rental terms and cancellation policy
                </a>
              </label>
            </div>
            {errors.agreed && (
              <p className="text-red-500 text-sm -mt-4 mb-4">{errors.agreed}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl text-white font-semibold text-lg bg-teal-500 hover:bg-teal-600 transition-all"
            >
              Continue to Payment
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
