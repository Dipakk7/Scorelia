export type PerformanceStatusType = 'healthy' | 'warning' | 'critical' | 'offline'

export interface PerformanceMetricItem {
  id: string
  title: string
  value: string
  numericValue: number
  trend: string
  isPositive: boolean
  status: PerformanceStatusType
  iconName: 'Clock' | 'ShieldCheck' | 'AlertOctagon' | 'CheckCircle' | 'Cpu' | 'HardDrive' | 'Layers' | 'Database'
  description: string
  comparisonLabel: string
  sparklineData: number[]
  strokeColor: string
  iconBg: string
}

export interface ResponseTimeTrendPoint {
  date: string
  displayDate: string
  responseTime: number
  target: number
}

export interface TaskCompletionTrendPoint {
  date: string
  displayDate: string
  completed: number
  pending: number
  failed: number
}

export interface SystemHealthServiceItem {
  id: string
  name: string
  status: PerformanceStatusType
  value: string
  threshold: string
  lastUpdated: string
  iconName: string
}

export interface AnalyticsPerformanceData {
  metrics: PerformanceMetricItem[]
  responseTimeTrend: ResponseTimeTrendPoint[]
  taskCompletionTrend: TaskCompletionTrendPoint[]
  healthServices: SystemHealthServiceItem[]
}

export const analyticsPerformanceMockData: AnalyticsPerformanceData = {
  metrics: [
    {
      id: 'response_time',
      title: 'Avg. Response Time',
      value: '1.32s',
      numericValue: 1.32,
      trend: '↓ 12.5%',
      isPositive: true,
      status: 'healthy',
      iconName: 'Clock',
      description: 'Average latency across API endpoints',
      comparisonLabel: 'vs target 1.5s',
      sparklineData: [1.6, 1.52, 1.48, 1.41, 1.38, 1.35, 1.32],
      strokeColor: '#a855f7',
      iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    {
      id: 'uptime',
      title: 'Platform Uptime',
      value: '99.9%',
      numericValue: 99.9,
      trend: '↑ 0.1%',
      isPositive: true,
      status: 'healthy',
      iconName: 'ShieldCheck',
      description: 'System operational availability percentage',
      comparisonLabel: 'vs last 30 days',
      sparklineData: [99.7, 99.8, 99.8, 99.9, 99.9, 99.9, 99.9],
      strokeColor: '#10b981',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'error_rate',
      title: 'Error Rate',
      value: '0.12%',
      numericValue: 0.12,
      trend: '↓ 18.2%',
      isPositive: true,
      status: 'healthy',
      iconName: 'AlertOctagon',
      description: 'HTTP 5xx and 4xx exception ratio',
      comparisonLabel: 'vs target <0.5%',
      sparklineData: [0.22, 0.19, 0.18, 0.16, 0.14, 0.13, 0.12],
      strokeColor: '#38bdf8',
      iconBg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    },
    {
      id: 'api_success',
      title: 'API Success Rate',
      value: '99.6%',
      numericValue: 99.6,
      trend: '↑ 1.3%',
      isPositive: true,
      status: 'healthy',
      iconName: 'CheckCircle',
      description: 'Successful HTTP response ratio',
      comparisonLabel: 'vs last 30 days',
      sparklineData: [98.2, 98.6, 98.9, 99.1, 99.3, 99.5, 99.6],
      strokeColor: '#06b6d4',
      iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      id: 'cpu_usage',
      title: 'CPU Usage',
      value: '24%',
      numericValue: 24,
      trend: '↓ 4.1%',
      isPositive: true,
      status: 'healthy',
      iconName: 'Cpu',
      description: 'Average cluster CPU load',
      comparisonLabel: 'vs 80% threshold',
      sparklineData: [32, 29, 28, 26, 25, 25, 24],
      strokeColor: '#6366f1',
      iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    },
    {
      id: 'memory_usage',
      title: 'Memory Usage',
      value: '42%',
      numericValue: 42,
      trend: '↑ 1.8%',
      isPositive: true,
      status: 'healthy',
      iconName: 'HardDrive',
      description: 'Cluster RAM consumption ratio',
      comparisonLabel: 'vs 85% threshold',
      sparklineData: [38, 39, 40, 41, 41, 42, 42],
      strokeColor: '#ec4899',
      iconBg: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    },
    {
      id: 'queue_health',
      title: 'Queue Health',
      value: '99.8%',
      numericValue: 99.8,
      trend: '↑ 0.5%',
      isPositive: true,
      status: 'healthy',
      iconName: 'Layers',
      description: 'Message broker delivery success',
      comparisonLabel: 'vs 98% SLA',
      sparklineData: [99.2, 99.4, 99.5, 99.6, 99.7, 99.8, 99.8],
      strokeColor: '#14b8a6',
      iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    },
    {
      id: 'db_latency',
      title: 'Database Latency',
      value: '14ms',
      numericValue: 14,
      trend: '↓ 8.3%',
      isPositive: true,
      status: 'healthy',
      iconName: 'Database',
      description: 'Average SQL/NoSQL query roundtrip',
      comparisonLabel: 'vs target <30ms',
      sparklineData: [18, 17, 16, 15, 15, 14, 14],
      strokeColor: '#3b82f6',
      iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
  ],
  responseTimeTrend: [
    { date: '2025-05-11', displayDate: 'May 11', responseTime: 1.62, target: 1.5 },
    { date: '2025-05-12', displayDate: 'May 12', responseTime: 1.54, target: 1.5 },
    { date: '2025-05-13', displayDate: 'May 13', responseTime: 1.48, target: 1.5 },
    { date: '2025-05-14', displayDate: 'May 14', responseTime: 1.41, target: 1.5 },
    { date: '2025-05-15', displayDate: 'May 15', responseTime: 1.38, target: 1.5 },
    { date: '2025-05-16', displayDate: 'May 16', responseTime: 1.35, target: 1.5 },
    { date: '2025-05-17', displayDate: 'May 17', responseTime: 1.32, target: 1.5 },
  ],
  taskCompletionTrend: [
    { date: '2025-04-20', displayDate: 'Apr 20 – Apr 26', completed: 2150, pending: 450, failed: 85 },
    { date: '2025-04-27', displayDate: 'Apr 27 – May 3', completed: 2480, pending: 510, failed: 92 },
    { date: '2025-05-04', displayDate: 'May 4 – May 10', completed: 2980, pending: 620, failed: 110 },
    { date: '2025-05-11', displayDate: 'May 11 – May 17', completed: 3421, pending: 710, failed: 125 },
  ],
  healthServices: [
    { id: 'api_gateway', name: 'API Gateway', status: 'healthy', value: '18ms', threshold: '< 50ms', lastUpdated: '1m ago', iconName: 'Server' },
    { id: 'auth_service', name: 'Authentication', status: 'healthy', value: '24ms', threshold: '< 100ms', lastUpdated: '1m ago', iconName: 'Shield' },
    { id: 'database', name: 'Database Cluster', status: 'healthy', value: '14ms', threshold: '< 30ms', lastUpdated: '1m ago', iconName: 'Database' },
    { id: 'storage', name: 'Object Storage', status: 'healthy', value: '45ms', threshold: '< 150ms', lastUpdated: '2m ago', iconName: 'HardDrive' },
    { id: 'queue', name: 'Queue Service', status: 'healthy', value: '99.8%', threshold: '> 98%', lastUpdated: '1m ago', iconName: 'Layers' },
    { id: 'llm_service', name: 'LLM Orchestrator', status: 'warning', value: '1.42s', threshold: '< 1.5s', lastUpdated: '1m ago', iconName: 'Bot' },
  ],
}

export default analyticsPerformanceMockData
