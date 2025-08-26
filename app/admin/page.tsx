'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Redirect to dashboard if already logged in
      router.push('/admin/dashboard');
    } else {
      // Redirect to login if not logged in
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-wa-beige flex items-center justify-center">
      <div className="text-wa-gray">リダイレクト中...</div>
    </div>
  );
}