import type {
  RealEstateType,
  RealEstateStatus,
  RealEstateFinishing,
  RealEstateFinishingStatus,
  RealEstateFloor,
  RealEstateAmenity,
  RealEstatePhase,
  RealEstateElectricityStatus,
  RealEstateOwnershipProofType,
  RealEstateInquiryType,
  RealEstateInquiryStatus,
  RealEstateSubmissionStatus,
} from './api/types';

export function formatCurrency(value?: string | number | null, currency = 'EGP') {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return 'غير متاح';
  }

  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value?: string | null) {
  if (!value) return 'غير متاح';

  try {
    return new Intl.DateTimeFormat('ar-EG', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export const realEstateTypeLabels: Record<RealEstateType, string> = {
  APARTMENT: 'شقة',
  VILLA: 'فيلا',
  STUDIO: 'ستوديو',
  DUPLEX: 'دوبلكس',
  SHOP: 'محل تجاري',
  OFFICE: 'مكتب إداري',
  LAND: 'أرض',
};

export const realEstateStatusLabels: Record<RealEstateStatus, string> = {
  DRAFT: 'مسودة',
  PENDING_REVIEW: 'قيد المراجعة',
  PUBLISHED: 'منشور',
  HIDDEN: 'مخفي',
  UNDER_NEGOTIATION: 'تحت التفاوض',
  RESERVED: 'محجوز',
  SOLD: 'تم البيع',
  REJECTED: 'مرفوض',
};

export const realEstateFinishingLabels: Record<RealEstateFinishing, string> = {
  CORE_AND_SHELL: 'طوب أحمر',
  SEMI_FINISHED: 'نصف تشطيب',
  FULLY_FINISHED: 'تشطيب كامل',
  FURNISHED: 'مفروش',
};

export const realEstateFinishingStatusLabels: Record<RealEstateFinishingStatus, string> = {
  WITHOUT_FINISHING: 'بدون تشطيب',
  FINISHED: 'متشطبة',
  FINISHED_FURNISHED: 'متشطبة ومفروشة',
};

export const realEstateFloorLabels: Record<RealEstateFloor, string> = {
  BASEMENT: 'بدروم',
  GROUND: 'أرضي',
  1: 'الأول',
  2: 'الثاني',
  3: 'الثالث',
  4: 'الرابع',
  5: 'الخامس',
  6: 'السادس',
  7: 'السابع',
  8: 'الثامن',
  9: 'التاسع',
  10: 'العاشر',
  11: 'الحادي عشر',
  12: 'الثاني عشر',
  13: 'الثالث عشر',
  14: 'الرابع عشر',
  15: 'الخامس عشر',
  16: 'السادس عشر',
  17: 'السابع عشر',
  18: 'الثامن عشر',
  19: 'التاسع عشر',
  20: 'العشرون',
  ROOF: 'روف',
};

export const realEstateAmenityLabels: Record<RealEstateAmenity, string> = {
  ELEVATOR: 'مصعد',
  GARAGE: 'جراج',
  SECURITY: 'أمن وحراسة',
  SURVEILLANCE_CAMERAS: 'كاميرات مراقبة',
  INTERCOM: 'إنتركم',
  NATURAL_GAS: 'غاز طبيعي',
  WATER_METER: 'عداد مياه',
  GAS_METER: 'عداد غاز',
  AIR_CONDITIONERS: 'تكيفات',
  KITCHEN: 'مطبخ',
  ELECTRICAL_APPLIANCES: 'أجهزة كهربائية',
  BALCONY_OR_TERRACE: 'بلكونة أو تراس',
  LAND_SHARE: 'حصة بالأرض',
};

export const realEstatePhaseLabels: Record<RealEstatePhase, string> = {
  PHASE_ONE: 'المرحلة الأولى',
  PHASE_TWO: 'المرحلة الثانية',
};

export const realEstateElectricityStatusLabels: Record<RealEstateElectricityStatus, string> = {
  ELECTRICITY_METER: 'عداد كهرباء',
  ELECTRICITY_PRACTICE: 'ممارسة',
};

export const realEstateOwnershipProofTypeLabels: Record<RealEstateOwnershipProofType, string> = {
  CONTRACT: 'عقد',
  POWER_OF_ATTORNEY: 'توكيل',
};

export function formatRealEstateFloor(value?: string | null) {
  if (!value) return 'غير متاح';
  const key = value as RealEstateFloor;
  return realEstateFloorLabels[key] ?? value;
}

export const realEstateInquiryTypeLabels: Record<RealEstateInquiryType, string> = {
  CONTACT: 'تواصل',
  INSPECTION: 'معاينة',
  INTEREST: 'إبداء اهتمام',
};

export const realEstateInquiryStatusLabels: Record<RealEstateInquiryStatus, string> = {
  NEW: 'جديد',
  CONTACTED: 'تم التواصل',
  CLOSED: 'مغلق',
};

export const realEstateSubmissionStatusLabels: Record<RealEstateSubmissionStatus, string> = {
  PENDING: 'قيد المراجعة',
  REVIEWED: 'تمت المراجعة',
  APPROVED: 'مقبول',
  REJECTED: 'مرفوض',
  CONVERTED: 'محول لإعلان',
};
