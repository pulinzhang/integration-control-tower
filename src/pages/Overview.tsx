import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  Activity,
  Database,
  Filter,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import {
  integrationsHealth,
  recentActivity,
  reviewQueue,
  flowStages,
  hourlyTransactionData,
  successRateData,
} from '../data/mockData'

// Status indicator component - minimal, professional
function StatusIndicator({
  status,
}: {
  status: 'success' | 'warning' | 'error' | 'pending' | 'active' | 'paused'
}) {
  const config = {
    success: { color: 'bg-emerald', label: 'Active' },
    warning: { color: 'bg-amber-warning', label: 'Warning' },
    error: { color: 'bg-coral', label: 'Error' },
    pending: { color: 'bg-gray-500', label: 'Pending' },
    active: { color: 'bg-emerald', label: 'Active' },
    paused: { color: 'bg-amber-warning', label: 'Paused' },
  }

  const { color, label } = config[status] || config.pending

  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className={`w-1.5 h-1.5 ${color}`} />
      <span className="text-gray-400">{label}</span>
    </span>
  )
}

// Metric Card Component - clean, structured
function MetricCard({
  title,
  value,
  trend,
  trendLabel,
  trendDirection,
  icon: Icon,
}: {
  title: string
  value: string | number
  trend: number
  trendLabel: string
  trendDirection: 'up' | 'down'
  icon: React.ElementType
}) {
  const isPositive = trendDirection === 'up'
  const trendColor =
    title === 'FAILED MESSAGES'
      ? isPositive
        ? 'text-coral'
        : 'text-emerald'
      : isPositive
        ? 'text-emerald'
        : 'text-coral'

  return (
    <div className="bg-charcoal border border-graphite">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500 uppercase tracking-wider">{title}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className="px-4 pb-4">
        <p className="text-2xl font-mono font-medium text-white">{value}</p>
        <p className="text-xs text-gray-600 mt-1">{trendLabel}</p>
      </div>
    </div>
  )
}

// Integration Health Card - structured, data-focused
function IntegrationCard({
  name,
  description,
  status,
  uptime,
  throughput,
}: {
  name: string
  description: string
  status: 'active' | 'paused' | 'error'
  uptime: number
  throughput: number
}) {
  const statusStyles = {
    active: 'border-l-emerald',
    paused: 'border-l-amber-warning',
    error: 'border-l-coral',
  }

  return (
    <div className={`bg-charcoal border border-graphite border-l-2 ${statusStyles[status]} p-3`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <StatusIndicator status={status} />
            <h4 className="text-xs font-medium text-white">{name}</h4>
          </div>
          <p className="text-[10px] text-gray-600 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-graphite/50">
        <span className="text-[10px] text-gray-500 font-mono">
          {uptime > 0 ? `${uptime}%` : 'OFFLINE'}
        </span>
        {throughput > 0 && (
          <span className="text-[10px] text-gray-500 font-mono">
            {throughput.toLocaleString()}/hr
          </span>
        )}
      </div>
    </div>
  )
}

// Activity Item Component - minimal
function ActivityItem({
  type,
  message,
  timestamp,
}: {
  type: 'success' | 'warning' | 'error' | 'retry' | 'review'
  message: string
  timestamp: string
}) {
  const typeConfig = {
    success: { color: 'bg-emerald' },
    warning: { color: 'bg-amber-warning' },
    error: { color: 'bg-coral' },
    retry: { color: 'bg-steel-blue' },
    review: { color: 'bg-violet-accent' },
  }

  const time = new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className="flex items-center gap-3 py-2 px-3 border-b border-graphite/30">
      <span className={`w-1.5 h-1.5 ${typeConfig[type].color} flex-shrink-0`} />
      <span className="text-xs text-gray-500 font-mono w-16 flex-shrink-0">{time}</span>
      <p className="text-xs text-gray-400 truncate flex-1">{message}</p>
    </div>
  )
}

// Review Queue Item - structured
function ReviewItem({
  transactionId,
  riskScore,
  reason,
  submittedAt,
  integrationName,
}: {
  transactionId: string
  riskScore: number
  reason: string
  submittedAt: string
  integrationName: string
}) {
  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-coral bg-coral/10'
    if (score >= 50) return 'text-amber-warning bg-amber-warning/10'
    return 'text-steel-blue bg-steel-blue/10'
  }

  const time = new Date(submittedAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 border-b border-graphite/30">
      <div className={`px-1.5 py-0.5 text-[10px] font-mono ${getRiskColor(riskScore)}`}>
        {riskScore}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-300">{transactionId}</span>
          <span className="text-[10px] text-gray-600">•</span>
          <span className="text-[10px] text-gray-600">{integrationName}</span>
        </div>
        <p className="text-[10px] text-gray-600 truncate mt-0.5">{reason}</p>
      </div>
      <span className="text-[10px] text-gray-600 font-mono">{time}</span>
      <ArrowRight className="w-3 h-3 text-gray-600" />
    </div>
  )
}

// Flow Stage Component - minimal, structured
function FlowStage({
  name,
  status,
  metrics,
  isLast,
}: {
  name: string
  status: 'success' | 'warning' | 'error' | 'pending'
  metrics: { count: number; avgDuration: number; errorRate: number }
  isLast?: boolean
}) {
  const statusColors = {
    success: { bg: 'bg-emerald' },
    warning: { bg: 'bg-amber-warning' },
    error: { bg: 'bg-coral' },
    pending: { bg: 'bg-gray-500' },
  }

  const colors = statusColors[status]

  return (
    <div className="flex items-center flex-1">
      <div className="flex flex-col items-center min-w-[80px]">
        <div className={`w-8 h-8 ${colors.bg}/20 flex items-center justify-center`}>
          {status === 'success' && <CheckCircle2 className={`w-4 h-4 text-emerald`} />}
          {status === 'warning' && <AlertCircle className={`w-4 h-4 text-amber-warning`} />}
          {status === 'error' && <XCircle className={`w-4 h-4 text-coral`} />}
          {status === 'pending' && <Clock className={`w-4 h-4 text-gray-500`} />}
        </div>
        <p className="text-[10px] text-gray-500 mt-2 text-center">{name}</p>

        <div className="mt-2 text-center">
          <p className="text-xs font-mono text-white">{metrics.count.toLocaleString()}</p>
          <p className="text-[9px] text-gray-600">{metrics.avgDuration}ms</p>
          <p
            className={`text-[9px] font-mono ${metrics.errorRate > 0 ? 'text-amber-warning' : 'text-gray-600'}`}
          >
            {metrics.errorRate}%
          </p>
        </div>
      </div>

      {!isLast && <div className="flex-1 h-px bg-graphite mx-2" />}
    </div>
  )
}

// Main Overview Page
function Overview() {
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight">Overview</h1>
          <p className="text-xs text-gray-600 mt-0.5">System monitoring and analytics</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-graphite">
        <MetricCard
          title="Total Messages"
          value="12,847"
          trend={12.5}
          trendLabel="vs last hour"
          trendDirection="up"
          icon={Database}
        />
        <MetricCard
          title="Active Flows"
          value="24"
          trend={4.2}
          trendLabel="vs last hour"
          trendDirection="up"
          icon={Activity}
        />
        <MetricCard
          title="Pending Reviews"
          value="7"
          trend={-2.1}
          trendLabel="vs last hour"
          trendDirection="down"
          icon={Clock}
        />
        <MetricCard
          title="Failed Messages"
          value="12"
          trend={0.8}
          trendLabel="vs last hour"
          trendDirection="up"
          icon={AlertCircle}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-graphite">
        {/* Transaction Volume Chart */}
        <div className="bg-charcoal p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Transaction Volume (24H)
            </h3>
            <div className="flex gap-0.5">
              {['1H', '6H', '24H', '7D'].map(range => (
                <button
                  key={range}
                  className={`px-2 py-1 text-[10px] transition-colors ${
                    range === '24H'
                      ? 'bg-electric-cyan text-obsidian'
                      : 'bg-slate-dark text-gray-600 hover:text-gray-400'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyTransactionData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
                <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
                <YAxis stroke="#6B7280" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1E28',
                    border: '1px solid #2A2A36',
                    borderRadius: '2px',
                    color: '#F4F4F6',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#00D4FF"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Success Rate Chart */}
        <div className="bg-charcoal p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Success Rate Trend
            </h3>
            <div className="flex gap-0.5">
              {['1H', '6H', '24H', '7D'].map(range => (
                <button
                  key={range}
                  className={`px-2 py-1 text-[10px] transition-colors ${
                    range === '24H'
                      ? 'bg-electric-cyan text-obsidian'
                      : 'bg-slate-dark text-gray-600 hover:text-gray-400'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={successRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
                <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
                <YAxis domain={[94, 100]} stroke="#6B7280" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1E28',
                    border: '1px solid #2A2A36',
                    borderRadius: '2px',
                    color: '#F4F4F6',
                    fontSize: '11px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Success Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#10B981"
                  strokeWidth={1.5}
                  dot={{ fill: '#10B981', strokeWidth: 0, r: 2 }}
                  activeDot={{ r: 3, fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Integration Flow Diagram */}
      <div className="bg-charcoal border border-graphite p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Integration Pipeline
          </h3>
          <button className="text-[10px] text-electric-cyan hover:text-electric-cyan/80 transition-colors flex items-center gap-1">
            View Details <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center overflow-x-auto py-2">
          {flowStages.map((stage, index) => (
            <FlowStage
              key={stage.id}
              name={stage.name}
              status={stage.status}
              metrics={stage.metrics}
              isLast={index === flowStages.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Integration Health Grid & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-graphite">
        {/* Integration Health */}
        <div className="bg-charcoal p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Integration Status
            </h3>
            <button className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-px bg-graphite">
            {integrationsHealth.slice(0, 6).map(integration => (
              <IntegrationCard
                key={integration.id}
                name={integration.name}
                description={integration.description}
                status={integration.status}
                uptime={integration.uptime}
                throughput={integration.throughput}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-charcoal p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Recent Activity
            </h3>
            <button className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter
            </button>
          </div>

          <div className="divide-y divide-graphite/30">
            {recentActivity.slice(0, 6).map(activity => (
              <ActivityItem
                key={activity.id}
                type={activity.type}
                message={activity.message}
                timestamp={activity.timestamp}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Manual Review Queue */}
      <div className="bg-charcoal border border-graphite">
        <div className="flex items-center justify-between px-4 py-3 border-b border-graphite">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Manual Review Queue
            </h3>
            <span className="px-1.5 py-0.5 bg-violet-accent/10 text-violet-accent text-[10px]">
              {reviewQueue.length}
            </span>
          </div>
          <button className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-graphite/30">
          {reviewQueue.slice(0, 5).map(review => (
            <ReviewItem
              key={review.id}
              transactionId={review.transactionId}
              riskScore={review.riskScore}
              reason={review.reason}
              submittedAt={review.submittedAt}
              integrationName={review.integrationName}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Overview
