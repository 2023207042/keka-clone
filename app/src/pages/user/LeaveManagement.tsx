import { useState, useEffect } from 'react';
import { RNCard } from '@/components/RNCard';
import { RNButton } from '@/components/RNButton';
import { RNSelect } from '@/components/RNSelect';
import { RNTextarea } from '@/components/RNTextarea';
import { RNAlert } from '@/components/RNAlert';
import { RNTable } from '@/components/RNTable';
import { RNBadge } from '@/components/RNBadge';
import { RNTabs } from '@/components/RNTabs';
import api from '@/services/api';
import { authService } from '@/services/auth';
import { RNDatePicker } from '@/components/RNDatePicker';

function LeaveManagementPage() {
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const user = authService.getCurrentUser();

  // Form States
  const [type, setType] = useState('Sick');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchLeaves();
    fetchBalances();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get(`/leave/my-leaves?userId=${user.id}`);
      setLeaves(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchBalances = async () => {
    try {
        const res = await api.get(`/leave/balances?userId=${user.id}`);
        setBalances(res.data);
    } catch (err) { console.error(err); }
  };

  const handleApply = async (e: any) => {
    e.preventDefault();
    if (!startDate || !endDate) {
        setMsg({ type: 'error', text: 'Please select start and end dates' });
        return;
    }

    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      await api.post('/leave/apply', {
        userId: user.id,
        type,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        reason
      });
      setMsg({ type: 'success', text: 'Leave applied successfully' });
      fetchLeaves();
      // Reset form
      setReason('');
      setStartDate(undefined); 
      setEndDate(undefined);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to apply' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Type', accessorKey: 'type' },
    { header: 'From', accessorKey: 'startDate' },
    { header: 'To', accessorKey: 'endDate' },
    { header: 'Reason', accessorKey: 'reason' },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => 
        <RNBadge variant={row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'destructive' : 'warning'}>
            {row.status}
        </RNBadge> 
    }
  ];

  const ApplyForm = () => (
    <form onSubmit={handleApply} className="space-y-4 max-w-lg">
       <RNSelect 
         label="Leave Type" 
         options={[{label: 'Sick Leave', value: 'Sick'}, {label: 'Casual Leave', value: 'Casual'}, {label: 'Earned Leave', value: 'Earned'}]}
         value={type}
         onChange={(e) => setType(e.target.value)}
       />
       <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Start Date</label>
            <RNDatePicker selected={startDate} onSelect={setStartDate} />
          </div>
          <div>
             <label className="text-sm font-medium mb-1 block">End Date</label>
             <RNDatePicker selected={endDate} onSelect={setEndDate} />
          </div>
       </div>
       <RNTextarea label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} required />
       
       {msg.text && <RNAlert variant={msg.type as any}>{msg.text}</RNAlert>}
       
       <RNButton type="submit" disabled={loading}>{loading ? 'Applying...' : 'Apply Leave'}</RNButton>
    </form>
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <RNButton variant="ghost" onClick={() => window.history.back()}>
            ← Back
        </RNButton>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
            Leave Management
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(balances).map(([key, val]) => (
            <RNCard key={key} className="text-center p-4">
                <h3 className="text-lg font-semibold text-[var(--text-secondary)]">{key}</h3>
                <p className="text-3xl font-bold text-[var(--color-primary-600)]">{val as number}</p>
            </RNCard>
        ))}
      </div>

       <RNCard>
         <RNTabs 
           tabs={[
             { id: 'apply', label: 'Apply Leave', content: <div className="pt-4"><ApplyForm/></div> },
             { id: 'history', label: 'My Leave History', content: <div className="pt-4"><RNTable data={leaves} columns={columns}/></div> }
           ]}
         />
       </RNCard>
    </div>
  );
}

export default LeaveManagementPage;
