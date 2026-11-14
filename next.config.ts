import type { NextConfig } from 'next';

// ============================================================
// 栖小光的工具站 · Next.js 配置
// ------------------------------------------------------------
//   - 纯静态导出（SSG），产物在 out/，交给 Cloudflare Workers Static Assets
//     （wrangler.jsonc 的 assets.directory = ./out）；没有 Node 服务端，
//     因此不需要 @opennextjs/cloudflare，Worker 也没有 main 字段
//   - 自定义域 www.skystarlight.top 挂在根路径，不需要 basePath / assetPrefix
//   - output: 'export' 只在生产构建时开启：dev 下开 export 会让
//     Next 拿「已生成路径」比对每次导航，动态段容易被误判成 404
//   - trailingSlash: true → 目录式 URL（/tools/base64/ → base64/index.html），
//     与 Workers 的 html_handling: auto-trailing-slash 对齐，静态托管兼容性最好；
//     站内链接必须带尾斜杠，统一走 toolPath()
// ============================================================
const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' as const } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
