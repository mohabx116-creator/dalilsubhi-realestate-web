import type { RealEstateListing, RealEstateType } from './api/types';
import { REAL_ESTATE_FALLBACK } from '../data/real-estate-fallback';

export function getFallbackRealEstateListings() {
  return [...REAL_ESTATE_FALLBACK];
}

export function getFallbackRealEstateListingsByType(type: RealEstateType) {
  return REAL_ESTATE_FALLBACK.filter((listing) => listing.type === type);
}

export function getFallbackRealEstateProperties() {
  return REAL_ESTATE_FALLBACK.filter((listing) => listing.type !== 'LAND');
}

export function getFallbackRealEstateLands() {
  return REAL_ESTATE_FALLBACK.filter((listing) => listing.type === 'LAND');
}

export function getFallbackRealEstateListingBySlug(slug: string) {
  return REAL_ESTATE_FALLBACK.find((listing) => listing.slug === slug) ?? null;
}

export function getFallbackRealEstateListingById(id: string) {
  return REAL_ESTATE_FALLBACK.find((listing) => listing.id === id) ?? null;
}

export function replaceRealEstateListingsBySource(
  listings: RealEstateListing[],
  source: 'properties' | 'lands' = 'properties',
) {
  return source === 'lands'
    ? listings.filter((listing) => listing.type === 'LAND')
    : listings.filter((listing) => listing.type !== 'LAND');
}
