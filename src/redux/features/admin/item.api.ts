import { baseApi } from "@/redux/baseApi";
import type { IResponse, IItem, ItemStatus } from "@/types";

interface ItemsQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: ItemStatus;
  sellingCategory?: string;
  objectCategory?: string;
}

interface ItemsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: IItem[];
}

export const itemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all items with pagination and filters
    getAllItems: builder.query<ItemsResponse, ItemsQueryParams>({
      query: (params) => ({
        url: "/admin/items",
        method: "GET",
        params,
      }),
      providesTags: ["ITEMS"],
    }),

    // Update item status (publish/cancel)
    updateItemStatus: builder.mutation<IResponse<IItem>, { itemId: string; status: ItemStatus }>({
      query: ({ itemId, status }) => ({
        url: `/admin/items/${itemId}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["ITEMS"],
    }),

    // Delete item
    deleteItem: builder.mutation<IResponse<null>, string>({
      query: (itemId) => ({
        url: `/admin/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ITEMS"],
    }),
  }),
});

export const {
  useGetAllItemsQuery,
  useUpdateItemStatusMutation,
  useDeleteItemMutation,
} = itemApi;
