import { useState } from 'react'
import {
  Shield,
  Edit2,
  Copy,
  Power,
  Trash2,
  Plus,
  ChevronRight,
  Bell,
  Lock,
  Activity,
} from 'lucide-react'

// Mock data for governance rules
const validationRules = [
  {
    id: 'rule-1',
    name: 'Required Field Validation',
    description: 'Ensures all required fields are present in the payload',
    type: 'schema',
    severity: 'critical',
    status: 'active',
    appliedTo: 'All integrations',
    lastTriggered: '2 min ago',
    triggerCount: 1247,
  },
  {
    id: 'rule-2',
    name: 'Email Format Validation',
    description: 'Validates email addresses match RFC 5322 standard',
    type: 'format',
    severity: 'warning',
    status: 'active',
    appliedTo: 'Customer Sync, Order Flow',
    lastTriggered: '15 min ago',
    triggerCount: 89,
  },
  {
    id: 'rule-3',
    name: 'Amount Range Validation',
    description: 'Validates transaction amounts are within acceptable range',
    type: 'range',
    severity: 'info',
    status: 'active',
    appliedTo: 'Payment Gateway, Order Sync',
    lastTriggered: '5 min ago',
    triggerCount: 456,
  },
  {
    id: 'rule-4',
    name: 'Duplicate Detection',
    description: 'Checks for duplicate transaction IDs within 24 hours',
    type: 'custom',
    severity: 'warning',
    status: 'active',
    appliedTo: 'Order Sync, Payment Gateway',
    lastTriggered: '1 hr ago',
    triggerCount: 23,
  },
  {
    id: 'rule-5',
    name: 'IP Address Validation',
    description: 'Validates IP addresses are from allowed ranges',
    type: 'format',
    severity: 'critical',
    status: 'inactive',
    appliedTo: 'Webhook Handler',
    lastTriggered: '3 days ago',
    triggerCount: 0,
  },
  {
    id: 'rule-6',
    name: 'Currency Code Validation',
    description: 'Validates currency codes are ISO 4217 compliant',
    type: 'format',
    severity: 'warning',
    status: 'active',
    appliedTo: 'Payment Gateway',
    lastTriggered: '30 min ago',
    triggerCount: 178,
  },
]

const transformationRules = [
  {
    id: 'trans-1',
    name: 'Date Format Converter',
    description: 'Converts date formats to ISO 8601',
    type: 'format',
    status: 'active',
    usageCount: 2341,
  },
  {
    id: 'trans-2',
    name: 'Phone Number Normalizer',
    description: 'Normalizes phone numbers to E.164 format',
    type: 'transform',
    status: 'active',
    usageCount: 1567,
  },
  {
    id: 'trans-3',
    name: 'Address Standardization',
    description: 'Standardizes address format',
    type: 'transform',
    status: 'active',
    usageCount: 892,
  },
]

const compliancePolicies = [
  {
    id: 'policy-1',
    name: 'GDPR Compliance',
    rulesCount: 12,
    status: 'active',
    lastAudit: 'Today 10:30 AM',
  },
  { id: 'policy-2', name: 'PCI DSS', rulesCount: 8, status: 'active', lastAudit: 'Yesterday' },
  {
    id: 'policy-3',
    name: 'SOX Controls',
    rulesCount: 15,
    status: 'active',
    lastAudit: 'Feb 24, 2026',
  },
  {
    id: 'policy-4',
    name: 'PII Protection',
    rulesCount: 6,
    status: 'warning',
    lastAudit: 'Feb 23, 2026',
  },
  {
    id: 'policy-5',
    name: 'Data Retention',
    rulesCount: 4,
    status: 'active',
    lastAudit: 'Feb 22, 2026',
  },
]

const alertConfigs = [
  {
    id: 'alert-1',
    name: 'High Error Rate Alert',
    condition: 'Error rate > 5% in 5 minutes',
    status: 'active',
    channels: ['Email', 'Slack'],
  },
  {
    id: 'alert-2',
    name: 'Integration Down Alert',
    condition: 'Integration unavailable > 2 minutes',
    status: 'active',
    channels: ['Email', 'SMS', 'Slack'],
  },
  {
    id: 'alert-3',
    name: 'High Latency Alert',
    condition: 'Average latency > 2 seconds',
    status: 'active',
    channels: ['Email'],
  },
  {
    id: 'alert-4',
    name: 'Review Queue Alert',
    condition: 'Pending reviews > 10',
    status: 'inactive',
    channels: ['Email'],
  },
]

type TabType = 'validation' | 'transformation' | 'compliance' | 'alerts'

// Severity badge
function SeverityBadge({ severity }: { severity: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    critical: { bg: 'bg-coral/10', text: 'text-coral', label: 'Critical' },
    warning: { bg: 'bg-amber-warning/10', text: 'text-amber-warning', label: 'Warning' },
    info: { bg: 'bg-steel-blue/10', text: 'text-steel-blue', label: 'Info' },
  }
  const { bg, text, label } = config[severity] || config.info
  return <span className={`inline-flex px-1.5 py-0.5 text-[10px] ${bg} ${text}`}>{label}</span>
}

// Status badge
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'bg-emerald/10', text: 'text-emerald', label: 'Active' },
    inactive: { bg: 'bg-gray-500/10', text: 'text-gray-500', label: 'Inactive' },
    warning: { bg: 'bg-amber-warning/10', text: 'text-amber-warning', label: 'Warning' },
  }
  const { bg, text, label } = config[status] || config.inactive
  return <span className={`inline-flex px-1.5 py-0.5 text-[10px] ${bg} ${text}`}>{label}</span>
}

// Validation Rule Card
function ValidationRuleCard({ rule }: { rule: (typeof validationRules)[0] }) {
  return (
    <div className="bg-charcoal border border-graphite p-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 flex items-center justify-center ${rule.severity === 'critical' ? 'bg-coral/10' : rule.severity === 'warning' ? 'bg-amber-warning/10' : 'bg-steel-blue/10'}`}
          >
            <Shield
              className={`w-3 h-3 ${rule.severity === 'critical' ? 'text-coral' : rule.severity === 'warning' ? 'text-amber-warning' : 'text-steel-blue'}`}
            />
          </div>
          <div>
            <h4 className="text-xs font-medium text-white">{rule.name}</h4>
            <p className="text-[10px] text-gray-600">
              {rule.type} • {rule.appliedTo}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <SeverityBadge severity={rule.severity} />
          <StatusBadge status={rule.status} />
        </div>
      </div>
      <p className="text-[10px] text-gray-500 mb-2">{rule.description}</p>
      <div className="flex items-center justify-between text-[10px] text-gray-600 pt-2 border-t border-graphite/50">
        <span>
          Triggered: {rule.lastTriggered} ({rule.triggerCount.toLocaleString()})
        </span>
      </div>
      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-graphite/30">
        <button className="p-1 hover:bg-slate-dark">
          <Edit2 className="w-3 h-3 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-slate-dark">
          <Copy className="w-3 h-3 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-slate-dark">
          <Power className="w-3 h-3 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-slate-dark ml-auto">
          <Trash2 className="w-3 h-3 text-coral" />
        </button>
      </div>
    </div>
  )
}

// Transformation Rule Card
function TransformationRuleCard({ rule }: { rule: (typeof transformationRules)[0] }) {
  return (
    <div className="bg-charcoal border border-graphite p-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center bg-violet-accent/10">
            <Activity className="w-3 h-3 text-violet-accent" />
          </div>
          <div>
            <h4 className="text-xs font-medium text-white">{rule.name}</h4>
            <p className="text-[10px] text-gray-600">{rule.type}</p>
          </div>
        </div>
        <StatusBadge status={rule.status} />
      </div>
      <p className="text-[10px] text-gray-500 mb-2">{rule.description}</p>
      <div className="flex items-center justify-between text-[10px] text-gray-600 pt-2 border-t border-graphite/50">
        <span>{rule.usageCount.toLocaleString()} uses</span>
      </div>
      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-graphite/30">
        <button className="p-1 hover:bg-slate-dark">
          <Edit2 className="w-3 h-3 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-slate-dark">
          <Copy className="w-3 h-3 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-slate-dark ml-auto">
          <Trash2 className="w-3 h-3 text-coral" />
        </button>
      </div>
    </div>
  )
}

// Compliance Policy Row
function CompliancePolicyRow({ policy }: { policy: (typeof compliancePolicies)[0] }) {
  return (
    <tr className="border-b border-graphite/30 hover:bg-slate-dark/30">
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 flex items-center justify-center ${policy.status === 'active' ? 'bg-emerald/10' : policy.status === 'warning' ? 'bg-amber-warning/10' : 'bg-gray-500/10'}`}
          >
            <Lock
              className={`w-3 h-3 ${policy.status === 'active' ? 'text-emerald' : policy.status === 'warning' ? 'text-amber-warning' : 'text-gray-500'}`}
            />
          </div>
          <span className="text-xs text-white">{policy.name}</span>
        </div>
      </td>
      <td className="px-3 py-2.5">
        <span className="text-xs text-gray-500">{policy.rulesCount} rules</span>
      </td>
      <td className="px-3 py-2.5">
        <StatusBadge status={policy.status} />
      </td>
      <td className="px-3 py-2.5">
        <span className="text-xs text-gray-600">{policy.lastAudit}</span>
      </td>
      <td className="px-3 py-2.5">
        <button className="p-1 hover:bg-slate-dark">
          <ChevronRight className="w-3 h-3 text-gray-600" />
        </button>
      </td>
    </tr>
  )
}

// Alert Config Row
function AlertConfigRow({ alert }: { alert: (typeof alertConfigs)[0] }) {
  return (
    <tr className="border-b border-graphite/30 hover:bg-slate-dark/30">
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 flex items-center justify-center ${alert.status === 'active' ? 'bg-coral/10' : 'bg-gray-500/10'}`}
          >
            <Bell
              className={`w-3 h-3 ${alert.status === 'active' ? 'text-coral' : 'text-gray-500'}`}
            />
          </div>
          <span className="text-xs text-white">{alert.name}</span>
        </div>
      </td>
      <td className="px-3 py-2.5">
        <span className="text-xs text-gray-500">{alert.condition}</span>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex gap-1">
          {alert.channels.map(channel => (
            <span key={channel} className="px-1.5 py-0.5 bg-slate-dark text-[10px] text-gray-500">
              {channel}
            </span>
          ))}
        </div>
      </td>
      <td className="px-3 py-2.5">
        <StatusBadge status={alert.status} />
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-slate-dark">
            <Edit2 className="w-3 h-3 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-slate-dark">
            <Power className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// Main Governance Rules Page
function GovernanceRules() {
  const [activeTab, setActiveTab] = useState<TabType>('validation')

  const tabs = [
    {
      id: 'validation' as const,
      label: 'Validation Rules',
      icon: Shield,
      count: validationRules.length,
    },
    {
      id: 'transformation' as const,
      label: 'Transformation Rules',
      icon: Activity,
      count: transformationRules.length,
    },
    {
      id: 'compliance' as const,
      label: 'Compliance Policies',
      icon: Lock,
      count: compliancePolicies.length,
    },
    { id: 'alerts' as const, label: 'Alerts', icon: Bell, count: alertConfigs.length },
  ]

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight">Governance Rules</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Validation, transformation, and compliance rules
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-electric-cyan text-obsidian text-xs font-medium">
          <Plus className="w-3 h-3" />
          New Rule
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-graphite">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-electric-cyan border-electric-cyan'
                  : 'text-gray-600 border-transparent hover:text-gray-400'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
              <span
                className={`px-1.5 py-0.5 ${activeTab === tab.id ? 'bg-electric-cyan/20 text-electric-cyan' : 'bg-slate-dark text-gray-600'}`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'validation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-graphite">
          {validationRules.map(rule => (
            <ValidationRuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      )}

      {activeTab === 'transformation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-graphite">
          {transformationRules.map(rule => (
            <TransformationRuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="bg-charcoal border border-graphite">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-dark">
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                  Policy
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                  Rules
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                  Last Audit
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite/30">
              {compliancePolicies.map(policy => (
                <CompliancePolicyRow key={policy.id} policy={policy} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="bg-charcoal border border-graphite">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-dark">
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                  Alert
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                  Condition
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                  Channels
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-600 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite/30">
              {alertConfigs.map(alert => (
                <AlertConfigRow key={alert.id} alert={alert} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default GovernanceRules
