import { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  ChevronRight,
  AlertCircle,
  Activity,
  Filter,
  Download,
  Lightbulb,
  Edit2,
  Eye,
} from 'lucide-react'

// Mock data for error control
const errorSummary = {
  critical: 3,
  errorRate: 0.8,
  errorRateTrend: -12,
  resolvedToday: 47,
  totalErrors: 59,
}

const errorCategories = [
  {
    id: 'cat-1',
    name: 'Connection Errors',
    count: 12,
    percentage: 45,
    examples: ['Connection timeout', 'DNS resolution failed', 'SSL handshake error'],
    color: 'bg-coral',
  },
  {
    id: 'cat-2',
    name: 'Validation Errors',
    count: 8,
    percentage: 30,
    examples: ['Missing required field', 'Invalid email format', 'Amount out of range'],
    color: 'bg-amber-warning',
  },
  {
    id: 'cat-3',
    name: 'Target Errors',
    count: 4,
    percentage: 15,
    examples: ['SAP service unavailable', 'Rate limit exceeded', 'Internal server error'],
    color: 'bg-violet-accent',
  },
  {
    id: 'cat-4',
    name: 'Mapping Errors',
    count: 3,
    percentage: 10,
    examples: ['Null pointer in transformation', 'Type conversion failed'],
    color: 'bg-steel-blue',
  },
]

const failedTransactions = [
  {
    id: 'err-1',
    traceId: 'trx-x9y2z1a',
    timestamp: '2024-01-15T12:43:05Z',
    integrationName: 'Payment Gateway',
    errorType: 'Connection Error',
    errorMessage: 'Connection to target timed out after 30000ms',
    retryCount: 3,
    maxRetries: 3,
    status: 'failed',
  },
  {
    id: 'err-2',
    traceId: 'trx-m5n6o7p',
    timestamp: '2024-01-15T12:38:22Z',
    integrationName: 'Order Sync',
    errorType: 'Validation Error',
    errorMessage: 'Missing required field: customer_email',
    retryCount: 0,
    maxRetries: 3,
    status: 'pending_review',
  },
  {
    id: 'err-3',
    traceId: 'trx-k1l2m3n',
    timestamp: '2024-01-15T12:35:18Z',
    integrationName: 'Customer Data Hub',
    errorType: 'Target Error',
    errorMessage: 'SAP service unavailable - HTTP 503',
    retryCount: 2,
    maxRetries: 3,
    status: 'retrying',
  },
  {
    id: 'err-4',
    traceId: 'trx-p4q5r6s',
    timestamp: '2024-01-15T12:32:10Z',
    integrationName: 'Inventory Sync',
    errorType: 'Mapping Error',
    errorMessage: 'Type conversion failed: string to number',
    retryCount: 1,
    maxRetries: 3,
    status: 'failed',
  },
  {
    id: 'err-5',
    traceId: 'trx-t7u8v9w',
    timestamp: '2024-01-15T12:28:45Z',
    integrationName: 'Shipping Service',
    errorType: 'Validation Error',
    errorMessage: 'Invalid address format: missing postal code',
    retryCount: 0,
    maxRetries: 3,
    status: 'pending_review',
  },
]

// Summary Card
function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  trendDirection,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  color: string
  trend?: number
  trendDirection?: 'up' | 'down'
}) {
  return (
    <div className="bg-charcoal border border-graphite p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {trend !== undefined && trendDirection && (
          <span className={`text-xs ${trendDirection === 'down' ? 'text-emerald' : 'text-coral'}`}>
            {trendDirection === 'down' ? '↓' : '↑'}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-[10px] text-gray-600 uppercase tracking-wider">{title}</p>
      <p className="text-xl font-mono font-medium text-white mt-0.5">{value}</p>
      {subtitle && <p className="text-[10px] text-gray-600 mt-1">{subtitle}</p>}
    </div>
  )
}

// Error Category Bar
function ErrorCategoryBar({ category }: { category: (typeof errorCategories)[0] }) {
  return (
    <div className="bg-charcoal border border-graphite p-3 hover:border-graphite/80 cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 ${category.color}`} />
          <h4 className="text-xs text-white">{category.name}</h4>
          <span className="text-[10px] text-gray-600">({category.count})</span>
        </div>
        <ChevronRight className="w-3 h-3 text-gray-600" />
      </div>
      <div className="h-1 bg-slate-dark rounded-full overflow-hidden">
        <div className={`h-full ${category.color}`} style={{ width: `${category.percentage}%` }} />
      </div>
      <p className="text-[10px] text-gray-600 mt-1.5">{category.percentage}% of total</p>
    </div>
  )
}

// Status Badge
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    failed: { bg: 'bg-coral/10', text: 'text-coral', label: 'Failed' },
    retrying: { bg: 'bg-steel-blue/10', text: 'text-steel-blue', label: 'Retrying' },
    pending_review: { bg: 'bg-amber-warning/10', text: 'text-amber-warning', label: 'Pending' },
  }
  const { bg, text, label } = config[status] || config.failed
  return <span className={`inline-flex px-1.5 py-0.5 text-[10px] ${bg} ${text}`}>{label}</span>
}

// Failed Transaction Row
function FailedTransactionRow({
  transaction,
  isSelected,
  onClick,
}: {
  transaction: (typeof failedTransactions)[0]
  isSelected: boolean
  onClick: () => void
}) {
  const time = new Date(transaction.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer ${isSelected ? 'bg-slate-dark' : 'hover:bg-slate-dark/50'}`}
    >
      <td className="px-3 py-2.5">
        <span className="text-xs font-mono text-electric-cyan">{transaction.traceId}</span>
      </td>
      <td className="px-3 py-2.5">
        <span className="text-xs text-gray-500 font-mono">{time}</span>
      </td>
      <td className="px-3 py-2.5">
        <span className="text-xs text-gray-400">{transaction.integrationName}</span>
      </td>
      <td className="px-3 py-2.5">
        <span className="text-xs text-gray-500">{transaction.errorType}</span>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className="w-12 h-1 bg-slate-dark rounded-full overflow-hidden">
            <div
              className={`h-full ${transaction.retryCount >= transaction.maxRetries ? 'bg-coral' : 'bg-steel-blue'}`}
              style={{ width: `${(transaction.retryCount / transaction.maxRetries) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-600">
            {transaction.retryCount}/{transaction.maxRetries}
          </span>
        </div>
      </td>
      <td className="px-3 py-2.5">
        <StatusBadge status={transaction.status} />
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1">
          {transaction.status !== 'failed' && (
            <button className="p-1 hover:bg-slate-dark">
              <RefreshCw className="w-3 h-3 text-gray-600" />
            </button>
          )}
          {transaction.status === 'pending_review' && (
            <button className="p-1 hover:bg-slate-dark">
              <Eye className="w-3 h-3 text-gray-600" />
            </button>
          )}
          <button className="p-1 hover:bg-slate-dark">
            <Edit2 className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// Investigation Panel
function InvestigationPanel({
  transaction,
  onClose,
}: {
  transaction: (typeof failedTransactions)[0] | null
  onClose: () => void
}) {
  if (!transaction) return null
  return (
    <div className="fixed inset-y-12 right-0 w-[420px] bg-charcoal border-l border-graphite overflow-hidden flex flex-col z-30">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-graphite bg-slate-dark/50">
        <div>
          <p className="text-xs text-gray-400">Trace ID</p>
          <p className="text-xs font-mono text-electric-cyan">{transaction.traceId}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-dark">
          <XCircle className="w-3 h-3 text-gray-600" />
        </button>
      </div>
      <div className="px-4 py-3 border-b border-graphite bg-slate-dark/30">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-gray-600 uppercase">Type</p>
            <p className="text-xs text-gray-300 mt-0.5">{transaction.errorType}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 uppercase">Integration</p>
            <p className="text-xs text-gray-300 mt-0.5">{transaction.integrationName}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] text-gray-600 uppercase">Message</p>
            <p className="text-xs text-coral mt-0.5">{transaction.errorMessage}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 uppercase">Time</p>
            <p className="text-xs text-gray-300 font-mono mt-0.5">
              {new Date(transaction.timestamp).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 uppercase">Retries</p>
            <p className="text-xs text-gray-300 mt-0.5">{transaction.maxRetries} attempts</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-graphite">
        <h4 className="text-[10px] text-gray-400 uppercase mb-2">Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-dark text-xs text-gray-400 hover:text-gray-300">
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-dark text-xs text-gray-400 hover:text-gray-300">
            <Clock className="w-3 h-3" />
            Schedule
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-dark text-xs text-gray-400 hover:text-gray-300">
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-dark text-xs text-gray-400 hover:text-gray-300">
            <Eye className="w-3 h-3" />
            Review
          </button>
        </div>
      </div>
      <div className="px-4 py-3 flex-1 overflow-y-auto">
        <h4 className="text-[10px] text-gray-400 uppercase mb-2 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-warning" />
          Root Cause
        </h4>
        <div className="bg-slate-dark p-3">
          <p className="text-xs text-gray-400">
            Similar errors <span className="text-amber-warning">15 times</span> in past 24h
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Primary: <span className="text-white">Target system high latency</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Recommendation:{' '}
            <span className="text-electric-cyan">Increase timeout or enable TCC</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// Main Error Control Page
function ErrorControl() {
  const [selectedTransaction, setSelectedTransaction] = useState<
    (typeof failedTransactions)[0] | null
  >(null)

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight">Error Control</h1>
          <p className="text-xs text-gray-600 mt-0.5">Error monitoring and resolution</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-graphite text-xs text-gray-500 hover:text-gray-400">
            <Activity className="w-3 h-3" />
            Trends
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-graphite text-xs text-gray-500 hover:text-gray-400">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite">
        <SummaryCard
          title="Critical Errors"
          value={errorSummary.critical}
          subtitle="Requires action"
          icon={AlertCircle}
          color="bg-coral"
        />
        <SummaryCard
          title="Error Rate"
          value={`${errorSummary.errorRate}%`}
          subtitle="vs 24h avg"
          icon={Activity}
          color="bg-amber-warning"
          trend={errorSummary.errorRateTrend}
          trendDirection={errorSummary.errorRateTrend < 0 ? 'down' : 'up'}
        />
        <SummaryCard
          title="Resolved Today"
          value={errorSummary.resolvedToday}
          subtitle={`of ${errorSummary.totalErrors}`}
          icon={CheckCircle2}
          color="bg-emerald"
        />
      </div>

      {/* Error Categories */}
      <div>
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Error Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {errorCategories.map(category => (
            <ErrorCategoryBar key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Failed Transactions Table */}
      <div className="bg-charcoal border border-graphite">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-graphite">
          <h3 className="text-xs font-medium text-gray-400 uppercase">Failed Transactions</h3>
          <button className="text-[10px] text-gray-600 hover:text-gray-400 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Filter
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-dark">
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                Trace ID
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                Time
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                Integration
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                Type
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                Retries
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                Status
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite/30">
            {failedTransactions.map(transaction => (
              <FailedTransactionRow
                key={transaction.id}
                transaction={transaction}
                isSelected={selectedTransaction?.id === transaction.id}
                onClick={() => setSelectedTransaction(transaction)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <InvestigationPanel
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  )
}

export default ErrorControl
