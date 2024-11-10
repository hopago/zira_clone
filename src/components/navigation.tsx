"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useParamsId } from "@/features/hooks/use-params-id";

import { sidebarRoutes } from "./constants/routes";

import { cn } from "@/lib/utils";

export const Navigation = () => {
  const workspaceId = useParamsId();
  const pathname = usePathname();

  return (
    <div className="flex flex-col">
      {sidebarRoutes.map((route) => {
        const fullHref = `/workspaces/${workspaceId}${route.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? route.activeIcon : route.icon;

        return (
          <Link key={route.href} href={fullHref}>
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
