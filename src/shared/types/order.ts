export interface OrderItem {
  _id: string;
  product: { _id: string; name: string; images: string[] } | string;
  variant: { _id: string; size: string; color: string } | string;
  productName: string;
  variantInfo: string;
  quantity: number;
  price: number;
  offerDiscount: number;
  finalPrice: number;
  taxableValue: number;
  gstRate: number;
  gstAmount: number;
}

export interface StatusHistory {
  status: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  user: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  subtotal: number;
  offerDiscount: number;
  couponDiscount: number;
  couponCode?: string;
  walletAmountUsed: number;
  shippingCharge: number;
  totalTax: number;
  isInterState: boolean;
  totalAmount: number;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus: string;
  statusHistory: StatusHistory[];
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  cancelReason?: string;
  returnReason?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrderPayload {
  addressId: string;
  paymentMethod: 'razorpay' | 'cod';
  couponCode?: string;
  useWallet?: boolean;
}

export interface Invoice {
  invoiceId: string;
  pdfUrl: string;
  invoiceDate: string;
}
