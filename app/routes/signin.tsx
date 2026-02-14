import type { Route } from "./+types/signin";
import { useState } from "react";
import { Form, redirect } from "react-router";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { getSession, commitSession } from "../sessions";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Signin" }];
}

//signin validation with zod
export const signinValidation = () => {
  return z.object({
    email: z.email("Invalid Email Format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });
};

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("token")) {
    return redirect("/dashboard");
  }

  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  const signinBody = {
    email,
    password,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_API_URL}/auth/signin`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signinBody),
      },
    );

    if (response.status !== 200) {
      const error = await response.json();
      return { error: error.message || "Signin failed" };
    }

    const token = await response.json();

    session.set("token", token);

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("Signin request failed:", error);
    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

export default function SignInRoute({ actionData }: Route.ComponentProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8 transition-all duration-300 hover:shadow-2xl">
        {/* Logo */}
        <div className="flex gap-2 justify-center mb-6">
          <img
            src="/images/kendarago_logo_v2.png"
            alt="Kendarago Logo"
            className="h-8 mb-2"
          />
          <h1 className="text-2xl font-bold text-foreground">Kendarago</h1>
        </div>
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500">Continue to your account</p>
        </div>

        {/* Form */}
        <Form method="POST" className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 block"
            >
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Password Field */}

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 block"
            >
              password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {/* Error Message */}
          {actionData?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">{actionData.error}</p>
            </div>
          )}
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Sign In
          </Button>
        </Form>

        {/* Footer Link */}
        <div className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-black-600 hover:underline font-medium"
          >
            Register here
          </a>
        </div>
      </div>
    </div>
  );
}
