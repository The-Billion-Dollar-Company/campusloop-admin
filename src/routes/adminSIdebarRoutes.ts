import Analytics from "@/pages/Analytics";
import ManageItems from "@/pages/Admin/ManageItems";
import ManageUsers from "@/pages/Admin/ManageUsers";
import Profile from "@/pages/Profile";
import type { ISidebarItems } from "@/types";

export const adminSidebarItems: ISidebarItems[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: Analytics,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Users",
        url: "/admin/users",
        component: ManageUsers,
      },
      {
        title: "Items",
        url: "/admin/items",
        component: ManageItems,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Profile",
        url: "/admin/profile",
        component: Profile,
      },
    ],
  },
];
