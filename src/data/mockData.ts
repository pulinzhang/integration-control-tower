// Mock data for Integration Control Tower

export interface SystemStatus {
  status: 'operational' | 'degraded' | 'outage'
  message: string
  lastChecked: string
}

export interface MetricCard {
  id: string
  title: string
  value: number | string
  trend: number
  trendLabel: string
  trendDirection: 'up' | 'down'
}

export interface IntegrationHealth {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'error'
  uptime: number
  throughput: number
  successRate: number
}

export interface ActivityItem {
  id: string
  type: 'success' | 'warning' | 'error' | 'retry' | 'review'
  message: string
  timestamp: string
  traceId?: string
}

export interface ReviewItem {
  id: string
  transactionId: string
  riskScore: number
  reason: string
  submittedAt: string
  integrationName: string
}

export interface FlowStage {
  id: string
  name: string
  status: 'success' | 'warning' | 'error' | 'pending'
  metrics: {
    count: number
    avgDuration: number
    errorRate: number
  }
}

// System Status
export const systemStatus: SystemStatus = {
  status: 'operational',
  message: 'All Systems Operational',
  lastChecked: new Date().toISOString(),
}

// Metric Cards Data
export const metricsData: MetricCard[] = [
  {
    id: 'total-transactions',
    title: 'TOTAL MESSAGES',
    value: '12,847',
    trend: 12.5,
    trendLabel: 'vs last hour',
    trendDirection: 'up',
  },
  {
    id: 'active-integrations',
    title: 'ACTIVE FLOWS',
    value: '24',
    trend: 4.2,
    trendLabel: 'vs last hour',
    trendDirection: 'up',
  },
  {
    id: 'pending-reviews',
    title: 'PENDING REVIEWS',
    value: '7',
    trend: -2.1,
    trendLabel: 'vs last hour',
    trendDirection: 'down',
  },
  {
    id: 'failed-messages',
    title: 'FAILED MESSAGES',
    value: '12',
    trend: 0.8,
    trendLabel: 'vs last hour',
    trendDirection: 'up',
  },
]

// Integration Health Data
export const integrationsHealth: IntegrationHealth[] = [
  {
    id: 'order-sync',
    name: 'Order Sync',
    description: 'Shopify to SAP S/4HANA',
    status: 'active',
    uptime: 98.2,
    throughput: 1200,
    successRate: 99.2,
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    description: 'Salesforce Integration',
    status: 'active',
    uptime: 99.9,
    throughput: 850,
    successRate: 99.5,
  },
  {
    id: 'inventory-service',
    name: 'Inventory Service',
    description: 'ERP Synchronization',
    status: 'paused',
    uptime: 95.4,
    throughput: 2100,
    successRate: 97.8,
  },
  {
    id: 'payment-gateway',
    name: 'Payment Gateway',
    description: 'Payment Processing',
    status: 'active',
    uptime: 99.5,
    throughput: 450,
    successRate: 99.9,
  },
  {
    id: 'shipping-service',
    name: 'Shipping Service',
    description: 'Logistics Integration',
    status: 'active',
    uptime: 99.1,
    throughput: 320,
    successRate: 98.7,
  },
  {
    id: 'analytics-pipeline',
    name: 'Analytics Pipeline',
    description: 'Data Warehouse Sync',
    status: 'active',
    uptime: 97.8,
    throughput: 1500,
    successRate: 96.5,
  },
  {
    id: 'notification-service',
    name: 'Notification Service',
    description: 'Email & SMS Gateway',
    status: 'error',
    uptime: 0,
    throughput: 0,
    successRate: 0,
  },
  {
    id: 'webhook-handler',
    name: 'Webhook Handler',
    description: 'Inbound Webhooks',
    status: 'active',
    uptime: 99.9,
    throughput: 780,
    successRate: 99.8,
  },
]

// Recent Activity Data
export const recentActivity: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'success',
    message: 'Order #ORD-2024-00123 synced to ERP successfully',
    timestamp: '2024-01-15T12:45:32Z',
    traceId: 'trx-a8f2c9d',
  },
  {
    id: 'act-2',
    type: 'review',
    message: 'Transaction #TRX-8842 pending manual review',
    timestamp: '2024-01-15T12:44:18Z',
    traceId: 'trx-b7e1f8a',
  },
  {
    id: 'act-3',
    type: 'error',
    message: 'Payment #PMT-5521 failed validation - invalid amount',
    timestamp: '2024-01-15T12:43:05Z',
    traceId: 'trx-c3d5e2b',
  },
  {
    id: 'act-4',
    type: 'success',
    message: 'Customer #CUS-7782 created in CRM',
    timestamp: '2024-01-15T12:42:51Z',
    traceId: 'trx-d9f4a1c',
  },
  {
    id: 'act-5',
    type: 'retry',
    message: 'Inventory #INV-3321 retry attempt 2/3',
    timestamp: '2024-01-15T12:41:22Z',
    traceId: 'trx-e2a8b7f',
  },
  {
    id: 'act-6',
    type: 'success',
    message: 'Shipment #SHP-2210 confirmed with carrier',
    timestamp: '2024-01-15T12:40:15Z',
    traceId: 'trx-f3b9c8e',
  },
  {
    id: 'act-7',
    type: 'warning',
    message: 'High latency detected in Order Sync (>500ms)',
    timestamp: '2024-01-15T12:39:45Z',
    traceId: 'trx-g4c0d9f',
  },
  {
    id: 'act-8',
    type: 'success',
    message: 'Bulk sync completed - 450 records processed',
    timestamp: '2024-01-15T12:38:30Z',
    traceId: 'trx-h5d1e0a',
  },
]

// Manual Review Queue
export const reviewQueue: ReviewItem[] = [
  {
    id: 'rev-1',
    transactionId: 'TRX-8842',
    riskScore: 85,
    reason: 'High-value transaction exceeding threshold',
    submittedAt: '2024-01-15T12:30:00Z',
    integrationName: 'Payment Gateway',
  },
  {
    id: 'rev-2',
    transactionId: 'TRX-8839',
    riskScore: 72,
    reason: 'New customer - first transaction',
    submittedAt: '2024-01-15T12:28:15Z',
    integrationName: 'Customer Service',
  },
  {
    id: 'rev-3',
    transactionId: 'TRX-8827',
    riskScore: 68,
    reason: 'Unusual geographic location',
    submittedAt: '2024-01-15T12:25:30Z',
    integrationName: 'Order Sync',
  },
  {
    id: 'rev-4',
    transactionId: 'TRX-8815',
    riskScore: 55,
    reason: 'Duplicate detection flagged',
    submittedAt: '2024-01-15T12:20:45Z',
    integrationName: 'Order Sync',
  },
  {
    id: 'rev-5',
    transactionId: 'TRX-8802',
    riskScore: 45,
    reason: 'Validation warning - manual review recommended',
    submittedAt: '2024-01-15T12:15:00Z',
    integrationName: 'Inventory Service',
  },
  {
    id: 'rev-6',
    transactionId: 'TRX-8798',
    riskScore: 42,
    reason: 'Address validation warning',
    submittedAt: '2024-01-15T12:10:30Z',
    integrationName: 'Shipping Service',
  },
  {
    id: 'rev-7',
    transactionId: 'TRX-8785',
    riskScore: 38,
    reason: 'Payment method risk assessment',
    submittedAt: '2024-01-15T12:05:15Z',
    integrationName: 'Payment Gateway',
  },
]

// Flow Stages for Integration Flow Diagram
export const flowStages: FlowStage[] = [
  {
    id: 'stage-1',
    name: 'Source Ingestion',
    status: 'success',
    metrics: {
      count: 12847,
      avgDuration: 45,
      errorRate: 0.2,
    },
  },
  {
    id: 'stage-2',
    name: 'Validation',
    status: 'success',
    metrics: {
      count: 12822,
      avgDuration: 23,
      errorRate: 0.5,
    },
  },
  {
    id: 'stage-3',
    name: 'Transformation',
    status: 'success',
    metrics: {
      count: 12758,
      avgDuration: 156,
      errorRate: 0.3,
    },
  },
  {
    id: 'stage-4',
    name: 'Mapping',
    status: 'success',
    metrics: {
      count: 12720,
      avgDuration: 89,
      errorRate: 0.1,
    },
  },
  {
    id: 'stage-5',
    name: 'Target Delivery',
    status: 'warning',
    metrics: {
      count: 12682,
      avgDuration: 234,
      errorRate: 1.2,
    },
  },
  {
    id: 'stage-6',
    name: 'Acknowledgment',
    status: 'success',
    metrics: {
      count: 12835,
      avgDuration: 12,
      errorRate: 0.0,
    },
  },
]

// Chart Data - Hourly Transactions
export const hourlyTransactionData = [
  { time: '00:00', count: 245, success: 242, failed: 3 },
  { time: '01:00', count: 198, success: 196, failed: 2 },
  { time: '02:00', count: 156, success: 155, failed: 1 },
  { time: '03:00', count: 124, success: 123, failed: 1 },
  { time: '04:00', count: 98, success: 97, failed: 1 },
  { time: '05:00', count: 145, success: 143, failed: 2 },
  { time: '06:00', count: 312, success: 308, failed: 4 },
  { time: '07:00', count: 567, success: 559, failed: 8 },
  { time: '08:00', count: 892, success: 878, failed: 14 },
  { time: '09:00', count: 1124, success: 1105, failed: 19 },
  { time: '10:00', count: 1345, success: 1322, failed: 23 },
  { time: '11:00', count: 1456, success: 1431, failed: 25 },
  { time: '12:00', count: 1234, success: 1212, failed: 22 },
]

// Chart Data - Success Rate Trend
export const successRateData = [
  { time: '00:00', rate: 98.8 },
  { time: '01:00', rate: 99.0 },
  { time: '02:00', rate: 99.4 },
  { time: '03:00', rate: 99.2 },
  { time: '04:00', rate: 99.0 },
  { time: '05:00', rate: 98.6 },
  { time: '06:00', rate: 98.7 },
  { time: '07:00', rate: 98.6 },
  { time: '08:00', rate: 98.4 },
  { time: '09:00', rate: 98.3 },
  { time: '10:00', rate: 98.3 },
  { time: '11:00', rate: 98.3 },
  { time: '12:00', rate: 98.2 },
]
