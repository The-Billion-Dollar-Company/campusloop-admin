import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetDashboardStatsQuery, useGetRecentActivityQuery } from "@/redux/features/admin/dashboard.api";
import { Users, Package, CheckCircle, Clock, UserCheck, XCircle } from "lucide-react";

const Analytics = () => {
  const { data: userInfo } = useUserInfoQuery();
  const { data: statsData, isLoading } = useGetDashboardStatsQuery();
  const { data: activityData } = useGetRecentActivityQuery({ limit: 5 });

  const stats = statsData?.data;

  const dashboardCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Pending Users",
      value: stats?.pendingUsers || 0,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Suspended Users",
      value: stats?.suspendedUsers || 0,
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: "Total Items",
      value: stats?.totalItems || 0,
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Published Items",
      value: stats?.publishedItems || 0,
      icon: CheckCircle,
      color: "text-teal-600",
    },
    {
      title: "Pending Items",
      value: stats?.pendingItems || 0,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Canceled Items",
      value: stats?.canceledItems || 0,
      icon: XCircle,
      color: "text-gray-600",
    },
  ];

  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Analytics</h1>
        <p className="text-muted-foreground">
          Welcome back, {userInfo?.data?.name}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activityData?.data && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activityData.data.recentUsers.length > 0 ? (
                  activityData.data.recentUsers.map((user: any) => (
                    <div key={user._id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        user.isStatus === "ACTIVE" ? "bg-green-100 text-green-800" :
                        user.isStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {user.isStatus}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent users</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activityData.data.recentItems.length > 0 ? (
                  activityData.data.recentItems.map((item: any) => (
                    <div key={item._id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">৳{item.price}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.status === "PUBLISHED" ? "bg-green-100 text-green-800" :
                        item.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent items</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Manage Users</h3>
                <p className="text-sm text-muted-foreground">
                  View and verify pending user registrations
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Manage Items</h3>
                <p className="text-sm text-muted-foreground">
                  Review and publish pending marketplace items
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
