// components/ChartConfig.tsx — Configuração e adição de gráficos
import { memo, useState, useCallback } from 'react'
import { Plus, BarChart2, LineChart, AreaChart, PieChart, ScatterChart, Trash2, Edit3, Check, X } from 'lucide-react'
import { useDashboardStore, CHART_COLORS, type ChartType, type ChartConfig } from '../store/useDashboardStore'
import { suggestAxes } from '../lib/excel'

/* =========================================================
   TIPOS DE GRÁFICO DISPONÍVEIS
   ========================================================= */
const CHART_TYPES: { value: ChartType; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { value: 'bar',     label: 'Barras',     Icon: BarChart2 },
  { value: 'line',    label: 'Linhas',     Icon: LineChart },
  { value: 'area',    label: 'Área',       Icon: AreaChart },
  { value: 'pie',     label: 'Pizza',      Icon: PieChart },
  { value: 'scatter', label: 'Dispersão',  Icon: ScatterChart },
]

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */
const ChartConfig = memo(() => {
  const { columns, rawData, charts, activeChartId, addChart, removeChart, updateChart, setActiveChart } =
    useDashboardStore()

  // Estado do formulário de novo gráfico
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const suggestedAxes = suggestAxes(columns, rawData)

  const [form, setForm] = useState<Omit<ChartConfig, 'id'>>({
    title: '',
    type: 'bar',
    xKey: suggestedAxes.xKey,
    yKey: suggestedAxes.yKey,
    color: CHART_COLORS[0],
  })

  /* -------------------------------------------------------
     Handlers
  ------------------------------------------------------- */
  const resetForm = useCallback(() => {
    const axes = suggestAxes(columns, rawData)
    setForm({
      title: '',
      type: 'bar',
      xKey: axes.xKey,
      yKey: axes.yKey,
      color: CHART_COLORS[charts.length % CHART_COLORS.length],
    })
  }, [columns, rawData, charts.length])

  const handleAdd = useCallback(() => {
    if (charts.length >= 6) return
    resetForm()
    setIsAdding(true)
    setEditingId(null)
  }, [charts.length, resetForm])

  const handleSave = useCallback(() => {
    const title = form.title.trim() || `Gráfico ${charts.length + 1}`
    addChart({
      id: `chart-${Date.now()}`,
      ...form,
      title,
    })
    setIsAdding(false)
    resetForm()
  }, [form, charts.length, addChart, resetForm])

  const handleStartEdit = useCallback((chart: ChartConfig) => {
    setEditingId(chart.id)
    setIsAdding(false)
    setForm({
      title: chart.title,
      type: chart.type,
      xKey: chart.xKey,
      yKey: chart.yKey,
      color: chart.color,
    })
  }, [])

  const handleSaveEdit = useCallback(() => {
    if (!editingId) return
    updateChart(editingId, form)
    setEditingId(null)
  }, [editingId, form, updateChart])

  /* -------------------------------------------------------
     Formulário reutilizável
  ------------------------------------------------------- */
  const renderForm = (onSave: () => void, onCancel: () => void) => (
    <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-3 animate-fade-in">
      {/* Título */}
      <div>
        <label className="label">Título</label>
        <input
          type="text"
          placeholder={`Gráfico ${charts.length + 1}`}
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="input-base text-sm py-1.5"
        />
      </div>

      {/* Tipo de gráfico */}
      <div>
        <label className="label">Tipo</label>
        <div className="grid grid-cols-5 gap-1">
          {CHART_TYPES.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => setForm((f) => ({ ...f, type: value }))}
              title={label}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer
                ${form.type === value
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-brand-400'
                }`}
            >
              <Icon size={14} />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Eixos */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label">Eixo X</label>
          <select
            value={form.xKey}
            onChange={(e) => setForm((f) => ({ ...f, xKey: e.target.value }))}
            className="select-base text-sm py-1.5"
          >
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Eixo Y</label>
          <select
            value={form.yKey}
            onChange={(e) => setForm((f) => ({ ...f, yKey: e.target.value }))}
            className="select-base text-sm py-1.5"
          >
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cor */}
      <div>
        <label className="label">Cor</label>
        <div className="flex gap-2">
          {CHART_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setForm((f) => ({ ...f, color }))}
              className="w-6 h-6 rounded-full transition-transform hover:scale-110 cursor-pointer"
              style={{
                backgroundColor: color,
                outline: form.color === color ? `2px solid ${color}` : 'none',
                outlineOffset: '2px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-2 pt-1">
        <button onClick={onSave} className="btn-primary flex-1 justify-center py-1.5 text-xs">
          <Check size={13} /> Salvar
        </button>
        <button onClick={onCancel} className="btn-ghost flex-1 justify-center py-1.5 text-xs border border-slate-200 dark:border-slate-600">
          <X size={13} /> Cancelar
        </button>
      </div>
    </div>
  )

  /* -------------------------------------------------------
     Render
  ------------------------------------------------------- */
  return (
    <div className="flex flex-col gap-2">
      {/* Header da sidebar */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Gráficos ({charts.length}/6)
        </h3>
        {charts.length < 6 && (
          <button
            onClick={handleAdd}
            className="btn-primary py-1 px-2 text-xs"
          >
            <Plus size={13} /> Novo
          </button>
        )}
      </div>

      {/* Formulário de novo gráfico */}
      {isAdding && renderForm(handleSave, () => setIsAdding(false))}

      {/* Lista de gráficos */}
      {charts.length === 0 && !isAdding && (
        <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
          <BarChart2 size={28} className="mx-auto mb-2 opacity-40" />
          <p>Nenhum gráfico ainda.</p>
          <p className="text-xs mt-1">Clique em "+ Novo" para começar.</p>
        </div>
      )}

      {charts.map((chart) => {
        const ChartIcon = CHART_TYPES.find((t) => t.value === chart.type)?.Icon ?? BarChart2
        const isActive = activeChartId === chart.id
        const isEditing = editingId === chart.id

        return (
          <div key={chart.id}>
            <div
              onClick={() => setActiveChart(isActive ? null : chart.id)}
              className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all
                ${isActive
                  ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent'
                }`}
            >
              {/* Indicador de cor */}
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: chart.color }} />

              {/* Ícone do tipo */}
              <ChartIcon size={14} className="text-slate-400 shrink-0" />

              {/* Título */}
              <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                {chart.title}
              </span>

              {/* Ações (visíveis no hover) */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); handleStartEdit(chart) }}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 hover:text-brand-500 transition-colors"
                >
                  <Edit3 size={12} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); removeChart(chart.id) }}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Formulário de edição inline */}
            {isEditing && renderForm(handleSaveEdit, () => setEditingId(null))}
          </div>
        )
      })}
    </div>
  )
})

ChartConfig.displayName = 'ChartConfig'
export default ChartConfig
