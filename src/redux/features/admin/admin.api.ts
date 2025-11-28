import { baseApi } from "@/redux/baseApi";
import type { IResponse, IUser, Status } from "@/types";

interface UsersQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  activeRole?: string;
  isStatus?: Status;
}

interface UsersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: IUser[];
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with pagination and filters
    getAllUsers: builder.query<UsersResponse, UsersQueryParams>({
      query: (params) => ({
        url: "/admin/users",
        method: "GET",
        params,
      }),
      providesTags: ["USERS"],
    }),

    // Update user status (verify/suspend)
    updateUserStatus: builder.mutation<IResponse<IUser>, { userId: string; isStatus: Status; isVerified?: boolean }>({
      query: ({ userId, isStatus, isVerified }) => ({
        url: `/admin/users/${userId}/status`,
        method: "PATCH",
        data: { isStatus, ...(isVerified !== undefined && { isVerified }) },
      }),
      invalidatesTags: ["USERS"],
    }),

    // Delete user
    deleteUser: builder.mutation<IResponse<null>, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USERS"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} = adminApi;
