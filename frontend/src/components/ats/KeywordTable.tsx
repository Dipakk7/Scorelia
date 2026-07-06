import { useState, useMemo } from 'react'
import { Search, Download, Check, X, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface KeywordTableItem {
  keyword: string
  frequency: number
  density: number
  status: 'matched' | 'missing' | 'suggested'
}

interface KeywordTableProps {
  items: KeywordTableItem[]
}

export function KeywordTable({ items }: KeywordTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'matched' | 'missing' | 'suggested'>('all')
  const [sortField, setSortField] = useState<'keyword' | 'frequency' | 'density'>('frequency')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Export current list to CSV
  const handleExportCSV = () => {
    const headers = ['Keyword', 'Frequency', 'Density (%)', 'Status']
    const rows = items.map((item) => [
      item.keyword,
      item.frequency,
      `${item.density.toFixed(2)}%`,
      item.status.toUpperCase(),
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'keyword_analysis_report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle sorting toggle
  const toggleSort = (field: 'keyword' | 'frequency' | 'density') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  // Filter and sort keywords
  const processedItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesSearch = item.keyword.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        let valA = a[sortField]
        let valB = b[sortField]

        if (typeof valA === 'string') {
          valA = valA.toLowerCase()
          valB = (valB as string).toLowerCase()
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
  }, [items, searchQuery, statusFilter, sortField, sortOrder])

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans"
          />
        </div>

        {/* Filter Tabs & Export */}
        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/40 dark:border-slate-700/40 text-xs">
            {(['all', 'matched', 'missing', 'suggested'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-md font-medium capitalize cursor-pointer transition-colors ${
                  statusFilter === tab
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs h-9 cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto border border-slate-200/60 dark:border-slate-800/40 rounded-xl">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800/60 text-left text-xs font-sans">
          <thead className="bg-slate-50/50 dark:bg-slate-900/60 font-semibold text-slate-700 dark:text-slate-350">
            <tr>
              <th
                onClick={() => toggleSort('keyword')}
                className="px-6 py-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Keyword</span>
                  <ArrowUpDown size={12} className="text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('frequency')}
                className="px-6 py-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Frequency</span>
                  <ArrowUpDown size={12} className="text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('density')}
                className="px-6 py-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Density</span>
                  <ArrowUpDown size={12} className="text-slate-400" />
                </div>
              </th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60 bg-white dark:bg-slate-900/10">
            {processedItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500">
                  No matching keywords found.
                </td>
              </tr>
            ) : (
              processedItems.map((item, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50/40 dark:hover:bg-slate-850/20 transition-colors"
                >
                  <td className="px-6 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                    {item.keyword}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-700 dark:text-slate-400">
                    {item.frequency}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-700 dark:text-slate-400">
                    {item.density.toFixed(2)}%
                  </td>
                  <td className="px-6 py-3.5">
                    {item.status === 'matched' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <Check size={12} className="stroke-[3]" />
                        <span>Matched</span>
                      </span>
                    ) : item.status === 'missing' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                        <X size={12} className="stroke-[3]" />
                        <span>Missing</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                        <span>Suggested</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default KeywordTable
