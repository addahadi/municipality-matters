import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import "@/i18n";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AccountsPage from "@/pages/admin/AccountsPage";
import StatisticsPage from "@/pages/admin/StatisticsPage";
import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import PropertiesPage from "@/pages/employee/PropertiesPage";
import AuctionsPage from "@/pages/employee/AuctionsPage";
import InvoicesPage from "@/pages/employee/InvoicesPage";
import RequestsPage from "@/pages/employee/RequestsPage";
import ComplaintsPage from "@/pages/employee/ComplaintsPage";
import ReviewsPage from "@/pages/employee/ReviewsPage";
import AnnouncementsPage from "@/pages/employee/AnnouncementsPage";
import MessagesPage from "@/pages/employee/MessagesPage";
import CitizenDashboard from "@/pages/citizen/CitizenDashboard";
import CitizenPropertiesPage from "@/pages/citizen/CitizenPropertiesPage";
import CitizenRequestsPage from "@/pages/citizen/CitizenRequestsPage";
import CitizenComplaintsPage from "@/pages/citizen/CitizenComplaintsPage";
import CitizenReviewsPage from "@/pages/citizen/CitizenReviewsPage";
import CitizenAnnouncementsPage from "@/pages/citizen/CitizenAnnouncementsPage";
import CitizenInvoicesPage from "@/pages/citizen/CitizenInvoicesPage";
import CitizenDocumentsPage from "@/pages/citizen/CitizenDocumentsPage";
import CitizenAuctionsPage from "@/pages/citizen/CitizenAuctionsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard />}/>
            <Route path="/admin/accounts" element={<ProtectedRoute allowedRoles={['ADMIN']}><AccountsPage /></ProtectedRoute>} />
            <Route path="/admin/statistics" element={<ProtectedRoute allowedRoles={['ADMIN']}><StatisticsPage /></ProtectedRoute>} />
            <Route path="/admin/properties" element={<ProtectedRoute allowedRoles={['ADMIN']}><PropertiesPage /></ProtectedRoute>} />

            {/* Employee */}
            <Route path="/employee" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employee/properties" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><PropertiesPage /></ProtectedRoute>} />
            <Route path="/employee/auctions" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><AuctionsPage /></ProtectedRoute>} />
            <Route path="/employee/invoices" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><InvoicesPage /></ProtectedRoute>} />
            <Route path="/employee/requests" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><RequestsPage /></ProtectedRoute>} />
            <Route path="/employee/complaints" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><ComplaintsPage /></ProtectedRoute>} />
            <Route path="/employee/reviews" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><ReviewsPage /></ProtectedRoute>} />
            <Route path="/employee/announcements" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><AnnouncementsPage /></ProtectedRoute>} />
            <Route path="/employee/messages" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><MessagesPage /></ProtectedRoute>} />

            {/* Citizen */}
            <Route path="/citizen" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenDashboard /></ProtectedRoute>} />
            <Route path="/citizen/properties" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenPropertiesPage /></ProtectedRoute>} />
            <Route path="/citizen/auctions" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenAuctionsPage /></ProtectedRoute>} />
            <Route path="/citizen/requests" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenRequestsPage /></ProtectedRoute>} />
            <Route path="/citizen/complaints" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenComplaintsPage /></ProtectedRoute>} />
            <Route path="/citizen/reviews" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenReviewsPage /></ProtectedRoute>} />
            <Route path="/citizen/announcements" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenAnnouncementsPage /></ProtectedRoute>} />
            <Route path="/citizen/invoices" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenInvoicesPage /></ProtectedRoute>} />
            <Route path="/citizen/documents" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenDocumentsPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
