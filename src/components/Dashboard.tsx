// components/Dashboard.tsx — Dashboard principal com gráficos Recharts
import { memo, useMemo } from 'react'
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, BarChart2, Trash2 } from 'lucide-react'
import { useDashboardStore, type ChartConfig, type DataRow } from '../store/useDashboardStore'
import { ChartDownloadButton } from './ExportButtons'

/* =========================================================
   HELPERS
   ========================================================= */

/** Prepara dados para o tipo de gráfico especificado */
function prepareData(data: DataRow[], config: ChartConfig): DataRow[] {
  if (config.type === 'pie') {
    // Pie: agrega valores por xKey
    const aggregated: Record<string, number> = {}
    for (const row of data) {
      const key = String(row[config.xKey] ?? 'Outros')
      const val = Number(row[config.yKey]) || 0
      aggregated[key] = (aggregated[key] ?? 0) + val
    }
    return Object.entries(aggregated)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // máx 10 fatias
      .map(([name, value]) => ({ name, value }))
  }

  if (config.type === 'scatter') {
    // Scatter: usa xKey e yKey diretamente
    return data
      .filter((row) => row[config.xKey] !== null && row[config.yKey] !== null)
      .slice(0, 500)
      .map((row) => ({
        x: Number(row[config.xKey]) || 0,
        y: Number(row[config.yKey]) || 0,
      }))
  }

  // Bar, Line, Area: agrupa e soma por xKey (máx 50 pontos)
  const aggregated: Record<string, number> = {}
  for (const row of data) {
    const key = String(row[config.xKey] ?? '')
    if (!key) continue
    const val = Number(row[config.yKey]) || 0
    aggregated[key] = (aggregated[key] ?? 0) + val
  }

  return Object.entries(aggregated)
    .slice(0, 50)
    .map(([name, value]) => ({ name, value }))
}

/* =========================================================
   TOOLTIP CUSTOMIZADO
   ========================================================= */
const CustomTooltip = ({
  active, payload, label
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600
                    rounded-xl px-3 py-2 shadow-lg text-xs">
      {label && <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="text-slate-500 dark:text-slate-400">
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">
            {typeof entry.value === 'number' ? entry.value.toLocaleString('pt-BR') : entry.value}
          </span>
        </p>
      ))}
    </div>
  )
}

/* =========================================================
   GRÁFICO INDIVIDUAL
   ========================================================= */
interface SingleChartProps {
  config: ChartConfig
  data: DataRow[]
}

const SingleChart = memo(({ config, data }: SingleChartProps) => {
  const { removeChart } = useDashboardStore()
  const chartData = useMemo(() => prepareData(data, config), [data, config])

  const commonProps = {
    data: chartData,
    margin: { top: 5, right: 10, bottom: 20, left: 5 },
  }

  const axisProps = {
    tick: { fontSize: 11, fill: 'currentColor' },
    axisLine: false,
    tickLine: false,
  }

  const renderChart = () => {
    switch (config.type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20 dark:opacity-10" vertical={false} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill={config.color} radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        )

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20 dark:opacity-10" vertical={false} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone" dataKey="value" stroke={config.color}
              strokeWidth={2} dot={{ r: 3, fill: config.color }} activeDot={{ r: 5 }}
            />
          </LineChart>
        )

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`grad-${config.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20 dark:opacity-10" vertical={false} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" dataKey="value" stroke={config.color}
              fill={`url(#grad-${config.id})`} strokeWidth={2}
            />
          </AreaChart>
        )

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%" cy="50%"
              innerRadius="35%" outerRadius="65%"
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
              label={({ name, percent }) => `${String(name).slice(0, 10)} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(${(parseInt(config.color.replace('#',''), 16) + index * 40) % 360}, 70%, 55%)`}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        )

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20 dark:opacity-10" />
            <XAxis dataKey="x" type="number" name={config.xKey} {...axisProps} />
            <YAxis dataKey="y" type="number" name={config.yKey} {...axisProps} width={40} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Scatter data={chartData} fill={config.color} fillOpacity={0.7} />
          </ScatterChart>
        )

      default:
        return null
    }
  }

  return (
    <div
      id={`chart-${config.id}`}
      className="card p-4 flex flex-col gap-3 animate-fade-in"
    >
      {/* Header do gráfico */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate max-w-[160px]">
            {config.title}
          </h4>
          <span className="badge bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs">
            {config.xKey} × {config.yKey}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ChartDownloadButton chartId={config.id} chartTitle={config.title} />
          <button
            onClick={() => removeChart(config.id)}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 dark:hover:bg-red-900/20
                       text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-56 text-slate-600 dark:text-slate-400">
        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
            <BarChart2 size={32} className="mb-2 opacity-50" />
            <p className="text-xs">Sem dados para exibir</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart() as React.ReactElement}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
})

SingleChart.displayName = 'SingleChart'

/* =========================================================
   DASHBOARD (grid de gráficos)
   ========================================================= */
const Dashboard = memo(() => {
  const { charts, rawData } = useDashboardStore()

  if (charts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <TrendingUp size={28} className="text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="font-semibold text-slate-600 dark:text-slate-400 mb-1">Nenhum gráfico ainda</h3>
        <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
          Use o painel lateral para adicionar gráficos ao seu dashboard.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {charts.map((chart) => (
        <SingleChart key={chart.id} config={chart} data={rawData} />
      ))}
    </div>
  )
})

Dashboard.displayName = 'Dashboard'
export default Dashboard
