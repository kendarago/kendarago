import { Outlet } from "react-router";
import { BottomNav } from "../components/bottom-nav";
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
