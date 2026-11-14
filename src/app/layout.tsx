import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import AppShell from '@/components/layout/AppShell';
import MduiProvider from '@/components/mdui/MduiProvider';
import { SITE } from '@/data/site';
import { THEME_BOOTSTRAP } from '@/lib/theme';

// MDUI 的组件样式必须先于自研 SCSS 引入：
//   后声明者胜，我们的主题覆写才能压住它默认的紫。
import 'mdui/mdui.css';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  // Metadata 的类型是可变数组，SITE 是 as const，所以要展开一份
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.author }],
  icons: { icon: '/images/favicon.svg' },
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: 'website',
    locale: 'zh_CN',
    siteName: SITE.name,
  },
};

/**
 * 生产构建走同步内联脚本，dev 走 next/script。
 *
 * 原因：React 19 在客户端渲染时遇到 <script> 会报
 *   "Scripts inside React components are never executed when rendering on the client"
 * 并跳过执行。静态导出（生产）的 HTML 由构建期 SSR 生成，浏览器解析即执行，
 * 首帧主题照常落地；真正被这条规则影响的是 dev（Turbopack 会在客户端重放 RSC 树），
 * 控制台会红一片。
 *
 * 生产不能换成 next/script：它的 beforeInteractive 在 App Router 里只是把
 * 脚本 push 进 self.__next_s 队列，要等 async chunk 加载后才执行，
 * 深色用户会先看到一闪白屏。所以两边分开处理：
 *   - 生产：内联 <script>，同步执行，零闪
 *   - dev：next/script（延迟执行）+ SSR 默认 mdui-theme-auto（跟随系统，先兜住首帧）
 */
const IS_PROD = process.env.NODE_ENV === 'production';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // 生产：主题类由 <head> 里的内联脚本写入，React 不接管 className，
    //       否则每次重渲染都会把 class 冲回 SSR 时的空值。
    // dev：默认 mdui-theme-auto，让 MDUI 自己的 prefers-color-scheme 规则兜首帧。
    <html lang="zh-CN" className={IS_PROD ? undefined : 'mdui-theme-auto'} suppressHydrationWarning>
      <head>
        {/* 三类字体由 scripts/sync-fonts.mjs 从本地 npm 包同步到 public/fonts/，
            随产物自包含，线上不产生任何第三方字体请求 */}
        <link rel="stylesheet" href="/fonts/fonts.css" />

        {/* 图标字体单独 preload：字形没到会先渲染成 "more_vert" 这类英文连字名，
            配合 fonts.css 里的 font-display: block 留白，避免首屏闪字 */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/material-icons.woff2"
          crossOrigin="anonymous"
        />

        {/* 首帧落地主题，避免深色用户先看到白屏（两条路径的原因见 IS_PROD 注释） */}
        {IS_PROD ? (
          <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        ) : (
          <Script id="theme-bootstrap" strategy="beforeInteractive">
            {THEME_BOOTSTRAP}
          </Script>
        )}
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <MduiProvider />
      </body>
    </html>
  );
}
