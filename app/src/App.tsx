import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import UserDashboard from '@/pages/user/Dashboard';
import AttendancePage from '@/pages/user/Attendance';
import LeaveManagementPage from '@/pages/user/LeaveManagement';
import UserManagement from '@/pages/admin/UserManagement';
import LeaveApprovals from '@/pages/admin/LeaveApprovals';
import AttendanceReport from '@/pages/admin/AttendanceReport';
import ConsolidatedAttendance from '@/pages/admin/ConsolidatedAttendance';
import SetupPassword from '@/pages/SetupPassword';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import { authService } from '@/services/auth';
import type { ReactNode } from 'react';

// Simple Auth Guard
const ProtectedRoute = ({ children, role }: { children: ReactNode, role?: 'admin' | 'employee' }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role?.toLowerCase() !== role.toLowerCase()) {
    // Redirect to their appropriate dashboard if they try to access a wrong role route
    return <Navigate to={user?.role?.toLowerCase() === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/setup-password" element={<SetupPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute role="admin">
              <UserManagement />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/leaves" 
          element={
            <ProtectedRoute role="admin">
              <LeaveApprovals />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin/approvals" element={<Navigate to="/admin/leaves" replace />} />
        
        <Route 
          path="/admin/attendance" 
          element={
            <ProtectedRoute role="admin">
              <AttendanceReport />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin/consolidated" element={<ConsolidatedAttendance />} />
        <Route path="/admin/reports" element={<Navigate to="/admin/attendance" replace />} />
        
        <Route 
          path="/user/dashboard" 
          element={
            <ProtectedRoute role="employee">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/user/attendance" 
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/user/leave" 
          element={
            <ProtectedRoute role="employee">
              <LeaveManagementPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all - 404 */}
        <Route path="*" element={<div className="p-8 text-center text-xl">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
