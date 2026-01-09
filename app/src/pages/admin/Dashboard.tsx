import { useEffect, useState } from 'react';
import { RNCard } from '@/components/RNCard';
import { RNTable } from '@/components/RNTable';
import { RNBadge } from '@/components/RNBadge';
import { Users, UserCheck, UserX, Clock, ArrowRight, Calendar, Coffee, MapPin, History } from 'lucide-react';
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

  // Attendance State
  const [todayStatus, setTodayStatus] = useState<{
    clockIn: string | null;
    clockOut: string | null;
    duration: number | null;
    status: string;
    lastClockIn?: string;
  } | null>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [liveDuration, setLiveDuration] = useState<string>('--');
  // Work From State
  const [workFrom, setWorkFrom] = useState<'Office' | 'Home'>('Office');

  useEffect(() => {
    fetchStats();
    fetchTodaySummary();
    fetchTodayStatus();
  }, []);

  // Update timer every second
  useEffect(() => {
    if (!todayStatus) return;

    const updateTimer = () => {
        // Assume duration is in minutes from API
        let totalSeconds = (todayStatus.duration || 0) * 60;

        // If currently running, add time since lastClockIn
        if (todayStatus.clockIn && !todayStatus.clockOut && todayStatus.lastClockIn) {
            const start = new Date(todayStatus.lastClockIn);
            const now = new Date();
            const diffMs = now.getTime() - start.getTime();
            const diffSeconds = Math.floor(diffMs / 1000);
            totalSeconds += diffSeconds;
        }

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        setLiveDuration(`${h}h ${m}m ${s}s` + (!todayStatus.clockOut && todayStatus.clockIn ? ' (Running)' : ''));
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000); // 1 second
    return () => clearInterval(interval);
  }, [todayStatus]);

  const fetchTodayStatus = async () => {
    if (!user) return;
    try {
      const { data } = await api.get(`/attendance/today?userId=${user.id}`);
      setTodayStatus(data);
    } catch (error) {
      console.error("Failed to fetch status", error);
    }
  };

  const handleClockIn = async () => {
    if (!user) return;
    setAttendanceLoading(true);
    try {
      await api.post('/attendance/clock-in', { userId: user.id, workFrom });
      await fetchTodayStatus();
    } catch (error: any) {
      console.error("Clock in failed", error);
      alert(error.response?.data?.message || "Failed to clock in");
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!user) return;
    setAttendanceLoading(true);
    try {
      await api.post('/attendance/clock-out', { userId: user.id });
      await fetchTodayStatus();
    } catch (error: any) {
      console.error("Clock out failed", error);
      alert(error.response?.data?.message || "Failed to clock out");
    } finally {
      setAttendanceLoading(false);
    }
  };

  const formatTime = (dateString?: string | null) => {
    if (!dateString) return '--:--';
    try {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        console.error("Date parsing error", e);
        return 'Invalid Date';
    }
  };

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

      {/* Admin Attendance Section */}
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">My Attendance</h2>
      <RNCard className="border-blue-100 bg-blue-50/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <div className="flex gap-8 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-green-600"/>
                        <span>In: <span className="font-semibold text-gray-900">{formatTime(todayStatus?.clockIn)}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-red-600"/>
                        <span>Out: <span className="font-semibold text-gray-900">{formatTime(todayStatus?.clockOut)}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coffee size={16} className="text-orange-600"/>
                        <span>Duration: <span className="font-semibold text-gray-900">{liveDuration}</span></span>
                      </div>
                </div>
            </div>
            
            <div className="flex flex-col gap-3">
                 <div className="flex gap-3 justify-end items-center">
                    { (!todayStatus?.clockIn || todayStatus?.clockOut) && (
                        <div className="bg-white rounded-lg p-1 border flex text-xs">
                            <button 
                                onClick={() => setWorkFrom('Office')}
                                className={`px-3 py-1 rounded-md transition-all ${workFrom === 'Office' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Office
                            </button>
                            <button 
                                onClick={() => setWorkFrom('Home')}
                                className={`px-3 py-1 rounded-md transition-all ${workFrom === 'Home' ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Home
                            </button>
                        </div>
                    )}
                 </div>

                <div className="flex gap-3">
                    <Link to="/user/attendance">
                        <RNButton variant="outline" className="h-full">
                            <History size={16} className="mr-2"/> History
                        </RNButton>
                    </Link>

                    {!todayStatus || (todayStatus.clockOut && todayStatus.clockIn) ? (
                        <RNButton onClick={handleClockIn} disabled={attendanceLoading} className="px-8 py-3 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] shadow-md hover:shadow-lg transition-all">
                            {attendanceLoading ? 'Processing...' : 'Clock In'}
                        </RNButton>
                    ) : (
                        <RNButton onClick={handleClockOut} disabled={attendanceLoading} variant="destructive" className="px-8 py-3 shadow-md hover:shadow-lg transition-all">
                            {attendanceLoading ? 'Processing...' : 'Clock Out'}
                        </RNButton>
                    )}
                </div>
            </div>
        </div>
      </RNCard>

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
