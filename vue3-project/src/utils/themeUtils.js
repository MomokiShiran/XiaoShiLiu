/**
 * 主题工具函数
 * 用于管理应用的主题系统
 */

// 获取系统主题
export const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 应用主题到DOM
export const applyTheme = (theme) => {
  let actualTheme = theme
  if (theme === 'system') {
    actualTheme = getSystemTheme()
  }
  document.documentElement.setAttribute('data-theme', actualTheme)
  return actualTheme
}

// 获取当前保存的主题设置
export const getSavedTheme = () => {
  return localStorage.getItem('theme') || 'system'
}

// 保存主题设置
export const saveTheme = (theme) => {
  localStorage.setItem('theme', theme)
}

// 初始化主题系统
export const initTheme = () => {
  const savedTheme = getSavedTheme()
  const appliedTheme = applyTheme(savedTheme)

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = () => {
    const currentSavedTheme = getSavedTheme()
    if (currentSavedTheme === 'system') {
      applyTheme('system')
    }
  }

  mediaQuery.addEventListener('change', handleSystemThemeChange)

  return {
    savedTheme,
    appliedTheme,
    cleanup: () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }
}

// 设置主题（包含保存和应用）
export const setTheme = (theme) => {
  saveTheme(theme)
  return applyTheme(theme)
}

// 检测是否支持 View Transitions
function supportsViewTransition() {
  return typeof document !== 'undefined' &&
    typeof document.startViewTransition === 'function'
}

export function setTransitionOriginFromEvent(ev) {
  const x = ev?.clientX ?? window.innerWidth
  const y = ev?.clientY ?? 0
  const xp = `${(x / window.innerWidth) * 100}%`
  const yp = `${(y / window.innerHeight) * 100}%`
  document.documentElement.style.setProperty('--theme-transition-x', xp)
  document.documentElement.style.setProperty('--theme-transition-y', yp)
}

// 带圆形扩散动效的主题切换
export function setThemeWithTransition(theme, ev) {
  const current = document.documentElement.getAttribute('data-theme')
  if (current === theme) return
  if (ev) {
    setTransitionOriginFromEvent(ev)
  } else {
    document.documentElement.style.setProperty('--theme-transition-x', '100%')
    document.documentElement.style.setProperty('--theme-transition-y', '0%')
  }

  if (!supportsViewTransition()) {
    setTheme(theme)
    return
  }

  document.startViewTransition(() => {
    setTheme(theme)
  })
}

// 主题选项配置
export const themeOptions = [
  {
    value: 'system',
    label: '跟随系统',
    icon: 'setting'
  },
  {
    value: 'light',
    label: '浅色模式',
    icon: 'sun'
  },
  {
    value: 'dark',
    label: '深色模式',
    icon: 'moon'
  }
]