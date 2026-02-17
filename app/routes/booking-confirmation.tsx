import type { Route } from "./+types/booking-confirmation";
import { redirect, Link } from "react-router";
import { getSession } from "../sessions";
import { format } from "date-fns";
import { formatRupiah } from "~/lib/utils/format-rupiah";
import { Button } from "~/components/ui/button";
import {
  CheckCircle,
  Users,
  Cog,
  Gauge,
  MapPin,
  Clock,
  Share2,
  Phone,
} from "lucide-react";

interface BookingDetail {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  vehicle: {
    id: string;
    name: string;
    brand: string;
    imageUrl: string | null;
    transmission: string;
    seatCapacity: number;
    engineCapacity: string;
    pricePerDay: number;
    rentalCompany: {
      id: string;
      name: string;
      address: string;
      city: string;
      operatingHours: string;
      contact: string;
    };
  };
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
}

function generateBookingNumber(id: string, createdAt: string): string {
  const date = new Date(createdAt);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const suffix = id.slice(-4).toUpperCase();
  return `M-${year}${month}-${suffix}`;
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) {
    return redirect("/signin");
  }

  const { bookingId } = params;

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/bookings/${bookingId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    throw new Response("Booking not found", { status: 404 });
  }

  const booking: BookingDetail = await response.json();
  return { booking };
}

export default function BookingConfirmation({
  loaderData,
}: Route.ComponentProps) {
  const { booking } = loaderData;
  const bookingNumber = generateBookingNumber(booking.id, booking.createdAt);

  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const rentalCompany = booking.vehicle.rentalCompany;
  const whatsappNumber = rentalCompany.contact.replace(/\D/g, "");

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Success Header */}
      <div className="flex flex-col items-center pt-10 pb-6 bg-white">
        <div className="relative mb-4">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
          </div>
          {/* Decorative dots */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-emerald-300 rounded-full" />
          <div className="absolute -top-1 right-4 w-2 h-2 bg-emerald-200 rounded-full" />
          <div className="absolute top-0 -left-3 w-2.5 h-2.5 bg-emerald-300 rounded-full" />
          <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-emerald-200 rounded-full" />
          <div className="absolute -bottom-2 right-2 w-2 h-2 bg-emerald-300 rounded-full" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Vehicle Successfully Booked!
        </h1>
        <p className="text-sm text-gray-500">
          We've sent the details to your email.
        </p>
      </div>

      {/* Booking Receipt Card */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Booking Number */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-base font-bold text-gray-900">
              Booking Number
            </h2>
            <span className="text-base font-bold text-gray-900">
              {bookingNumber}
            </span>
          </div>

          {/* Dashed separator */}
          <div className="px-5">
            <div className="border-t-2 border-dashed border-gray-300" />
          </div>

          {/* Vehicle Info */}
          <div className="px-5 py-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                <img
                  src={booking.vehicle.imageUrl || "/placeholder-vehicle.png"}
                  alt={booking.vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 uppercase">
                  {booking.vehicle.name}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                    <Users className="w-3.5 h-3.5" />
                    {booking.vehicle.seatCapacity} Seats
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                    <Cog className="w-3.5 h-3.5" />
                    {booking.vehicle.transmission}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                    <Gauge className="w-3.5 h-3.5" />
                    {booking.vehicle.engineCapacity}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex justify-between mt-4">
              <div>
                <p className="text-xs text-teal-600 font-medium">Pick-up</p>
                <p className="text-sm font-semibold text-gray-900">
                  {format(startDate, "EEE, dd MMMM yyyy")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-teal-600 font-medium">Return</p>
                <p className="text-sm font-semibold text-gray-900">
                  {format(endDate, "EEE, dd MMMM yyyy")}
                </p>
              </div>
            </div>

            {/* Price Calculation */}
            <div className="mt-4 bg-teal-50 rounded-xl px-4 py-3">
              <p className="text-sm font-medium text-gray-700">
                {formatRupiah(booking.vehicle.pricePerDay)}/day × {days} days ={" "}
                <span className="font-bold text-teal-600">
                  {formatRupiah(booking.totalPrice)} total
                </span>
              </p>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="px-5">
            <div className="border-t-2 border-dashed border-gray-300" />
          </div>

          {/* User Info */}
          <div className="px-5 py-4">
            <p className="text-sm font-bold text-gray-900">
              {booking.user.fullName}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              {booking.user.phoneNumber}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">{booking.user.email}</p>
          </div>

          {/* Dashed separator */}
          <div className="px-5">
            <div className="border-t-2 border-dashed border-gray-300" />
          </div>

          {/* Rental Company Info */}
          <div className="px-5 py-4 flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {rentalCompany.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {rentalCompany.address}, {rentalCompany.city}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                {rentalCompany.operatingHours}
              </p>
            </div>
          </div>
          <div className="flex gap-3 px-5 pb-5">
            <Button
              variant="outline"
              className="flex-1 h-12 gap-2 rounded-xl border-teal-600 text-teal-600 hover:bg-teal-50"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Booking Confirmation",
                    text: `Booking ${bookingNumber} - ${booking.vehicle.name}`,
                  });
                }
              }}
            >
              <Share2 className="w-4 h-4" />
              Share Receipt
            </Button>
            <Button
              className="flex-1 h-12 gap-2 rounded-xl bg-teal-600 hover:bg-teal-700"
              asChild
            >
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="w-4 h-4" />
                Contact Us
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mx-4 mt-6 space-y-3">
        <Button
          className="w-full h-12 rounded-xl bg-teal-600 hover:bg-teal-700"
          asChild
        >
          <Link to="/">Return to home</Link>
        </Button>
      </div>
    </div>
  );
}
