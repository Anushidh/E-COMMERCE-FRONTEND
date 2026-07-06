import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';

export interface ActiveOfferItem {
  _id: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  endDate: string;
}

export interface ActiveProductOffer extends ActiveOfferItem {
  product: { _id: string; name: string; slug: string };
}

export interface ActiveCategoryOffer extends ActiveOfferItem {
  category: { _id: string; name: string; slug: string };
}

export interface ActiveOffersResponse {
  productOffers: ActiveProductOffer[];
  categoryOffers: ActiveCategoryOffer[];
}

export const offersService = {
  getActiveOffers: async (): Promise<ActiveOffersResponse> => {
    const { data } = await apiClient.get(ENDPOINTS.OFFERS.ACTIVE);
    return data.data;
  },
};
