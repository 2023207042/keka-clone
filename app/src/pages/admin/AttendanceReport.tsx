import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RNCard } from '@/components/RNCard';
import { RNButton } from '@/components/RNButton';
import { RNTable } from '@/components/RNTable';
import { RNBadge } from '@/components/RNBadge';
import { RNDateRangePicker } from '@/components/RNDateRangePicker';
import { ArrowLeft, Download, Filter } from 'lucide-react';
import api from '@/services/api';

function AttendanceReport() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [dateRange, setDateRange] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
        const params: any = {};
        if (dateRange?.from) params.startDate = dateRange.from.toISOString();
        if (dateRange?.to) params.endDate = dateRange.to.toISOString();

        const res = await api.get('/attendance/all', { params });
        setLogs(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const downloadCSV = () => {
      if (!logs.length) return;

      const headers = ['User ID', 'Date', 'Clock In', 'Clock Out', 'Duration (m)', 'Status', 'Work From'];
      const csvContent = [
          headers.join(','),
          ...logs.map((row: any) => [
              row.userId,
              new Date(row.date).toLocaleDateString(),
              new Date(row.clockIn).toLocaleTimeString(),
              row.clockOut ? new Date(row.clockOut).toLocaleTimeString() : '-',
              row.duration || '-',
              row.status,
              row.workFrom
          ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
  };

  const columns = [
    { header: 'User ID', accessorKey: 'userId' },
    { header: 'Date', accessorKey: 'date', cell: (row: any) => new Date(row.date).toLocaleDateString() },
    { header: 'Clock In', accessorKey: 'clockIn', cell: (row: any) => new Date(row.clockIn).toLocaleTimeString() },
    { header: 'Clock Out', accessorKey: 'clockOut', cell: (row: any) => row.clockOut ? new Date(row.clockOut).toLocaleTimeString() : '-' },
    { header: 'Duration (m)', accessorKey: 'duration', cell: (row: any) => row.duration || '-' },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => (
        <RNBadge variant={row.status === 'Absent' ? 'destructive' : row.status === 'Half Day' ? 'warning' : 'success'}>
            {row.status}
        </RNBadge>
    )},
    { header: 'Work From', accessorKey: 'workFrom' }
  ];

  return (
    <div className="p-8 space-y-8">
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
          <div className="flex items-end gap-4">
              <div className="flex-1 max-w-sm">
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
