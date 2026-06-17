import type {
  RealEstateType,
  RealEstateStatus,
  RealEstateFinishing,
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
