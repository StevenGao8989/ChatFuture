# 迁移到新架构指南

## 🎯 迁移概述

本指南将帮助你从当前的单体架构迁移到新的前后端分离架构。

## 📋 迁移步骤

### 1. 备份当前项目

```bash
# 创建备份
cp -r /Users/gaobingsong/Documents/ChatFuture /Users/gaobingsong/Documents/ChatFuture-backup
```

### 2. 执行自动迁移

```bash
# 运行迁移脚本
node scripts/migrate-to-new-architecture.js
```

### 3. 安装依赖

```bash
# 安装所有依赖
npm run install:all

# 构建共享包
npm run build:shared
```

### 4. 更新导入路径

#### 前端文件更新

需要更新以下文件中的导入路径：

**从:**
```typescript
import { User } from '@/types/auth'
import { AssessmentResult } from '@/types/assessment'
```

**到:**
```typescript
import { User } from '@shared/types/auth.types'
import { AssessmentResult } from '@shared/types/assessment.types'
```

#### 后端文件更新

**从:**
```typescript
import { User } from '../types/auth'
```

**到:**
```typescript
import { User } from '@shared/types/auth.types'
```

### 5. 更新配置文件

#### 前端 next.config.js

确保包含以下配置：

```javascript
webpack: (config) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': require('path').resolve(__dirname, 'src'),
    '@shared': require('path').resolve(__dirname, '../shared'),
  }
  return config
}
```

#### 后端 tsconfig.json

确保包含以下配置：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["../shared/*"]
    }
  }
}
```

## 🔧 需要手动处理的项目

### 1. 环境变量

将 `.env.local` 移动到 `frontend/.env.local`，并创建 `backend/.env`：

```bash
# 前端环境变量 (frontend/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
# ... 其他前端变量

# 后端环境变量 (backend/.env)
NODE_ENV=development
PORT=3001
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
# ... 其他后端变量
```

### 2. 数据库Schema

将 `supabase-schema.sql` 转换为 Prisma Schema：

```prisma
// backend/database/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

// ... 其他模型
```

### 3. API路由更新

#### 前端 API 路由 (frontend/src/app/api/)

创建代理路由到后端：

```typescript
// frontend/src/app/api/auth/login/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  
  return response
}
```

#### 后端 API 路由 (backend/src/modules/)

```typescript
// backend/src/modules/auth/auth.controller.ts
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // 登录逻辑
  }
}
```

## 🧪 测试迁移

### 1. 启动开发服务器

```bash
# 启动所有服务
npm run dev

# 或者分别启动
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:3001
```

### 2. 验证功能

- [ ] 前端页面正常加载
- [ ] 认证功能正常工作
- [ ] API调用成功
- [ ] 数据库连接正常
- [ ] 静态资源加载正常

### 3. 运行测试

```bash
npm run test
```

## 🚨 常见问题

### 1. 导入路径错误

**问题:** `Cannot resolve module '@shared/types'`

**解决:** 确保在 `next.config.js` 和 `tsconfig.json` 中正确配置了路径别名。

### 2. 环境变量未加载

**问题:** 环境变量在运行时未定义

**解决:** 检查 `.env` 文件位置和变量名前缀（前端需要 `NEXT_PUBLIC_`）。

### 3. 数据库连接失败

**问题:** Prisma 无法连接到数据库

**解决:** 检查 `DATABASE_URL` 环境变量和数据库服务状态。

### 4. 端口冲突

**问题:** 端口已被占用

**解决:** 修改配置文件中的端口号或停止占用端口的进程。

## 📝 迁移检查清单

- [ ] 备份原始项目
- [ ] 运行迁移脚本
- [ ] 安装所有依赖
- [ ] 更新导入路径
- [ ] 配置环境变量
- [ ] 更新数据库Schema
- [ ] 创建API路由
- [ ] 测试所有功能
- [ ] 运行测试套件
- [ ] 更新文档

## 🎉 完成迁移

迁移完成后，你将拥有：

- ✅ 清晰的前后端分离架构
- ✅ 可重用的共享类型和工具
- ✅ 更好的代码组织和维护性
- ✅ 独立的开发和部署流程
- ✅ 更好的扩展性

如果遇到任何问题，请参考 `ARCHITECTURE.md` 文档或联系开发团队。
