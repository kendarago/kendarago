import type { Route } from "./+types/signup";
import { useState } from "react";
import { Form, redirect } from "react-router";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { z, ZodError } from "zod";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Sign Up" }];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const password = formData.get("password");

  const registerBody = {
    fullName,
    email,
    password,
  };

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/auth/signup`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerBody),
    }
  );

  const result = await response.json();
  console.log(result);

  return redirect("/signin");
}

//VALIDATION WITH ZOD
export const signupValidation = () => {
  return z
    .object({
      fullName: z.string().min(3, "Full name is required"),
      email: z.string().email("Invalid Email Format"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z
        .string()
        .min(8, "Confirm password must be at least 8 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Confirmation password is incorrect",
      path: ["confirmPassword"],
    });
};
// Signup Form Component
export default function signupRoute() {
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    const schema = signupValidation();
    const result = schema.safeParse(data);

    // if (!result.success) {
    //   console.log("VALIDATION FAILED:", result.error.format());
    // } else {
    //   console.log("VALIDATION PASSED:", result.data);
    // }
    if (!result.success) {
      setErrors(result.error.format());
      return;
    }

    setErrors({});
    console.log("VALIDATION PASSED:", result.data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border border-gray-200 shadow-md">
        <CardContent className="pt-8 pb-6 px-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="h-10 w-10 bg-black rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-center mb-1">
            Create your account
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Enter your email below to create your account
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              <Input name="email" placeholder="m@example.com" type="email" />
              {errors.email?._errors && (
                <p className="text-red-500 text-sm">
                  {errors.email._errors[0]}
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

            <Button
              className="w-full bg-black text-white hover:bg-gray-800"
              type="submit"
            >
              Create Account
            </Button>
          </form>

          {/* Already have account */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-black hover:underline">
              Sign in
            </a>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-gray-400 mt-6">
            By clicking continue, you agree to our{" "}
            <a className="text-black hover:underline">Terms of Service</a> and{" "}
            <a className="text-black hover:underline">Privacy Policy</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
