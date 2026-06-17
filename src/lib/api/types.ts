export type RealEstateType = 
  | 'APARTMENT'
  | 'VILLA'
  | 'STUDIO'
  | 'DUPLEX'
  | 'SHOP'
  | 'OFFICE'
  | 'LAND';

export const realEstateTypes: RealEstateType[] = [
  'APARTMENT',
  'VILLA',
  'STUDIO',
  'DUPLEX',
  'SHOP',
  'OFFICE',
  'LAND',
];

export type RealEstateStatus = 
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'HIDDEN'
  | 'UNDER_NEGOTIATION'
  | 'RESERVED'
  | 'SOLD'
  | 'REJECTED';

export type RealEstateFinishing = 
  | 'CORE_AND_SHELL'
  | 'SEMI_FINISHED'
  | 'FULLY_FINISHED'
  | 'FURNISHED';

export type RealEstateInquiryType = 'CONTACT' | 'INSPECTION' | 'INTEREST';

export type RealEstateInquiryStatus = 'NEW' | 'CONTACTED' | 'CLOSED';

export type RealEstateSubmissionStatus = 
  | 'PENDING'
  | 'REVIEWED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CONVERTED';

export interface ImageDto {
  id: string;
  url: string;
  isCover: boolean;
  order: number;
}

export interface RealEstateListing {
  id: string;
  slug: string;
  type: RealEstateType;
  title: string;
  description: string;
  price: number;
  areaSqm: number;
  status: RealEstateStatus;
  
  // Land fields
  pricePerMeter?: number;
  frontage?: number;
  depth?: number;
  streetWidth?: number;
  landUse?: string;
  utilitiesAvailable?: boolean;
  cornerPlot?: boolean;
  isRegistered?: boolean;

  // Building fields
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  finishingType?: RealEstateFinishing;
  deliveryStatus?: string;
  hasElevator?: boolean;
  hasParking?: boolean;
  view?: string;

  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  images?: ImageDto[];
}

export interface RealEstateOwnerSubmission {
  id: string;
  submitterName: string;
  submitterPhone: string;
  submitterWhatsapp?: string;
  submitterEmail?: string;

  type: RealEstateType;
  title: string;
  description: string;
  price: number;
  areaSqm: number;
  status: RealEstateSubmissionStatus;

  // Land fields
  pricePerMeter?: number;
  frontage?: number;
  depth?: number;
  streetWidth?: number;
  landUse?: string;
  utilitiesAvailable?: boolean;
  cornerPlot?: boolean;
  isRegistered?: boolean;

  // Building fields
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  finishingType?: RealEstateFinishing;
  deliveryStatus?: string;
  hasElevator?: boolean;
  hasParking?: boolean;
  view?: string;

  images?: ImageDto[];
  createdAt: string;
}

export interface RealEstateInquiry {
  id: string;
  listingId?: string;
  inquiryType: RealEstateInquiryType;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message?: string;
  status: RealEstateInquiryStatus;
  createdAt: string;
  listing?: RealEstateListing;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginatedMeta;
}
