import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSIdebarRoutes";
import type { TRole } from "@/types";

export const getSidebarItems = (userRole: TRole) => {
    switch (userRole) {
        case role.admin:
        case role.superAdmin:
            return [...adminSidebarItems];
        default:
            return [];
    }
}
