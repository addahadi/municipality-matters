import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import "@/i18n";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import CitizenDashboard from "@/pages/citizen/CitizenDashboard";
import PropertiesPage from "@/pages/employee/PropertiesPage";
import CitizenPropertiesPage from "@/pages/citizen/CitizenPropertiesPage";
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
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/accounts" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/statistics" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/properties" element={<ProtectedRoute allowedRoles={['ADMIN']}><PropertiesPage /></ProtectedRoute>} />

            {/* Employee */}
            <Route path="/employee" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employee/properties" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><PropertiesPage /></ProtectedRoute>} />
            <Route path="/employee/auctions" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employee/invoices" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employee/requests" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employee/complaints" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employee/reviews" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employee/announcements" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employee/messages" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />

            {/* Citizen */}
            <Route path="/citizen" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenDashboard /></ProtectedRoute>} />
            <Route path="/citizen/properties" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenPropertiesPage /></ProtectedRoute>} />
            <Route path="/citizen/requests" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenDashboard /></ProtectedRoute>} />
            <Route path="/citizen/complaints" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenDashboard /></ProtectedRoute>} />
            <Route path="/citizen/reviews" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenDashboard /></ProtectedRoute>} />
            <Route path="/citizen/announcements" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenDashboard /></ProtectedRoute>} />
            <Route path="/citizen/invoices" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenDashboard /></ProtectedRoute>} />
            <Route path="/citizen/documents" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenDashboard /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
