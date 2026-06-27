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

export type RealEstateFurnishingStatus =
  | 'FURNISHED'
  | 'UNFURNISHED'
  | 'SEMI_FURNISHED';

export type RealEstateFinishingStatus =
  | 'WITHOUT_FINISHING'
  | 'FINISHED'
  | 'FINISHED_FURNISHED';

export type RealEstateFloor =
  | 'BASEMENT'
  | 'GROUND'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | 'ROOF';

export type RealEstateAmenity =
  | 'ELEVATOR'
  | 'GARAGE'
  | 'SECURITY'
  | 'SURVEILLANCE_CAMERAS'
  | 'INTERCOM'
  | 'NATURAL_GAS'
  | 'WATER_METER'
  | 'GAS_METER'
  | 'AIR_CONDITIONERS'
  | 'KITCHEN'
  | 'ELECTRICAL_APPLIANCES'
  | 'BALCONY_OR_TERRACE'
  | 'LAND_SHARE';

export type RealEstatePhase = 'PHASE_ONE' | 'PHASE_TWO';

export type RealEstateElectricityStatus = 'ELECTRICITY_METER' | 'ELECTRICITY_PRACTICE';

export type RealEstateOwnershipProofType = 'CONTRACT' | 'POWER_OF_ATTORNEY';

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
  hasBuildingPermit?: boolean;

  // Building fields
  bedrooms?: number;
  bathrooms?: number;
  floor?: RealEstateFloor;
  balconies?: number;
  receptionRooms?: number;
  buildingAge?: number;
  buildingNumber?: string;
  apartmentNumber?: string;
  finishingType?: RealEstateFinishing;
  finishingStatus?: RealEstateFinishingStatus;
  furnishingStatus?: 'FURNISHED' | 'UNFURNISHED' | 'SEMI_FURNISHED';
  deliveryStatus?: string;
  hasElevator?: boolean;
  hasParking?: boolean;
  view?: string;
  phase?: RealEstatePhase;
  electricityStatus?: RealEstateElectricityStatus;
  ownershipProofType?: RealEstateOwnershipProofType;
  areInstallmentsSettled?: boolean;
  isDepositSettled?: boolean;
  hasFinalContract?: boolean;

  amenities?: RealEstateAmenity[];

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
  hasBuildingPermit?: boolean;

  // Building fields
  bedrooms?: number;
  bathrooms?: number;
  floor?: RealEstateFloor;
  balconies?: number;
  receptionRooms?: number;
  buildingAge?: number;
  buildingNumber?: string;
  apartmentNumber?: string;
  finishingType?: RealEstateFinishing;
  finishingStatus?: RealEstateFinishingStatus;
  furnishingStatus?: RealEstateFurnishingStatus;
  deliveryStatus?: string;
  hasElevator?: boolean;
  hasParking?: boolean;
  view?: string;
  phase?: RealEstatePhase;
  electricityStatus?: RealEstateElectricityStatus;
  ownershipProofType?: RealEstateOwnershipProofType;
  areInstallmentsSettled?: boolean;
  isDepositSettled?: boolean;
  hasFinalContract?: boolean;

  amenities?: RealEstateAmenity[];

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
