import type React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SearchIcon, MapPinnedIcon, HeartIcon } from "./icons";
import { useAppStore } from "~/lib/booking-store";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  authRequired?: boolean;
}

const navItems: NavItem[] = [
  { label: "Search", icon: SearchIcon, href: "/" },
  { label: "Sign In", icon: SearchIcon, href: "/sign" },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isModalOpen } = useAppStore();

  const handleNavClick = (item: NavItem) => {
    if (item.authRequired && !isAuthenticated) {
      router.push("/login");
    } else {
      router.push(item.href);
    }
  };

  // Don't show on auth pages or booking flow pages
  const hideOnPaths = [
    "/login",
    "/register",
    "/booking",
    "/confirmation",
    "/vehicle",
    "/results",
  ];
  const shouldHide = hideOnPaths.some((path) => pathname.startsWith(path));

  if (shouldHide || isModalOpen) return null;

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <button
              key={item.href}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center gap-1 px-6 py-3 min-w-[80px] transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className={`text-xs ${isActive ? "font-medium" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
