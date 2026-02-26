import { useState } from 'react'
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Copy,
  X,
  History,
  ArrowRight,
} from 'lucide-react'

// Message Status State Machine
enum MessageStatus {
  RECEIVED = 'RECEIVED',
  VALIDATED = 'VALIDATED',
  MAPPED = 'MAPPED',
  SENT = 'SENT',
  CALLBACK_RECEIVED = 'CALLBACK_RECEIVED',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
}

// State machine definition
const STATE_MACHINE = {
  [MessageStatus.RECEIVED]: {
    label: 'RECEIVED',
    next: [MessageStatus.VALIDATED],
    color: 'bg-gray-500',
  },
  [MessageStatus.VALIDATED]: {
    label: 'VALIDATED',
    next: [MessageStatus.MAPPED, MessageStatus.FAILED],
    color: 'bg-steel-blue',
  },
  [MessageStatus.MAPPED]: {
    label: 'MAPPED',
    next: [MessageStatus.SENT, MessageStatus.FAILED],
    color: 'bg-violet-accent',
  },
  [MessageStatus.SENT]: {
    label: 'SENT',
    next: [MessageStatus.CALLBACK_RECEIVED, MessageStatus.RETRYING, MessageStatus.FAILED],
    color: 'bg-amber-warning',
  },
  [MessageStatus.CALLBACK_RECEIVED]: {
    label: 'CALLBACK',
    next: [MessageStatus.CONFIRMED],
    color: 'bg-electric-cyan',
  },
  [MessageStatus.CONFIRMED]: {
    label: 'CONFIRMED',
    next: [],
    color: 'bg-emerald',
  },
  [MessageStatus.FAILED]: {
    label: 'FAILED',
    next: [MessageStatus.RETRYING, MessageStatus.MANUAL_REVIEW],
    color: 'bg-coral',
  },
  [MessageStatus.RETRYING]: {
    label: 'RETRYING',
    next: [MessageStatus.SENT, MessageStatus.FAILED, MessageStatus.MANUAL_REVIEW],
    color: 'bg-amber-warning',
  },
  [MessageStatus.MANUAL_REVIEW]: {
    label: 'REVIEW',
    next: [MessageStatus.CONFIRMED, MessageStatus.FAILED],
    color: 'bg-violet-accent',
  },
}

// Status to badge config
const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  [MessageStatus.RECEIVED]: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'RECEIVED' },
  [MessageStatus.VALIDATED]: {
    bg: 'bg-steel-blue/10',
    text: 'text-steel-blue',
    label: 'VALIDATED',
  },
  [MessageStatus.MAPPED]: {
    bg: 'bg-violet-accent/10',
    text: 'text-violet-accent',
    label: 'MAPPED',
  },
  [MessageStatus.SENT]: { bg: 'bg-amber-warning/10', text: 'text-amber-warning', label: 'SENT' },
  [MessageStatus.CALLBACK_RECEIVED]: {
    bg: 'bg-electric-cyan/10',
    text: 'text-electric-cyan',
    label: 'CALLBACK',
  },
  [MessageStatus.CONFIRMED]: { bg: 'bg-emerald/10', text: 'text-emerald', label: 'CONFIRMED' },
  [MessageStatus.FAILED]: { bg: 'bg-coral/10', text: 'text-coral', label: 'FAILED' },
  [MessageStatus.RETRYING]: {
    bg: 'bg-amber-warning/10',
    text: 'text-amber-warning',
    label: 'RETRYING',
  },
  [MessageStatus.MANUAL_REVIEW]: {
    bg: 'bg-violet-accent/10',
    text: 'text-violet-accent',
    label: 'REVIEW',
  },
}

// Mock data for message logs
const mockMessages = [
  {
    id: 'msg-1',
    traceId: 'trx-a8f2c9d',
    integrationName: 'Order Sync',
    status: MessageStatus.CONFIRMED,
    timestamp: '2024-01-15T12:45:32Z',
    duration: 245,
    source: 'Shopify',
    target: 'SAP S/4HANA',
    sourcePayload: {
      order_id: 'ORD-2024-00123',
      customer: { email: 'john.doe@example.com', name: 'John Doe' },
      total: 299.99,
      currency: 'USD',
    },
    mappedPayload: { external_id: 'SAP-88234', customer_id: 'CUST-7782', order_value: 299.99 },
    targetResponse: { success: true, sap_doc_number: '88234' },
    timeline: [
      {
        time: '12:45:30.123',
        event: 'Message received from source',
        state: MessageStatus.RECEIVED,
      },
      { time: '12:45:30.234', event: 'Validation passed', state: MessageStatus.VALIDATED },
      { time: '12:45:30.456', event: 'Payload mapped', state: MessageStatus.MAPPED },
      { time: '12:45:30.890', event: 'Request sent to target', state: MessageStatus.SENT },
      {
        time: '12:45:31.012',
        event: 'Callback received from target',
        state: MessageStatus.CALLBACK_RECEIVED,
      },
      { time: '12:45:31.045', event: 'Transaction confirmed', state: MessageStatus.CONFIRMED },
    ],
  },
  {
    id: 'msg-2',
    traceId: 'trx-b7e1f8a',
    integrationName: 'Customer Data Hub',
    status: MessageStatus.CALLBACK_RECEIVED,
    timestamp: '2024-01-15T12:44:18Z',
    duration: 156,
    source: 'Salesforce',
    target: 'Data Warehouse',
    sourcePayload: { customer_id: 'CUS-NEW-8842', email: 'test@example.com' },
    mappedPayload: { customer_key: 'CUS-NEW-8842', email_address: 'test@example.com' },
    targetResponse: { success: true, records_inserted: 1 },
    warning: 'New customer - first transaction',
    timeline: [
      { time: '12:44:17.123', event: 'Message received', state: MessageStatus.RECEIVED },
      { time: '12:44:17.345', event: 'Validated with warnings', state: MessageStatus.VALIDATED },
      { time: '12:44:18.012', event: 'Payload mapped', state: MessageStatus.MAPPED },
      { time: '12:44:18.012', event: 'Sent to target', state: MessageStatus.SENT },
      { time: '12:44:18.012', event: 'Callback received', state: MessageStatus.CALLBACK_RECEIVED },
    ],
  },
  {
    id: 'msg-3',
    traceId: 'trx-c3d5e2b',
    integrationName: 'Payment Gateway',
    status: MessageStatus.FAILED,
    timestamp: '2024-01-15T12:43:05Z',
    duration: 89,
    source: 'Web Store',
    target: 'Payment Processor',
    sourcePayload: { payment_id: 'PMT-5521', amount: -50.0 },
    mappedPayload: { transaction_id: 'PMT-5521', amount: -50.0 },
    targetResponse: null,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid amount: must be positive',
      field: 'amount',
    },
    timeline: [
      { time: '12:43:04.123', event: 'Message received', state: MessageStatus.RECEIVED },
      {
        time: '12:43:04.234',
        event: 'Validation failed: invalid amount',
        state: MessageStatus.FAILED,
      },
    ],
  },
  {
    id: 'msg-4',
    traceId: 'trx-d9f4a1c',
    integrationName: 'Customer Service',
    status: MessageStatus.MAPPED,
    timestamp: '2024-01-15T12:42:51Z',
    duration: 312,
    source: 'CRM',
    target: 'Salesforce',
    sourcePayload: { contact_id: 'CONTACT-7782', name: 'John Doe', email: 'john@example.com' },
    mappedPayload: { FirstName: 'John', LastName: 'Doe', Email: 'john@example.com' },
    targetResponse: null,
    timeline: [
      { time: '12:42:50.123', event: 'Message received', state: MessageStatus.RECEIVED },
      { time: '12:42:50.345', event: 'Validation passed', state: MessageStatus.VALIDATED },
      { time: '12:42:51.234', event: 'Payload mapped', state: MessageStatus.MAPPED },
    ],
  },
  {
    id: 'msg-5',
    traceId: 'trx-e2a8b7f',
    integrationName: 'Inventory Sync',
    status: MessageStatus.RETRYING,
    timestamp: '2024-01-15T12:41:22Z',
    duration: 15000,
    source: 'ERP',
    target: 'Warehouse System',
    retryCount: 2,
    maxRetries: 3,
    sourcePayload: { inventory_id: 'INV-3321', sku: 'PROD-001', quantity: 50 },
    mappedPayload: { item_sku: 'PROD-001', new_quantity: 50 },
    targetResponse: null,
    error: { code: 'CONNECTION_TIMEOUT', message: 'Connection to target timed out' },
    timeline: [
      { time: '12:41:07.123', event: 'Message received', state: MessageStatus.RECEIVED },
      { time: '12:41:07.345', event: 'Validated', state: MessageStatus.VALIDATED },
      { time: '12:41:07.567', event: 'Mapped', state: MessageStatus.MAPPED },
      {
        time: '12:41:37.123',
        event: 'Connection timeout - retrying',
        state: MessageStatus.RETRYING,
      },
      { time: '12:42:22.123', event: 'Retry attempt 2/3', state: MessageStatus.SENT },
    ],
  },
  {
    id: 'msg-6',
    traceId: 'trx-f3b9c8e',
    integrationName: 'Shipping Service',
    status: MessageStatus.MANUAL_REVIEW,
    timestamp: '2024-01-15T12:40:15Z',
    duration: 178,
    source: 'Order System',
    target: 'Logistics Provider',
    sourcePayload: { shipment_id: 'SHP-2210', order_id: 'ORD-2024-00120', carrier: 'FedEx' },
    mappedPayload: { consignment: 'SHP-2210', carrier_code: 'FDX' },
    targetResponse: null,
    error: { code: 'RISK_HIGH', message: 'High value shipment requires manual approval' },
    timeline: [
      { time: '12:40:14.123', event: 'Message received', state: MessageStatus.RECEIVED },
      { time: '12:40:14.345', event: 'Validated', state: MessageStatus.VALIDATED },
      { time: '12:40:14.567', event: 'Mapped', state: MessageStatus.MAPPED },
      { time: '12:40:14.789', event: 'Sent to target', state: MessageStatus.SENT },
      { time: '12:40:15.012', event: 'Requires manual review', state: MessageStatus.MANUAL_REVIEW },
    ],
  },
]

const integrations = [
  'All Integrations',
  'Order Sync',
  'Customer Data Hub',
  'Payment Gateway',
  'Inventory Sync',
  'Shipping Service',
]
const timeRanges = [
  'Last 15 minutes',
  'Last 1 hour',
  'Last 6 hours',
  'Last 24 hours',
  'Last 7 days',
]
const savedSearches = [
  'Failed transactions today',
  'High risk reviews',
  'Retry attempts',
  'Slow transactions (>1s)',
]

// State machine visualization component
function StateMachineView({ currentState }: { currentState: string }) {
  const states = [
    MessageStatus.RECEIVED,
    MessageStatus.VALIDATED,
    MessageStatus.MAPPED,
    MessageStatus.SENT,
    MessageStatus.CALLBACK_RECEIVED,
    MessageStatus.CONFIRMED,
  ]

  const errorStates = [MessageStatus.FAILED, MessageStatus.RETRYING, MessageStatus.MANUAL_REVIEW]

  const getStateStyle = (state: string) => {
    const config = STATE_MACHINE[state as MessageStatus]
    if (!config) return 'bg-graphite text-gray-600'

    const isActive = state === currentState
    const isPast =
      states.indexOf(state as MessageStatus) < states.indexOf(currentState as MessageStatus) ||
      errorStates.includes(state as MessageStatus)

    if (isActive) return `${config.color} text-white`
    if (isPast || state === MessageStatus.CONFIRMED) return `${config.color}/30 text-gray-400`
    return 'bg-graphite text-gray-600'
  }

  return (
    <div className="flex items-center gap-1">
      {states.map((state, index) => (
        <div key={state} className="flex items-center">
          <div className={`px-2 py-1 text-[9px] font-mono ${getStateStyle(state)}`}>
            {STATE_MACHINE[state].label}
          </div>
          {index < states.length - 1 && <ArrowRight className="w-3 h-3 text-gray-700 mx-0.5" />}
        </div>
      ))}
      {/* Terminal states */}
      <div className="flex items-center gap-1 ml-2 pl-2 border-l border-graphite">
        <div className={`px-2 py-1 text-[9px] font-mono ${getStateStyle(MessageStatus.FAILED)}`}>
          FAILED
        </div>
        <div className={`px-2 py-1 text-[9px] font-mono ${getStateStyle(MessageStatus.RETRYING)}`}>
          RETRYING
        </div>
        <div
          className={`px-2 py-1 text-[9px] font-mono ${getStateStyle(MessageStatus.MANUAL_REVIEW)}`}
        >
          REVIEW
        </div>
      </div>
    </div>
  )
}

// Status badge
function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig[MessageStatus.RECEIVED]
  return (
    <span className={`inline-flex px-1.5 py-0.5 text-[10px] ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

// Message row
function MessageRow({
  message,
  isSelected,
  onClick,
}: {
  message: (typeof mockMessages)[0]
  isSelected: boolean
  onClick: () => void
}) {
  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer ${isSelected ? 'bg-slate-dark' : 'hover:bg-slate-dark/50'}`}
    >
      <td className="px-3 py-2">
        <span className="text-xs font-mono text-electric-cyan">{message.traceId}</span>
      </td>
      <td className="px-3 py-2">
        <span className="text-xs text-gray-500 font-mono">{time}</span>
      </td>
      <td className="px-3 py-2">
        <span className="text-xs text-gray-400">{message.integrationName}</span>
      </td>
      <td className="px-3 py-2">
        <StatusBadge status={message.status} />
      </td>
      <td className="px-3 py-2">
        <span className="text-xs text-gray-600 font-mono">{message.duration}ms</span>
      </td>
      <td className="px-3 py-2">
        <span className="text-xs text-gray-600 truncate max-w-[200px] block">
          {message.error ? message.error.message : 'Completed'}
        </span>
      </td>
    </tr>
  )
}

// Detail panel
function DetailPanel({
  message,
  onClose,
}: {
  message: (typeof mockMessages)[0] | null
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState<'state' | 'payloads' | 'response'>('state')
  if (!message) return null

  const copyToClipboard = (text: unknown) =>
    navigator.clipboard.writeText(JSON.stringify(text, null, 2))

  return (
    <div className="fixed inset-y-12 right-0 w-[500px] bg-charcoal border-l border-graphite overflow-hidden flex flex-col z-30">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-graphite bg-slate-dark/50">
        <div>
          <p className="text-xs text-gray-400">Trace ID</p>
          <p className="text-xs font-mono text-electric-cyan">{message.traceId}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => copyToClipboard(message.traceId)}
            className="p-1 hover:bg-slate-dark"
            title="Copy"
          >
            <Copy className="w-3 h-3 text-gray-500" />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-slate-dark">
            <X className="w-3 h-3 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-graphite bg-slate-dark/30">
        <div className="grid grid-cols-4 gap-3">
          <div>
            <p className="text-[10px] text-gray-600 uppercase">Integration</p>
            <p className="text-xs text-gray-300 mt-0.5">{message.integrationName}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 uppercase">Status</p>
            <div className="mt-0.5">
              <StatusBadge status={message.status} />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 uppercase">Duration</p>
            <p className="text-xs text-gray-300 font-mono mt-0.5">{message.duration}ms</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 uppercase">Time</p>
            <p className="text-xs text-gray-300 font-mono mt-0.5">
              {new Date(message.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* State Machine Visualization */}
      <div className="px-4 py-3 border-b border-graphite">
        <p className="text-[10px] text-gray-600 uppercase mb-2">State Machine</p>
        <StateMachineView currentState={message.status} />
      </div>

      <div className="flex border-b border-graphite">
        {(['state', 'payloads', 'response'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-2 text-[10px] uppercase tracking-wider transition-colors ${activeTab === tab ? 'text-electric-cyan border-b border-electric-cyan bg-slate-dark/30' : 'text-gray-600 hover:text-gray-400'}`}
          >
            {tab === 'state' ? 'Timeline' : tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'state' && (
          <div className="space-y-0">
            {message.timeline.map((event, index) => {
              const config = STATE_MACHINE[event.state as MessageStatus]
              return (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full ${config?.color || 'bg-gray-500'}`} />
                    {index < message.timeline.length - 1 && (
                      <div className="w-px h-full bg-graphite/50 my-0.5" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <span className="text-[10px] font-mono text-gray-600">{event.time}</span>
                    <p className="text-xs text-gray-400">{event.event}</p>
                    <span className="text-[9px] text-gray-600">{config?.label || event.state}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'payloads' && (
          <div className="space-y-2">
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-[10px] text-gray-600 uppercase">Source</p>
                <button onClick={() => copyToClipboard(message.sourcePayload)}>
                  <Copy className="w-3 h-3 text-gray-600" />
                </button>
              </div>
              <pre className="bg-slate-dark p-2 text-[10px] font-mono text-gray-400 overflow-x-auto">
                {JSON.stringify(message.sourcePayload, null, 2)}
              </pre>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-[10px] text-gray-600 uppercase">Mapped</p>
                <button onClick={() => copyToClipboard(message.mappedPayload)}>
                  <Copy className="w-3 h-3 text-gray-600" />
                </button>
              </div>
              <pre className="bg-slate-dark p-2 text-[10px] font-mono text-gray-400 overflow-x-auto">
                {JSON.stringify(message.mappedPayload, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'response' && (
          <div>
            {message.error ? (
              <div className="bg-coral/10 border border-coral/30 p-3">
                <p className="text-xs text-coral">{message.error.message}</p>
                <p className="text-[10px] text-gray-500 mt-1 font-mono">{message.error.code}</p>
              </div>
            ) : message.targetResponse ? (
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-[10px] text-gray-600 uppercase">Response</p>
                  <button onClick={() => copyToClipboard(message.targetResponse)}>
                    <Copy className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                <pre className="bg-slate-dark p-2 text-[10px] font-mono text-gray-400 overflow-x-auto">
                  {JSON.stringify(message.targetResponse, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-xs text-gray-600">No response</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Main Message Center Page
function MessageCenter() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<(typeof mockMessages)[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIntegration, setSelectedIntegration] = useState('All Integrations')
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 1 hour')
  const [statusFilters, setStatusFilters] = useState({
    [MessageStatus.RECEIVED]: true,
    [MessageStatus.VALIDATED]: true,
    [MessageStatus.MAPPED]: true,
    [MessageStatus.SENT]: true,
    [MessageStatus.CALLBACK_RECEIVED]: true,
    [MessageStatus.CONFIRMED]: true,
    [MessageStatus.FAILED]: true,
    [MessageStatus.RETRYING]: true,
    [MessageStatus.MANUAL_REVIEW]: true,
  })

  const toggleStatusFilter = (status: MessageStatus) => {
    setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }))
  }

  const filteredMessages = mockMessages.filter(msg => {
    const matchesSearch =
      msg.traceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.integrationName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIntegration =
      selectedIntegration === 'All Integrations' || msg.integrationName === selectedIntegration
    const matchesStatus = statusFilters[msg.status as MessageStatus]
    return matchesSearch && matchesIntegration && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight">Message Center</h1>
          <p className="text-xs text-gray-600 mt-0.5">Transaction logs and message analysis</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-dark border border-graphite text-xs text-gray-400 hover:text-gray-300">
          <Download className="w-3 h-3" />
          Export
        </button>
      </div>

      <div className="flex gap-4">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? 'w-52' : 'w-0'} transition-all duration-200 overflow-hidden`}
        >
          <div className="w-52 space-y-3">
            <div className="bg-charcoal border border-graphite p-3 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-medium text-gray-400 uppercase">Filters</h3>
                <button onClick={() => setSidebarOpen(false)} className="p-0.5 hover:bg-slate-dark">
                  <ChevronLeft className="w-3 h-3 text-gray-600" />
                </button>
              </div>
              <div>
                <label className="text-[10px] text-gray-600 uppercase">Time Range</label>
                <select
                  value={selectedTimeRange}
                  onChange={e => setSelectedTimeRange(e.target.value)}
                  className="mt-1 w-full bg-slate-dark border border-graphite px-2 py-1.5 text-xs text-gray-400"
                >
                  {timeRanges.map(r => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-600 uppercase">Integration</label>
                <select
                  value={selectedIntegration}
                  onChange={e => setSelectedIntegration(e.target.value)}
                  className="mt-1 w-full bg-slate-dark border border-graphite px-2 py-1.5 text-xs text-gray-400"
                >
                  {integrations.map(i => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-600 uppercase">Status</label>
                <div className="mt-1.5 space-y-1">
                  {Object.values(MessageStatus).map(status => {
                    const config = statusConfig[status]
                    return (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={statusFilters[status as MessageStatus]}
                          onChange={() => toggleStatusFilter(status as MessageStatus)}
                          className="sr-only"
                        />
                        <div
                          className={`w-3 h-3 border ${statusFilters[status as MessageStatus] ? 'bg-electric-cyan border-electric-cyan' : 'border-graphite'}`}
                        >
                          {statusFilters[status as MessageStatus] && (
                            <svg
                              className="w-full h-full text-obsidian"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-xs ${statusFilters[status] ? config.text : 'text-gray-600'}`}
                        >
                          {config.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="bg-charcoal border border-graphite p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <History className="w-3 h-3 text-gray-600" />
                <h3 className="text-[10px] font-medium text-gray-400 uppercase">Saved</h3>
              </div>
              <div className="space-y-0.5">
                {savedSearches.map((s, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:text-gray-400 hover:bg-slate-dark"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed left-[228px] top-20 p-1 bg-charcoal border border-graphite z-20"
          >
            <ChevronRight className="w-3 h-3 text-gray-600" />
          </button>
        )}

        {/* Table */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
              <input
                type="text"
                placeholder="Search trace ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-charcoal border border-graphite pl-7 pr-3 py-1.5 text-xs text-gray-400 placeholder-gray-600"
              />
            </div>
            <button className="flex items-center gap-1 px-2 py-1.5 border border-graphite text-xs text-gray-600 hover:text-gray-400">
              <Filter className="w-3 h-3" />
              Filter
            </button>
          </div>

          <div className="bg-charcoal border border-graphite">
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
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                    Duration
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite/30">
                {filteredMessages.map(msg => (
                  <MessageRow
                    key={msg.id}
                    message={msg}
                    isSelected={selectedMessage?.id === msg.id}
                    onClick={() => setSelectedMessage(msg)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-[10px] text-gray-600">
              Showing {filteredMessages.length} of {mockMessages.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                className="px-2 py-1 border border-graphite text-xs text-gray-600 hover:text-gray-400 disabled:opacity-50"
                disabled
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="px-2 py-1 bg-slate-dark text-xs text-gray-400">1</span>
              <button className="px-2 py-1 border border-graphite text-xs text-gray-600 hover:text-gray-400">
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DetailPanel message={selectedMessage} onClose={() => setSelectedMessage(null)} />
    </div>
  )
}

export default MessageCenter
