import { getSession } from "../sessions";
import { redirect, Link, type MetaArgs, type LoaderFunctionArgs } from "react-router";
import { ArrowLeft, Calendar, MapPin, Car } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { formatRupiah } from "../lib/utils/format-rupiah";
import { format } from "date-fns";

export function meta({}: MetaArgs) {
  return [{ title: "My Bookings" }];
}

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  vehicle: {
    name: string;
    brand: string;
    imageUrl: string | null;
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!session.has("token")) {
    return redirect("/signin");
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/bookings`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.ok) {
     // Handle error or return empty list
     return { bookings: [] };
  }

  const result = await response.json();
  const bookings: Booking[] = Array.isArray(result) ? result : (result.data || []);
  
  return { bookings };
}

export default function BookingsRoute({ loaderData }: { loaderData: { bookings: Booking[] } }) {
  const { bookings } = loaderData;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4 max-w-2xl mx-auto">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">My Bookings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Car className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No bookings found.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex p-4 gap-4">
                  {/* Vehicle Image */}
                  <div className="w-24 h-24 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
                    {booking.vehicle.imageUrl ? (
                        <img 
                            src={booking.vehicle.imageUrl} 
                            alt={booking.vehicle.name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Car className="h-8 w-8" />
                        </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-lg truncate">{booking.vehicle.name}</h3>
                            <p className="text-sm text-slate-500">{booking.vehicle.brand}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                            ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-slate-100 text-slate-700'}`}>
                            {booking.status}
                        </span>
                    </div>

                    <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {format(new Date(booking.startDate), "dd MMM")} - {format(new Date(booking.endDate), "dd MMM yyyy")}
                            </span>
                        </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer / Actions */}
                <div className="bg-slate-50 px-4 py-3 border-t flex justify-between items-center">
                    <span className="text-sm text-slate-500">Total Price</span>
                    <span className="font-bold text-teal-600">{formatRupiah(booking.totalPrice)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
