# 拥抱 AI，拒绝焦虑 · VibeCoding 技术成长分享交流会

一个用于现场演示的分享会展示网站：从「工具焦虑」讲到「说一句话就改版」，再从小站走到完整技术栈，把 VibeCoding 的完整链路拆成 13 个可讲述的章节。

内容整理自《VibeCoding 建站实操指南：工具、技术栈与 GitHub Pages 部署》与《网站规模进阶与 AI 时代认知升华》。

## 内容结构

| 章节 | 讲什么 |
| --- | --- |
| 00 Hero | 主题 + 「自然语言 → 页面」实时演示 |
| 01 焦虑清单 | 四个真实卡点，逐条指向「不是代码问题」 |
| 02 是什么 | VibeCoding 定义、过去 / 现在的对比 |
| 03 工具链 | 豆包（构思）· Trea（编码）· WorkBuddy（迭代）+ Watt Toolkit |
| 04 技术栈 | CSS 框架 / 站点生成器 / UI 组件库，推荐 Tailwind + DaisyUI |
| 05 部署 · 路径一 | 手动上传：新建仓库 → 上传文件 → 开启 Pages |
| 06 部署 · 路径二 | Fine-grained PAT + AI 接管 + 维护提示词 |
| 07 路径对比 | 五维度对比，先跑通再自动化 |
| 08 闭环 | 构思 → 实现 → 迭代 → 上线 → 验证（可点击） |
| 09 常见坑 | 白屏、超时、认证失败、改完不生效 |
| 10 能力边界 | 静态站的优势与天花板：能展示，不能承载业务 |
| 11 规模进阶 | 前端 / 后端与数据库 / 部署 / 能力定位四条升级线（可切换） |
| 12 AI 时代 | AI 擅长与做不了的事、淘汰逻辑、入门与上限 |
| 13 寄语 | 保持探索，以及今天就能做完的三件事 |

## 技术说明

- **零构建、零依赖**：纯静态 HTML + CSS + 原生 JS，可直接托管在 GitHub Pages，与文档中「能 CDN 引入就别打包」的选型逻辑一致。
- **自建轻量组件库**：`assets/css/style.css` 顶部定义了设计 token（配色、字号、圆角、阴影），往下是 nav / card / tabs / stepper / accordion / table 等组件样式，没有引入第三方框架，避免 FOUC 与额外的网络请求。
- **字体自托管**：Space Grotesk（拉丁文展示字）与 JetBrains Mono（代码）放在 `assets/fonts`，离线也能正常渲染，现场演示不依赖网络。
- **图标**：Lucide 线条图标（`assets/icons`），通过 CSS `mask` 使用，可跟随文字颜色变化。
- **真实截图**：GitHub 操作步骤与界面细节取自 GitHub Docs 官方文档原图；产品界面截图取自豆包、TRAE、WorkBuddy、Watt Toolkit 官网。
- **交互**：滚动进场、章节导航与进度、技术栈与升级线两组选项卡、可点击闭环、代码一键复制、截图灯箱放大、移动端菜单；支持 `←` / `→` 键切换章节，适合现场讲解。
- **响应式**：桌面双栏 / 平板收窄 / 手机单栏；对比表与升级线表格在手机上自动改为堆叠布局，选项卡在窄屏变为 2×2。
- **可访问性**：语义化标签、`aria-selected` / `aria-pressed` / `aria-live`、键盘可操作、`prefers-reduced-motion` 降级、打印样式。

## 目录

```
.
├── index.html
└── assets
    ├── css/style.css
    ├── js/main.js
    ├── fonts/          # 自托管 woff2
    ├── icons/          # 线条图标（mask 使用）
    ├── logos/          # 产品与技术栈 logo
    └── shots/          # 产品截图与 GitHub 文档截图
```

## 本地预览

任选一种静态服务器（不要直接双击打开，`mask` 与字体在 `file://` 下会被拦截）：

```bash
npx http-server -p 4173 -c-1
# 打开 http://127.0.0.1:4173
```

## 部署到 GitHub Pages

1. 仓库设为 **Public**，根目录保留 `index.html`；
2. Settings → Pages → Source 选 `Deploy from a branch`，分支 `main`、目录 `/root`，Save；
3. 等待 1–3 分钟，访问 `https://<用户名>.github.io/<仓库名>/`。

资源全部使用相对路径，因此放在仓库子路径下也能正常加载。

## 素材来源

- GitHub 界面截图：GitHub Docs（Quickstart for GitHub Pages、Configuring a publishing source、Managing your personal access tokens、Adding a file to a repository）
- 产品界面：豆包、TRAE、WorkBuddy、Watt Toolkit 官网
- 品牌图标：Simple Icons 及各产品官方 favicon / logo
- 第二篇《网站规模进阶与 AI 时代认知升华》为本次新增内容，两篇文档中部分内容由豆包工作 AI 生成，本站据此整理归纳
