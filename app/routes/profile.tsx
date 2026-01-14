import { getSession } from "../sessions";
import type { Route } from "./+types/profile";
import type { UserAuthMe } from "../modules/user";
import { Card, CardContent } from "../components/ui/card";
import { redirect, Form } from "react-router";
import { User, ChevronRight, LogOut, Bell } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Profile" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!session.has("token")) {
    return redirect("/signin");
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/auth/me`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const user: UserAuthMe = await response.json();
  return { user };
}

export default function ProfileRoute({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <Bell className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* User Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center">
                <span className="text-white text-4xl font-semibold">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              
              {/* Name */}
              <div>
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <p className="text-slate-600">Guest</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking History Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🧍</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Booking History</h3>
                <p className="text-sm text-slate-600">
                  It's easy to start hosting and earn extra income.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card>
          <CardContent className="p-0">
            {/* View Profile */}
            <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b">
              <div className="flex items-center gap-4">
                <User className="h-6 w-6" />
                <span className="font-medium">View profile</span>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>

            {/* Log Out */}
            <Form method="post" action="/signout" className="w-full">
              <button
                type="submit"
                className="w-full flex items-center gap-4 p-6 hover:bg-slate-50 transition-colors text-left"
              >
                <LogOut className="h-6 w-6" />
                <span className="font-medium">Log out</span>
              </button>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
