/**
 * 友情链接：个人站点（本地图标）+ 技术文档（devicon CDN 图标）。
 * 纯数据，不引入运行时依赖。
 */

// 将友情链接数据耦合在 tsx 文件内部以简化数据管理（因为只有这个组件会用到友情链接数据）
interface FriendLink {
  name: string;
  url: string;
  desc: string;
  /** 图标地址：站内相对路径或外链 */
  icon: string;
}

const FRIEND_LINKS: FriendLink[] = [
  {
    name: '冷域观者的个人网站',
    url: 'https://coldfieldobserver.github.io',
    desc: '冷域观者的个人站点',
    icon: '/images/friendlinkicon/coldfieldobserver.webp',
  },
  {
    name: '蛋仔资源站',
    url: 'https://eggyreshub.wordpress.com',
    desc: '一站式获取蛋仔派对相关资源',
    icon: '/images/friendlinkicon/eggyreshub.webp',
  },
  {
    name: '逃少音乐档案馆',
    url: 'https://space.bilibili.com/3632301571311734',
    desc: '《逃跑吧！少年》游戏背景音乐收集与存档',
    icon: '/images/friendlinkicon/dmmdzzmusicarchive.webp',
  },
  {
    name: 'PidanUI',
    url: 'https://pidanui.eggycore.top/',
    desc: '一个蛋仔风 Windows 美化包',
    icon: '/images/friendlinkicon/eggyui.webp',
  },
  {
    name: 'React',
    url: 'https://www.reactjs.cn',
    desc: '用于构建用户界面的 JavaScript 库',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  },
  {
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org/zh',
    desc: '带类型系统的 JavaScript 超集',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-plain.svg',
  },
  {
    name: 'MDUI',
    url: 'https://www.mdui.org/zh-cn/',
    desc: '本站使用的 Material Design 3 组件库',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/materialui/materialui-original.svg',
  },
  {
    name: 'Next.js',
    url: 'https://nextjs.org/docs',
    desc: '本站使用的 React 框架',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
  },
  {
    name: 'Sass',
    url: 'https://www.sass.hk',
    desc: 'CSS 预处理器',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg',
  },
];

// 友情链接：本地 webp 图标 + devicon CDN 图标混用，一律 lazy。
/** 友情链接列表组件 */
export default function FriendLinks() {
  return (
    <ul className="friend-grid">
      {FRIEND_LINKS.map((link) => (
        <li key={link.url}>
          <a className="friend-card" href={link.url} target="_blank" rel="noopener noreferrer">
            <img
              className="friend-icon"
              src={link.icon}
              alt=""
              width="36"
              height="36"
              loading="lazy"
              decoding="async"
            />
            <span className="friend-body">
              <span className="friend-name">{link.name}</span>
              <span className="friend-desc">{link.desc}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
