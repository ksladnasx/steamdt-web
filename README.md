# SteamDT 饰品价格查询系统

一个基于 Vue 3 + TypeScript + Element Plus 的 Steam 饰品价格查询平台，支持实时价格、7 日平台均价、磨损信息等多维度数据展示。

## ✨ 功能特性

- 🔍 **智能搜索**：支持中英文模糊搜索，自动补全饰品名称
- 📊 **多维度价格展示**：
  - 实时平台价格对比
  - 7 日平台均价分析
  - 不同磨损等级价格
  - 其他品质/分类信息
- 📱 **响应式设计**：适配桌面端和移动端
- ⚡ **高性能**：并行请求所有 API，优化加载体验
- 🎨 **美观 UI**：现代化的卡片式设计，渐变色彩
- 🔄 **数据联动**：点击磨损信息可重新查询完整数据

## 🛠 技术栈

- **前端框架**: Vue 3 + TypeScript + Composition API
- **UI 组件库**: Element Plus
- **构建工具**: Vite
- **HTTP 客户端**: Fetch API
- **样式**: CSS3 + Flexbox + Grid
- **开发语言**: TypeScript 5+

## 📁 项目结构

```
src/
├── api/                    # API请求封装
│   └── index.ts           # 所有API接口定义
├── components/            # 可复用组件
│   ├── SearchInput.vue    # 搜索输入组件
│   ├── SkinInfo.vue       # 饰品信息展示组件
│   ├── PriceDisplay.vue   # 价格展示组件
│   └── MoreInfo.vue       # 更多价格信息组件
├── views/                 # 页面组件
│   └── SkinSearch.vue     # 主搜索页面
├── types/                 # TypeScript类型定义
│   └── index.ts
├── datacontent/           # 本地数据
│   └── content.json       # 饰品基础数据
└── main.ts               # 应用入口
```

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm
pnpm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录中。

## 🔧 配置说明

### API 配置

在 `src/api/index.ts` 中配置 API 相关参数：

```typescript
export const API_CONFIG = {
  BASE: "/api", // 代理基础路径
  MoreInfoBASE: "/api", // 更多信息API基础路径
  TOKEN: "Bearer YOUR_TOKEN_HERE", // API认证令牌
  TIMEOUT: 10000, // 请求超时时间
};
```

### 代理配置

在 `vite.config.ts` 中配置开发代理：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://api.steamdt.com',  // 目标API服务器
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 数据源

1. **本地数据**：`src/datacontent/content.json` 包含饰品基础信息
2. **远程 API**：
   - 实时价格：`/cs2/v1/price/single`
   - 7 日均价：`/cs2/v1/price/avg`
   - 磨损信息：`/sale-wear-detail`

## 📱 使用指南

### 搜索饰品

1. 在搜索框中输入饰品名称（如"响尾蛇"、"AK-47"等）
2. 从下拉列表中选择目标饰品
3. 系统自动加载所有相关信息

### 查看价格信息

- **基本信息**：饰品名称、Hash 名称、平台数量
- **实时价格**：各平台当前售价、求购价、库存量
- **7 日均价**：各平台近 7 天平均价格
- **磨损信息**：不同磨损等级的价格和存世量
- **品质分类**：其他版本/品质的价格信息

### 交互操作

- **点击"查看"按钮**：重新搜索并加载该饰品所有数据
- **价格排序**：点击表格标题可对价格排序
- **信息提示**：鼠标悬停在英文名称上显示完整信息

## 🔌 API 接口

### 基础信息接口

- `GET /cs2/v1/base` - 获取所有饰品基础信息

### 价格查询接口

- `GET /cs2/v1/price/single?marketHashName={name}` - 查询单饰品实时价格
- `GET /cs2/v1/price/avg?marketHashName={name}` - 查询 7 日平台均价

### 磨损信息接口

- `POST /sale-wear-detail` - 查询饰品不同磨损信息

## 🎨 设计特色

### UI 设计

- 渐变背景和卡片式布局
- 响应式网格系统
- 颜色编码的价格显示
- 直观的数据可视化

### 用户体验

- 实时搜索建议
- 并行数据加载
- 智能错误处理
- 平滑的动画过渡

## 🧪 开发说明

### 添加新功能

1. 在 `src/api/index.ts` 中添加新的 API 函数
2. 在 `src/types/index.ts` 中定义相关类型
3. 创建新的组件或扩展现有组件
4. 在适当的位置集成新功能

### 调试技巧

- 使用浏览器开发者工具的 Network 面板监控 API 请求
- 查看控制台日志了解数据加载状态
- 使用 Element Plus 的开发工具调试组件

## 📄 许可证

MIT License

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 🔄 更新日志

### v1.0.0 (2024-01)

- 初始版本发布
- 实现基础搜索功能
- 集成实时价格和均价查询
- 添加磨损信息展示
- 完成响应式设计

---

**温馨提示**：本项目仅供学习和研究使用，请遵守相关平台的使用条款和数据获取政策。
