// App.tsx
import { memo, useCallback, useState } from 'react'
import { FileSpreadsheet, Upload, ChevronLeft, ChevronRight, LayoutDashboard, Table2 } from 'lucide-react'
import { useDashboardStore } from './store/useDashboardStore'
import UploadExcel from './components/UploadExcel'
import Dashboard from './components/Dashboard'
import DynamicTable from './components/DynamicTable'
import ChartConfig from './components/ChartConfig'
import ExportButtons from './components/ExportButtons'
import ThemeToggle from './components/ThemeToggle'

/* =========================================================
   TELA DE PRÉVIA
   ========================================================= */
const PreviewScreen = memo(() => {
  const { rawData, columns, fileName, setView, clearData } = useDashboardStore()

  return (
    <div className="min-h-screen app-bg flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
              <FileSpreadsheet size={16} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 dark:text-slate-100 text-xl">Incell</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
                {fileName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={clearData} className="btn-ghost border border-slate-200 dark:border-slate-600 text-xs">
              <Upload size={13} /> Novo arquivo
            </button>
            <button onClick={() => setView('dashboard')} className="btn-primary text-xs">
              Criar Dashboard →
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 animate-slide-up">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Prévia dos dados</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {rawData.length} linhas · {columns.length} colunas
            </p>
          </div>
        </div>
        <DynamicTable />
      </main>
    </div>
  )
})

/* =========================================================
   TELA PRINCIPAL DO DASHBOARD
   ========================================================= */
const DashboardScreen = memo(() => {
  const { fileName, setView, clearData } = useDashboardStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'charts' | 'table'>('charts')

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), [])

  return (
    <div className="min-h-screen app-bg flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={toggleSidebar} className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors cursor-pointer shrink-0">
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shrink-0">
              <FileSpreadsheet size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-slate-800 dark:text-slate-100 text-xl">Incell</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-[180px]">
                {fileName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ExportButtons />
            <ThemeToggle />
            <button onClick={() => setView('preview')} className="btn-ghost border border-slate-200 dark:border-slate-600 text-xs hidden sm:inline-flex">
              Prévia
            </button>
            <button onClick={clearData} className="btn-ghost border border-slate-200 dark:border-slate-600 text-xs hidden sm:inline-flex">
              <Upload size={13} /> Novo arquivo
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} shrink-0 overflow-y-auto bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-all duration-300`}>
          <div className="p-4 min-w-64">
            <ChartConfig />
          </div>
        </aside>

        <main id="dashboard-container" className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <div className="flex items-center gap-1 mb-5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
            {[
              { id: 'charts' as const, label: 'Gráficos', Icon: LayoutDashboard },
              { id: 'table' as const, label: 'Tabela', Icon: Table2 },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                  ${activeTab === id ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'charts' ? <Dashboard /> : <DynamicTable />}
        </main>
      </div>
    </div>
  )
})

/* =========================================================
   APP RAIZ
   ========================================================= */
const App = memo(() => {
  const view = useDashboardStore((s) => s.view)

  switch (view) {
    case 'upload': return <UploadExcel />
    case 'preview': return <PreviewScreen />
    case 'dashboard': return <DashboardScreen />
    default: return <UploadExcel />
  }
})

App.displayName = 'App'
PreviewScreen.displayName = 'PreviewScreen'
DashboardScreen.displayName = 'DashboardScreen'

export default App
