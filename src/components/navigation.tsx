import Link from "next/link";

import { sidebarRoutes } from "./constants/routes";

import { cn } from "@/lib/utils";

export const Navigation = () => {
  return (
    <div className="flex flex-col">
      {sidebarRoutes.map((route) => {
        const isActive = false;
        const Icon = isActive ? route.activeIcon : route.icon;

        return (
          <Link key={route.href} href={route.href}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {route.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
