<div align="center">

# StarLight-7693-Tools-Website

![Last Commit](https://img.shields.io/github/last-commit/PidanEggyTeam/StarLight-7693-Tools-Website?label=Last%20Commit)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-000000?logo=Next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.1-61DAFB?logo=React&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?logo=TypeScript&logoColor=white)](https://www.typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/SCSS-sass%201.101-CF649A?logo=sass&logoColor=white)](https://sass-lang.com/)
[![MDUI](https://img.shields.io/badge/MDUI-2.1.5-757575?logo=materialdesign&logoColor=white)](https://www.mdui.org/)
![License](https://img.shields.io/badge/License-MIT-blue)
[![GitHub](https://img.shields.io/badge/GitHub-PidanEggyTeam-blue?logo=github&logoColor=F5F5F5)](https://github.com/PidanEggyTeam)

栖小光的工具站：一堆纯前端小工具，输入的内容不上传服务器。使用 Next.js 16 + React 19 + TypeScript + SCSS + MDUI 构建，`output: 'export'` 静态生成（SSG）后以 assets-only Worker 部署到 **Cloudflare Workers Static Assets**，线上地址 <https://www.skystarlight.top>。

</div>

## 网站结构

- **顶栏**：品牌 + 主题切换 + 关于。窄屏（≤840px）左侧换成汉堡按钮，点开抽屉式侧栏。
- **侧栏**：按分类分组列出全部工具（编码转换 / 时间处理 / 游戏工具），当前工具高亮。
- **首页**：`/`，简介 → 工具矩阵 → 友情链接。
- **工具页**：`/tools/<slug>/`，左侧输入、右侧结果，一键复制。
- **底栏**：站点说明、技术栈与仓库入口。

## 工具

| 工具             | 路径                    | 说明                                         |
| ---------------- | ----------------------- | -------------------------------------------- |
| Base64 编解码    | `/tools/base64/`        | UTF-8 优先，中文与 emoji 可安全往返          |
| Unicode 编解码   | `/tools/unicode/`       | 按码点处理，支持 `\u4F60` 与 `\u{1F600}`     |
| URL 编解码       | `/tools/url/`           | 整串 URI 与 URI 组件两种粒度                 |
| 时间戳转换       | `/tools/timestamp/`     | 秒 / 毫秒自动识别，本地时间与 UTC 对照       |
| 蛋仔派对地图文本 | `/tools/eggy-map-text/` | 从分享文本里提取地图名与地图码，生成标准文案 |

全部计算在浏览器里完成，没有任何后端请求。

## 技术栈

- [Next.js 16](https://nextjs.org/)（App Router，`output: 'export'` 静态导出，`trailingSlash: true`）
- [React 19](https://react.dev/)
- [TypeScript 7.0.2](https://www.typescriptlang.org/)
- [MDUI 2](https://www.mdui.org/)（Material Design 3 的 Web Components 组件库）
- [SCSS](https://sass-lang.com/)（按职责分片，无 CSS 框架）
- [oxlint](https://oxc.rs/) + [Prettier](https://prettier.io/)（代码检查与排版）
- [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/)（Static Assets 托管 + Worker Previews 独立预览）

## 构建步骤

1. [下载并安装 Node.js](https://nodejs.org/zh-cn)（建议 22 LTS）
2. 安装 `pnpm`：`npm install -g pnpm`（`pnpm --version` 可验证）
3. 在项目文件夹下执行 `pnpm install`
4. `pnpm dev` 启动开发服务器（默认 `http://localhost:3000`）
5. `pnpm build` 先同步字体、再 `next build` 并跑产物校验，输出在 **`out/`**（Cloudflare Workers 直接托管这个目录）

提交前这几条都要绿：

```bash
pnpm typecheck     # tsc --noEmit
pnpm lint          # oxlint
pnpm format:check  # prettier --check
pnpm build         # 同步字体 → next build → 产物校验，产物在 out/
```

> [!TIP]
> 如果 `npm install` 安装较慢，可先执行 `npm config set registry https://registry.npmmirror.com` 切换至镜像源。

## 字体与图标

三类字体全部**随产物自包含**，字体加载不再请求任何 CDN：构建期由 `scripts/sync-fonts.mjs` 从本地 npm 包同步到 `public/fonts/`，`next build` 原样复制进 `out/fonts/`，Cloudflare Workers 直接托管该目录。

- **HarmonyOS Sans SC**（界面）：400 / 500 / 700 三档，按 unicode-range 分片，浏览器只下当前页面用到的片；
- **Cascadia Code**（代码与输入输出）：400 / 700 两档，补齐 Windows 之外平台的等宽字体；
- **Material Icons**（图标连字）：单独 preload + `font-display: block`，避免首屏先闪出 `more_vert` 这类英文连字名。

`public/fonts/` 是生成物、已进 `.gitignore`，仓库不提交字体二进制；`scripts/verify-output.mjs` 每次构建后断言页面齐全、字体分片齐全、HTML / CSS 中无字体 CDN 引用。图标名集中在 `src/data/icons.ts`，站点不内置任何图标文件。

## 部署方式

本网站以 **assets-only Worker** 部署于 **Cloudflare Workers Static Assets**，站点没有后端，所有内容以静态资源形式存在。仓库里**没有 GitHub Pages 部署流水线**（`.github/workflows/deploy.yml` 及 Pages 专属权限 / environment 已删除）；部署由 Cloudflare 侧一次性设置好 Git 集成（Workers Builds）后自动执行：

| 设置项   | 值                                                                                                  |
| -------- | --------------------------------------------------------------------------------------------------- |
| 生产分支 | `main`（推送即自动构建部署）                                                                        |
| 构建命令 | `pnpm build`（同步字体 → `next build` → 产物校验 → `out/`）                                         |
| 部署命令 | `npx wrangler deploy`                                                                               |
| 产物目录 | 由 `wrangler.jsonc` 的 `assets.directory = ./out` 指定                                              |
| 预览部署 | 在 Cloudflare 开启非生产分支 / PR 预览；`previews: {}` 声明启用 Worker Previews，与生产 Worker 隔离 |
| 运行环境 | Node 22 + pnpm（`packageManager` 指定版本）                                                         |

- **兼容 Next.js 的关键点**：`output: 'export'` 是纯静态导出，没有 Node 服务端，所以不需要 `@opennextjs/cloudflare`，Worker 也没有 `main` 字段，只做静态资源分发。`trailingSlash: true` 产出目录式 `xxx/index.html`，配合 `html_handling: auto-trailing-slash` 命中站内带尾斜杠的链接；`images.unoptimized` 对应无图片优化服务，`404.html` 对应 `not_found_handling: 404-page`。
- **CI 只保留 `.github/workflows/lint.yml`**：`format:check` → `lint` → `typecheck` → `build`（含字体同步与产物校验），不通过就不该发版；仓库不再需要 `pages: write` / `id-token: write` 权限，也不需要任何 `CLOUDFLARE_*` secrets。
- **独立预览环境**：`wrangler.jsonc` 的 `previews: {}` 启用 Worker Previews，非生产分支 / PR 由 Cloudflare 生成独立预览 URL，与生产 Worker 隔离；本地可用 `pnpm deploy:preview`（`wrangler preview`）创建预览部署，或用 `pnpm preview`（`wrangler dev`）按线上规则验收。
- 自定义域 `www.skystarlight.top` 在 Cloudflare 侧绑定；仓库里不需要 `public/.nojekyll` 与 `public/CNAME`，这两个文件只对「从分支直接发布」的 GitHub Pages 生效。

## 参与开发

实现层面的约定（MDUI 的注册时机、布尔属性、样式分片顺序、滚动容器等）与提交前自检清单写在 [.github/copilot-instructions.md](.github/copilot-instructions.md)，改代码前请先读一遍。

## 许可证

本项目采用 **MIT** 许可证，详见 [LICENSE](LICENSE)。
