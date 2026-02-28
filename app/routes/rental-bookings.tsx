import type { Route } from "./+types/rental-bookings";
import { useLoaderData, useRevalidator, redirect } from "react-router";
import { getSession } from "../sessions";
import { formatRupiah } from "../lib/utils/format-rupiah";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Check,
  X,
  CheckSquare,
  Clock,
  AlertTriangle,
  CalendarCheck,
  CarFront,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Manage Bookings" }];
}

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  totalPrice: number;
  vehicle: {
    id: string;
    name: string;
    brand: string;
    imageUrl: string | null;
  };
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) return redirect("/signin");

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "";

  const apiUrl = new URL(
    `${import.meta.env.VITE_BACKEND_API_URL}/bookings/rental-company`
  );
  if (status) apiUrl.searchParams.set("status", status);

  const response = await fetch(apiUrl.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 401) return redirect("/signin");
    throw new Error("Failed to load bookings");
  }

  const bookings: Booking[] = await response.json();
  return { bookings };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  if (!token) return redirect("/signin");

  const formData = await request.formData();
  const bookingId = formData.get("bookingId");
  const newStatus = formData.get("status");

  if (!bookingId || !newStatus) {
    return { error: "Invalid action" };
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/bookings/${bookingId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to update status" };
  }

  return { success: true };
}

export default function RentalBookings({ loaderData }: Route.ComponentProps) {
  const { bookings } = loaderData;
  const revalidator = useRevalidator();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500 hover:bg-green-600";
      case "PENDING":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "COMPLETED":
        return "bg-blue-500 hover:bg-blue-600";
      case "CANCELLED":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your incoming and active bookings
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="rounded-full bg-gray-100 p-3 mb-4">
            <CalendarCheck className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium">No bookings found</h3>
          <p className="text-sm text-gray-500 mt-1">
            You don't have any bookings matching your criteria yet.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden flex flex-col">
              <div className="aspect-video w-full bg-gray-100 relative">
                {booking.vehicle.imageUrl ? (
                  <img
                    src={booking.vehicle.imageUrl}
                    alt={booking.vehicle.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <CarFront className="h-10 w-10" />
                  </div>
                )}
                <Badge
                  className={`absolute top-2 right-2 ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-1">
                  {booking.vehicle.name}
                </CardTitle>
                <CardDescription className="line-clamp-1">
                  {booking.vehicle.brand} • {booking.user.fullName}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 text-sm space-y-2 pb-3">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Start
                  </span>
                  <span className="font-medium">
                    {formatDate(booking.startDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> End
                  </span>
                  <span className="font-medium">
                    {formatDate(booking.endDate)}
                  </span>
                </div>
                <div className="pt-2 mt-2 border-t flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-primary">
                    {formatRupiah(booking.totalPrice)}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-0 grid grid-cols-2 gap-2">
                {booking.status === "PENDING" && (
                  <>
                    <form method="post" className="w-full">
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <input type="hidden" name="status" value="CONFIRMED" />
                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </form>
                    <form method="post" className="w-full">
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <input type="hidden" name="status" value="CANCELLED" />
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </form>
                  </>
                )}

                {booking.status === "CONFIRMED" && (
                  <>
                    <form method="post" className="w-full col-span-2">
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <input type="hidden" name="status" value="COMPLETED" />
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <CheckSquare className="h-4 w-4 mr-1" />
                        Complete Booking
                      </Button>
                    </form>
                  </>
                )}

                {(booking.status === "COMPLETED" ||
                  booking.status === "CANCELLED") && (
                  <Button
                    variant="secondary"
                    className="w-full col-span-2"
                    disabled
                    size="sm"
                  >
                    No actions available
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
