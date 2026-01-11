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
  lastClockIn?: string; // Added for live timer logic
}

function UserDashboard() {
  const user = authService.getCurrentUser();
  const [todayStatus, setTodayStatus] = useState<AttendanceStatus | null>(null);
  const [loading, setLoading] = useState(false);
  // Work From State
  const [workFrom, setWorkFrom] = useState<'Office' | 'Home'>('Office');
  // Real-time duration state
  const [liveDuration, setLiveDuration] = useState<string>('--');

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  // Update timer every minute
  useEffect(() => {
    if (!todayStatus) return;

    const updateTimer = () => {
        // Assume duration is in minutes from API (convert to seconds)
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
    setLoading(true);
    try {
      await api.post('/attendance/clock-in', { userId: user.id, workFrom });
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
        return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
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
             
              <Link to="/user/permissions" className="block h-full">
                <RNCard className="h-full hover:shadow-md transition-shadow cursor-pointer border-indigo-100 bg-indigo-50/30 group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Request Permission</h3>
                            <p className="text-sm text-gray-500">Late login / Early checkout</p>
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
