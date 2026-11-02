/**
 * 站点常量：站名、描述、作者、许可、仓库。
 * 前后端共用（页面 metadata 与页脚都读这一份），不要在这里 import 浏览器 API。
 */

/**
 * 站点关键词（<meta name="keywords">）。
 *
 * 组织方式参考同作者的 StarLight-7693.github.io.react（那站在 index.html 里
 * 把「同一身份的各种写法」与「站点主题词」铺平成一串）。这里照同样的思路：
 *   1. 身份别名 —— 中英文名、缩写、旧用户名，覆盖不同叫法下的检索；
 *   2. 站点定位 —— 「栖小光的工具站」这类整名，以及通用词；
 *   3. 具体工具 —— 五个工具各自的中英文写法与常见别称。
 * 不要塞与本站无关的词（别的站的内容、无关的热门词），那是堆砌而非关键词。
 */
export const SITE = {
  /** 站点名（顶栏标题、<title> 后缀都用它） */
  name: '栖小光的工具站',
  /** 一句话描述 */
  description: '一堆纯前端小工具：编码转换、时间戳、URL、游戏文本处理，数据不上传服务器。',
  /** 关键词（见上方说明） */
  keywords: [
    // 身份别名
    '栖小光',
    '栖小光的工具站',
    'StarLight-7693',
    'SL-7693',
    'TP-RLX-LIGHT',
    'TP-RLX-STAR-LIGHT',
    // 站点定位
    '在线工具',
    '在线小工具',
    '工具站',
    '纯前端工具',
    '浏览器工具',
    // 具体工具
    'Base64',
    'Base64 编解码',
    'Base64 编码',
    'Base64 解码',
    'Unicode',
    'Unicode 编解码',
    'UTF-8',
    'URL 编解码',
    'URL 编码',
    'URL 解码',
    'encodeURIComponent',
    '时间戳转换',
    'Unix 时间戳',
    '毫秒时间戳',
    '蛋仔派对',
    '蛋仔派对地图码',
    '地图码',
  ],
  /** 作者 */
  author: '栖小光',
  /** 作者主页（GitHub Pages 个人站） */
  authorUrl: 'https://github.com/StarLight-7693',
  /** 许可 */
  license: 'MIT',
  /** 技术栈（关于对话框与页脚展示） */
  tech: ['Next.js', 'React', 'TypeScript', 'SCSS', 'MDUI'],
  /** 开发域名 */
  url: 'https://www.skystarlight.top',
  /** 仓库域名 */
  repoUrl: 'https://github.com/StarLight-7693/StarLight-7693.github.io',
} as const;

/** 站内路由帮助函数：trailingSlash 模式下必须带尾斜杠 */
export function toolPath(slug: string): string {
  return `/tools/${slug}/`;
}
