
import {
  Outlet,
  redirect,
  useLoaderData,
  Link,
  useLocation,
} from "react-router";
import type { Route } from "./+types/layout-rental";
import { getSession } from "../sessions";
import type { UserAuthMe } from "../modules/user";
import {
  LayoutDashboard,
  CalendarCheck,
  CarFront,
  Settings,
  LogOut,
  Building2,
} from "lucide-react";
import { Button } from "../components/ui/button";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) {
    return redirect("/signin");
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/auth/me`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    return redirect("/signin");
  }

  const user: UserAuthMe = await response.json();

  if (user.role !== "PROVIDER") {
    return redirect("/dashboard");
  }

  if (!user.rentalCompanyId) {
    // Should not happen for valid PROVIDER but safety check
    return redirect("/dashboard");
  }

  return { user };
}

export default function LayoutRental({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const location = useLocation();

  const navItems = [
    {
      label: "Bookings",
      href: "/rental/bookings",
      icon: CalendarCheck,
    },
    {
      label: "Vehicles",
      href: "/rental/vehicles",
      icon: CarFront,
    },
    {
      label: "Company Profile",
      href: "/rental/profile",
      icon: Building2,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b flex items-center gap-2">
          <img src="/images/kendarago_logo_v2.png" alt="Logo" className="h-8" />
          <span className="font-bold text-lg">Provider Panel</span>
        </div>

        <div className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
              {user.fullName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {user.role.toLowerCase()}
              </p>
            </div>
          </div>
          <form action="/signout" method="post">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <img
              src="/images/kendarago_logo_v2.png"
              alt="Logo"
              className="h-6"
            />
            <span className="font-bold">Provider Panel</span>
          </div>
          <form action="/signout" method="post">
            <Button variant="ghost" size="icon" className="text-red-600">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sign out</span>
            </Button>
          </form>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Bottom Nav for Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-20">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center p-2 text-xs font-medium ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                <item.icon className={`h-6 w-6 mb-1 ${isActive ? "fill-current" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
