import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RNCard } from '@/components/RNCard';
import { RNButton } from '@/components/RNButton';
import { RNTable } from '@/components/RNTable';
import { RNBadge } from '@/components/RNBadge';
import { RNSelect } from '@/components/RNSelect';
import { ArrowLeft, Download, Filter } from 'lucide-react';
import api from '@/services/api';

function ConsolidatedAttendance() {
  const navigate = useNavigate();
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  
  // Filters
  const [userId, setUserId] = useState<string>('');
  const [month, setMonth] = useState<string>(String(new Date().getMonth() + 1));
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
      try {
          const res = await api.get('/users');
          const userOptions = res.data.map((u: any) => ({
              label: `${u.name} (${u.email})`,
              value: u.id.toString()
          }));
          setUsers(userOptions);
          // Auto-select first user if available
          if (userOptions.length > 0) setUserId(userOptions[0].value);
      } catch (err) { console.error(err); }
  };

  const fetchReport = async () => {
    if (!userId) return;
    setLoading(true);
    try {
        const res = await api.get('/attendance/consolidated', { 
            params: { userId, month, year } 
        });
        const data = res.data.filter((row: any) => !row.debug);
        setReport(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const downloadCSV = () => {
      if (!report.length) return;

      const headers = ['Date', 'Day', 'Status', 'In', 'Out', 'Duration'];
      const csvContent = [
          headers.join(','),
          ...report.map((row: any) => {
              // Format times for CSV
              let clockInFormatted = row.clockIn;
              let clockOutFormatted = row.clockOut;
              
              if (row.clockIn && row.clockIn !== '-') {
                  try {
                      clockInFormatted = new Date(row.clockIn).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                      });
                  } catch {
                      clockInFormatted = row.clockIn;
                  }
              }
              
              if (row.clockOut && row.clockOut !== '-') {
                  try {
                      clockOutFormatted = new Date(row.clockOut).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                      });
                  } catch {
                      clockOutFormatted = row.clockOut;
                  }
              }
              
              return [
                  row.date,
                  row.day,
                  row.status,
                  clockInFormatted,
                  clockOutFormatted,
                  row.duration
              ].join(',');
          })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consolidated_report_${userId}_${month}_${year}.csv`;
      a.click();
  };

  const columns = [
    { header: 'Date', accessorKey: 'date' },
    { header: 'Day', accessorKey: 'day' },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => {
        let variant: any = 'default';
        if (row.status.includes('Present')) variant = 'success';
        else if (row.status === 'Absent' || row.status === 'Not Clocked Out') variant = 'destructive';
        else if (row.status === 'Week Off') variant = 'secondary';
        else if (row.status.includes('Leave')) variant = 'warning';
        
        return <RNBadge variant={variant}>{row.status}</RNBadge>;
    }},
    { header: 'In', accessorKey: 'clockIn', cell: (row: any) => {
        if (!row.clockIn || row.clockIn === '-') return <span className="text-xs">-</span>;
        try {
            const time = new Date(row.clockIn).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            return <span className="text-xs">{time}</span>;
        } catch {
            return <span className="text-xs">{row.clockIn}</span>;
        }
    }},
    { header: 'Out', accessorKey: 'clockOut', cell: (row: any) => {
        if (!row.clockOut || row.clockOut === '-') return <span className="text-xs">-</span>;
        try {
            const time = new Date(row.clockOut).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            return <span className="text-xs">{time}</span>;
        } catch {
            return <span className="text-xs">{row.clockOut}</span>;
        }
    }},
    { header: 'Duration', accessorKey: 'duration', cell: (row: any) => <span className="font-medium">{row.duration}</span> },
  ];

  const months = [
      { label: 'January', value: '1' }, { label: 'February', value: '2' }, { label: 'March', value: '3' },
      { label: 'April', value: '4' }, { label: 'May', value: '5' }, { label: 'June', value: '6' },
      { label: 'July', value: '7' }, { label: 'August', value: '8' }, { label: 'September', value: '9' },
      { label: 'October', value: '10' }, { label: 'November', value: '11' }, { label: 'December', value: '12' }
  ];

  const currentYear = new Date().getFullYear();
  const years = [
      { label: (currentYear - 1).toString(), value: (currentYear - 1).toString() },
      { label: currentYear.toString(), value: currentYear.toString() },
      { label: (currentYear + 1).toString(), value: (currentYear + 1).toString() }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
       <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
               <RNButton variant="ghost" onClick={() => navigate('/admin/dashboard')}>
                   <ArrowLeft className="w-5 h-5 mr-2" /> Back
               </RNButton>
               <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
                Consolidated Report
               </h1>
           </div>
           <RNButton variant="outline" onClick={downloadCSV} disabled={!report.length}>
               <Download className="w-4 h-4 mr-2" /> Export CSV
           </RNButton>
       </div>

      <RNCard className="space-y-6">
          <div className="flex items-end gap-4 flex-wrap">
              <div className="min-w-[200px] flex-1">
                  <RNSelect 
                    label="Employee" 
                    options={users} 
                    value={userId} 
                    onChange={e => setUserId(e.target.value)} 
                  />
              </div>
              <div className="w-40">
                  <RNSelect label="Month" options={months} value={month} onChange={e => setMonth(e.target.value)} />
              </div>
              <div className="w-32">
                   <RNSelect label="Year" options={years} value={year} onChange={e => setYear(e.target.value)} />
              </div>

              <RNButton onClick={fetchReport} disabled={loading || !userId}>
                  <Filter className="w-4 h-4 mr-2" /> 
                  {loading ? 'Generating...' : 'Generate Report'}
              </RNButton>
          </div>

         <div className="border rounded-lg overflow-hidden">
            <RNTable data={report} columns={columns} />
         </div>
      </RNCard>
    </div>
  );
}

export default ConsolidatedAttendance;
