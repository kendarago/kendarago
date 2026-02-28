export type UserAuthMe = {
  id: string;
  email: string;
  phonenumber: string | null;
  fullName: string;
  role: "RENTER" | "PROVIDER";
  rentalCompanyId: string | null;
  createdAt: string;
  updatedAt: string;
};
