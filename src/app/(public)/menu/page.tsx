import React from 'react';
import { FullMenu } from '@/components/public/FullMenu';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Full Menu | RoastBar Baku Specialty Coffee & Desserts',
  description:
    'Explore our comprehensive artisan menu: Pour-over V60, Espresso signatures, cold brew, San Sebastian cheesecake, and fresh pastries.',
};

export default function MenuPage() {
  return <FullMenu />;
}
