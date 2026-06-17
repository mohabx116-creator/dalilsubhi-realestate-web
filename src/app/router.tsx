import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PublicRealEstateShell } from '../components/layout/PublicRealEstateShell';
import { HomePage } from '../pages/real-estate/HomePage';
import { PropertiesPage } from '../pages/real-estate/PropertiesPage';
import { LandsPage } from '../pages/real-estate/LandsPage';
import { DetailPage } from '../pages/real-estate/DetailPage';
import { SellPage } from '../pages/real-estate/SellPage';
import { SuccessPage } from '../pages/real-estate/SuccessPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicRealEstateShell />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'properties',
            element: <PropertiesPage />,
          },
          {
            path: 'properties/:slug',
            element: <DetailPage />,
          },
          {
            path: 'lands',
            element: <LandsPage />,
          },
          {
            path: 'lands/:slug',
            element: <DetailPage />,
          },
          {
            path: 'sell',
            element: <SellPage />,
          },
          {
            path: 'success',
            element: <SuccessPage />,
          },
      { path: '404', element: <NotFoundPage /> },
      { path: '*', element: <Navigate replace to="/404" /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
