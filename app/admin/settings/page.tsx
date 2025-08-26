'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminSettings() {
  const [testEmail, setTestEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [emailMessage, setEmailMessage] = useState('');
  
  // Gmail configuration state
  const [gmailConfig, setGmailConfig] = useState({
    gmailUser: '',
    gmailAppPassword: '',
  });
  const [configLoading, setConfigLoading] = useState(false);
  const [configStatus, setConfigStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [configMessage, setConfigMessage] = useState('');
  const [hasExistingPassword, setHasExistingPassword] = useState(false);

  // Homepage background image state
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [backgroundStatus, setBackgroundStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [backgroundMessage, setBackgroundMessage] = useState('');

  // Floor plan images state
  const [floorPlanLoading, setFloorPlanLoading] = useState(false);
  const [floorPlanStatus, setFloorPlanStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [floorPlanMessage, setFloorPlanMessage] = useState('');
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());

  // Load existing email settings
  useEffect(() => {
    loadEmailSettings();
  }, []);

  const loadEmailSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/settings/email', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGmailConfig(prev => ({
          ...prev,
          gmailUser: data.gmailUser || '',
        }));
        setHasExistingPassword(data.hasPassword);
      }
    } catch (error) {
      console.error('Failed to load email settings:', error);
    }
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGmailConfig(prev => ({
      ...prev,
      [name]: value,
    }));
    if (configMessage) setConfigMessage('');
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gmailConfig.gmailUser) return;

    // If there's an existing password and no new password provided, skip validation
    if (!hasExistingPassword && !gmailConfig.gmailAppPassword) {
      setConfigStatus('error');
      setConfigMessage('Gmail アプリパスワードを入力してください');
      return;
    }

    setConfigLoading(true);
    setConfigStatus('loading');
    setConfigMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const requestData: any = {
        gmailUser: gmailConfig.gmailUser,
      };

      // Only send password if it's provided (for updates)
      if (gmailConfig.gmailAppPassword) {
        requestData.gmailAppPassword = gmailConfig.gmailAppPassword;
      } else if (hasExistingPassword) {
        // For existing password, we need to get it from the current settings
        setConfigStatus('error');
        setConfigMessage('パスワードを変更するには新しいアプリパスワードを入力してください');
        setConfigLoading(false);
        return;
      }

      const response = await fetch('/api/admin/settings/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setConfigStatus('success');
        setConfigMessage(data.message);
        setHasExistingPassword(true);
        setGmailConfig(prev => ({ ...prev, gmailAppPassword: '' })); // Clear password field
      } else {
        setConfigStatus('error');
        setConfigMessage(data.error || 'Gmail設定の保存に失敗しました');
      }
    } catch (error) {
      setConfigStatus('error');
      setConfigMessage('ネットワークエラーが発生しました');
    } finally {
      setConfigLoading(false);
    }
  };

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    setEmailStatus('loading');
    setEmailMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ testEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailStatus('success');
        setEmailMessage(data.message);
        setTestEmail('');
      } else {
        setEmailStatus('error');
        setEmailMessage(data.error || 'テストメール送信に失敗しました');
      }
    } catch (error) {
      setEmailStatus('error');
      setEmailMessage('ネットワークエラーが発生しました');
    }
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBackgroundLoading(true);
    setBackgroundStatus('loading');
    setBackgroundMessage('');

    try {
      const formData = new FormData();
      formData.append('background', file);

      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/homepage/background', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setBackgroundStatus('success');
        setBackgroundMessage(data.message);
      } else {
        setBackgroundStatus('error');
        setBackgroundMessage(data.error || '背景画像のアップロードに失敗しました');
      }
    } catch (error) {
      setBackgroundStatus('error');
      setBackgroundMessage('ネットワークエラーが発生しました');
    } finally {
      setBackgroundLoading(false);
    }
  };

  const handleBackgroundDelete = async () => {
    if (!confirm('背景画像を削除しますか？')) return;

    setBackgroundLoading(true);
    setBackgroundStatus('loading');
    setBackgroundMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/homepage/background', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setBackgroundStatus('success');
        setBackgroundMessage(data.message);
      } else {
        setBackgroundStatus('error');
        setBackgroundMessage(data.error || '背景画像の削除に失敗しました');
      }
    } catch (error) {
      setBackgroundStatus('error');
      setBackgroundMessage('ネットワークエラーが発生しました');
    } finally {
      setBackgroundLoading(false);
    }
  };

  const handleFloorPlanUpload = async (e: React.ChangeEvent<HTMLInputElement>, floor: '1' | '2') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFloorPlanLoading(true);
    setFloorPlanStatus('loading');
    setFloorPlanMessage('');

    try {
      const formData = new FormData();
      formData.append('floorplan', file);
      formData.append('floor', floor);

      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/floorplan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setFloorPlanStatus('success');
        setFloorPlanMessage(data.message);
        // 强制刷新图片预览
        setImageRefreshKey(Date.now());
      } else {
        setFloorPlanStatus('error');
        setFloorPlanMessage(data.error || '平面図のアップロードに失敗しました');
      }
    } catch (error) {
      setFloorPlanStatus('error');
      setFloorPlanMessage('ネットワークエラーが発生しました');
    } finally {
      setFloorPlanLoading(false);
    }
  };

  const handleFloorPlanDelete = async (floor: '1' | '2') => {
    if (!confirm(`${floor}階の平面図を削除しますか？`)) return;

    setFloorPlanLoading(true);
    setFloorPlanStatus('loading');
    setFloorPlanMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/floorplan?floor=${floor}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFloorPlanStatus('success');
        setFloorPlanMessage(data.message);
        // 强制刷新图片预览
        setImageRefreshKey(Date.now());
      } else {
        setFloorPlanStatus('error');
        setFloorPlanMessage(data.error || '平面図の削除に失敗しました');
      }
    } catch (error) {
      setFloorPlanStatus('error');
      setFloorPlanMessage('ネットワークエラーが発生しました');
    } finally {
      setFloorPlanLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-wa-brown mb-2">システム設定</h1>
          <p className="text-wa-gray">システムの設定と管理</p>
        </div>

        {/* Email Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-wa-brown">メール設定</h3>
              <p className="text-sm text-wa-gray">Gmail SMTP設定とテスト送信</p>
            </div>
          </div>

          {/* Gmail Configuration Form */}
          <form onSubmit={handleSaveConfig} className="space-y-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-wa-brown mb-4">Gmail SMTP設定</h4>
            
            <div>
              <label htmlFor="gmailUser" className="block text-sm font-medium text-wa-brown mb-2">
                Gmail アドレス
              </label>
              <input
                type="email"
                id="gmailUser"
                name="gmailUser"
                value={gmailConfig.gmailUser}
                onChange={handleConfigChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent"
                placeholder="your-email@gmail.com"
                required
                disabled={configLoading}
              />
            </div>

            <div>
              <label htmlFor="gmailAppPassword" className="block text-sm font-medium text-wa-brown mb-2">
                Gmail アプリパスワード
                {hasExistingPassword && (
                  <span className="text-xs text-green-600 ml-2">（設定済み - 変更する場合のみ入力）</span>
                )}
              </label>
              <input
                type="password"
                id="gmailAppPassword"
                name="gmailAppPassword"
                value={gmailConfig.gmailAppPassword}
                onChange={handleConfigChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent"
                placeholder={hasExistingPassword ? "変更する場合のみ入力" : "アプリパスワードを入力"}
                required={!hasExistingPassword}
                disabled={configLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Gmail の2段階認証を有効にして、アプリパスワードを生成してください
              </p>
            </div>

            {configMessage && (
              <div className={`p-3 rounded-md text-sm ${
                configStatus === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {configMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={configLoading || !gmailConfig.gmailUser}
              className="bg-blue-600 text-wa-cream px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {configLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-wa-cream" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  保存中...
                </span>
              ) : (
                'Gmail設定を保存'
              )}
            </button>
          </form>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Gmail アプリパスワードの取得方法：</strong><br/>
                  1. Gmailアカウントで2段階認証を有効にする<br/>
                  2. Googleアカウント設定 → セキュリティ → アプリパスワード<br/>
                  3. 「メール」を選択してパスワードを生成<br/>
                  4. 生成されたパスワードを上記フィールドに入力
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleTestEmail} className="space-y-4">
            <div>
              <label htmlFor="testEmail" className="block text-sm font-medium text-wa-brown mb-2">
                テスト送信先メールアドレス
              </label>
              <input
                type="email"
                id="testEmail"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent"
                placeholder="test@example.com"
                required
                disabled={emailStatus === 'loading'}
              />
            </div>

            {emailMessage && (
              <div className={`p-3 rounded-md text-sm ${
                emailStatus === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {emailMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={emailStatus === 'loading' || !testEmail}
              className="bg-wa-brown text-wa-cream px-6 py-2 rounded-md hover:bg-wa-brown/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailStatus === 'loading' ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-wa-cream" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  送信中...
                </span>
              ) : (
                'テストメール送信'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm text-gray-700 mb-2">メール送信について</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• 予約が「確認済み」に変更された時に自動でお客様にメールが送信されます</li>
              <li>• メールにはお客様名、予約番号、部屋情報、宿泊日程が含まれます</li>
              <li>• Gmail SMTPを使用しているため、Gmailアカウントとアプリパスワードが必要です</li>
            </ul>
          </div>
        </div>

        {/* Homepage Background Image */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-wa-brown">ホームページ背景画像</h3>
              <p className="text-sm text-wa-gray">メインセクションの背景画像を管理</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Current background preview */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <div 
                  className="w-full h-32 bg-cover bg-center rounded-md mb-4"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/hero-bg.jpg')`,
                    backgroundColor: '#f3f4f6'
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <span className="text-sm font-medium drop-shadow-md">現在の背景画像</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">推奨サイズ: 1920x1080px 以上、最大10MB</p>
              </div>
            </div>

            {/* Upload new background */}
            <div>
              <label htmlFor="background-upload" className="block text-sm font-medium text-wa-brown mb-2">
                新しい背景画像をアップロード
              </label>
              <input
                type="file"
                id="background-upload"
                accept="image/*"
                onChange={handleBackgroundUpload}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent"
                disabled={backgroundLoading}
              />
            </div>

            {/* Status message */}
            {backgroundMessage && (
              <div className={`p-3 rounded-md text-sm ${
                backgroundStatus === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {backgroundMessage}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex-1 border-2 border-wa-brown text-wa-brown px-4 py-2 rounded-md hover:bg-wa-brown hover:text-wa-cream transition-colors"
              >
                ホームページを確認
              </button>
              <button
                onClick={handleBackgroundDelete}
                disabled={backgroundLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {backgroundLoading ? '削除中...' : '画像を削除'}
              </button>
            </div>
          </div>
        </div>

        {/* Floor Plan Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-wa-brown">楼層平面図管理</h3>
              <p className="text-sm text-wa-gray">1階・2階の平面図を管理</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1F Floor Plan */}
            <div className="space-y-4">
              <h4 className="font-semibold text-wa-brown text-center">1階 共用スペース</h4>
              
              {/* Current 1F preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <div 
                    className="w-full h-32 bg-cover bg-center rounded-md mb-4 relative overflow-hidden"
                    style={{
                      backgroundColor: '#f3f4f6'
                    }}
                  >
                    <img
                      src={`/images/floor-1f.png?v=${imageRefreshKey}`}
                      alt="1階 共用スペース"
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.nextElementSibling?.classList.add('hidden');
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <span className="text-sm text-gray-600">1階 共用スペース</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload 1F */}
              <div>
                <input
                  type="file"
                  id="floor-2f-upload"
                  accept="image/*"
                  onChange={(e) => handleFloorPlanUpload(e, '1')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent text-sm"
                  disabled={floorPlanLoading}
                />
              </div>

              <button
                onClick={() => handleFloorPlanDelete('1')}
                disabled={floorPlanLoading}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 text-sm"
              >
                1階平面図を削除
              </button>
            </div>

            {/* 2F Floor Plan */}
            <div className="space-y-4">
              <h4 className="font-semibold text-wa-brown text-center">2階 客室フロア</h4>
              
              {/* Current 2F preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <div 
                    className="w-full h-32 bg-cover bg-center rounded-md mb-4 relative overflow-hidden"
                    style={{
                      backgroundColor: '#f3f4f6'
                    }}
                  >
                    <img
                      src={`/images/floor-2f.png?v=${imageRefreshKey}`}
                      alt="2階 客室フロア"
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.nextElementSibling?.classList.add('hidden');
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <span className="text-sm text-gray-600">2階 客室フロア</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload 2F */}
              <div>
                <input
                  type="file"
                  id="floor-3f-upload"
                  accept="image/*"
                  onChange={(e) => handleFloorPlanUpload(e, '2')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent text-sm"
                  disabled={floorPlanLoading}
                />
              </div>

              <button
                onClick={() => handleFloorPlanDelete('2')}
                disabled={floorPlanLoading}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 text-sm"
              >
                2階平面図を削除
              </button>
            </div>
          </div>

          {/* Status message */}
          {floorPlanMessage && (
            <div className={`mt-4 p-3 rounded-md text-sm ${
              floorPlanStatus === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {floorPlanMessage}
            </div>
          )}

          {/* Action button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => window.open('/floorplan', '_blank')}
              className="border-2 border-wa-brown text-wa-brown px-6 py-2 rounded-md hover:bg-wa-brown hover:text-wa-cream transition-colors"
            >
              平面図ページを確認
            </button>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600">
              推奨サイズ: 1200x900px 以上、最大10MB。JPG、PNG、WebP形式をサポートしています。
            </p>
          </div>
        </div>

        {/* Other Settings */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-wa-beige rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-wa-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-wa-brown mb-2">その他のシステム設定</h3>
          <p className="text-wa-gray mb-4">
            ホテル情報、システム設定などを管理できます。
          </p>
          <p className="text-sm text-gray-500">
            このセクションは開発中です。基本設定はデータベースに保存されています。
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}