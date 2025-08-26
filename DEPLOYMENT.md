# 部署指南 / Deployment Guide

## 🚀 项目已推送到GitHub

**仓库地址**: https://github.com/Zhang-FenFen/asukaHotel.git

## 📋 部署前准备

### 1. 环境变量配置
复制 `.env.example` 到 `.env` 并配置以下变量：

```bash
# 复制环境变量模板
cp .env.example .env
```

### 2. 必需的API密钥

**Google Maps API**:
1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建项目并启用 Maps JavaScript API
3. 创建API密钥并设置域名限制
4. 更新 `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

**数据库**:
- 开发环境：使用SQLite (默认配置)
- 生产环境：配置PostgreSQL连接

**Gmail SMTP** (可选):
- 配置Gmail应用密码用于发送预订确认邮件

## 🛠 本地开发

```bash
# 安装依赖
npm install

# 数据库设置
npx prisma generate
npx prisma db push
npx prisma db seed

# 启动开发服务器
npm run dev
```

访问: http://localhost:3000

## 🌐 生产部署选项

### Vercel (推荐)
1. 连接GitHub仓库到Vercel
2. 配置环境变量
3. 自动部署

### 其他平台
- **Netlify**: 支持Next.js部署
- **Railway**: 支持数据库和应用
- **DigitalOcean App Platform**: 全栈应用支持

## 📁 项目结构

```
asuka-hotel/
├── app/                 # Next.js 15 App Router
│   ├── admin/          # 管理后台
│   ├── api/            # API路由
│   └── [pages]         # 用户页面
├── components/         # React组件
├── contexts/          # React Context
├── lib/               # 工具函数
├── prisma/            # 数据库配置
├── public/            # 静态资源
├── .env.example       # 环境变量模板
└── .gitignore         # Git忽略配置
```

## 🔐 安全注意事项

- ✅ `.env` 文件被git忽略
- ✅ API密钥通过环境变量管理
- ✅ JWT认证保护管理功能
- ✅ 文件上传限制和验证

## 📞 支持

如有问题，请在GitHub仓库中创建issue：
https://github.com/Zhang-FenFen/asukaHotel/issues