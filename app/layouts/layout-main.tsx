import { Outlet, redirect } from "react-router";
import { BottomNav } from "../components/bottom-nav";
import type { Route } from "./+types/layout-main";
import { getSession, destroySession } from "~/sessions";
export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  console.log("Layout Main Loader - Token:", token);

  const response = await fetch(
    import.meta.env.VITE_BACKEND_API_URL + "/auth/me",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok && token) {
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
  return;
}
export default function UserLayout() {
  return (
    <div className="mx-auto max-w-md min-h-screen bg-background flex flex-col relative">
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
