# ChatFuture 项目架构图

## 🏗️ 整体架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                    ChatFuture Platform                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)    │    Backend (NestJS)               │
│  ┌─────────────────┐   │   ┌─────────────────────────────┐   │
│  │   User Interface │   │   │        API Services        │   │
│  │   - React 18     │   │   │        - REST API          │   │
│  │   - Tailwind CSS │   │   │        - Authentication    │   │
│  │   - Shadcn/UI    │   │   │        - Business Logic    │   │
│  └─────────────────┘   │   └─────────────────────────────┘   │
│           │             │              │                     │
│           │             │              ▼                     │
│           │             │   ┌─────────────────────────────┐   │
│           │             │   │      Data Layer             │   │
│           │             │   │   - PostgreSQL              │   │
│           │             │   │   - Redis Cache             │   │
│           │             │   │   - Supabase Storage        │   │
│           │             │   └─────────────────────────────┘   │
│           │             │              │                     │
│           │             │              ▼                     │
│           │             │   ┌─────────────────────────────┐   │
│           │             │   │     External Services       │   │
│           │             │   │   - AI Image Generation     │   │
│           │             │   │   - OpenAI/DeepSeek APIs    │   │
│           │             │   │   - Supabase Auth           │   │
│           │             │   └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📁 文件结构树

```
ChatFuture/
├── 📁 frontend/                    # 前端应用
│   ├── 📁 src/
│   │   ├── 📁 app/                 # Next.js App Router
│   │   │   ├── 📁 (auth)/          # 认证页面组
│   │   │   │   ├── 📄 login/page.tsx
│   │   │   │   ├── 📄 signup/page.tsx
│   │   │   │   └── 📄 callback/page.tsx
│   │   │   ├── 📁 (dashboard)/     # 仪表板页面组
│   │   │   │   ├── 📄 dashboard/page.tsx
│   │   │   │   └── 📄 profile/page.tsx
│   │   │   ├── 📁 (assessment)/    # 测评页面组
│   │   │   │   ├── 📄 assessment/page.tsx
│   │   │   │   └── 📄 results/page.tsx
│   │   │   ├── 📁 (card)/          # 画像卡页面组
│   │   │   │   ├── 📄 generate/page.tsx
│   │   │   │   └── 📄 gallery/page.tsx
│   │   │   ├── 📁 api/             # API路由代理
│   │   │   ├── 📄 layout.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 components/          # React组件
│   │   │   ├── 📁 ui/              # 基础UI组件
│   │   │   ├── 📁 auth/            # 认证组件
│   │   │   ├── 📁 assessment/      # 测评组件
│   │   │   ├── 📁 card/            # 画像卡组件
│   │   │   └── 📁 common/          # 通用组件
│   │   ├── 📁 hooks/               # 自定义Hooks
│   │   ├── 📁 lib/                 # 工具库
│   │   │   ├── 📁 api/             # API客户端
│   │   │   ├── 📁 auth/            # 认证工具
│   │   │   ├── 📁 utils/           # 通用工具
│   │   │   └── 📁 constants/       # 常量定义
│   │   ├── 📁 contexts/            # React Context
│   │   ├── 📁 types/               # 类型定义
│   │   └── 📁 styles/              # 样式文件
│   ├── 📁 public/                  # 静态资源
│   ├── 📄 package.json
│   ├── 📄 next.config.js
│   ├── 📄 tailwind.config.ts
│   └── 📄 tsconfig.json
├── 📁 backend/                     # 后端服务
│   ├── 📁 src/
│   │   ├── 📁 modules/             # 功能模块
│   │   │   ├── 📁 auth/            # 认证模块
│   │   │   ├── 📁 assessment/      # 测评模块
│   │   │   ├── 📁 card/            # 画像卡模块
│   │   │   ├── 📁 storage/         # 存储模块
│   │   │   ├── 📁 admin/           # 管理模块
│   │   │   └── 📁 common/          # 通用模块
│   │   ├── 📁 database/            # 数据库相关
│   │   │   ├── 📁 migrations/      # 数据库迁移
│   │   │   ├── 📁 seeds/           # 种子数据
│   │   │   └── 📁 prisma/          # Prisma配置
│   │   ├── 📁 config/              # 配置文件
│   │   ├── 📁 guards/              # 守卫
│   │   ├── 📁 interceptors/        # 拦截器
│   │   ├── 📁 decorators/          # 装饰器
│   │   ├── 📁 filters/             # 异常过滤器
│   │   ├── 📁 pipes/               # 管道
│   │   ├── 📄 main.ts              # 应用入口
│   │   └── 📄 app.module.ts        # 根模块
│   ├── 📁 test/                    # 测试文件
│   ├── 📁 docker/                  # Docker配置
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
├── 📁 shared/                      # 共享代码
│   ├── 📁 types/                   # 共享类型
│   │   ├── 📄 auth.types.ts
│   │   ├── 📄 assessment.types.ts
│   │   ├── 📄 card.types.ts
│   │   └── 📄 common.types.ts
│   ├── 📁 constants/               # 共享常量
│   ├── 📁 utils/                   # 共享工具
│   ├── 📁 schemas/                 # 数据验证
│   └── 📄 package.json
├── 📁 docs/                        # 项目文档
├── 📁 scripts/                     # 工具脚本
├── 📄 package.json                 # 根项目配置
├── 📄 docker-compose.yml           # Docker编排
└── 📄 README.md                    # 项目说明
```

## 🔄 数据流架构

```
用户交互 → 前端组件 → API调用 → 后端服务 → 数据库
    ↑                                    ↓
    ←─────── 响应数据 ←─── 业务处理 ←──────┘
```

## 🚀 部署架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                   │
├─────────────────────────────────────────────────────────────┤
│  CDN (Vercel)      │    Load Balancer    │   API Server     │
│  ┌─────────────┐   │   ┌─────────────┐   │ ┌─────────────┐  │
│  │   Frontend  │   │   │    Nginx    │   │ │   Backend   │  │
│  │   (Next.js) │   │   │   Proxy     │   │ │  (NestJS)   │  │
│  └─────────────┘   │   └─────────────┘   │ └─────────────┘  │
│         │          │         │           │        │         │
│         │          │         │           │        ▼         │
│         │          │         │           │ ┌─────────────┐  │
│         │          │         │           │ │  Database   │  │
│         │          │         │           │ │(PostgreSQL) │  │
│         │          │         │           │ └─────────────┘  │
│         │          │         │           │        │         │
│         │          │         │           │        ▼         │
│         │          │         │           │ ┌─────────────┐  │
│         │          │         │           │ │    Redis    │  │
│         │          │         │           │ │   Cache     │  │
│         │          │         │           │ └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 技术栈映射

| 层级 | 前端技术 | 后端技术 | 基础设施 |
|------|----------|----------|----------|
| **UI层** | React 18, Tailwind CSS, Shadcn/UI | - | - |
| **状态管理** | Zustand, React Context | - | - |
| **路由** | Next.js App Router | - | - |
| **API层** | Axios, React Query | NestJS, Swagger | - |
| **认证** | Supabase Auth | JWT, Passport | Supabase |
| **数据库** | - | Prisma ORM | PostgreSQL |
| **缓存** | - | Redis | Redis |
| **任务队列** | - | BullMQ | Redis |
| **文件存储** | - | Supabase Storage | Supabase |
| **AI服务** | - | OpenAI, DeepSeek | External APIs |
| **部署** | Vercel | Railway/Render | Docker |
