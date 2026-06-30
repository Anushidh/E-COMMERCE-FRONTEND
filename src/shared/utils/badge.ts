import type { BadgeVariant } from '@shared/components/Badge/Badge';

export const getStatusBadgeVariant = (
  status: 'Active' | 'Inactive' | 'Out of Stock',
): BadgeVariant => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Inactive':
      return 'default';
    case 'Out of Stock':
      return 'error';
  }
};

export const getGenderBadgeVariant = (
  gender: 'Men' | 'Women' | 'Both' | 'Unisex',
): BadgeVariant => {
  switch (gender) {
    case 'Men':
      return 'info';
    case 'Women':
      return 'warning';
    case 'Both':
    case 'Unisex':
      return 'default';
  }
};

export const getStockBadgeVariant = (stock: number): BadgeVariant => {
  if (stock === 0) return 'error';
  if (stock <= 5) return 'warning';
  return 'success';
};

export const getUserStatusBadgeVariant = (
  isBlocked: boolean,
): BadgeVariant => {
  return isBlocked ? 'error' : 'success';
};

export const getOrderStatusBadgeVariant = (status: string): BadgeVariant => {
  switch (status) {
    case 'Delivered':
      return 'success';
    case 'Cancelled':
    case 'Returned':
      return 'error';
    case 'Return Requested':
    case 'Cancel Requested':
      return 'warning';
    case 'Shipped':
    case 'Out for Delivery':
      return 'info';
    default:
      return 'default';
  }
};

export const getPaymentStatusBadgeVariant = (status: string): BadgeVariant => {
  switch (status) {
    case 'Paid':
      return 'success';
    case 'Failed':
      return 'error';
    case 'Refunded':
      return 'warning';
    default:
      return 'default';
  }
};

export const getOfferStatusBadgeVariant = (isActive: boolean): BadgeVariant => {
  return isActive ? 'success' : 'error';
};

