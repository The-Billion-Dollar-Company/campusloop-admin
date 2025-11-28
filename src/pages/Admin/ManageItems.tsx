import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useGetAllItemsQuery,
  useUpdateItemStatusMutation,
  useDeleteItemMutation,
} from "@/redux/features/admin/item.api";
import { ItemStatus, Availability, type IItem } from "@/types";
import { toast } from "sonner";
import { CheckCircle, XCircle, Trash2, Eye } from "lucide-react";

const ManageItems = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<IItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({ open: false, title: "", description: "", action: () => {} });

  const { data, isLoading } = useGetAllItemsQuery({
    page,
    limit,
    status: statusFilter !== "ALL" ? (statusFilter as ItemStatus) : undefined,
    searchTerm: searchTerm || undefined,
  });

  const [updateStatus] = useUpdateItemStatusMutation();
  const [deleteItem] = useDeleteItemMutation();

  const items = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };
  const totalPages = meta.totalPages || Math.ceil(meta.total / meta.limit);

  const handleStatusUpdate = async (itemId: string, status: ItemStatus, itemTitle: string) => {
    const actionText = status === ItemStatus.PUBLISHED ? "publish" : status === ItemStatus.CANCEL ? "reject" : "update";
    setConfirmDialog({
      open: true,
      title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Item`,
      description: `Are you sure you want to ${actionText} "${itemTitle}"?`,
      action: async () => {
        try {
          await updateStatus({ itemId, status }).unwrap();
          toast.success(`Item ${actionText}ed successfully`);
        } catch (error: any) {
          toast.error(error?.data?.message || `Failed to ${actionText} item`);
        }
      },
    });
  };

  const handleDelete = async (itemId: string, itemTitle: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete Item",
      description: `Are you sure you want to permanently delete "${itemTitle}"? This action cannot be undone.`,
      action: async () => {
        try {
          await deleteItem(itemId).unwrap();
          toast.success("Item deleted successfully");
        } catch (error: any) {
          toast.error(error?.data?.message || "Failed to delete item");
        }
      },
    });
  };

  const handleViewItem = (item: IItem) => {
    setSelectedItem(item);
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: ItemStatus) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PUBLISHED: "bg-green-100 text-green-800",
      CANCEL: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const getAvailabilityBadge = (availability: Availability) => {
    const colors = {
      IN_STOCK: "bg-blue-100 text-blue-800",
      RENTED: "bg-purple-100 text-purple-800",
      SOLD: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[availability]}`}>
        {availability.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Items</h1>
        <p className="text-muted-foreground">Review and manage marketplace items</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Input
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="CANCEL">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No items found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{item.sellingCategory}</div>
                        <div className="text-muted-foreground">{item.objectCategory}</div>
                      </div>
                    </TableCell>
                    <TableCell>৳{item.price}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{getAvailabilityBadge(item.availability)}</TableCell>
                    <TableCell>
                      {typeof item.ownerId === "object" ? item.ownerId.name : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewItem(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {item.status === ItemStatus.PENDING && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(item._id, ItemStatus.PUBLISHED, item.title)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Publish
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(item._id, ItemStatus.CANCEL, item.title)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item._id, item.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="py-2 px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* View Item Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
            <DialogDescription>Complete information about the marketplace item</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <p className="text-xl font-semibold">{selectedItem.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Price</label>
                  <p className="text-2xl font-bold text-primary">৳{selectedItem.price}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Owner</label>
                  <p className="text-lg">
                    {typeof selectedItem.ownerId === "object" ? selectedItem.ownerId.name : "N/A"}
                  </p>
                  {typeof selectedItem.ownerId === "object" && (
                    <p className="text-sm text-muted-foreground">{selectedItem.ownerId.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Selling Category</label>
                  <p className="text-lg">{selectedItem.sellingCategory}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Object Category</label>
                  <p className="text-lg">{selectedItem.objectCategory}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Availability</label>
                  <div className="mt-1">{getAvailabilityBadge(selectedItem.availability)}</div>
                </div>
                {selectedItem.description && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm mt-1">{selectedItem.description}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Item ID</label>
                  <p className="text-sm font-mono text-muted-foreground">{selectedItem._id}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                confirmDialog.action();
                setConfirmDialog({ ...confirmDialog, open: false });
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageItems;
