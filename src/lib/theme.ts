// ============================================================
// 主题（三态：跟随系统 / 浅色 / 深色）
// ------------------------------------------------------------
// 落地点是 <html> 上的 MDUI 主题类：
//   mdui-theme-auto | mdui-theme-light | mdui-theme-dark
// 「跟随系统」不是 JS 轮询：MDUI 自己给 .mdui-theme-auto 写了
// @media (prefers-color-scheme: dark) 分支，系统切换时浏览器直接换令牌，
// 没有闪烁，也没有监听器要清理。
//
// 浅色 / 深色同时写 style.colorScheme，让滚动条、原生控件、表单外观一起变；
// auto 则必须**不写** —— MDUI 的两条 auto 规则各自声明了 color-scheme，
// 内联值会盖掉它，系统切成深色时滚动条仍是浅色的。
//
// 首帧防闪：THEME_BOOTSTRAP 由 app/layout.tsx 放进 <head> 内联执行，
// 在首次绘制前就把 class 落地，避免「先白后黑」。
// storage key 与旧站（starlight-theme）隔离，两站互不影响。
// ============================================================

export const THEME_STORAGE_KEY = 'qxg-tools-theme';

export type ThemeMode = 'auto' | 'light' | 'dark';

/** 循环切换顺序，与另外两个同作者站点保持一致 */
export const THEME_MODES: ThemeMode[] = ['auto', 'light', 'dark'];

/**
 * 首帧内联脚本：读 localStorage → 没有（或值是垃圾）就跟随系统 → 写 <html> class。
 * 写成字符串是因为它必须同步执行在 <head> 里，不能等 React。
 */
export const THEME_BOOTSTRAP = `(function(){var k='${THEME_STORAGE_KEY}';var m='auto';try{var v=localStorage.getItem(k);if(v==='light'||v==='dark'||v==='auto')m=v;}catch(err){}var e=document.documentElement;e.classList.add('mdui-theme-'+m);if(m==='auto'){e.style.colorScheme='';}else{e.style.colorScheme=m;}})();`;

/** 当前主题模式（以 <html> 上的类为准，不读 React state） */
export function readTheme(): ThemeMode {
  if (typeof document === 'undefined') return 'auto';
  const list = document.documentElement.classList;
  if (list.contains('mdui-theme-dark')) return 'dark';
  if (list.contains('mdui-theme-light')) return 'light';
  return 'auto';
}

/** 应用并持久化主题 */
export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('mdui-theme-auto', mode === 'auto');
  root.classList.toggle('mdui-theme-dark', mode === 'dark');
  root.classList.toggle('mdui-theme-light', mode === 'light');
  // auto：交回给 MDUI 的 prefers-color-scheme 规则（见文件头）
  root.style.colorScheme = mode === 'auto' ? '' : mode;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // 隐私模式下写入失败：本次切换仍然生效，只是不持久化
  }
}

/** 三态循环：跟随系统 → 浅色 → 深色 → 跟随系统 */
export function cycleTheme(): ThemeMode {
  const next = THEME_MODES[(THEME_MODES.indexOf(readTheme()) + 1) % THEME_MODES.length] ?? 'auto';
  applyTheme(next);
  return next;
}
