import { useUserInfoQuery } from "@/redux/features/auth/auth.api"
import type { TRole } from "@/types"
import type { ComponentType } from "react"
import { Navigate } from "react-router"
import { Loader2 } from "lucide-react"

export const withAuth = (Component: ComponentType, _requiredRole: TRole) => {
    return function AuthWrapper() {
        const { data, isLoading, error } = useUserInfoQuery();

        // Show loading state while checking authentication
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                </div>
            )
        }

        // If user data doesn't exist or error occurred, redirect to login
        if (error || !data?.data?._id) {
            return <Navigate to='/login' replace />
        }

        // Check if user has admin role
        const userRole = data.data.activeRole;
        const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

        if (!isAdmin) {
            return <Navigate to='/unauthorized' replace />
        }

        // User is authenticated and has admin role
        return <Component />
    }
}