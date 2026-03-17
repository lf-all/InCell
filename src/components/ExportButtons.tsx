// components/ExportButtons.tsx — Botões de exportação (Excel, CSV, PDF)
import { memo, useState, useCallback } from 'react'
import { FileDown, FileText, Image, Loader2, FileSpreadsheet } from 'lucide-react'
import { useDashboardStore } from '../store/useDashboardStore'
import { exportToExcel, exportToCSV } from '../lib/excel'
import { exportDashboardToPDF } from '../lib/pdfExport'

/* =========================================================
   COMPONENTE
   ========================================================= */
const ExportButtons = memo(() => {
  const { rawData, fileName } = useDashboardStore()
  const [exportingPDF, setExportingPDF] = useState(false)

  const baseName = fileName?.replace(/\.[^.]+$/, '') ?? 'dashboard'

  /* -------------------------------------------------------
     Handlers
  ------------------------------------------------------- */
  const handleExportExcel = useCallback(() => {
    exportToExcel(rawData, baseName)
  }, [rawData, baseName])

  const handleExportCSV = useCallback(() => {
    exportToCSV(rawData, baseName)
  }, [rawData, baseName])

  const handleExportPDF = useCallback(async () => {
    setExportingPDF(true)
    try {
      await exportDashboardToPDF('dashboard-container', baseName)
    } catch (err) {
      console.error('Erro ao exportar PDF:', err)
      alert('Não foi possível exportar o PDF. Tente novamente.')
    } finally {
      setExportingPDF(false)
    }
  }, [baseName])

  /* -------------------------------------------------------
     Render
  ------------------------------------------------------- */
  return (
    <div className="flex items-center gap-2">
      {/* Excel */}
      <button
        onClick={handleExportExcel}
        title="Exportar dados como Excel"
        className="btn-ghost border border-slate-200 dark:border-slate-600 text-xs py-1.5 hidden sm:inline-flex"
      >
        <FileSpreadsheet size={14} className="text-emerald-500" />
        <span className="hidden md:inline">Excel</span>
      </button>

      {/* CSV */}
      <button
        onClick={handleExportCSV}
        title="Exportar dados como CSV"
        className="btn-ghost border border-slate-200 dark:border-slate-600 text-xs py-1.5 hidden sm:inline-flex"
      >
        <FileText size={14} className="text-blue-500" />
        <span className="hidden md:inline">CSV</span>
      </button>

      {/* PDF */}
      <button
        onClick={handleExportPDF}
        disabled={exportingPDF}
        title="Exportar dashboard como PDF"
        className="btn-primary text-xs py-1.5 disabled:opacity-70"
      >
        {exportingPDF ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <FileDown size={14} />
        )}
        <span>{exportingPDF ? 'Gerando...' : 'PDF'}</span>
      </button>

      {/* Mobile: menu compacto */}
      <div className="flex sm:hidden gap-1">
        <button onClick={handleExportExcel} title="Excel" className="btn-ghost p-2 border border-slate-200 dark:border-slate-600">
          <FileSpreadsheet size={14} className="text-emerald-500" />
        </button>
        <button onClick={handleExportCSV} title="CSV" className="btn-ghost p-2 border border-slate-200 dark:border-slate-600">
          <FileText size={14} className="text-blue-500" />
        </button>
      </div>
    </div>
  )
})

/* =========================================================
   BOTÃO DE DOWNLOAD DE GRÁFICO INDIVIDUAL
   ========================================================= */
export const ChartDownloadButton = memo(({ chartId, chartTitle }: { chartId: string; chartTitle: string }) => {
  const [loading, setLoading] = useState(false)

  const handleDownload = useCallback(async () => {
    setLoading(true)
    try {
      const { exportChartToPNG } = await import('../lib/pdfExport')
      await exportChartToPNG(`chart-${chartId}`, chartTitle)
    } catch (err) {
      console.error('Erro ao baixar gráfico:', err)
    } finally {
      setLoading(false)
    }
  }, [chartId, chartTitle])

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      title="Baixar gráfico como PNG"
      className="w-6 h-6 flex items-center justify-center rounded-md
                 hover:bg-slate-100 dark:hover:bg-slate-600
                 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                 transition-colors cursor-pointer"
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <Image size={12} />}
    </button>
  )
})

ExportButtons.displayName = 'ExportButtons'
ChartDownloadButton.displayName = 'ChartDownloadButton'
export default ExportButtons
