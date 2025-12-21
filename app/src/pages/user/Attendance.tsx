import { useState, useEffect } from 'react';
import { RNCard } from '@/components/RNCard';
import { RNButton } from '@/components/RNButton';
import { RNAlert } from '@/components/RNAlert';
import { RNTable } from '@/components/RNTable';
import { RNBadge } from '@/components/RNBadge';
import { Clock, MapPin } from 'lucide-react';
import api from '@/services/api';
import { authService } from '@/services/auth';

function AttendancePage() {
  const [status, setStatus] = useState<'Clocked In' | 'Clocked Out'>('Clocked Out');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchTodayStatus();
    fetchHistory();
  }, []);

  const fetchTodayStatus = async () => {
    try {
      const res = await api.get(`/attendance/today?userId=${user.id}`);
      if (res.data && !res.data.clockOut) {
        setStatus('Clocked In');
      } else {
        setStatus('Clocked Out');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/attendance/history?userId=${user.id}`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClockAction = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (status === 'Clocked Out') {
        await api.post('/attendance/clock-in', { userId: user.id, workFrom: 'Office' }); // Default to Office
        setStatus('Clocked In');
        setSuccess('Successfully clocked in!');
      } else {
        await api.post('/attendance/clock-out', { userId: user.id });
        setStatus('Clocked Out');
        setSuccess('Successfully clocked out!');
      }
      fetchHistory();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Date', accessorKey: 'date' },
    { header: 'Clock In', accessorKey: 'clockIn', cell: (row: any) => row.clockIn ? new Date(row.clockIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-' },
    { header: 'Clock Out', accessorKey: 'clockOut', cell: (row: any) => row.clockOut ? new Date(row.clockOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-' },
    { header: 'Duration (m)', accessorKey: 'duration', cell: (row: any) => row.duration !== undefined ? `${Math.floor(row.duration / 60)}h ${row.duration % 60}m` : '-' },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => <RNBadge variant={row.status === 'Present' ? 'success' : row.status === 'Absent' ? 'destructive' : 'warning'}>{row.status}</RNBadge> }
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
        Attendance
      </h1>

      {error && <RNAlert variant="error" title="Error" dismissible>{error}</RNAlert>}
      {success && <RNAlert variant="success" title="Success" dismissible>{success}</RNAlert>}

      <RNCard className="flex flex-col items-center justify-center p-12 space-y-6">
         <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Current Status: <span className={status === 'Clocked In' ? 'text-green-600' : 'text-gray-500'}>{status}</span></h2>
            <p className="text-[var(--text-secondary)]">{new Date().toLocaleDateString()}</p>
         </div>

         <RNButton 
           size="lg" 
           variant={status === 'Clocked Out' ? 'solid' : 'destructive'}
           onClick={handleClockAction}
           disabled={loading}
           className="h-32 w-32 rounded-full text-lg shadow-lg"
         >
            {loading ? '...' : status === 'Clocked Out' ? 'Clock In' : 'Clock Out'}
         </RNButton>

         <div className="flex gap-2 text-sm text-[var(--text-secondary)]">
            <span className="flex items-center gap-1"><MapPin size={14}/> Office</span>
            <span className="flex items-center gap-1"><Clock size={14}/> 09:00 AM - 06:00 PM</span>
         </div>
      </RNCard>

      <RNCard title="Attendance History">
         <RNTable data={history} columns={columns} />
      </RNCard>
    </div>
  );
}

export default AttendancePage;
