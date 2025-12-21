import { useState, useEffect } from 'react';
import { RNCard } from '@/components/RNCard';
import { RNButton } from '@/components/RNButton';
import { authService } from '@/services/auth';
import { Clock, Calendar, LogOut, Coffee } from 'lucide-react';
import api from '@/services/api';
import { Link } from 'react-router-dom';

interface AttendanceStatus {
  clockIn: string | null;
  clockOut: string | null;
  duration: number | null;
  status: string;
}

function UserDashboard() {
  const user = authService.getCurrentUser();
  const [todayStatus, setTodayStatus] = useState<AttendanceStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodayStatus();
  }, []);

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
    setLoading(true);
    try {
      await api.post('/attendance/clock-in', { userId: user.id, workFrom: 'Office' });
      await fetchTodayStatus();
    } catch (error: any) {
      console.error("Clock in failed", error);
      alert(error.response?.data?.message || "Failed to clock in");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await api.post('/attendance/clock-out', { userId: user.id });
      await fetchTodayStatus();
    } catch (error: any) {
      console.error("Clock out failed", error);
      alert(error.response?.data?.message || "Failed to clock out");
    } finally {
      setLoading(false);
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

  if (!user) {
      return <div className="p-8 text-black">Loading User Data... Please Login again if this persists.</div>;
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
            User Dashboard
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">Good day, {user?.name || 'User'}!</p>
        </div>
        <RNButton variant="outline" onClick={authService.logout} leftIcon={<LogOut size={16}/>}>Logout</RNButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="md:col-span-2">
            <RNCard className="h-full border-blue-100 bg-blue-50/30">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Today's Attendance</h2>
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
                                <span>Duration: <span className="font-semibold text-gray-900">
                                    {(() => {
                                        if (!todayStatus) return '--';
                                        // Base duration from completed sessions
                                        let dur = todayStatus.duration || 0;
                                        
                                        // If currently clocked in, add running time
                                        if (todayStatus.clockIn && !todayStatus.clockOut) {
                                            // Calculate diff from LAST clock in? 
                                            // ERROR: The backend returns 'clockIn' as the FIRST clock in of the day.
                                            // We don't have the "Current Session Start" time if we only return First In.
                                            // However, for single session or simply showing "Total Duration", we might need to fetch `sessions` or just show static "Current".
                                            // But for "Live" timer, we ideally need the start of the CURRENT session.
                                            // Let's settle for showing the static duration + " (Running)" indicator or similar if I can't easily get exact ms.
                                            // Wait, user complained about "-".
                                            // If I show just `dur`, it will be 0 for the first session.
                                            // Let's assume the user wants to see elapsed time since *First* Clock In? No, that counts breaks.
                                            // Let's show `dur` formatted.
                                            return `${Math.floor(dur / 60)}h ${dur % 60}m` + (!todayStatus.clockOut ? ' + Running' : '');
                                        }
                                        return `${Math.floor(dur / 60)}h ${dur % 60}m`;
                                    })()}
                                </span></span>
                             </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        {!todayStatus || (todayStatus.clockOut && todayStatus.clockIn) ? (
                             <RNButton onClick={handleClockIn} disabled={loading} className="px-8 py-3 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] shadow-md hover:shadow-lg transition-all">
                                {loading ? 'Processing...' : 'Clock In'}
                            </RNButton>
                        ) : (
                            <RNButton onClick={handleClockOut} disabled={loading} variant="destructive" className="px-8 py-3 shadow-md hover:shadow-lg transition-all">
                                {loading ? 'Processing...' : 'Clock Out'}
                            </RNButton>
                        )}
                    </div>
                </div>
            </RNCard>
        </div>
        
         {/* Quick Actions */}
         <div className="grid gap-4">
             <Link to="/user/leave" className="block h-full">
                <RNCard className="h-full hover:shadow-md transition-shadow cursor-pointer border-orange-100 bg-orange-50/30 group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 rounded-full text-orange-600 group-hover:scale-110 transition-transform">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Leave Request</h3>
                            <p className="text-sm text-gray-500">Apply for leave or view balance</p>
                        </div>
                    </div>
                </RNCard>
             </Link>
             
              <Link to="/user/attendance" className="block h-full">
                <RNCard className="h-full hover:shadow-md transition-shadow cursor-pointer border-purple-100 bg-purple-50/30 group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600 group-hover:scale-110 transition-transform">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Attendance History</h3>
                            <p className="text-sm text-gray-500">View past logs</p>
                        </div>
                    </div>
                </RNCard>
             </Link>
         </div>
      </div>
    </div>
  );
}

export default UserDashboard;
