'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(t.auth.errors.fillAllFields);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.auth.errors.passwordMismatch);
      return;
    }

    if (formData.password.length < 6) {
      setError(t.auth.errors.passwordTooShort);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
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
      console.error('Register error:', error);
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
          <h1 className="text-2xl font-bold text-wa-brown mb-2">{t.auth.register.title}</h1>
          <p className="text-wa-gray">{t.auth.register.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-wa-brown mb-2">
              {t.auth.register.name}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent text-wa-brown placeholder-gray-400"
              placeholder={t.auth.register.name}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-wa-brown mb-2">
              {t.auth.register.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent text-wa-brown placeholder-gray-400"
              placeholder={t.auth.register.email}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-wa-brown mb-2">
              {t.auth.register.password}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent text-wa-brown placeholder-gray-400"
              placeholder={t.auth.register.password}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-wa-brown mb-2">
              {t.auth.register.confirmPassword}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent text-wa-brown placeholder-gray-400"
              placeholder={t.auth.register.confirmPassword}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-wa-brown text-wa-cream py-3 px-4 rounded-md hover:bg-wa-brown/90 focus:outline-none focus:ring-2 focus:ring-wa-brown focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t.auth.register.registerProgress : t.auth.register.registerBtn}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-wa-gray">
            {t.auth.register.hasAccount}{' '}
            <Link href="/login" className="text-wa-brown hover:text-wa-brown/80 font-medium">
              {t.auth.register.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}