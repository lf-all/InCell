// lib/excel.ts — Utilitários para leitura e exportação de arquivos Excel
import * as XLSX from 'xlsx'
import type { DataRow } from '../store/useDashboardStore'

/* =========================================================
   TIPOS
   ========================================================= */

export interface ParseResult {
  sheetNames: string[]
  activeSheet: string
  data: DataRow[]
  columns: string[]
}

/* =========================================================
   CONSTANTES
   ========================================================= */

/** Tamanho máximo permitido: 15 MB */
export const MAX_FILE_SIZE = 15 * 1024 * 1024

/** Extensões aceitas */
export const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls', '.csv']

/* =========================================================
   VALIDAÇÃO
   ========================================================= */

/**
 * Valida o arquivo antes de processar.
 * Retorna uma string de erro ou null se válido.
 */
export function validateFile(file: File): string | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()

  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return `Formato inválido. Use: ${ACCEPTED_EXTENSIONS.join(', ')}`
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1)
    return `Arquivo muito grande (${sizeMB} MB). Limite: 15 MB.`
  }

  return null
}

/* =========================================================
   PARSE
   ========================================================= */

/**
 * Lê o arquivo Excel/CSV e retorna dados estruturados.
 * Usa a primeira aba por padrão.
 */
export async function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result
        if (!buffer) throw new Error('Não foi possível ler o arquivo.')

        // SheetJS lê o buffer
        const workbook = XLSX.read(buffer, {
          type: 'array',
          cellDates: true,    // converte datas automaticamente
          cellNF: false,      // não aplica formatação de número
          cellText: false,    // não converte tudo para string
        })

        const sheetNames = workbook.SheetNames
        if (sheetNames.length === 0) throw new Error('Arquivo sem abas.')

        const activeSheet = sheetNames[0]
        const { data, columns } = sheetToData(workbook, activeSheet)

        resolve({ sheetNames, activeSheet, data, columns })
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Erro ao processar arquivo.'))
      }
    }

    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Extrai dados de uma aba específica do workbook.
 */
export function sheetToData(
  workbook: XLSX.WorkBook,
  sheetName: string
): { data: DataRow[]; columns: string[] } {
  const sheet = workbook.Sheets[sheetName]
  if (!sheet) return { data: [], columns: [] }

  // Converte para JSON — primeira linha vira cabeçalho
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: null,   // células vazias viram null
    raw: false,     // converte para string formatada
  })

  if (raw.length === 0) return { data: [], columns: [] }

  const columns = Object.keys(raw[0])

  // Sanitiza: converte valores numéricos de string para number quando possível
  const data: DataRow[] = raw.map((row) => {
    const sanitized: DataRow = {}
    for (const key of columns) {
      const val = row[key]
      if (val === null || val === undefined) {
        sanitized[key] = null
      } else if (typeof val === 'string') {
        const num = Number(val.replace(',', '.'))
        sanitized[key] = !isNaN(num) && val.trim() !== '' ? num : val
      } else {
        sanitized[key] = val as string | number
      }
    }
    return sanitized
  })

  return { data, columns }
}

/* =========================================================
   EXPORT EXCEL
   ========================================================= */

/**
 * Exporta os dados como arquivo .xlsx para download.
 */
export function exportToExcel(data: DataRow[], fileName = 'dashboard-export'): void {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados')
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}

/* =========================================================
   EXPORT CSV
   ========================================================= */

/**
 * Exporta os dados como CSV para download.
 */
export function exportToCSV(data: DataRow[], fileName = 'dashboard-export'): void {
  if (data.length === 0) return

  const columns = Object.keys(data[0])
  const header = columns.map(escapeCSV).join(',')
  const rows = data.map((row) =>
    columns.map((col) => escapeCSV(String(row[col] ?? ''))).join(',')
  )

  const csv = [header, ...rows].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `${fileName}.csv`)
}

/** Escapa um valor para uso em CSV */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/** Cria link de download e clica automaticamente */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

/* =========================================================
   HELPERS
   ========================================================= */

/**
 * Detecta se uma coluna tem dados predominantemente numéricos.
 * Útil para sugerir eixo Y automaticamente.
 */
export function isNumericColumn(data: DataRow[], column: string): boolean {
  if (data.length === 0) return false
  const nonNull = data
    .map((row) => row[column])
    .filter((v) => v !== null && v !== undefined)
  if (nonNull.length === 0) return false
  const numericCount = nonNull.filter((v) => typeof v === 'number').length
  return numericCount / nonNull.length >= 0.7 // 70%+ numérico = coluna numérica
}

/**
 * Sugere automaticamente xKey e yKey com base nas colunas.
 */
export function suggestAxes(
  columns: string[],
  data: DataRow[]
): { xKey: string; yKey: string } {
  const numericCols = columns.filter((col) => isNumericColumn(data, col))
  const textCols = columns.filter((col) => !isNumericColumn(data, col))

  return {
    xKey: textCols[0] ?? columns[0] ?? '',
    yKey: numericCols[0] ?? columns[1] ?? columns[0] ?? '',
  }
}
