import type { Route } from "./+types/signup-provider";
import { Form, redirect, useActionData } from "react-router";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { z } from "zod";

// META
export function meta({}: Route.MetaArgs) {
  return [{ title: "Provider Sign Up" }];
}

// VALIDATION WITH ZOD VALIDATION
export const signupProviderValidation = () => {
  return z
    .object({
      fullName: z.string().min(3, "Full name is required"),
      email: z.string().email("Invalid Email Format"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z
        .string()
        .min(8, "Confirm password must be at least 8 characters"),
      phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 characters"),
      companyName: z.string().min(3, "Company name is required"),
      address: z.string().min(5, "Address is required"),
      city: z.string().min(3, "City is required"),
      operatingHours: z.string().min(3, "Operating hours are required"),
      contact: z.string().min(10, "Contact number is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Confirmation password is incorrect",
      path: ["confirmPassword"],
    });
};

// CLIENT ACTION
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  const schema = signupProviderValidation();
  const parsed = schema.safeParse(data);

  // ZOD FAILED
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.format(),
    };
  }

  const registerBody = {
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    password: parsed.data.password,
    phoneNumber: parsed.data.phoneNumber,
    companyName: parsed.data.companyName,
    address: parsed.data.address,
    city: parsed.data.city,
    operatingHours: parsed.data.operatingHours,
    contact: parsed.data.contact,
  };

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/auth/signup/provider`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerBody),
    },
  );

  const result = await response.json();

  // BACKEND FAILED
  if (!response.ok) {
    return {
      serverError: result.message || "Provider signup failed",
    };
  }

  // SUCCESS
  return redirect("/signin");
}

// COMPONENT UI
export default function SignupProviderRoute() {
  const actionData = useActionData<{
    fieldErrors?: any;
    serverError?: string;
  }>();

  const errors = actionData?.fieldErrors || {};
  const serverError = actionData?.serverError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-2xl border border-gray-200 shadow-md">
        <CardContent className="pt-8 pb-6 px-8">
          {/* Logo */}
          <div className="flex gap-2 justify-center mb-6">
            <img
              src="/images/kendarago_logo_v2.png"
              alt="Kendarago Logo"
              className="h-8 mb-2"
            />
            <h1 className="text-2xl font-bold text-foreground">Kendarago</h1>
          </div>
          <h2 className="text-2xl font-semibold text-center mb-1">
            Create a Provider Account
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Register your rental company to start accepting bookings
          </p>

          {/* SERVER ERROR */}
          {serverError && (
            <p className="text-red-600 text-sm text-center mb-4">
              {serverError}
            </p>
          )}

          <Form method="post" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg border-b pb-2">Personal Information</h3>
                
                {/* FULL NAME */}
                <div className="space-y-1">
                  <Label>Full Name</Label>
                  <Input name="fullName" placeholder="John Doe" />
                  {errors.fullName?._errors && (
                    <p className="text-red-500 text-sm">
                      {errors.fullName._errors[0]}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input name="email" type="email" placeholder="m@example.com" />
                  {errors.email?._errors && (
                    <p className="text-red-500 text-sm">
                      {errors.email._errors[0]}
                    </p>
                  )}
                </div>

                {/* PHONE NUMBER */}
                <div className="space-y-1">
                  <Label>Phone Number</Label>
                  <Input name="phoneNumber" placeholder="+62 812-3456-7890" />
                  {errors.phoneNumber?._errors && (
                    <p className="text-red-500 text-sm">
                      {errors.phoneNumber._errors[0]}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input name="password" type="password" />
                  {errors.password?._errors && (
                    <p className="text-red-500 text-sm">
                      {errors.password._errors[0]}
                    </p>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="space-y-1">
                  <Label>Confirm Password</Label>
                  <Input name="confirmPassword" type="password" />
                  {errors.confirmPassword?._errors && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword._errors[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Company Info Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg border-b pb-2">Company Information</h3>

                {/* COMPANY NAME */}
                <div className="space-y-1">
                  <Label>Company Name</Label>
                  <Input name="companyName" placeholder="Kendarago Rentals" />
                  {errors.companyName?._errors && (
                    <p className="text-red-500 text-sm">
                      {errors.companyName._errors[0]}
                    </p>
                  )}
                </div>

                {/* CITY */}
                <div className="space-y-1">
                  <Label>City</Label>
                  <Input name="city" placeholder="Jakarta" />
                  {errors.city?._errors && (
                    <p className="text-red-500 text-sm">
                      {errors.city._errors[0]}
                    </p>
                  )}
                </div>

                {/* ADDRESS */}
                <div className="space-y-1">
                  <Label>Address</Label>
                  <Input name="address" placeholder="Jl. Sudirman No. 1" />
                  {errors.address?._errors && (
                    <p className="text-red-500 text-sm">
                      {errors.address._errors[0]}
                    </p>
                  )}
                </div>

                {/* OPERATING HOURS */}
                <div className="space-y-1">
                  <Label>Operating Hours</Label>
                  <Input name="operatingHours" placeholder="08:00 - 20:00" />
                  {errors.operatingHours?._errors && (
                    <p className="text-red-500 text-sm">
                      {errors.operatingHours._errors[0]}
                    </p>
                  )}
                </div>

                {/* CONTACT */}
                <div className="space-y-1">
                  <Label>Company Contact</Label>
                  <Input name="contact" placeholder="+62 812-3456-7890" />
                  {errors.contact?._errors && (
                    <p className="text-red-500 text-sm">
                      {errors.contact._errors[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 mt-6"
            >
              Create Provider Account
            </Button>
          </Form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/signin" className="text-black hover:underline">
              Sign in
            </a>
          </p>
          <p className="text-center text-sm text-gray-600 mt-2">
            Looking to rent a vehicle?{" "}
            <a href="/signup" className="text-black hover:underline">
              Sign up as a Renter
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
