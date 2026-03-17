// components/DynamicTable.tsx — Tabela dinâmica com @tanstack/react-table v8
import { memo, useState, useMemo, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download } from 'lucide-react'
import { useDashboardStore, type DataRow } from '../store/useDashboardStore'
import { exportToCSV } from '../lib/excel'

/* =========================================================
   COLUNA HELPER
   ========================================================= */
const columnHelper = createColumnHelper<DataRow>()

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */
const DynamicTable = memo(() => {
  const { rawData, columns, fileName } = useDashboardStore()

  // Estado da tabela
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [showColumnFilters, setShowColumnFilters] = useState(false)

  /* -------------------------------------------------------
     Define colunas dinamicamente com base nos dados
  ------------------------------------------------------- */
  const tableColumns = useMemo(() =>
    columns.map((col) =>
      columnHelper.accessor((row) => row[col], {
        id: col,
        header: col,
        cell: (info) => {
          const val = info.getValue()
          if (val === null || val === undefined) {
            return <span className="text-slate-300 dark:text-slate-600 italic text-xs">—</span>
          }
          return (
            <span className={typeof val === 'number' ? 'font-mono tabular-nums' : ''}>
              {String(val)}
            </span>
          )
        },
        filterFn: 'includesString',
      })
    ),
    [columns]
  )

  /* -------------------------------------------------------
     Instância da tabela
  ------------------------------------------------------- */
  const table = useReactTable({
    data: rawData,
    columns: tableColumns,
    state: { globalFilter, sorting, columnFilters, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
  })

  /* -------------------------------------------------------
     Exporta somente as linhas filtradas/visíveis
  ------------------------------------------------------- */
  const handleExportCSV = useCallback(() => {
    const visibleRows = table.getFilteredRowModel().rows.map((row) => row.original)
    exportToCSV(visibleRows, fileName?.replace(/\.[^.]+$/, '') ?? 'tabela')
  }, [table, fileName])

  /* -------------------------------------------------------
     Ícone de ordenação
  ------------------------------------------------------- */
  const SortIcon = ({ sorted }: { sorted: false | 'asc' | 'desc' }) => {
    if (sorted === 'asc') return <ChevronUp size={13} className="text-brand-500" />
    if (sorted === 'desc') return <ChevronDown size={13} className="text-brand-500" />
    return <ChevronsUpDown size={13} className="text-slate-300 dark:text-slate-600" />
  }

  /* -------------------------------------------------------
     Render
  ------------------------------------------------------- */
  return (
    <div className="card overflow-hidden animate-fade-in">
      {/* Header da tabela */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
            Tabela de Dados
          </h3>
          <span className="badge bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400">
            {table.getFilteredRowModel().rows.length} linhas
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Busca global */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar em tudo..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="input-base pl-8 py-1.5 text-sm w-48"
            />
          </div>

          {/* Toggle filtros por coluna */}
          <button
            onClick={() => setShowColumnFilters((v) => !v)}
            className={`btn-ghost border text-xs py-1.5 ${showColumnFilters ? 'border-brand-300 text-brand-600 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-600'}`}
          >
            Filtros
          </button>

          {/* Export CSV */}
          <button onClick={handleExportCSV} className="btn-ghost border border-slate-200 dark:border-slate-600 text-xs py-1.5">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            {/* Headers */}
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-slate-50 dark:bg-slate-700/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400
                               uppercase tracking-wide whitespace-nowrap cursor-pointer select-none
                               hover:text-slate-700 dark:hover:text-slate-200 transition-colors
                               border-b border-slate-100 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <SortIcon sorted={header.column.getIsSorted()} />
                    </div>
                  </th>
                ))}
              </tr>
            ))}

            {/* Filtros por coluna (condicional) */}
            {showColumnFilters && table.getHeaderGroups().map((headerGroup) => (
              <tr key={`filter-${headerGroup.id}`} className="bg-slate-50 dark:bg-slate-700/30">
                {headerGroup.headers.map((header) => (
                  <th key={`f-${header.id}`} className="px-2 py-1 border-b border-slate-100 dark:border-slate-700">
                    {header.column.getCanFilter() && (
                      <input
                        type="text"
                        placeholder={`${String(header.column.columnDef.header)}...`}
                        value={(header.column.getFilterValue() as string) ?? ''}
                        onChange={(e) => header.column.setFilterValue(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-2 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-600
                                   bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200
                                   placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  Nenhum resultado encontrado para os filtros aplicados.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`border-b border-slate-50 dark:border-slate-700/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30
                    ${idx % 2 === 0 ? '' : 'bg-slate-50/40 dark:bg-slate-800/30'}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2.5 text-slate-700 dark:text-slate-300 max-w-xs truncate"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
        {/* Info */}
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Página{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {table.getState().pagination.pageIndex + 1}
          </span>{' '}
          de{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {table.getPageCount()}
          </span>
          {' '}·{' '}
          {table.getFilteredRowModel().rows.length} registros
        </div>

        {/* Controles */}
        <div className="flex items-center gap-1.5">
          {/* Linhas por página */}
          <select
            value={pagination.pageSize}
            onChange={(e) => setPagination((p) => ({ ...p, pageSize: Number(e.target.value), pageIndex: 0 }))}
            className="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600
                       bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>{size} por página</option>
            ))}
          </select>

          {/* Botões de navegação */}
          {[
            { icon: ChevronsLeft,  action: () => table.setPageIndex(0),            disabled: !table.getCanPreviousPage() },
            { icon: ChevronLeft,   action: () => table.previousPage(),              disabled: !table.getCanPreviousPage() },
            { icon: ChevronRight,  action: () => table.nextPage(),                  disabled: !table.getCanNextPage() },
            { icon: ChevronsRight, action: () => table.setPageIndex(table.getPageCount() - 1), disabled: !table.getCanNextPage() },
          ].map(({ icon: Icon, action, disabled }, i) => (
            <button
              key={i}
              onClick={action}
              disabled={disabled}
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-600
                         text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
})

DynamicTable.displayName = 'DynamicTable'
export default DynamicTable
