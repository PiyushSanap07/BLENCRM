export interface MetricCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  timeframe: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'lead' | 'invoice' | 'payment' | 'contract';
}

export const mockMetrics: MetricCard[] = [
  { title: "Total Revenue", value: "₹0.00", change: "0%", isPositive: true, timeframe: "vs last month" },
  { title: "Active Clients", value: "0", change: "0", isPositive: true, timeframe: "new this month" },
  { title: "Pending Invoices", value: "₹0.00", change: "0", isPositive: true, timeframe: "requires action" },
  { title: "Open Pipeline Value", value: "₹0.00", change: "0%", isPositive: true, timeframe: "across 0 deals" },
];

export const mockRecentActivities: ActivityItem[] = [];