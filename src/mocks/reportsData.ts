export interface MonthlyRevenue {
  month: string;
  revenue: number;
  invoicesCount: number;
}

export const mockMonthlyRevenue: MonthlyRevenue[] = [
  { month: "May 2026", revenue: 14500, invoicesCount: 4 },
  { month: "Jun 2026", revenue: 22000, invoicesCount: 6 },
  { month: "Jul 2026", revenue: 19500, invoicesCount: 5 },
  { month: "Aug 2026", revenue: 28000, invoicesCount: 8 },
  { month: "Sep 2026", revenue: 34000, invoicesCount: 9 },
  { month: "Oct 2026", revenue: 41200, invoicesCount: 11 },
];

export const mockKpis = {
  totalYTDRevenue: 159200,
  outstandingReceivables: 5700,
  averageDealSize: 14500,
  leadConversionRate: "68.5%",
};