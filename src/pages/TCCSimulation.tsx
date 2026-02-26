import { useState, useEffect, useRef } from 'react'
import {
  Play,
  Square,
  RotateCcw,
  Plus,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trash2,
  Copy,
  Edit2,
} from 'lucide-react'

// Mock data for TCC flows
const tccFlows = [
  {
    id: 'flow-1',
    name: 'Order Processing with Inventory Reserve',
    description: 'Multi-step transaction: reserve inventory, process payment, confirm order',
    participants: [
      { name: 'Inventory Service', resource: 'Stock', status: 'success' },
      { name: 'Payment Gateway', resource: 'Payment', status: 'success' },
      { name: 'Order Service', resource: 'Order', status: 'success' },
    ],
    activeTransactions: 3,
    completedTransactions: 156,
    rolledBackTransactions: 8,
  },
  {
    id: 'flow-2',
    name: 'Fund Transfer',
    description: 'Transfer funds between accounts with rollback capability',
    participants: [
      { name: 'Source Account', resource: 'Account', status: 'success' },
      { name: 'Destination Account', resource: 'Account', status: 'success' },
    ],
    activeTransactions: 1,
    completedTransactions: 78,
    rolledBackTransactions: 4,
  },
]

const demoLog = [
  { time: '12:45:30.123', event: 'Starting TCC flow: Order #ORD-2024-00123', type: 'info' },
  { time: '12:45:30.145', event: 'TRY phase initiated', type: 'info' },
  { time: '12:45:30.234', event: 'Inventory: Try - Reserving 5 units of SKU-12345', type: 'info' },
  {
    time: '12:45:30.456',
    event: 'Inventory: Success - Reservation ID: RES-88234',
    type: 'success',
  },
  { time: '12:45:30.567', event: 'Payment: Try - Authorizing $299.99', type: 'info' },
  { time: '12:45:31.012', event: 'Payment: Success - Auth ID: AUTH-55672', type: 'success' },
  { time: '12:45:31.123', event: 'Order: Try - Creating order in pending state', type: 'info' },
  { time: '12:45:31.234', event: 'Order: Success - Order ID: ORD-99281', type: 'success' },
  { time: '12:45:31.345', event: 'All participants in TRY phase - Confirming...', type: 'info' },
  { time: '12:45:31.456', event: 'Inventory: Confirm - Committing reservation', type: 'info' },
  { time: '12:45:31.567', event: 'Inventory: Success - Stock committed', type: 'success' },
  { time: '12:45:31.678', event: 'Payment: Confirm - Capturing authorized amount', type: 'info' },
  { time: '12:45:31.890', event: 'Payment: Success - Payment captured', type: 'success' },
  { time: '12:45:32.001', event: 'Order: Confirm - Activating order', type: 'info' },
  { time: '12:45:32.112', event: 'Order: Success - Order activated', type: 'success' },
  { time: '12:45:32.234', event: 'TCC flow completed successfully', type: 'success' },
]

const failureLog = [
  { time: '12:48:15.123', event: 'Starting TCC flow: Order #ORD-2024-00124', type: 'info' },
  { time: '12:48:15.145', event: 'TRY phase initiated', type: 'info' },
  { time: '12:48:15.234', event: 'Inventory: Try - Reserving 3 units of SKU-98765', type: 'info' },
  {
    time: '12:48:15.456',
    event: 'Inventory: Success - Reservation ID: RES-88235',
    type: 'success',
  },
  { time: '12:48:15.567', event: 'Payment: Try - Authorizing $149.99', type: 'info' },
  { time: '12:48:16.012', event: 'Payment: FAILED - Insufficient funds', type: 'error' },
  { time: '12:48:16.123', event: 'Payment try failed - Initiating COMPENSATION', type: 'warning' },
  { time: '12:48:16.234', event: 'Inventory: Cancel - Releasing reservation', type: 'info' },
  { time: '12:48:16.345', event: 'Inventory: Success - Stock released', type: 'success' },
  {
    time: '12:48:16.456',
    event: 'Compensation complete - All resources released',
    type: 'success',
  },
  { time: '12:48:16.567', event: 'TCC flow ROLLED BACK', type: 'error' },
  { time: '12:48:16.567', event: 'Reason: Payment declined (Insufficient funds)', type: 'error' },
]

// TCC Flow Card
function TCCFlowCard({ flow }: { flow: (typeof tccFlows)[0] }) {
  return (
    <div className="bg-charcoal border border-graphite p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-xs font-medium text-white">{flow.name}</h4>
          <p className="text-[10px] text-gray-600 mt-1">{flow.description}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="p-1 hover:bg-slate-dark">
            <Edit2 className="w-3 h-3 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-slate-dark">
            <Copy className="w-3 h-3 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-slate-dark">
            <Trash2 className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Participants */}
      <div className="flex items-center gap-1 mb-3">
        {flow.participants.map((participant, index) => (
          <div key={participant.name} className="flex items-center">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-dark">
              <span
                className={`w-1.5 h-1.5 ${participant.status === 'success' ? 'bg-emerald' : participant.status === 'pending' ? 'bg-gray-500' : 'bg-coral'}`}
              />
              <span className="text-[10px] text-gray-500">{participant.name}</span>
            </div>
            {index < flow.participants.length - 1 && (
              <ArrowRight className="w-3 h-3 text-gray-700 mx-0.5" />
            )}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-graphite/50">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] text-gray-600">Active</p>
            <p className="text-xs font-mono text-white">{flow.activeTransactions}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600">Completed</p>
            <p className="text-xs font-mono text-emerald">{flow.completedTransactions}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600">Rolled Back</p>
            <p className="text-xs font-mono text-coral">{flow.rolledBackTransactions}</p>
          </div>
        </div>
        <button className="flex items-center gap-1 px-2 py-1 bg-electric-cyan text-obsidian text-[10px] font-medium">
          <Play className="w-2.5 h-2.5" />
          Run
        </button>
      </div>
    </div>
  )
}

// Log Entry Component
function LogEntry({ entry }: { entry: (typeof demoLog)[0] }) {
  const typeConfig: Record<string, { color: string }> = {
    info: { color: 'text-gray-400' },
    success: { color: 'text-emerald' },
    error: { color: 'text-coral' },
    warning: { color: 'text-amber-warning' },
  }
  const { color } = typeConfig[entry.type] || typeConfig.info

  return (
    <div className="flex items-start gap-3 py-0.5">
      <span className="font-mono text-[10px] text-gray-600 w-20 flex-shrink-0">{entry.time}</span>
      <span className={`text-xs ${color}`}>{entry.event}</span>
    </div>
  )
}

// Demo Runner Component
function DemoRunner() {
  const [isRunning, setIsRunning] = useState(false)
  const [demoType, setDemoType] = useState<'success' | 'failure'>('success')
  const [logs, setLogs] = useState<typeof demoLog>([])
  const logContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isRunning) {
      setLogs([])
      const logData = demoType === 'success' ? demoLog : failureLog

      const interval = setInterval(() => {
        setLogs(prevLogs => {
          if (prevLogs.length < logData.length) {
            return [...prevLogs, logData[prevLogs.length]]
          } else {
            clearInterval(interval)
            return prevLogs
          }
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isRunning, demoType])

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="bg-charcoal border border-graphite">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-graphite">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          TCC Demo Runner
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => {
                setIsRunning(false)
                setDemoType('success')
                setLogs([])
              }}
              className={`px-2 py-1 text-[10px] ${demoType === 'success' ? 'bg-slate-dark text-electric-cyan' : 'text-gray-600'}`}
            >
              Success
            </button>
            <button
              onClick={() => {
                setIsRunning(false)
                setDemoType('failure')
                setLogs([])
              }}
              className={`px-2 py-1 text-[10px] ${demoType === 'failure' ? 'bg-slate-dark text-coral' : 'text-gray-600'}`}
            >
              Failure
            </button>
          </div>
          <button
            onClick={() => {
              setIsRunning(false)
              setLogs([])
            }}
            className="flex items-center gap-1 px-2 py-1 border border-graphite text-[10px] text-gray-500 hover:text-gray-400"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            Reset
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1 px-2 py-1 text-[10px] font-medium ${isRunning ? 'bg-coral text-white' : 'bg-electric-cyan text-obsidian'}`}
          >
            {isRunning ? (
              <>
                <Square className="w-2.5 h-2.5" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-2.5 h-2.5" />
                Start
              </>
            )}
          </button>
        </div>
      </div>

      {/* Logs */}
      <div ref={logContainerRef} className="h-64 overflow-y-auto p-3 font-mono">
        {logs.length === 0 ? (
          <p className="text-[10px] text-gray-600">Click "Start" to run simulation</p>
        ) : (
          logs.map((log, index) => <LogEntry key={index} entry={log} />)
        )}
      </div>

      {/* State Summary */}
      {logs.length > 0 && (
        <div className="px-4 py-2.5 border-t border-graphite bg-slate-dark/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-600 uppercase">Current State</p>
              <p
                className={`text-xs font-medium mt-0.5 ${demoType === 'success' ? 'text-emerald' : 'text-coral'}`}
              >
                {demoType === 'success' ? 'Transaction Completed' : 'Transaction Rolled Back'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-600 uppercase">Steps</p>
              <p className="text-xs font-mono text-white mt-0.5">
                {logs.length} / {demoType === 'success' ? demoLog.length : failureLog.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main TCC Simulation Page
function TCCSimulation() {
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight">TCC Simulation</h1>
          <p className="text-xs text-gray-600 mt-0.5">Try-Confirm-Cancel transaction pattern</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-electric-cyan text-obsidian text-xs font-medium">
          <Plus className="w-3 h-3" />
          New TCC Flow
        </button>
      </div>

      {/* TCC Overview */}
      <div className="bg-charcoal border border-graphite p-4">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          TCC Transaction Overview
        </h3>

        {/* Visual Flow */}
        <div className="flex items-center justify-center gap-4 py-4">
          {/* Try Phase */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-sm bg-emerald/10 border border-emerald flex items-center justify-center">
              <span className="text-emerald font-bold text-xs">TRY</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-2">Reserve</p>
          </div>

          <ArrowRight className="w-4 h-4 text-gray-700" />

          {/* Confirm Phase */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-sm bg-electric-cyan/10 border border-electric-cyan flex items-center justify-center">
              <span className="text-electric-cyan font-bold text-xs">CONFIRM</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-2">Commit</p>
          </div>

          <ArrowRight className="w-4 h-4 text-gray-700" />

          {/* Complete */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-sm bg-violet-accent/10 border border-violet-accent flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-violet-accent" />
            </div>
            <p className="text-[10px] text-gray-600 mt-2">Complete</p>
          </div>

          {/* Failure Arrow */}
          <div className="ml-4 flex flex-col items-center">
            <ArrowRight className="w-4 h-4 text-coral rotate-90" />
            <p className="text-[10px] text-coral mt-1">On Failure</p>
          </div>

          {/* Cancel */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-sm bg-coral/10 border border-coral flex items-center justify-center">
              <XCircle className="w-5 h-5 text-coral" />
            </div>
            <p className="text-[10px] text-gray-600 mt-1">CANCEL</p>
            <p className="text-[10px] text-coral">Compensate</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-12 pt-4 border-t border-graphite/50">
          <div className="text-center">
            <p className="text-lg font-mono font-medium text-white">5</p>
            <p className="text-[10px] text-gray-600">Active</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-mono font-medium text-emerald">234</p>
            <p className="text-[10px] text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-mono font-medium text-coral">12</p>
            <p className="text-[10px] text-gray-600">Rolled Back</p>
          </div>
        </div>
      </div>

      {/* TCC Flows */}
      <div>
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          TCC Flow Configurations
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-graphite">
          {tccFlows.map(flow => (
            <TCCFlowCard key={flow.id} flow={flow} />
          ))}
        </div>
      </div>

      {/* Demo Runner */}
      <DemoRunner />
    </div>
  )
}

export default TCCSimulation
