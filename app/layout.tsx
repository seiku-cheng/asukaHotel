import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';

const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '箱根仙石原寮 - 心温まる日本のおもてなし',
    template: '%s | 箱根仙石原寮'
  },
  description: '箱根仙石原寮は、神奈川県箱根の美しい仙石原に位置する宿泊施設です。完全予約制で、6つの個性豊かな客室で心温まるひとときをお過ごしください。',
  keywords: ['箱根', '仙石原', '民宿', '日本', 'ホテル', '宿泊', '予約', 'Hakone', 'Sengokuhara', 'Japanese lodge'],
  authors: [{ name: '箱根仙石原寮' }],
  creator: '箱根仙石原寮',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    alternateLocale: ['en_US', 'zh_CN'],
    title: '箱根仙石原寮 - 心温まる日本のおもてなし',
    description: '箱根仙石原寮は、神奈川県箱根の美しい仙石原に位置する宿泊施設です。完全予約制で運営しております。',
    siteName: '箱根仙石原寮',
  },
  twitter: {
    card: 'summary_large_image',
    title: '箱根仙石原寮 - 心温まる日本のおもてなし',
    description: '箱根仙石原寮は、神奈川県箱根の美しい仙石原に位置する宿泊施設です。完全予約制で運営しております。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token_here',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="canonical" href="https://asuka-hotel.com" />
        <link rel="alternate" hrefLang="ja" href="https://asuka-hotel.com" />
        <link rel="alternate" hrefLang="en" href="https://asuka-hotel.com/en" />
        <link rel="alternate" hrefLang="zh" href="https://asuka-hotel.com/zh" />
        <meta name="geo.region" content="JP" />
        <meta name="geo.placename" content="Kanagawa" />
      </head>
      <body className={notoSansJP.className}>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}