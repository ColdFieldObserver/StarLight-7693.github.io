'use client';

import { useEffect, useState } from 'react';
import { ICONS } from '@/data/icons';
import { cycleTheme, readTheme, type ThemeMode } from '@/lib/theme';

// ============================================================
// 主题开关（三态：跟随系统 / 浅色 / 深色）
// ------------------------------------------------------------
// 初始值必须等挂载后再读：SSR 阶段 <html> 上还没有主题类，
// 直接读会得到 'auto'，与客户端真实值不一致 → hydration 警告。
// 所以首帧渲染占位图标，mount 后换成真实图标。
//
// 图标语义：显示「当前处于哪种模式」——auto 半明半暗、light 太阳、dark 月亮。
// 按钮的无障碍名称描述「当前模式」，读屏用户能知道现在是什么状态。
// ============================================================

const MODE_ICON: Record<ThemeMode, string> = {
  auto: ICONS.autoMode,
  light: ICONS.lightMode,
  dark: ICONS.darkMode,
};

const MODE_NAME: Record<ThemeMode, string> = {
  auto: '跟随系统',
  light: '浅色模式',
  dark: '深色模式',
};

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode | null>(null);

  useEffect(() => {
    // 这里必须读一次外部系统（<html> 上的主题类），正是 effect 的正当用途：
    // 首帧 SSR 时没有 document，提前读会和客户端不一致。
    // oxlint-disable-next-line react/set-state-in-effect
    setMode(readTheme());
  }, []);

  const toggle = () => setMode(cycleTheme());

  const label = mode ? `切换主题，当前${MODE_NAME[mode]}` : '切换主题';
  const icon = mode ? MODE_ICON[mode] : ICONS.autoMode;

  return <mdui-button-icon aria-label={label} title={label} icon={icon} onClick={toggle} />;
}
