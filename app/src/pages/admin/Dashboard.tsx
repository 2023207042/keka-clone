import { RNCard } from '@/components/RNCard';
import { RNButton } from '@/components/RNButton';
import { authService } from '@/services/auth';

function AdminDashboard() {
  const user = authService.getCurrentUser();

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <RNButton variant="outline" onClick={authService.logout}>Logout</RNButton>
      </div>

      <RNCard>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Welcome Back, {user?.name || 'Admin'}!</h2>
          <p className="text-[var(--text-secondary)]">
            You have full access to manage users, settings, and system configurations.
          </p>
          {/* Add admin specific content here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] cursor-pointer hover:bg-[var(--color-surface-200)] transition-colors" onClick={() => window.location.href = '/admin/users'}>
                  <h3 className="font-bold text-lg mb-2 text-[var(--color-primary-600)]">User Management</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Add & Manage Employees</p>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] cursor-pointer hover:bg-[var(--color-surface-200)] transition-colors" onClick={() => window.location.href = '/admin/leaves'}>
                  <h3 className="font-bold text-lg mb-2 text-[var(--color-primary-600)]">Leave Approvals</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Approve or Reject Requests</p>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] cursor-pointer hover:bg-[var(--color-surface-200)] transition-colors" onClick={() => window.location.href = '/admin/attendance'}>
                  <h3 className="font-bold text-lg mb-2 text-[var(--color-primary-600)]">Attendance Report</h3>
                  <p className="text-sm text-[var(--text-secondary)]">View Employee Logs</p>
              </div>
          </div>
        </div>
      </RNCard>
    </div>
  );
}

export default AdminDashboard;
