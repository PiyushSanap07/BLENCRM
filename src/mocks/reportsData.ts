export interface MonthlyRevenue {
  month: string;
  revenue: number;
  invoicesCount: number;
}

export const mockMonthlyRevenue: MonthlyRevenue[] = [];

export const mockKpis = {
  totalYTDRevenue: 0,
  outstandingReceivables: 0,
  averageDealSize: 0,
  leadConversionRate: "0%",
};