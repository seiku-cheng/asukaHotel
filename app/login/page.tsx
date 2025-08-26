'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { locale } = useLanguage();
  const t = getTranslation(locale);
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除错误信息
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 客户端验证
    if (!formData.email || !formData.password) {
      setError(t.auth.errors.fillAllFields);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 使用AuthContext登录
        login(data.user, data.token);
        
        // 跳转到首页
        router.push('/');
      } else {
        setError(data.error || t.auth.errors.networkError);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t.auth.errors.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wa-cream py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-wa-gray hover:text-wa-brown transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.common.back}
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-wa-brown mb-2">{t.auth.login.title}</h1>
          <p className="text-wa-gray">{t.auth.login.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-wa-brown mb-2">
              {t.auth.login.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent text-wa-brown placeholder-gray-400"
              placeholder={t.auth.login.email}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-wa-brown mb-2">
              {t.auth.login.password}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent text-wa-brown placeholder-gray-400"
              placeholder={t.auth.login.password}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-wa-brown text-wa-cream py-3 px-4 rounded-md hover:bg-wa-brown/90 focus:outline-none focus:ring-2 focus:ring-wa-brown focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t.auth.login.loginProgress : t.auth.login.loginBtn}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-wa-gray">
            {t.auth.login.noAccount}{' '}
            <Link href="/register" className="text-wa-brown hover:text-wa-brown/80 font-medium">
              {t.auth.login.register}
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/admin" className="text-sm text-wa-gray hover:text-wa-brown">
            {t.auth.login.adminLogin}
          </Link>
        </div>
      </div>
    </div>
  );
}