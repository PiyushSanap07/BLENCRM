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
  { title: "Total Revenue", value: "$124,500.00", change: "+12.5%", isPositive: true, timeframe: "vs last month" },
  { title: "Active Clients", value: "48", change: "+4", isPositive: true, timeframe: "new this month" },
  { title: "Pending Invoices", value: "$18,200.00", change: "8 Overdue", isPositive: false, timeframe: "requires action" },
  { title: "Open Pipeline Value", value: "$85,400.00", change: "+18.2%", isPositive: true, timeframe: "across 14 deals" },
];

export const mockRecentActivities: ActivityItem[] = [
  { id: "1", user: "Sarah Jenkins", action: "paid invoice", target: "#INV-2026-089 ($4,500)", timestamp: "10 mins ago", type: "payment" },
  { id: "2", user: "Alex Rivera", action: "moved lead to Proposal", target: "Acme Corp Redesign", timestamp: "45 mins ago", type: "lead" },
  { id: "3", user: "System", action: "generated recurring invoice", target: "#INV-2026-090", timestamp: "2 hours ago", type: "invoice" },
  { id: "4", user: "Elena Rostova", action: "signed contract", target: "MSA - TechFlow Ltd", timestamp: "4 hours ago", type: "contract" },
];