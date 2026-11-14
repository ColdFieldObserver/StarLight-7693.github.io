/**
 * 把三类字体同步到 public/fonts/，让 next build 原样复制进 out/（随产物自包含）。
 *
 * 为什么不放 CDN：线上不能有任何第三方字体请求，断网 / CDN 被墙时站点也要完整可用。
 * 为什么不让 webpack 处理：CJK 分片有几百个 woff2，进构建图会拖慢构建、产物路径带
 *   hash 且难以断言；直接同步静态资源，dev / build / Cloudflare Workers 共用一套 /fonts/ 路径。
 * 为什么 public/fonts/ 不提交：字体二进制来自 npm 包，仓库保持零字体文件。
 *
 * 产物结构（相对 public/fonts/）：
 *   fonts.css              全部 @font-face，url 都指向本目录
 *   Regular_*.woff2 等      HarmonyOS Sans SC 400 / 500 / 700 的 CJK 分片
 *   files/*.woff2          Cascadia Code 400 / 700 的 unicode-range 分片
 *   material-icons.woff2   Material Icons 连字字体
 */
import { createRequire } from 'node:module';
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = join(root, 'public', 'fonts');

const harmonyDir = dirname(require.resolve('harmonyos-sans-sc-webfont-splitted'));
const cascadiaDir = dirname(require.resolve('@fontsource/cascadia-code/package.json'));
const iconsDir = dirname(require.resolve('material-icons/package.json'));

rmSync(outDir, { recursive: true, force: true });
mkdirSync(join(outDir, 'files'), { recursive: true });

let css = '/* 由 scripts/sync-fonts.mjs 生成，随产物自包含，请勿手改 */\n';
const copied = [];

// 1) HarmonyOS Sans SC：400 / 500 / 700 三档，CSS 里的 url("./Xxx_hash.woff2") 与本文件同目录
const WEIGHTS = ['Regular', 'Medium', 'Bold'];
for (const weight of WEIGHTS) {
  css += `\n/* HarmonyOS Sans SC ${weight} */\n`;
  css += `${readFileSync(join(harmonyDir, `${weight}.css`), 'utf8')}\n`;
  for (const file of readdirSync(harmonyDir)) {
    if (file.startsWith(`${weight}_`) && file.endsWith('.woff2')) {
      copyFileSync(join(harmonyDir, file), join(outDir, file));
      copied.push(file);
    }
  }
}

// 2) Cascadia Code：400 / 700，只保留 woff2（现代浏览器都支持），去掉 woff 备用源
const cascadiaFiles = join(cascadiaDir, 'files');
const referenced = new Set();
for (const weight of ['400', '700']) {
  let face = readFileSync(join(cascadiaDir, `${weight}.css`), 'utf8');
  face = face.replace(/,\s*url\(\.\/files\/[^)]*\.woff\)\s*format\(['"]woff['"]\)/g, '');
  css += `\n/* Cascadia Code ${weight} */\n${face}\n`;
  for (const match of face.matchAll(/url\(\.\/files\/([^)]+\.woff2)\)/g)) {
    referenced.add(match[1]);
  }
}
for (const file of referenced) {
  copyFileSync(join(cascadiaFiles, file), join(outDir, 'files', file));
  copied.push(file);
}

// 3) Material Icons：只取连字版一个字重，font-display: block 避免先闪出英文连字名
copyFileSync(
  join(iconsDir, 'iconfont', 'material-icons.woff2'),
  join(outDir, 'material-icons.woff2'),
);
copied.push('material-icons.woff2');
css += `
/* Material Icons（连字） */
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url('./material-icons.woff2') format('woff2');
}
`;

// 生成物里不能残留任何 CDN 引用（包自带注释里的项目主页不算资源请求）
if (/cdn\.jsdelivr\.net|url\(\s*['"]?https?:/i.test(css)) {
  console.error('[fonts] 生成的 CSS 里仍有远程字体 URL，中止构建');
  process.exit(1);
}

writeFileSync(join(outDir, 'fonts.css'), css);
console.log(
  `[fonts] ${WEIGHTS.length} 个中文字重 + 2 档代码字体 + 图标字体 / ${copied.length} 个 woff2 → public/fonts/`,
);
