import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSIdebarRoutes";
import { generateRoutes } from "@/utils/generateRoutes";
import Unauthorized from "@/pages/Unauthorized";
import { withAuth } from "@/utils/withAuth";
import { role } from "@/constants/role";
import type { TRole } from "@/types";

export const router = createBrowserRouter([
    {
        Component: App,
        path: '/',
        children: [
            {
                index: true,
                element: <Navigate to='/login' />,
            },
        ]
    },
    {
        Component: withAuth(DashboardLayout, role.admin as TRole),
        path: '/admin',
        children: [
            { index: true, element: <Navigate to='/admin/analytics' /> }, 
            ...generateRoutes(adminSidebarItems)
        ]
    },
    {
        Component: Login,
        path: '/login'
    },
    {
        Component: Unauthorized,
        path: '/unauthorized'
    }
]);
