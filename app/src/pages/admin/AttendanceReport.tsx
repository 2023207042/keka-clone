import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RNCard } from '@/components/RNCard';
import { RNButton } from '@/components/RNButton';
import { RNTable } from '@/components/RNTable';
import { RNBadge } from '@/components/RNBadge';
import { RNDateRangePicker } from '@/components/RNDateRangePicker';
import { RNSelect } from '@/components/RNSelect';
import { ArrowLeft, Download, Filter } from 'lucide-react';
import api from '@/services/api';

function AttendanceReport() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [dateRange, setDateRange] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  const fetchUsers = async () => {
      try {
          const res = await api.get('/users');
          // Format for RNSelect
          const userOptions = res.data.map((u: any) => ({
              label: `${u.name} (${u.email})`,
              value: u.id.toString()
          }));
          setUsers([{ label: 'All Users', value: '' }, ...userOptions]);
      } catch (err) { console.error(err); }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
        const params: any = {};
        if (dateRange?.from) params.startDate = dateRange.from.toISOString();
        if (dateRange?.to) params.endDate = dateRange.to.toISOString();
        if (selectedUserId) params.userId = selectedUserId;

        const res = await api.get('/attendance/all', { params });
        setLogs(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Real-time update for running sessions
  useEffect(() => {
    const interval = setInterval(() => {
        setLogs(prevLogs => [...prevLogs]); // Force re-render to update timers
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (row: any) => {
      // Logic for "Not Clocked Out"
      const todayStr = new Date().toISOString().split('T')[0];
      const rowDateStr = new Date(row.date).toISOString().split('T')[0];
      
      // If it's a PAST date and clockOut is missing -> Not Clocked Out
      if (!row.clockOut && rowDateStr < todayStr) {
          return <span className="text-red-500 font-medium">Not Clocked Out</span>;
      }

      // If it's TODAY and clockOut is missing -> Running
      if (!row.clockOut && rowDateStr === todayStr) {
           const start = new Date(row.clockIn);
           const now = new Date();
           const diffMs = now.getTime() - start.getTime();
           const minutes = Math.floor(diffMs / 60000);
           const h = Math.floor(minutes / 60);
           const m = minutes % 60;
           return <span className="text-green-600 font-medium animate-pulse">{`${h}h ${m}m (Running)`}</span>;
      }

      const minutes = row.duration;
      if (!minutes) return '-';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
  };

  const downloadCSV = () => {
      if (!logs.length) return;

      const headers = ['User ID', 'Name', 'Email', 'Date', 'Clock In', 'Clock Out', 'Duration', 'Status', 'Work From'];
      const csvContent = [
          headers.join(','),
          ...logs.map((row: any) => {
               // CSV needs simple strings
               let durStr = '-';
                const todayStr = new Date().toISOString().split('T')[0];
                const rowDateStr = new Date(row.date).toISOString().split('T')[0];

               if (!row.clockOut && rowDateStr < todayStr) durStr = 'Not Clocked Out';
               else if (!row.clockOut && rowDateStr === todayStr) durStr = 'Running';
               else if (row.duration) durStr = `${Math.floor(row.duration / 60)}h ${row.duration % 60}m`;

              return [
                row.userId,
                `"${row.userName || ''}"`,
                `"${row.userEmail || ''}"`,
                new Date(row.date).toLocaleDateString(),
                new Date(row.clockIn).toLocaleTimeString(),
                row.clockOut ? new Date(row.clockOut).toLocaleTimeString() : '-',
                durStr,
                row.status,
                row.workFrom
            ].join(',')
          })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
  };

  const columns = [
    { header: 'Name', accessorKey: 'userName' },
    { header: 'Email', accessorKey: 'userEmail', cell: (row: any) => <span className="text-xs text-[var(--text-secondary)]">{row.userEmail}</span> },
    { header: 'Date', accessorKey: 'date', cell: (row: any) => new Date(row.date).toLocaleDateString() },
    { header: 'In', accessorKey: 'clockIn', cell: (row: any) => new Date(row.clockIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
    { header: 'Out', accessorKey: 'clockOut', cell: (row: any) => row.clockOut ? new Date(row.clockOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-' },
    { header: 'Duration', accessorKey: 'duration', cell: (row: any) => formatDuration(row) },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => (
        <RNBadge variant={row.status === 'Absent' ? 'destructive' : row.status === 'Half Day' ? 'warning' : 'success'}>
            {row.status}
        </RNBadge>
    )},
    { header: 'Work From', accessorKey: 'workFrom' }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
       <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
               <RNButton variant="ghost" onClick={() => navigate('/admin/dashboard')}>
                   <ArrowLeft className="w-5 h-5 mr-2" /> Back
               </RNButton>
               <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
                Attendance Report
               </h1>
           </div>
           <RNButton variant="outline" onClick={downloadCSV} disabled={!logs.length}>
               <Download className="w-4 h-4 mr-2" /> Export CSV
           </RNButton>
       </div>

      <RNCard className="space-y-6">
          <div className="flex items-end gap-4 flex-wrap">
              <div className="min-w-[200px]">
                  <RNSelect 
                    label="Filter by Employee" 
                    options={users} 
                    value={selectedUserId} 
                    onChange={e => setSelectedUserId(e.target.value)} 
                  />
              </div>
              
              <div className="min-w-[250px]">
                  <label className="text-sm font-medium mb-1 block text-[var(--text-secondary)]">Date Range</label>
                  <RNDateRangePicker 
                      selected={dateRange}
                      onSelect={setDateRange}
                  />
              </div>

              <RNButton onClick={fetchLogs} disabled={loading}>
                  <Filter className="w-4 h-4 mr-2" /> 
                  {loading ? 'Filtering...' : 'Apply Filters'}
              </RNButton>
          </div>

         <RNTable data={logs} columns={columns} />
      </RNCard>
    </div>
  );
}

export default AttendanceReport;
