# 朝香ホテル (Asuka Hotel)

箱根仙石原寮のモダンな予約サイトです。フロントエンド・バックエンド・管理システムを統合した完全な予約管理システムです。

## 特徴 (Features)

### フロントエンド機能
- **多言語対応**: 日本語、英語、中文に対応
- **レスポンシブデザイン**: PC・タブレット・スマートフォンに最適化
- **リアルタイム予約確認**: 在庫状況をリアルタイムで確認
- **予約カレンダー**: 2ヶ月分の予約状況を視覚的に表示
- **日本風デザイン**: 和風カラーパレット、Noto Sans JP フォント
- **SEO最適化**: 構造化データ、メタタグ完備

### バックエンド機能
- **完全な予約管理システム**: 予約作成、確認、キャンセル、完了
- **顧客管理システム**: 顧客情報、予約履歴、統計分析
- **客室管理**: 6つの客室の詳細管理
- **お問い合わせ管理**: フロントからの問い合わせ受付・管理
- **管理者認証**: JWT認証による安全な管理システム

### システム機能
- **リアルタイム在庫確認**: 予約重複防止
- **自動料金計算**: 宿泊日数に応じた自動計算
- **予約状況管理**: PENDING → CONFIRMED → COMPLETED のワークフロー
- **データベース統合**: Prisma ORM + SQLite

## 技術スタック (Tech Stack)

### フロントエンド
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: React 18
- **状態管理**: React Context API
- **フォント**: Noto Sans JP
- **画像**: Next.js Image最適化

### バックエンド
- **API**: Next.js API Routes
- **データベース**: SQLite + Prisma ORM
- **認証**: JWT (JSON Web Tokens)
- **バリデーション**: Zod (型安全なスキーマ検証)

### 開発・運用
- **開発環境**: Node.js 18+
- **パッケージマネージャー**: npm
- **コード品質**: ESLint + TypeScript
- **デプロイ**: Vercel 対応

## 使用方法 (Usage)

### 開発環境の起動

```bash
npm install
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

### ビルド

```bash
npm run build
npm start
```

## プロジェクト構成 (Project Structure)

```
/
├── app/                    # Next.js App Router
│   ├── page.tsx           # トップページ
│   ├── rooms/             # 客室一覧・詳細
│   │   └── [id]/          # 客室詳細ページ
│   ├── booking/           # 予約フォーム
│   ├── about/             # 私たちについて
│   ├── contact/           # お問い合わせ
│   ├── admin/             # 管理システム
│   │   ├── login/         # 管理者ログイン
│   │   ├── bookings/      # 予約管理
│   │   ├── customers/     # 顧客管理
│   │   │   └── [email]/   # 顧客詳細
│   │   ├── rooms/         # 客室管理
│   │   └── contacts/      # お問い合わせ管理
│   └── api/               # バックエンド API
│       ├── auth/          # 認証
│       ├── bookings/      # 予約 API
│       ├── rooms/         # 客室 API
│       ├── contacts/      # お問い合わせ API
│       └── admin/         # 管理 API
├── components/            # 再利用可能コンポーネント
│   ├── Header.tsx         # ヘッダーナビゲーション
│   ├── AdminLayout.tsx    # 管理画面レイアウト
│   ├── PhotoCarousel.tsx  # 写真カルーセル
│   ├── AvailabilityCalendar.tsx # 予約カレンダー
│   └── StructuredData.tsx # SEO構造化データ
├── contexts/              # React Context
│   └── LanguageContext.tsx # 言語設定
├── lib/                   # ユーティリティ
│   ├── db.ts             # データベース接続
│   ├── auth.ts           # 認証ユーティリティ
│   └── i18n.ts           # 多言語対応
├── prisma/               # Prisma ORM
│   └── schema.prisma     # データベーススキーマ
├── types/                # TypeScript型定義
└── public/               # 静的ファイル
    └── images/           # 客室画像
```

## 客室情報 (Room Information)

1. **東側角部屋** - ¥12,000/泊 (2名まで)
2. **スタンダードルーム（1号室）** - ¥10,000/泊 (2名まで)
3. **中央連結部屋（A）** - ¥11,000/泊 (3名まで)
4. **中央連結部屋（B）** - ¥11,000/泊 (3名まで)
5. **スタンダードルーム（2号室）** - ¥10,000/泊 (2名まで)
6. **西側角部屋** - ¥12,000/泊 (2名まで)

## 機能詳細 (Detailed Features)

### フロントエンド機能
- **客室検索・フィルタリング**: 価格、客室タイプ、定員による絞り込み
- **リアルタイム在庫確認**: 予約前に在庫状況をリアルタイムチェック
- **予約カレンダー**: 2ヶ月分の予約状況を色分けで表示
- **写真カルーセル**: 客室の高品質画像表示
- **レスポンシブデザイン**: 全デバイス対応
- **多言語対応**: 日本語/英語/中国語の動的切り替え
- **予約フロー**: 日程選択 → 人数指定 → 料金確認 → 予約完了

### 管理システム機能
- **予約管理**: 全予約の一覧、ステータス管理、フィルタリング
- **顧客管理**: 顧客情報、予約履歴、統計分析
- **客室管理**: 客室情報の編集、価格設定
- **お問い合わせ管理**: フロントからの問い合わせ対応
- **ダッシュボード**: 予約状況、売上統計の可視化

### データベース機能
- **予約テーブル**: 予約情報、顧客情報、ステータス管理
- **客室テーブル**: 客室詳細、価格、設備情報
- **お問い合わせテーブル**: 問い合わせ内容、対応状況
- **管理者テーブル**: 認証情報、権限管理

### API機能
- **予約 API**: 作成、更新、削除、在庫確認
- **顧客 API**: 顧客情報管理、統計取得
- **認証 API**: JWT ベースの安全な認証
- **管理 API**: 管理者専用の操作

## セットアップ (Setup)

### 1. 依存関係のインストール
```bash
npm install
```

### 2. データベースのセットアップ
```bash
# Prisma データベースの初期化
npx prisma generate
npx prisma db push

# 初期データの投入
npx prisma db seed
```

### 3. 環境変数の設定
`.env.local` ファイルを作成:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-key"
NEXT_PUBLIC_ADMIN_EMAIL="admin@example.com"
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

## 管理システムへのアクセス

- **管理画面**: http://localhost:3000/admin/login
- **デフォルト管理者**: admin@example.com / password123

## API エンドポイント

### 公開 API
- `GET /api/rooms` - 客室一覧取得
- `GET /api/rooms/[id]` - 客室詳細取得
- `POST /api/bookings` - 予約作成
- `POST /api/bookings/check-availability` - 在庫確認
- `POST /api/contacts` - お問い合わせ送信

### 管理者 API (要認証)
- `GET /api/admin/bookings` - 予約管理
- `GET /api/admin/customers` - 顧客管理
- `GET /api/admin/rooms` - 客室管理
- `GET /api/admin/contacts` - お問い合わせ管理

## 今後の拡張 (Future Enhancements)

- **決済システム統合**: Stripe / PayPal 連携
- **メール通知システム**: 予約確認・リマインダー
- **レビューシステム**: 宿泊者レビュー機能
- **レポート機能**: 売上分析、客室稼働率
- **外部 API 連携**: 天気予報、観光情報
- **モバイルアプリ**: React Native 版の開発

## ライセンス (License)

© 2024 朝香ホテル. All rights reserved.