import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RoastBar Portal',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#221710]">
      {children}
    </div>
  );
}
