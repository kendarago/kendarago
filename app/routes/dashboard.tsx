import { getSession } from "../sessions";
import type { Route } from "./+types/dashboard";
import type { UserAuthMe } from "../modules/user";
import { Card, CardContent } from "../components/ui/card";
import { redirect } from "react-router";
import { User } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard" }];
}

export async function loader({ request }: Route.ClientLoaderArgs) {
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

export default function DashboardRoute({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      {/* Container dengan border dashed biru sesuai gambar */}
      <div className="relative border-2 border-dashed border-blue-400 p-1">
        {/* Label Kendarago di bagian atas */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-50 px-2 z-10">
          <span className="text-xs font-mono border border-dotted border-blue-500 px-1 bg-white">
            Kendarago
          </span>
        </div>

        <Card className="w-[450px] border-none shadow-none bg-transparent">
          <CardContent className="pt-12 pb-16 px-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="border-[1.5px] border-black p-2 mb-4 bg-white">
                <User className="h-10 w-10 text-black" strokeWidth={1.5} />
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-900">
                  {user.fullName}
                </span>
                <span className="text-lg text-teal-500 font-medium"></span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-900">
                  {user.email}
                </span>
                <button className="text-lg text-teal-500 font-medium hover:underline transition-all"></button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
//     <div className="flex flex-col items-center">
//       <div className="w-full max-w-xs">
//         <h1>Dashboard</h1>
//         <Card>
//           <h2>{user.fullName}</h2>
//           <p>{user.email}</p>
//         </Card>
//       </div>
//     </div>
//   );
// }
