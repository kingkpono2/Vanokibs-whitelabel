import type { Metadata } from 'next';
import { AdminApp } from '@/components/AdminApp';
import { brand } from '@/content/brand';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default function AdminPage() {
  return <AdminApp brandName={brand.name} />;
}
