export interface Address {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  addresses: Address[];
  referralCode: string;
  createdAt: string;
}

export interface WalletInfo {
  _id: string;
  user: string;
  balance: number;
}

export interface WalletTransaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference?: string;
  createdAt: string;
}

export interface ReferralInfo {
  referralCode: string;
  referrals: {
    _id: string;
    referee: { name: string; email: string };
    status: 'Pending' | 'Rewarded';
    createdAt: string;
  }[];
  stats: {
    totalRewarded: number;
    totalPending: number;
    totalReferrals: number;
  };
}

export interface WishlistProduct {
  _id: string;
  name: string;
  images: string[];
  basePrice: number;
  status: string;
  averageRating: number;
  inStock: boolean;
  totalStock: number;
}
