import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import type { AxiosError } from 'axios';

interface ErrorResponse { message?: string }
const errMsg = (e: AxiosError<ErrorResponse>) => e.response?.data?.message || 'Something went wrong';

// ─── Dashboard ───────────────────────────────────────────────────────────────

export function useDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminService.getDashboard,
    select: (res) => res.data.data,
  });
}

// ─── Users ───────────────────────────────────────────────────────────────────

export function useAdminUsers(params: { page?: number; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminService.getUsers(params),
    select: (res) => res.data.data,
  });
}

export function useBlockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.blockUser,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); toast.success('User blocked'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useUnblockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.unblockUser,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); toast.success('User unblocked'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function useAdminOrders(params: { page?: number; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: () => adminService.getOrders(params),
    select: (res) => res.data.data,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminService.updateOrderStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'orders'] }); toast.success('Status updated'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useHandleReturn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) => adminService.handleReturn(id, action),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'orders'] }); qc.invalidateQueries({ queryKey: ['admin', 'order'] }); toast.success('Return processed'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useHandleCancellation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) => adminService.handleCancellation(id, action),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'orders'] }); qc.invalidateQueries({ queryKey: ['admin', 'order'] }); toast.success('Cancellation processed'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

// ─── Coupons ─────────────────────────────────────────────────────────────────

export function useAdminCoupons() {
  return useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: adminService.getCoupons,
    select: (res) => res.data.data,
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.createCoupon,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }); toast.success('Coupon created'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updateCoupon(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }); toast.success('Coupon updated'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteCoupon,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }); toast.success('Coupon deleted'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

// ─── Offers ──────────────────────────────────────────────────────────────────

export function useProductOffers() {
  return useQuery({
    queryKey: ['admin', 'productOffers'],
    queryFn: adminService.getProductOffers,
    select: (res) => res.data.data,
  });
}

export function useCreateProductOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.createProductOffer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'productOffers'] }); toast.success('Offer created'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useDeleteProductOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteProductOffer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'productOffers'] }); toast.success('Offer deleted'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useUpdateProductOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updateProductOffer(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'productOffers'] }); toast.success('Offer updated'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useCategoryOffers() {
  return useQuery({
    queryKey: ['admin', 'categoryOffers'],
    queryFn: adminService.getCategoryOffers,
    select: (res) => res.data.data,
  });
}

export function useCreateCategoryOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.createCategoryOffer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'categoryOffers'] }); toast.success('Offer created'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useDeleteCategoryOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteCategoryOffer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'categoryOffers'] }); toast.success('Offer deleted'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useUpdateCategoryOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updateCategoryOffer(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'categoryOffers'] }); toast.success('Offer updated'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

// ─── Products (Admin CRUD) ───────────────────────────────────────────────────

export function useAdminProducts(params: { page?: string; limit?: string; search?: string; status?: string; includeDeleted?: boolean }) {
  return useQuery({
    queryKey: ['adminProducts', params],
    queryFn: () => adminService.getAdminProducts(params),
    select: (res) => res.data.data,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.createProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['adminProducts'] }); toast.success('Product created'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['adminProducts'] }); toast.success('Product deleted'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useRestoreProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.restoreProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['adminProducts'] }); toast.success('Product restored'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useAdjustStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, adjustment }: { variantId: string; adjustment: number }) =>
      adminService.adjustStock(variantId, adjustment),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'inventory'] }); toast.success('Stock adjusted'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

// ─── Categories (Admin CRUD) ─────────────────────────────────────────────────

export function useAdminCategories(params?: { includeDeleted?: boolean }) {
  return useQuery({
    queryKey: ['adminCategories', params],
    queryFn: () => adminService.getAdminCategories(params),
    select: (res) => res.data.data,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.createCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); qc.invalidateQueries({ queryKey: ['adminCategories'] }); toast.success('Category created'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); qc.invalidateQueries({ queryKey: ['adminCategories'] }); toast.success('Category deleted'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useRestoreCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.restoreCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); qc.invalidateQueries({ queryKey: ['adminCategories'] }); toast.success('Category restored'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

// ─── Inventory ───────────────────────────────────────────────────────────────

export function useLowStock() {
  return useQuery({
    queryKey: ['admin', 'inventory'],
    queryFn: adminService.getLowStock,
    select: (res) => res.data.data,
  });
}

// ─── Abandoned Carts ─────────────────────────────────────────────────────────

export function useAbandonedCarts() {
  return useQuery({
    queryKey: ['admin', 'abandonedCarts'],
    queryFn: adminService.getAbandonedCarts,
    select: (res) => res.data.data,
  });
}

export function useProcessAbandonedCarts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.processAbandonedCarts,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'abandonedCarts'] }); toast.success('Abandoned carts processed'); },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}
