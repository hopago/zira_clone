import { SettingsIcon, UserIcon } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

export const sidebarRoutes = [
  {
    label: "홈페이지",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "내 업무",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "내 구성원",
    href: "/members",
    icon: UserIcon,
    activeIcon: UserIcon,
  },
  {
    label: "설정",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
];
