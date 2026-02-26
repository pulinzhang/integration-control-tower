import { useState } from 'react'
import {
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  MoreVertical,
  ArrowRight,
  Clock,
  RefreshCw,
  Edit2,
} from 'lucide-react'

// Integration flow types
interface FlowStep {
  name: string
  type: 'source' | 'transform' | 'validation' | 'target'
  status: 'active' | 'inactive' | 'error'
}

interface IntegrationFlow {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'error'
  source: string
  target: string
  steps: FlowStep[]
  messageCount: number
  successRate: number
  avgDuration: number
  lastRun: string
}

// Mock data
const integrationFlows: IntegrationFlow[] = [
  {
    id: 'flow-1',
    name: 'Shopify to SAP Order Sync',
    description: 'Synchronizes orders from Shopify to SAP S/4HANA',
    status: 'active',
    source: 'Shopify',
    target: 'SAP S/4HANA',
    steps: [
      { name: 'Webhook Receiver', type: 'source', status: 'active' },
      { name: 'Validate Order', type: 'validation', status: 'active' },
      { name: 'Map to SAP Format', type: 'transform', status: 'active' },
      { name: 'SAP Order API', type: 'target', status: 'active' },
    ],
    messageCount: 1247,
    successRate: 99.2,
    avgDuration: 245,
    lastRun: '2 min ago',
  },
  {
    id: 'flow-2',
    name: 'Salesforce to Data Warehouse',
    description: 'ETL customer data from Salesforce to Snowflake',
    status: 'active',
    source: 'Salesforce',
    target: 'Snowflake',
    steps: [
      { name: 'Scheduled Trigger', type: 'source', status: 'active' },
      { name: 'Extract Records', type: 'source', status: 'active' },
      { name: 'Transform Fields', type: 'transform', status: 'active' },
      { name: 'Load to Warehouse', type: 'target', status: 'active' },
    ],
    messageCount: 892,
    successRate: 98.5,
    avgDuration: 1820,
    lastRun: '15 min ago',
  },
  {
    id: 'flow-3',
    name: 'Payment Gateway Integration',
    description: 'Processes payments through Stripe and updates ERP',
    status: 'error',
    source: 'Web Store',
    target: 'Stripe + ERP',
    steps: [
      { name: 'Payment Request', type: 'source', status: 'active' },
      { name: 'Validate Amount', type: 'validation', status: 'active' },
      { name: 'Stripe Payment', type: 'target', status: 'error' },
      { name: 'Update ERP', type: 'target', status: 'inactive' },
    ],
    messageCount: 456,
    successRate: 94.3,
    avgDuration: 890,
    lastRun: '1 hr ago',
  },
  {
    id: 'flow-4',
    name: 'Inventory Reserve Workflow',
    description: 'TCC-based inventory reservation with payment and order',
    status: 'active',
    source: 'Order System',
    target: 'Inventory + Payment',
    steps: [
      { name: 'Order Received', type: 'source', status: 'active' },
      { name: 'Try: Reserve Stock', type: 'transform', status: 'active' },
      { name: 'Try: Authorize Payment', type: 'transform', status: 'active' },
      { name: 'Confirm: Commit', type: 'transform', status: 'active' },
    ],
    messageCount: 234,
    successRate: 97.8,
    avgDuration: 1250,
    lastRun: '5 min ago',
  },
  {
    id: 'flow-5',
    name: 'Customer Data Sync',
    description: 'Bidirectional customer sync between CRM and marketing',
    status: 'paused',
    source: 'HubSpot',
    target: 'Salesforce',
    steps: [
      { name: 'Change Detection', type: 'source', status: 'inactive' },
      { name: 'Map Fields', type: 'transform', status: 'inactive' },
      { name: 'Upsert Target', type: 'target', status: 'inactive' },
    ],
    messageCount: 89,
    successRate: 100,
    avgDuration: 156,
    lastRun: '1 day ago',
  },
  {
    id: 'flow-6',
    name: 'Shipping Label Generation',
    description: 'Generates shipping labels via logistics provider API',
    status: 'active',
    source: 'Order System',
    target: 'FedEx API',
    steps: [
      { name: 'Order Complete', type: 'source', status: 'active' },
      { name: 'Validate Address', type: 'validation', status: 'active' },
      { name: 'Rate Calculation', type: 'transform', status: 'active' },
      { name: 'Label Generation', type: 'target', status: 'active' },
    ],
    messageCount: 567,
    successRate: 99.6,
    avgDuration: 320,
    lastRun: '10 min ago',
  },
]

const sourceSystems = [
  'All Sources',
  'Shopify',
  'Salesforce',
  'Web Store',
  'Order System',
  'HubSpot',
]
const targetSystems = ['All Targets', 'SAP S/4HANA', 'Snowflake', 'Stripe', 'ERP', 'FedEx API']

// Status badge
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'bg-emerald/10', text: 'text-emerald', label: 'Active' },
    paused: { bg: 'bg-amber-warning/10', text: 'text-amber-warning', label: 'Paused' },
    error: { bg: 'bg-coral/10', text: 'text-coral', label: 'Error' },
  }
  const { bg, text, label } = config[status] || config.paused
  return <span className={`inline-flex px-1.5 py-0.5 text-[10px] ${bg} ${text}`}>{label}</span>
}

// Step type icon
function StepIcon({ type }: { type: string }) {
  const colors = {
    source: 'bg-steel-blue/20 text-steel-blue',
    transform: 'bg-violet-accent/20 text-violet-accent',
    validation: 'bg-amber-warning/20 text-amber-warning',
    target: 'bg-emerald/20 text-emerald',
  }
  const icons = {
    source: 'S',
    transform: 'T',
    validation: 'V',
    target: 'R',
  }
  return (
    <div
      className={`w-5 h-5 flex items-center justify-center text-[9px] font-mono ${colors[type as keyof typeof colors] || colors.source}`}
    >
      {icons[type as keyof typeof icons] || '?'}
    </div>
  )
}

// Integration Flow Card
function FlowCard({ flow, onClick }: { flow: IntegrationFlow; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-charcoal border border-graphite p-4 hover:border-graphite/80 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={flow.status} />
            <h4 className="text-xs font-medium text-white">{flow.name}</h4>
          </div>
          <p className="text-[10px] text-gray-600">{flow.description}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="p-1 hover:bg-slate-dark">
            <Edit2 className="w-3 h-3 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-slate-dark">
            <MoreVertical className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Flow Pipeline */}
      <div className="flex items-center gap-1 mb-3 py-2 overflow-x-auto">
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-dark">
          <StepIcon type={flow.steps[0].type} />
          <span className="text-[10px] text-gray-500">{flow.source}</span>
        </div>
        {flow.steps.slice(1, -1).map((step, index) => (
          <div key={index} className="flex items-center">
            <ArrowRight className="w-3 h-3 text-gray-700 mx-0.5" />
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-dark">
              <StepIcon type={step.type} />
              <span className="text-[10px] text-gray-500 truncate max-w-[60px]">{step.name}</span>
            </div>
          </div>
        ))}
        <ArrowRight className="w-3 h-3 text-gray-700 mx-0.5" />
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-dark">
          <StepIcon type={flow.steps[flow.steps.length - 1].type} />
          <span className="text-[10px] text-gray-500">{flow.target}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-graphite/50">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] text-gray-600">Messages</p>
            <p className="text-xs font-mono text-white">{flow.messageCount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600">Success</p>
            <p
              className={`text-xs font-mono ${flow.successRate >= 95 ? 'text-emerald' : flow.successRate >= 90 ? 'text-amber-warning' : 'text-coral'}`}
            >
              {flow.successRate}%
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600">Avg</p>
            <p className="text-xs font-mono text-white">{flow.avgDuration}ms</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {flow.lastRun}
          </span>
          {flow.status === 'active' ? (
            <button className="p-1 hover:bg-slate-dark" title="Pause">
              <Pause className="w-3 h-3 text-gray-500" />
            </button>
          ) : flow.status === 'paused' ? (
            <button className="p-1 hover:bg-slate-dark" title="Activate">
              <Play className="w-3 h-3 text-gray-500" />
            </button>
          ) : (
            <button className="p-1 hover:bg-slate-dark" title="Retry">
              <RefreshCw className="w-3 h-3 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Integration Flows Page
function IntegrationFlows() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSource, setSelectedSource] = useState('All Sources')
  const [selectedTarget, setSelectedTarget] = useState('All Targets')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredFlows = integrationFlows.filter(flow => {
    const matchesSearch =
      flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSource = selectedSource === 'All Sources' || flow.source === selectedSource
    const matchesTarget = selectedTarget === 'All Targets' || flow.target === selectedTarget
    const matchesStatus = statusFilter === 'all' || flow.status === statusFilter
    return matchesSearch && matchesSource && matchesTarget && matchesStatus
  })

  const statusCounts = {
    active: integrationFlows.filter(f => f.status === 'active').length,
    paused: integrationFlows.filter(f => f.status === 'paused').length,
    error: integrationFlows.filter(f => f.status === 'error').length,
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight">Integration Flows</h1>
          <p className="text-xs text-gray-600 mt-0.5">Manage data integration pipelines</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-electric-cyan text-obsidian text-xs font-medium">
          <Plus className="w-3 h-3" />
          New Flow
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-px bg-graphite">
        <button
          onClick={() => setStatusFilter('all')}
          className={`bg-charcoal p-3 text-left ${statusFilter === 'all' ? 'border-l-2 border-electric-cyan' : ''}`}
        >
          <p className="text-[10px] text-gray-600 uppercase">Total Flows</p>
          <p className="text-lg font-mono text-white mt-0.5">{integrationFlows.length}</p>
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`bg-charcoal p-3 text-left ${statusFilter === 'active' ? 'border-l-2 border-electric-cyan' : ''}`}
        >
          <p className="text-[10px] text-gray-600 uppercase">Active</p>
          <p className="text-lg font-mono text-emerald mt-0.5">{statusCounts.active}</p>
        </button>
        <button
          onClick={() => setStatusFilter('paused')}
          className={`bg-charcoal p-3 text-left ${statusFilter === 'paused' ? 'border-l-2 border-electric-cyan' : ''}`}
        >
          <p className="text-[10px] text-gray-600 uppercase">Paused</p>
          <p className="text-lg font-mono text-amber-warning mt-0.5">{statusCounts.paused}</p>
        </button>
        <button
          onClick={() => setStatusFilter('error')}
          className={`bg-charcoal p-3 text-left ${statusFilter === 'error' ? 'border-l-2 border-electric-cyan' : ''}`}
        >
          <p className="text-[10px] text-gray-600 uppercase">Error</p>
          <p className="text-lg font-mono text-coral mt-0.5">{statusCounts.error}</p>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
          <input
            type="text"
            placeholder="Search flows..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-charcoal border border-graphite pl-7 pr-3 py-1.5 text-xs text-gray-400 placeholder-gray-600"
          />
        </div>
        <select
          value={selectedSource}
          onChange={e => setSelectedSource(e.target.value)}
          className="bg-charcoal border border-graphite px-3 py-1.5 text-xs text-gray-400"
        >
          {sourceSystems.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={selectedTarget}
          onChange={e => setSelectedTarget(e.target.value)}
          className="bg-charcoal border border-graphite px-3 py-1.5 text-xs text-gray-400"
        >
          {targetSystems.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button className="flex items-center gap-1 px-2 py-1.5 border border-graphite text-xs text-gray-600 hover:text-gray-400">
          <Filter className="w-3 h-3" />
          More
        </button>
      </div>

      {/* Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFlows.map(flow => (
          <FlowCard key={flow.id} flow={flow} onClick={() => {}} />
        ))}
      </div>

      {filteredFlows.length === 0 && (
        <div className="bg-charcoal border border-graphite p-8 text-center">
          <p className="text-xs text-gray-600">No integration flows match your filters</p>
        </div>
      )}
    </div>
  )
}

export default IntegrationFlows
