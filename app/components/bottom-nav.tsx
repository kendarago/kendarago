import type React from "react";
import { SearchIcon, Icon, CircleUserRound, LogOut } from "lucide-react";
import { Link, useLocation, useParams, useRouteLoaderData } from "react-router";
import { useRentVehicles } from "../context/rent-vehicles-context";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  authRequired?: boolean;
  showWhenAuthenticated?: boolean;
  showWhenNotAuthenticated?: boolean;
}

const navItems: NavItem[] = [
  { 
    label: "Search", 
    icon: SearchIcon, 
    href: "/",
    showWhenAuthenticated: true,
    showWhenNotAuthenticated: true,
  },
  { 
    label: "Sign In", 
    icon: CircleUserRound, 
    href: "/signin",
    showWhenNotAuthenticated: true,
  },
  { 
    label: "Sign Up", 
    icon: CircleUserRound, 
    href: "/signup",
    showWhenNotAuthenticated: true,
  },
  {
    label: "Profile",
    icon: CircleUserRound,
    href: "/profile",
    showWhenAuthenticated: true,
  },
];

export function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isModalOpen } = useRentVehicles();
  const rootData = useRouteLoaderData<{ isAuthenticated: boolean }>("root");
  const isAuthenticated = rootData?.isAuthenticated ?? false;

  // const handleNavClick = (item: NavItem) => {
  //   if (item.authRequired && !isAuthenticated) {
  //     router.push("/login");
  //   } else {
  //     router.push(item.href);
  //   }
  // };

  // Don't show on auth pages or booking flow pages
  const hideOnPaths: String[] = [
    "/login",
    "/register",
    "/booking",
    "/confirmation",
    "/vehicle-detail",
    "/results",
  ];


  const shouldHide = hideOnPaths.some((path) =>
    location.pathname.startsWith(path.toString())
  );
  if (shouldHide || isModalOpen) return null;

  // Filter nav items based on authentication status
  const visibleNavItems = navItems.filter((item) => {
    if (isAuthenticated) {
      return item.showWhenAuthenticated === true;
    } else {
      return item.showWhenNotAuthenticated === true;
    }
  });

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around">
        {visibleNavItems.map((item) => {
          const isActive =
            currentPath === item.href ||
            (item.href !== "/" && currentPath.startsWith(item.href));

          const Icon = item.icon;
          return (
            <Link
              to={item.href}
              className={`flex flex-col items-center gap-1 px-6 py-3 min-w-20 transition-colors               ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className={`text-xs`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
