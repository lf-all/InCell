// components/UploadExcel.tsx — Tela de upload de arquivo Excel
import { memo, useCallback, useRef, useState } from 'react'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X, ArrowRight, Loader2 } from 'lucide-react'
import { useDashboardStore } from '../store/useDashboardStore'
import { validateFile, parseExcelFile, ACCEPTED_EXTENSIONS, MAX_FILE_SIZE } from '../lib/excel'

const UploadExcel = memo(() => {
  const { setData, setLoading, setError, setView, isLoading, error } = useDashboardStore()

  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [success, setSuccess] = useState(false)

  /* -------------------------------------------------------
     Processa o arquivo selecionado
  ------------------------------------------------------- */
  const processFile = useCallback(async (file: File) => {
    // Limpa estado anterior
    setError(null)
    setSuccess(false)
    setUploadedFile(file)

    // Valida
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      const result = await parseExcelFile(file)

      if (result.data.length === 0) {
        setError('O arquivo não contém dados. Verifique se há linhas preenchidas.')
        return
      }

      setData({
        fileName: file.name,
        rawData: result.data,
        columns: result.columns,
        sheetNames: result.sheetNames,
        activeSheet: result.activeSheet,
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao processar o arquivo.')
    } finally {
      setLoading(false)
    }
  }, [setData, setError, setLoading])

  /* -------------------------------------------------------
     Drag & Drop handlers
  ------------------------------------------------------- */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Limpa o input para permitir reselecionar o mesmo arquivo
    e.target.value = ''
  }, [processFile])

  const handleClear = useCallback(() => {
    setUploadedFile(null)
    setSuccess(false)
    setError(null)
  }, [setError])

  /* -------------------------------------------------------
     Renderização
  ------------------------------------------------------- */
  return (
    <div className="min-h-screen app-bg flex flex-col items-center justify-center p-6">
      {/* Logo / Título */}
      <div className="mb-10 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <FileSpreadsheet size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Incell</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Carregue uma planilha e crie visualizações interativas em segundos
        </p>
      </div>

      {/* Card principal */}
      <div className="w-full max-w-xl animate-slide-up">
        {/* Zona de drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isLoading && inputRef.current?.click()}
          className={`
            relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
            p-10 flex flex-col items-center justify-center gap-4 text-center
            ${isDragging
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 scale-[1.01]'
              : success
                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-brand-400 hover:bg-brand-50/30 dark:hover:bg-brand-900/10'
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(',')}
            onChange={handleInputChange}
            className="hidden"
          />

          {/* Ícone central */}
          {isLoading ? (
            <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Loader2 size={28} className="text-brand-500 animate-spin" />
            </div>
          ) : success ? (
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle size={28} className="text-emerald-500" />
            </div>
          ) : (
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors
              ${isDragging ? 'bg-brand-200 dark:bg-brand-800' : 'bg-slate-100 dark:bg-slate-700'}`}>
              <Upload size={28} className={isDragging ? 'text-brand-600' : 'text-slate-400 dark:text-slate-500'} />
            </div>
          )}

          {/* Texto */}
          <div>
            {isLoading ? (
              <>
                <p className="font-semibold text-brand-600 dark:text-brand-400">Processando arquivo...</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Aguarde um momento</p>
              </>
            ) : success && uploadedFile ? (
              <>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  {(uploadedFile.size / 1024).toFixed(0)} KB · Arquivo pronto!
                </p>
              </>
            ) : uploadedFile ? (
              <>
                <p className="font-semibold text-slate-700 dark:text-slate-200">{uploadedFile.name}</p>
                <p className="text-sm text-slate-400 mt-1">Clique para trocar o arquivo</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  Arraste o arquivo ou <span className="text-brand-500">clique para buscar</span>
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  {ACCEPTED_EXTENSIONS.join(', ')} · Máximo {MAX_FILE_SIZE / 1024 / 1024} MB
                </p>
              </>
            )}
          </div>

          {/* Botão limpar */}
          {uploadedFile && !isLoading && (
            <button
              onClick={(e) => { e.stopPropagation(); handleClear() }}
              className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center
                         bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30
                         text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mt-3 flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20
                          border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Botões de ação */}
        {success && (
          <div className="mt-4 flex gap-3 animate-fade-in">
            <button
              onClick={() => setView('preview')}
              className="flex-1 btn-ghost border border-slate-200 dark:border-slate-600 justify-center py-2.5"
            >
              <FileSpreadsheet size={16} />
              Ver prévia
            </button>
            <button
              onClick={() => setView('dashboard')}
              className="flex-1 btn-primary justify-center py-2.5 shadow-lg shadow-brand-500/25"
            >
              Criar Dashboard
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Dicas */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '📊', text: 'Gráficos interativos' },
            { icon: '🌙', text: 'Dark Mode' },
            { icon: '📤', text: 'Export PDF/Excel' },
          ].map((tip) => (
            <div key={tip.text} className="card p-3">
              <div className="text-xl mb-1">{tip.icon}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

UploadExcel.displayName = 'UploadExcel'
export default UploadExcel
