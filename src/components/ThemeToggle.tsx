// components/ThemeToggle.tsx — Botão de alternância de tema claro/escuro
import { memo } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useDashboardStore } from '../store/useDashboardStore'

const ThemeToggle = memo(() => {
  const { theme, toggleTheme } = useDashboardStore()

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center
                 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600
                 text-slate-600 dark:text-slate-300 transition-all duration-200
                 cursor-pointer border border-slate-200 dark:border-slate-600"
    >
      {/* Ícone animado: transição entre sol e lua */}
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: theme === 'light' ? 1 : 0,
          transform: theme === 'light' ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
        }}
      >
        <Sun size={16} />
      </span>
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: theme === 'dark' ? 1 : 0,
          transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0)',
        }}
      >
        <Moon size={16} />
      </span>
    </button>
  )
})

ThemeToggle.displayName = 'ThemeToggle'
export default ThemeToggle
