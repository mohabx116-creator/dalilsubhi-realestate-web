export const ROUTES = {
  HOME: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: (slug: string) => `/properties/${slug}`,
  LANDS: '/lands',
  LAND_DETAIL: (slug: string) => `/lands/${slug}`,
  SELL: '/sell',
  SUCCESS: '/success',
};
