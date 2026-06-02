# JLPT Grammar Deck

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?logo=vercel)](https://jlpt-grammar-cards.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

一个 Anki 风格的 JLPT（N1–N5）日语语法学习工具。

**在线访问**: https://jlpt-grammar-cards.com

## 功能

- **语法库** — 浏览 700+ 条 JLPT 语法，支持搜索和筛选
- **卡片学习** — 正面显示语法，背面展示意思、接续、例句和易错点
- **SM-2 复习** — 基于遗忘曲线的智能复习调度
- **收藏与个人语法库** — 收藏重点语法，添加私有语法条目
- **学习数据** — Dashboard 展示学习进度、等级分布、复习趋势
- **Guest 模式** — 无需登录即可学习，登录后同步到云端
- **多语言** — 中文 / English 界面切换

## 技术栈

- **前端**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **后端**: Supabase (PostgreSQL + Auth + RLS)
- **部署**: Vercel

## 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## License

[MIT](./LICENSE) © 2026 panda-pig
