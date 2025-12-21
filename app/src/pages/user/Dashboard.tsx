import { RNCard } from '@/components/RNCard';
import { RNButton } from '@/components/RNButton';
import { authService } from '@/services/auth';

function UserDashboard() {
  const user = authService.getCurrentUser();

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
          User Dashboard
        </h1>
         <RNButton variant="outline" onClick={authService.logout}>Logout</RNButton>
      </div>

      <RNCard>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Hello, {user?.name || 'User'}!</h2>
          <p className="text-[var(--text-secondary)]">
            Welcome to your personal dashboard. Here you can view your profile and activities.
          </p>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] cursor-pointer hover:bg-[var(--color-surface-200)] transition-colors" onClick={() => window.location.href = '/user/attendance'}>
                  <h3 className="font-bold text-lg mb-2 text-[var(--color-primary-600)]">Attendance</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Clock In/Out & History</p>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] cursor-pointer hover:bg-[var(--color-surface-200)] transition-colors" onClick={() => window.location.href = '/user/leave'}>
                  <h3 className="font-bold text-lg mb-2 text-[var(--color-primary-600)]">Leave Management</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Apply & View Balance</p>
              </div>
          </div>
        </div>
      </RNCard>
    </div>
  );
}

export default UserDashboard;
