# 更新日志

## 2026-05-26

### 16:30 — 对齐新 PRD：首页动态统计、清理遗留代码
- **P0**：首页统计卡片从硬编码（30 / 0 / 0 / 1004）改为动态数据
  - 从 `grammarService.getAll()` 获取语法总数
  - 从 `learningService.getProgressMap()` 获取学习进度
  - 统计卡：今日待复习、已学习语法、已掌握语法、语法总数
  - N1~N5 进度条按真实进度比例渲染
  - zh/en 字典补齐 `masteredGrammar` 键
- **P1**：从 root layout 移除已废弃的 `GrammarProvider` / `GrammarContext`
  - 删除 `src/context/GrammarContext.tsx`（无任何业务页面引用）
- **P2**：`globals.css` 从 `src/app/[lang]/` 移动到标准位置 `src/app/`

### 15:00 — 评审新 PRD，确认对齐/不对齐项
- 完整阅读 `docs/jlpt-grammar-deck-prd.md`（680 条语法、SM-2、Guest 模式等）
- 逐项对照 PRD §6 ~ §16 和当前代码实现状态
- 确认：study/review 分工正确、SM-2 已集成、review_history 已有、proxy.ts 正确
- 发现并修复：首页硬编码统计、GrammarContext 残留、globals.css 路径

### 13:00 — 全部页面迁入 Supabase，数据迁移完成
- 所有页面（grammar / study / review / favorites / dashboard / admin）改用 `grammarService` / `learningService` 从 Supabase 读写
- `node scripts/seed.js` 成功导入 1004 条语法（后审计缩减为 680 条）
- Admin 新增/编辑/删除通过 `grammarService.create/update/delete` 真正写入数据库

### 12:00 — Supabase 基础设施搭建
- 安装 `@supabase/supabase-js`、`@supabase/ssr`
- 创建 `src/lib/supabase.ts`（公共客户端）、`src/lib/supabase-browser.ts`（浏览器端）、`src/lib/supabase-server.ts`（服务端）
- 创建 Auth Provider（邮箱/密码 + Google OAuth）、`src/middleware.ts`（session 刷新）
- 数据库 Schema：`grammar` / `profiles` / `user_grammar_progress` / `daily_stats`
- 数据服务层：`grammarService.ts`、`progressService.ts`
- SM-2 间隔重复算法：`src/lib/sm2.ts`

### 11:00 — 登录页面接入真实 Auth
- 重写 `src/app/login/page.tsx`：支持邮箱注册/登录 + Google 登录
- 添加错误状态显示、注册/登录模式切换
- 创建 `src/app/auth/callback/route.ts`（OAuth 回调处理）

### 10:30 — 筛选下拉框改为直角、修复显示问题
- SelectTrigger / SelectContent 圆角移除（从 `rounded-lg`/`rounded-full` 改为直角）
- 下拉菜单与触发器间距增大（`sideOffset` 4→8）
- SelectValue 从展示 raw value "all" 改为映射后的中文标签

### 10:00 — 字体改为系统默认
- 移除 Google Fonts 加载（Noto Serif SC、IBM Plex Mono、Inter）
- CSS 变量改为系统字体栈：`-apple-system`、`PingFang SC`、`Songti SC` 等

---

## 2026-05-25

### 23:00 — Supabase 注册、项目创建
- 注册 supabase.com 账号，创建 `jlpt-grammar-cards` 项目
- 配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `.env.local` 加入 `.gitignore`，不会提交到 GitHub

### 22:00 — Admin 后台完整 CRUD
- 创建 `GrammarContext` 全局状态管理（add / update / delete / toggleFavorite）
- `admin/grammar/new` 实现真正新增（所有表单字段受控，提交写入 Context）
- `admin/grammar/[id]/edit` 实现真正编辑（加载当前数据，保存后真正更新）
- `admin/grammar` 列表实现真正删除（带确认弹框）
- 所有页面统一从 Context 读取数据，不再静态 import `mock-data`
- 新增 `Textarea` 组件

### 21:00 — 首页微调
- Hero 标题与描述间距缩小（`mt-6→mt-4`、`mt-8→mt-6`）
- 学习流程卡片改为 Wash 蓝 `#cfdaf5` 背景，加步骤编号圆圈
- CTA 黑色卡片缩小：padding `p-10→p-8`、圆角 `40px→24px`、`max-w-3xl` 限制宽度

### 20:00 — Paper Canvas 主题重设计
- 完整应用 Paper Canvas (`#f6f3f1`) + Off Black (`#242424`) + Atmosphere Wash (`#cfdaf5`) 色板
- 字体：Noto Serif SC（标题）、IBM Plex Mono（UI）、Inter（正文）
- 40px 圆角卡片、pill 按钮、柔和复习色（rose/amber/blue/green）
- 布局重构：顶部 Header + NotificationBar + MobileBottomNav（移除左侧 Sidebar）
- 首页改为 Landing Page：Hero + Features + Flow + Stats + CTA
- StudyFlashcard 改为 Wash Card、ReviewButtons 改为软色 pill
- GrammarCard 改为 Paper Card、LevelBadge 软 JLPT 色
- 登录页简化：移除语法示例卡片、单列居中、pill 输入框/按钮
- 通知栏隐藏于登录页（`hideNotification` prop）

### 19:00 — 阅读设计文档，准备主题重构
- 阅读 `Anki 风格日语语法学习网站设计与开发需求prd.md`
- 阅读 `Grammar——DESIGN.md`
