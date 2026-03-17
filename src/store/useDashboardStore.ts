// store/useDashboardStore.ts — Estado global com Zustand
import { create } from 'zustand'

/* =========================================================
   TIPOS
   ========================================================= */

/** Uma linha de dado genérica do Excel */
export type DataRow = Record<string, string | number | null>

/** Tipos de gráfico suportados */
export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'scatter'

/** Configuração de um gráfico individual */
export interface ChartConfig {
  id: string
  title: string
  type: ChartType
  xKey: string
  yKey: string
  color: string
}

/** Estado completo do dashboard */
interface DashboardState {
  // Dados
  fileName: string | null
  rawData: DataRow[]
  columns: string[]
  sheetNames: string[]
  activeSheet: string

  // Gráficos
  charts: ChartConfig[]
  activeChartId: string | null

  // UI
  theme: 'light' | 'dark'
  view: 'upload' | 'preview' | 'dashboard'
  isLoading: boolean
  error: string | null

  // Ações — Dados
  setData: (data: {
    fileName: string
    rawData: DataRow[]
    columns: string[]
    sheetNames: string[]
    activeSheet: string
  }) => void
  clearData: () => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void

  // Ações — Gráficos
  addChart: (chart: ChartConfig) => void
  updateChart: (id: string, updates: Partial<ChartConfig>) => void
  removeChart: (id: string) => void
  setActiveChart: (id: string | null) => void

  // Ações — UI
  setView: (view: 'upload' | 'preview' | 'dashboard') => void
  toggleTheme: () => void
}

/* =========================================================
   CORES PRÉ-DEFINIDAS PARA GRÁFICOS
   ========================================================= */
export const CHART_COLORS = [
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#f59e0b', // amber
  '#ec4899', // pink
  '#10b981', // emerald
  '#f97316', // orange
]

/* =========================================================
   STORE
   ========================================================= */
export const useDashboardStore = create<DashboardState>((set) => ({
  // Estado inicial
  fileName: null,
  rawData: [],
  columns: [],
  sheetNames: [],
  activeSheet: '',
  charts: [],
  activeChartId: null,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  view: 'upload',
  isLoading: false,
  error: null,

  // Ações — Dados
  setData: ({ fileName, rawData, columns, sheetNames, activeSheet }) =>
    set({ fileName, rawData, columns, sheetNames, activeSheet, error: null }),

  clearData: () =>
    set({
      fileName: null,
      rawData: [],
      columns: [],
      sheetNames: [],
      activeSheet: '',
      charts: [],
      activeChartId: null,
      view: 'upload',
      error: null,
    }),

  setError: (error) => set({ error, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  // Ações — Gráficos
  addChart: (chart) =>
    set((state) => ({
      charts: [...state.charts, chart],
      activeChartId: chart.id,
    })),

  updateChart: (id, updates) =>
    set((state) => ({
      charts: state.charts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  removeChart: (id) =>
    set((state) => ({
      charts: state.charts.filter((c) => c.id !== id),
      activeChartId:
        state.activeChartId === id
          ? state.charts.find((c) => c.id !== id)?.id ?? null
          : state.activeChartId,
    })),

  setActiveChart: (id) => set({ activeChartId: id }),

  // Ações — UI
  setView: (view) => set({ view }),

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', next)
      if (next === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { theme: next }
    }),
}))
