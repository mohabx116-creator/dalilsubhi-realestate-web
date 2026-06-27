import { getApiData, postApiData } from './api-client';
import type { 
  RealEstateListing, 
  RealEstateOwnerSubmission, 
  RealEstateInquiry 
} from './types';

const BASE_URL = '/real-estate';

export const realEstateService = {
  // --- Listings ---
  listRealEstateListings: async (params?: Record<string, any>) => {
    const response = await getApiData<any>(`${BASE_URL}/listings`, params);
    
    let items: RealEstateListing[] = [];
    if (Array.isArray(response.data)) {
      items = response.data;
    } else if (response.data && typeof response.data === 'object') {
      if (Array.isArray(response.data.items)) items = response.data.items;
      else if (Array.isArray(response.data.listings)) items = response.data.listings;
    }

    return { ...response, data: items };
  },

  getRealEstateListing: async (slug: string) => {
    return await getApiData<RealEstateListing>(`${BASE_URL}/listings/${slug}`);
  },

  // --- Submissions ---
  createRealEstateSubmission: async (payload: Partial<RealEstateOwnerSubmission>) => {
    return await postApiData<RealEstateOwnerSubmission>(`${BASE_URL}/owner-submissions`, payload);
  },

  // --- Inquiries ---
  createRealEstateInquiry: async (payload: Partial<RealEstateInquiry>) => {
    return await postApiData<{
      id: string;
      status: RealEstateInquiry['status'];
      whatsappUrl?: string | null;
    }>(`${BASE_URL}/inquiries`, payload);
  },
};
