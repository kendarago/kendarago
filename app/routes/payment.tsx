import type { Route } from "./+types/payment";
import { redirect, Link, Form, useNavigation } from "react-router";
import { getSession } from "../sessions";
import { formatRupiah } from "~/lib/utils/format-rupiah";
import { Button } from "~/components/ui/button";
import { ArrowLeft, CreditCard, Wallet, Building2 } from "lucide-react";
import { useState } from "react";

interface BookingDetail {
  id: string;
  totalPrice: number;
  vehicle: {
    name: string;
    imageUrl: string | null;
  };
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
    }
  );

  if (!response.ok) {
    throw new Response("Booking not found", { status: 404 });
  }

  const booking: BookingDetail = await response.json();
  return { booking };
}

export async function action({ request, params }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) {
    return redirect("/signin");
  }

  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { rentalCompanySlug, vehicleSlug, bookingId } = params;
  return redirect(
    `/vehicles-detail/${rentalCompanySlug}/${vehicleSlug}/book-confirm/${bookingId}`
  );
}

export default function Payment({ loaderData }: Route.ComponentProps) {
  const { booking } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

  const paymentMethods = [
    { id: "bank_transfer", label: "Bank Transfer (Virtual Account)", icon: Building2 },
    { id: "credit_card", label: "Credit / Debit Card", icon: CreditCard },
    { id: "ewallet", label: "E-Wallet (GoPay, OVO, Dana)", icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-4">
        <Link to={-1 as any}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Payment</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      <div className="p-4 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Order Summary</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
              <img
                src={booking.vehicle.imageUrl || "/placeholder-vehicle.png"}
                alt={booking.vehicle.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{booking.vehicle.name}</h3>
              <p className="text-sm text-gray-500">Booking ID: {booking.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Payment</span>
            <span className="text-xl font-bold text-teal-600">
              {formatRupiah(booking.totalPrice)}
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <label
                  key={method.id}
                  className={`flex items-center p-4 bg-white border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? "border-teal-600 ring-1 ring-teal-600 shadow-sm"
                      : "border-gray-200 hover:border-teal-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="hidden"
                  />
                  <div className={`p-2 rounded-lg mr-4 ${
                    paymentMethod === method.id ? "bg-teal-50 text-teal-600" : "bg-gray-50 text-gray-500"
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-gray-900">{method.label}</span>
                  <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === method.id ? "border-teal-600" : "border-gray-300"
                  }`}>
                    {paymentMethod === method.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Form method="post">
          <input type="hidden" name="paymentMethod" value={paymentMethod} />
          <Button
            size="lg"
            className="w-full h-14 text-lg font-semibold"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </span>
            ) : (
              `Pay ${formatRupiah(booking.totalPrice)}`
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
}
