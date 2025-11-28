# CampusLoop Admin Dashboard - AI Coding Instructions

## Project Overview
React + TypeScript + Vite admin dashboard for CampusLoop - a university-based marketplace platform. Admins manage users (verify/suspend) and marketplace items (approve/reject). Uses Redux Toolkit Query with Axios for API communication and JWT cookie-based authentication.

## Architecture Patterns

### Authentication & Authorization
- **Admin-Only Access**: Only `ADMIN` and `SUPER_ADMIN` roles can access the dashboard
- **University Email Required**: All logins must use `@cse.bubt.edu.bd` email addresses
- **JWT Cookie Auth**: Backend uses JWT tokens stored in HTTP-only cookies (no Firebase/OTP)
- **Route Protection**: `withAuth(Component, role.admin)` HOC from `src/utils/withAuth.tsx`
  - Checks auth via `useUserInfoQuery()` which calls `/auth/me`
  - Redirects unauthenticated users to `/login`
  - Redirects non-admin roles to `/unauthorized`

### Routing System
- **Declarative Routes**: Auto-generated from sidebar config in `src/routes/adminSIdebarRoutes.ts`
- **Single Role**: Only admin routes exist (no multi-role routing)
- **Structure**: `{ title: string; items: { title: string; url: string; component: ComponentType }[] }[]`
- **Lazy Loading**: `const Analytics = lazy(() => import('@/pages/Analytics'))`
- **Base Path**: All admin routes are under `/admin/*`

### State Management (Redux Toolkit Query)
- **Base API**: All endpoints inject into `src/redux/baseApi.ts`
- **Custom Axios Base Query**: Uses `axiosBaseQuery()` instead of fetchBaseQuery
  - Configured in `src/lib/axios.ts` with `withCredentials: true` for cookies
  - Base URL: `http://localhost:9000/api/v1` (from `.env` → `VITE_BASE_URL`)
- **Cache Tags**: `["USER", "USERS", "ITEMS"]` for automatic invalidation
- **API Files**:
  - `src/redux/features/auth/auth.api.ts` - Login, logout, userInfo
  - `src/redux/features/admin/admin.api.ts` - User management (GET, PATCH, DELETE)
  - `src/redux/features/admin/item.api.ts` - Item management (GET, PATCH, DELETE)
  - `src/redux/features/admin/dashboard.api.ts` - Dashboard statistics and recent activity

### Admin Features

#### User Management (`/admin/users`)
- **Actions**: 
  - Verify (PENDING → ACTIVE + isVerified: true)
  - Suspend (ACTIVE → SUSPEND)
  - Activate (SUSPEND → ACTIVE)
  - Delete user
- **Filters**: Search by name/email, filter by status (PENDING/ACTIVE/SUSPEND)
- **Display**: Name, email, universityId, role, status, isVerified flag
- **API**: `useGetAllUsersQuery`, `useUpdateUserStatusMutation`, `useDeleteUserMutation`
- **Note**: Verify action sets both `isStatus: ACTIVE` and `isVerified: true`

#### Item Management (`/admin/items`)
- **Actions**: Publish (PENDING → PUBLISHED), Reject (PENDING → CANCEL), Delete
- **Filters**: Search by title, filter by status (PENDING/PUBLISHED/CANCEL)
- **Display**: Title, category, price, status, availability, owner (populated)
- **API**: `useGetAllItemsQuery`, `useUpdateItemStatusMutation`, `useDeleteItemMutation`

#### Dashboard Analytics (`/admin`)
- **Statistics**: 
  - User counts: total, active, pending, suspended
  - Item counts: total, published, pending, canceled
- **Recent Activity**: Last 5 users and items
- **API**: `useGetDashboardStatsQuery`, `useGetRecentActivityQuery`

### Form Handling
- **Standard Pattern**: React Hook Form + Zod + shadcn/ui components
- **Login Form**: Email validation with `.endsWith("@cse.bubt.edu.bd")` check
- **Example**:
  ```typescript
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" }
  });
  ```

### UI Components (shadcn/ui)
- Located in `src/components/ui/`
- Use `cn()` from `src/lib/utils.ts` for className merging (clsx + tailwind-merge)
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Dark mode via `next-themes` (ThemeProvider in `src/provider/theme-provider.tsx`)
- Common patterns: Card, Table, Button, Select, Input

## TypeScript Types

### User Types
```typescript
enum Status { PENDING, ACTIVE, SUSPEND }
enum Role { BUYER, SELLER, ADMIN, SUPER_ADMIN }
interface IUser {
  _id: string;
  name: string;
  email: string;
  universityId?: string;
  activeRole: Role;
  isVerified: boolean;
  isStatus: Status;
  // ... other fields
}
```

### Item Types
```typescript
enum ItemStatus { PENDING, PUBLISHED, CANCEL }
enum Availability { IN_STOCK, RENTED, SOLD }
enum ItemCategory { RENT, SELL, SKILL }
enum ObjectCategory { ELECTRONICS, BOOKS, FURNITURE, ... }
interface IItem {
  _id: string;
  ownerId: string | IUser;
  title: string;
  price: number;
  status: ItemStatus;
  availability: Availability;
  sellingCategory: ItemCategory;
  objectCategory: ObjectCategory;
  // ... other fields
}
```

## Development Workflow

### Running the App
```bash
npm run dev       # Start dev server (Vite)
npm run build     # TypeScript check + Vite build
npm run lint      # ESLint
```

### Adding New Admin Features
1. **New Page**: Create in `src/pages/Admin/PageName.tsx`
2. **Add to Sidebar**: Update `src/routes/adminSIdebarRoutes.ts`
3. **Create API**: Add endpoints to `src/redux/features/admin/*.api.ts`
4. **Use Hooks**: `useGetDataQuery`, `useMutationMutation` in component
5. **Invalidate Tags**: On mutations to trigger auto-refetch

### API Endpoint Pattern
```typescript
export const featureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getData: builder.query<IResponse<DataType>, QueryParams>({
      query: (params) => ({ url: "/admin/endpoint", method: "GET", params }),
      providesTags: ["TAG"],
    }),
    updateData: builder.mutation<IResponse<DataType>, UpdatePayload>({
      query: (data) => ({ url: "/admin/endpoint", method: "PATCH", data }),
      invalidatesTags: ["TAG"],
    }),
  }),
});
```

## File Organization
- **Pages**: `src/pages/Admin/*.tsx` (ManageUsers, ManageItems, Analytics)
- **Components**: 
  - `src/components/ui/` - shadcn components
  - `src/components/layout/` - DashboardLayout, Navbar
  - `src/components/modules/Authentication/` - LoginForm
- **Redux**: `src/redux/features/{auth,admin}/`
- **Utils**: `src/utils/{withAuth,generateRoutes,getSidebarItems}.tsx`
- **Types**: `src/types/index.ts` - All interfaces and enums
- **Config**: `src/config/index.ts` - Environment variables
- **Path Alias**: `@/` → `src/` (vite.config.ts)

## Backend Integration Notes
- **Base URL**: `http://localhost:9000/api/v1/`
- **Response Structure**: All endpoints return consistent format:
  ```typescript
  {
    statusCode: number;
    success: boolean;
    message: string;
    meta?: { total: number; page: number; limit: number; totalPages: number };
    data: T | T[] | null;
  }
  ```

### Authentication Endpoints
- **POST** `/auth/login` - Login with email/password
  - Body: `{ email: string, password: string }`
  - Returns: `{ statusCode, success, message, data: { user: IUser, accessToken: string } }`
- **GET** `/auth/me` - Get current user (requires JWT cookie)
  - Returns: `{ statusCode, success, message, data: IUser }`
- **POST** `/auth/logout` - Clear auth cookie
  - Returns: `{ statusCode, success, message, data: null }`

### User Management Endpoints
- **GET** `/admin/users` - List all users with pagination
  - Query: `?page=1&limit=10&searchTerm=name&isStatus=PENDING`
  - Returns: `{ statusCode, success, message, meta: {...}, data: IUser[] }`
- **GET** `/admin/users/:id` - Get single user (populated with items & wallet)
  - Returns: `{ statusCode, success, message, data: IUser }`
- **PATCH** `/admin/users/:id/status` - Update user status & verification
  - Body: `{ isStatus: "ACTIVE" | "SUSPEND" | "PENDING", isVerified?: boolean }`
  - Returns: `{ statusCode, success, message, data: IUser }`
- **DELETE** `/admin/users/:id` - Delete user permanently
  - Returns: `{ statusCode, success, message, data: null }`

### Item Management Endpoints
- **GET** `/admin/items` - List all items with pagination
  - Query: `?page=1&limit=10&searchTerm=title&status=PENDING&sellingCategory=RENT`
  - Returns: `{ statusCode, success, message, meta: {...}, data: IItem[] }`
  - Note: `ownerId` is populated with user details (name, email)
- **GET** `/admin/items/:id` - Get single item (populated with owner)
  - Returns: `{ statusCode, success, message, data: IItem }`
- **PATCH** `/admin/items/:id/status` - Update item status
  - Body: `{ status: "PUBLISHED" | "CANCEL" | "PENDING" }`
  - Returns: `{ statusCode, success, message, data: IItem }`
- **DELETE** `/admin/items/:id` - Delete item permanently
  - Returns: `{ statusCode, success, message, data: null }`

### Dashboard Analytics Endpoints
- **GET** `/admin/dashboard/stats` - Get dashboard statistics
  - Returns: 
    ```typescript
    {
      statusCode, success, message,
      data: {
        totalUsers: number,
        activeUsers: number,
        pendingUsers: number,
        suspendedUsers: number,
        totalItems: number,
        publishedItems: number,
        pendingItems: number,
        canceledItems: number
      }
    }
    ```
- **GET** `/admin/dashboard/recent-activity` - Get recent users & items
  - Query: `?limit=5`
  - Returns: 
    ```typescript
    {
      statusCode, success, message,
      data: {
        recentUsers: IUser[],
        recentItems: IItem[]
      }
    }
    ```

## Common Patterns
- **Pagination**: Server-side with `{ page, limit }` params, client-side search
- **Status Badges**: Color-coded pills using Tailwind classes
- **Confirmation**: Native `confirm()` before destructive actions
- **Toast Notifications**: Sonner library (`toast.success()`, `toast.error()`)
- **Loading States**: Check `isLoading` from RTK Query hooks
- **Error Handling**: Try-catch with `error?.data?.message` fallback

## Key Differences from Generic Admin Dashboards
- University-specific email validation (`@cse.bubt.edu.bd`)
- No user registration UI (admins are created server-side)
- No Firebase/OTP (pure JWT cookie auth)
- Three-state user status (PENDING → ACTIVE → SUSPEND)
- Items have dual status (ItemStatus for approval + Availability for stock)
- All mutations auto-refetch via RTK Query cache tags

## External Dependencies
- **Icons**: Lucide React
- **Toast**: Sonner
- **HTTP**: Axios (not fetch)
- **Forms**: React Hook Form + Zod
- **State**: Redux Toolkit + RTK Query
- **Router**: React Router v7
- **Tailwind**: v4 with Vite plugin
