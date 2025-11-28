import { baseApi } from "@/redux/baseApi";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  suspendedUsers: number;
  totalItems: number;
  publishedItems: number;
  pendingItems: number;
  canceledItems: number;
}

interface RecentActivity {
  recentUsers: any[];
  recentItems: any[];
}

interface DashboardStatsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: DashboardStats;
}

interface RecentActivityResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: RecentActivity;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get dashboard statistics
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: "/admin/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["USERS", "ITEMS"],
    }),

    // Get recent activity
    getRecentActivity: builder.query<RecentActivityResponse, { limit?: number }>({
      query: (params) => ({
        url: "/admin/dashboard/recent-activity",
        method: "GET",
        params,
      }),
      providesTags: ["USERS", "ITEMS"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
} = dashboardApi;
