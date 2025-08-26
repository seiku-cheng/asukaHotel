'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface Customer {
  email: string;
  name: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  firstBooking: string;
  lastBooking: string;
  isRegistered: boolean;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchCustomers();
  }, [router, currentPage, searchTerm]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/admin/customers?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers);
        setPagination(data.pagination);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomers();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-wa-gray">読み込み中...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-wa-brown mb-2">顧客管理</h1>
            <p className="text-wa-gray">宿泊客の情報と予約履歴の管理</p>
          </div>

          <div className="text-sm text-wa-gray">
            総顧客数: <span className="font-semibold">{pagination?.total || 0}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="名前、メール、電話番号で検索..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-wa-brown text-wa-cream rounded-md hover:bg-opacity-90 transition-colors"
            >
              検索
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-gray-500 text-wa-cream rounded-md hover:bg-opacity-90 transition-colors"
              >
                クリア
              </button>
            )}
          </form>
        </div>

        {/* Customer Stats */}
        {pagination && pagination.total > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-wa-gray">総顧客数</div>
              <div className="text-2xl font-bold text-wa-brown">{pagination.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-wa-gray">登録済み</div>
              <div className="text-2xl font-bold text-green-600">
                {customers.filter(c => c.isRegistered).length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-wa-gray">平均予約回数</div>
              <div className="text-2xl font-bold text-wa-brown">
                {customers.length > 0 
                  ? Math.round(customers.reduce((sum, c) => sum + c.totalBookings, 0) / customers.length * 10) / 10
                  : 0
                }
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-wa-gray">平均消費額</div>
              <div className="text-2xl font-bold text-wa-brown">
                ¥{customers.length > 0 
                  ? Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toLocaleString()
                  : 0
                }
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-wa-gray">リピート顧客</div>
              <div className="text-2xl font-bold text-wa-brown">
                {customers.filter(c => c.totalBookings > 1).length}
              </div>
            </div>
          </div>
        )}

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    顧客情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    連絡先
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    予約統計
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    利用履歴
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.email} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-wa-brown rounded-full flex items-center justify-center">
                          <span className="text-wa-cream font-medium text-sm">
                            {customer.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                            {customer.isRegistered && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                登録済み
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.totalBookings > 1 ? 'リピート顧客' : customer.totalBookings === 0 ? '未予約' : '新規顧客'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.totalBookings} 件の予約
                      </div>
                      <div className="text-sm text-gray-500">
                        総額 ¥{customer.totalSpent.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.totalBookings > 0 ? (
                        <>
                          <div className="text-sm text-gray-900">
                            初回: {new Date(customer.firstBooking).toLocaleDateString('ja-JP')}
                          </div>
                          <div className="text-sm text-gray-500">
                            最新: {new Date(customer.lastBooking).toLocaleDateString('ja-JP')}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">
                          登録: {new Date(customer.firstBooking).toLocaleDateString('ja-JP')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/customers/${encodeURIComponent(customer.email)}`}
                        className="bg-wa-brown text-wa-cream px-3 py-1 rounded text-xs hover:bg-opacity-90 transition-colors"
                      >
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {customers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm ? '検索結果が見つかりません' : '顧客データがありません'}
              </div>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="mt-2 text-wa-brown hover:text-wa-brown/80"
                >
                  すべての顧客を表示
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                {pagination.total} 件中 {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} 件を表示
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  前へ
                </button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = Math.max(1, pagination.page - 2) + i;
                  if (page > pagination.totalPages) return null;
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm border rounded-md ${
                        page === pagination.page
                          ? 'bg-wa-brown text-wa-cream'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  次へ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}