import { useEffect, useState } from 'react';
import { RNCard } from '@/components/RNCard';
import { RNTable } from '@/components/RNTable';
import { RNBadge } from '@/components/RNBadge';
import { Users, UserCheck, UserX, Clock, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { authService } from '@/services/auth';
import { RNButton } from '@/components/RNButton';

interface Stats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
}

function AdminDashboard() {
  const user = authService.getCurrentUser();
  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    onLeaveToday: 0
  });

  const [todaySummary, setTodaySummary] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchTodaySummary();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/attendance/stats');
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const fetchTodaySummary = async () => {
      try {
          const { data } = await api.get('/attendance/today-summary');
          setTodaySummary(data);
      } catch (error) {
          console.error("Failed to fetch today summary", error);
      }
  };

  const statCards = [
    {
      label: 'Total Employees',
      value: stats.totalEmployees,
      icon: <Users className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-50 border-blue-100',
    },
    {
      label: 'Present Today',
      value: stats.presentToday,
      icon: <UserCheck className="w-6 h-6 text-green-500" />,
      color: 'bg-green-50 border-green-100',
    },
    {
      label: 'Absent',
      value: stats.absentToday,
      icon: <UserX className="w-6 h-6 text-red-500" />,
      color: 'bg-red-50 border-red-100',
    },
    {
      label: 'On Leave',
      value: stats.onLeaveToday,
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      color: 'bg-orange-50 border-orange-100',
    },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
            Admin Dashboard
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">Welcome back, {user?.name || 'Admin'}!</p>
        </div>
        <RNButton variant="outline" onClick={authService.logout}>Logout</RNButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`p-6 rounded-2xl border ${stat.color} transition-all hover:shadow-md bg-white`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">{stat.icon}</div>
              <span className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</span>
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-[var(--text-primary)]">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/users" className="block group">
          <RNCard className="h-full hover:border-[var(--color-primary-300)] transition-colors group-hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary-600)]">User Management</h3>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Add, edit, or invite employees</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--color-primary-500)]" />
            </div>
          </RNCard>
        </Link>

        <Link to="/admin/leaves" className="block group">
          <RNCard className="h-full hover:border-[var(--color-primary-300)] transition-colors group-hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary-600)]">Leave Approvals</h3>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Review pending leave requests</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--color-primary-500)]" />
            </div>
          </RNCard>
        </Link>

        <Link to="/admin/reports" className="block group">
           <RNCard className="h-full hover:border-[var(--color-primary-300)] transition-colors group-hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary-600)]">Attendance Report</h3>
                <p className="text-[var(--text-secondary)] text-sm mt-1">View logs and export data</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--color-primary-500)]" />
            </div>
          </RNCard>
        </Link>

        <Link to="/admin/consolidated" className="block group">
           <RNCard className="h-full hover:border-[var(--color-primary-300)] transition-colors group-hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary-600)]">Consolidated Report</h3>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Monthly detailed view</p>
              </div>
              <Calendar className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--color-primary-500)]" />
            </div>
          </RNCard>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Today's Attendance Summary</h2>
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
           <RNTable 
              data={todaySummary}
              columns={[
                  { header: 'Employee', accessorKey: 'name', cell: (row: any) => (
                      <div>
                          <div className="font-medium text-gray-900">{row.name}</div>
                          <div className="text-xs text-gray-500">{row.email}</div>
                      </div>
                  )},
                  { header: 'Status', accessorKey: 'status', cell: (row: any) => {
                      let variant: any = 'default';
                      if (row.status.includes('Present')) variant = 'success';
                      else if (row.status === 'Absent' || row.status === 'Week Off') variant = 'destructive';
                      else if (row.status.includes('Leave')) variant = 'warning';
                      return <RNBadge variant={variant}>{row.status}</RNBadge>;
                  }},
                  { header: 'Clock In', accessorKey: 'clockIn', cell: (row: any) => <span className="text-xs font-mono">{row.clockIn}</span> },
                  { header: 'Clock Out', accessorKey: 'clockOut', cell: (row: any) => <span className="text-xs font-mono">{row.clockOut}</span> },
                  { header: 'Total Duration', accessorKey: 'duration', cell: (row: any) => <span className="font-medium">{row.duration}</span> },
              ]}
           />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
