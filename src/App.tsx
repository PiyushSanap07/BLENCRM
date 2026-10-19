import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { DashboardOverview } from './pages/DashboardOverview';
import { LeadsManagement } from './pages/LeadsManagement';
import { LeadDetails } from './pages/LeadDetails';
import { ClientsDirectory } from './pages/ClientsDirectory';
import { ClientDetails } from './pages/ClientDetails';
import { SalesPipeline } from './pages/SalesPipeline';
import { TasksActivities } from './pages/TasksActivities';
import { CalendarView } from './pages/CalendarView';
import { InvoicesList } from './pages/InvoicesList';
import { CreateInvoice } from './pages/CreateInvoice';
import { InvoiceDetails } from './pages/InvoiceDetails';
import { PaymentsLedger } from './pages/PaymentsLedger';
import { EstimatesList } from './pages/EstimatesList';
import { FinancialReports } from './pages/FinancialReports';
import { TeamManagement } from './pages/TeamManagement';
import { AdminSettings } from './pages/AdminSettings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="leads" element={<LeadsManagement />} />
          <Route path="leads/:id" element={<LeadDetails />} />
          <Route path="clients" element={<ClientsDirectory />} />
          <Route path="clients/:id" element={<ClientDetails />} />
          <Route path="pipeline" element={<SalesPipeline />} />
          <Route path="activities" element={<TasksActivities />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="invoices" element={<InvoicesList />} />
          <Route path="invoices/new" element={<CreateInvoice />} />
          <Route path="invoices/:id" element={<InvoiceDetails />} />
          <Route path="payments" element={<PaymentsLedger />} />
          <Route path="estimates" element={<EstimatesList />} />
          <Route path="reports" element={<FinancialReports />} />
          <Route path="team" element={<TeamManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
} 