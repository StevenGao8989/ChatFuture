# ChatFuture 项目架构

## 📁 整体架构

```
ChatFuture/
├── frontend/                 # 前端应用 (Next.js)
├── backend/                  # 后端服务 (NestJS + Prisma)
├── shared/                   # 共享类型和工具
├── docs/                     # 项目文档
├── scripts/                  # 部署和工具脚本
├── docker-compose.yml        # Docker 编排文件
├── package.json              # 根项目配置
└── README.md                 # 项目说明
```

## 🎨 前端架构 (frontend/)

```
frontend/
├── src/
│   ├── app/                  # Next.js 14 App Router
│   │   ├── (auth)/           # 认证相关页面组
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── callback/
│   │   ├── (dashboard)/      # 仪表板页面组
│   │   │   ├── dashboard/
│   │   │   └── profile/
│   │   ├── (assessment)/     # 测评页面组
│   │   │   ├── assessment/
│   │   │   └── results/
│   │   ├── (card)/           # 画像卡页面组
│   │   │   ├── generate/
│   │   │   └── gallery/
│   │   ├── api/              # API 路由 (代理到后端)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/           # React 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   ├── auth/             # 认证相关组件
│   │   ├── assessment/       # 测评相关组件
│   │   ├── card/             # 画像卡相关组件
│   │   └── common/           # 通用组件
│   ├── hooks/                # 自定义 React Hooks
│   ├── lib/                  # 前端工具库
│   │   ├── api/              # API 客户端
│   │   ├── auth/             # 认证工具
│   │   ├── utils/            # 通用工具
│   │   └── constants/        # 常量定义
│   ├── contexts/             # React Context
│   ├── types/                # TypeScript 类型定义
│   └── styles/               # 样式文件
├── public/                   # 静态资源
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## ⚙️ 后端架构 (backend/)

```
backend/
├── src/
│   ├── modules/              # 功能模块
│   │   ├── auth/             # 认证模块
│   │   ├── assessment/       # 测评模块
│   │   ├── card/             # 画像卡模块
│   │   ├── storage/          # 存储模块
│   │   ├── admin/            # 管理模块
│   │   └── common/           # 通用模块
│   ├── database/             # 数据库相关
│   │   ├── migrations/       # 数据库迁移
│   │   ├── seeds/            # 种子数据
│   │   └── prisma/           # Prisma 配置
│   ├── config/               # 配置文件
│   ├── guards/               # 守卫 (权限控制)
│   ├── interceptors/         # 拦截器
│   ├── decorators/           # 装饰器
│   ├── filters/              # 异常过滤器
│   ├── pipes/                # 管道
│   ├── main.ts               # 应用入口
│   └── app.module.ts         # 根模块
├── test/                     # 测试文件
├── docker/                   # Docker 配置
├── nest-cli.json
├── package.json
└── tsconfig.json
```

## 🔗 共享架构 (shared/)

```
shared/
├── types/                    # 共享类型定义
│   ├── auth.types.ts
│   ├── assessment.types.ts
│   ├── card.types.ts
│   └── common.types.ts
├── constants/                # 共享常量
├── utils/                    # 共享工具函数
├── schemas/                  # 数据验证模式
└── package.json
```

## 🚀 部署架构

```
scripts/
├── setup/                    # 环境设置脚本
├── deploy/                   # 部署脚本
├── dev/                      # 开发环境脚本
└── test/                     # 测试脚本

docs/
├── api/                      # API 文档
├── frontend/                 # 前端文档
├── backend/                  # 后端文档
└── deployment/               # 部署文档
```

## 🔄 数据流架构

1. **前端** → API Gateway → **后端服务**
2. **后端** → **数据库** (PostgreSQL)
3. **后端** → **AI 服务** (图像生成)
4. **后端** → **存储服务** (Supabase Storage)

## 📦 技术栈

### 前端
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Recharts
- Zustand (状态管理)

### 后端
- NestJS
- Prisma ORM
- PostgreSQL
- Redis (缓存)
- BullMQ (任务队列)
- JWT (认证)

### 基础设施
- Docker & Docker Compose
- Supabase (数据库 + 存储)
- Vercel (前端部署)
- Railway/Render (后端部署)
