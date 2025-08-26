'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactsResponse {
  contacts: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    new: 0,
    inProgress: 0,
    resolved: 0,
    total: 0
  });
  
  const router = useRouter();

  useEffect(() => {
    fetchContacts();
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/admin/contacts?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data: ContactsResponse = await response.json();
      setContacts(data.contacts);
      setTotalPages(data.pagination.totalPages);
      setTotalContacts(data.pagination.total);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const [newRes, inProgressRes, resolvedRes, totalRes] = await Promise.all([
        fetch('/api/admin/contacts?status=NEW&limit=1', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/contacts?status=IN_PROGRESS&limit=1', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/contacts?status=RESOLVED&limit=1', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/contacts?limit=1', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [newData, inProgressData, resolvedData, totalData] = await Promise.all([
        newRes.json(),
        inProgressRes.json(),
        resolvedRes.json(),
        totalRes.json()
      ]);

      setStats({
        new: newData.pagination?.total || 0,
        inProgress: inProgressData.pagination?.total || 0,
        resolved: resolvedData.pagination?.total || 0,
        total: totalData.pagination?.total || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleStatusUpdate = async (contactId: string, newStatus: string, notes?: string) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          ...(notes !== undefined && { notes }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update contact');
      }

      setShowModal(false);
      fetchContacts();
      fetchStats();
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('更新に失敗しました');
    } finally {
      setUpdating(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchContacts();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NEW': return '新規';
      case 'IN_PROGRESS': return '対応中';
      case 'RESOLVED': return '解決済';
      default: return status;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-xl text-wa-gray">読み込み中...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-wa-brown mb-2">お問い合わせ管理</h1>
          <p className="text-wa-gray">お客様からのお問い合わせの管理</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-sm font-medium text-wa-gray">総数</div>
            <div className="text-2xl font-bold text-wa-brown">{stats.total}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-sm font-medium text-red-500">新規</div>
            <div className="text-2xl font-bold text-red-600">{stats.new}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-sm font-medium text-yellow-500">対応中</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-sm font-medium text-green-500">解決済</div>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="名前、メール、メッセージで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
              >
                <option value="ALL">全ステータス</option>
                <option value="NEW">新規</option>
                <option value="IN_PROGRESS">対応中</option>
                <option value="RESOLVED">解決済</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-wa-brown text-wa-cream rounded-md hover:bg-opacity-90 transition-colors"
            >
              検索
            </button>
          </form>
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-wa-brown">
              お問い合わせ一覧 ({totalContacts}件)
            </h2>
          </div>
          
          {contacts.length === 0 ? (
            <div className="px-6 py-8 text-center text-wa-gray">
              お問い合わせがありません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wa-gray uppercase tracking-wider">
                      顧客情報
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wa-gray uppercase tracking-wider">
                      メッセージ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wa-gray uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wa-gray uppercase tracking-wider">
                      受信日時
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleContactClick(contact)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-wa-brown">
                            {contact.name}
                          </div>
                          <div className="text-sm text-wa-gray">
                            {contact.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-wa-brown max-w-xs truncate">
                          {contact.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                          {getStatusText(contact.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-wa-gray">
                        {new Date(contact.createdAt).toLocaleDateString('ja-JP')} {new Date(contact.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-wa-gray">
                  {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, totalContacts)} / {totalContacts}件
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-wa-gray"
                  >
                    前へ
                  </button>
                  <span className="px-3 py-1 text-sm text-wa-gray">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-wa-gray"
                  >
                    次へ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Detail Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-wa-brown">お問い合わせ詳細</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-wa-gray">お名前</label>
                <div className="mt-1 text-sm text-wa-brown">{selectedContact.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-wa-gray">メールアドレス</label>
                <div className="mt-1 text-sm text-wa-brown">{selectedContact.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-wa-gray">メッセージ</label>
                <div className="mt-1 text-sm text-wa-brown whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                  {selectedContact.message}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-wa-gray">ステータス</label>
                <select
                  value={selectedContact.status}
                  onChange={(e) => handleStatusUpdate(selectedContact.id, e.target.value)}
                  disabled={updating}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                >
                  <option value="NEW">新規</option>
                  <option value="IN_PROGRESS">対応中</option>
                  <option value="RESOLVED">解決済</option>
                </select>
              </div>
              {selectedContact.notes && (
                <div>
                  <label className="block text-sm font-medium text-wa-gray">備考</label>
                  <div className="mt-1 text-sm text-wa-brown whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                    {selectedContact.notes}
                  </div>
                </div>
              )}
              <div className="text-xs text-wa-gray">
                受信日時: {new Date(selectedContact.createdAt).toLocaleString('ja-JP')}
                {selectedContact.updatedAt !== selectedContact.createdAt && (
                  <div>更新日時: {new Date(selectedContact.updatedAt).toLocaleString('ja-JP')}</div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-wa-gray border border-gray-300 rounded-md hover:bg-gray-50 bg-white"
              >
                閉じる
              </button>
              <a
                href={`mailto:${selectedContact.email}?subject=Re: お問い合わせについて`}
                className="px-4 py-2 text-sm bg-wa-brown text-wa-cream rounded-md hover:bg-opacity-90"
              >
                返信
              </a>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}