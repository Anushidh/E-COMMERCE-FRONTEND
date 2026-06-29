export interface CartItemProduct {
  _id: string;
  name: string;
  images: string[];
  status: string;
  isDeleted: boolean;
  basePrice: number;
}

export interface CartItemVariant {
  _id: string;
  size: string;
  color: string;
  stock: number;
  price?: number;
  isDeleted: boolean;
}

export interface CartItem {
  _id: string;
  product: CartItemProduct;
  variant: CartItemVariant;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  lastActivityAt: string;
}
