export type VehicleCategory = "motorcycle" | "car";

export type MotorcycleType =
  | "scooter"
  | "sport"
  | "cruiser"
  | "adventure"
  | "naked";
export type CarType = "sedan" | "suv" | "hatchback" | "mpv" | "pickup";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: VehicleCategory;
  type: MotorcycleType | CarType;
  pricePerDay: number;
  image: string;
  shopName: string;
  shopAddress: string;
  distance: number;
  openingHours: string;
  specs: {
    engine: string;
    transmission: string;
    fuelCapacity: string;
    seatHeight?: string;
    seats?: number;
  };
  requirements: string[];
  available: boolean;
}

export interface Location {
  name: string;
  lat: number;
  lng: number;
}

export interface BookingFormData {
  startDate: Date | null;
  endDate: Date | null;
  fullName: string;
  whatsappNumber: string;
  idDocument: File | null;
  termsAccepted: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  vehicle: Vehicle;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  customerName: string;
  whatsappNumber: string;
  status: "confirmed" | "pending" | "cancelled";
}

export type SortOption = "cheapest" | "closest" | "newest";

export interface FilterState {
  priceRange: [number, number];
  vehicleType: string | null;
  sortBy: SortOption;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  createdAt: Date;
}
