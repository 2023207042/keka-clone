import { useState, useEffect } from 'react';
import { RNCard } from '@/components/RNCard';
import { RNButton } from '@/components/RNButton';
import { RNTable } from '@/components/RNTable';
import { RNAlert } from '@/components/RNAlert';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function LeaveApprovals() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
        const res = await api.get('/leave/pending');
        setLeaves(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAction = async (id: number, status: 'Approved' | 'Rejected') => {
    try {
        await api.post(`/leave/${id}/status`, { status });
        setMsg({ type: 'success', text: `Leave ${status} successfully` });
        fetchPending();
    } catch (err: any) {
        setMsg({ type: 'error', text: 'Action failed' });
    }
  };

  const columns = [
    { header: 'User ID', accessorKey: 'userId' },
    { header: 'Type', accessorKey: 'type' },
    { header: 'From', accessorKey: 'startDate' },
    { header: 'To', accessorKey: 'endDate' },
    { header: 'Reason', accessorKey: 'reason' },
    { header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
        <div className="flex gap-2">
            <RNButton size="xs" variant="solid" className="bg-green-600 hover:bg-green-700" onClick={() => handleAction(row.id, 'Approved')}>Approve</RNButton>
            <RNButton size="xs" variant="destructive" onClick={() => handleAction(row.id, 'Rejected')}>Reject</RNButton>
        </div>
    )}
  ];

  return (
    <div className="p-8 space-y-8">
       <div className="flex items-center gap-4">
           <RNButton variant="ghost" onClick={() => navigate('/admin/dashboard')}>
               <ArrowLeft className="w-5 h-5 mr-2" /> Back
           </RNButton>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
            Leave Approvals
           </h1>
       </div>
    
       {msg.text && <RNAlert variant={msg.type as any}>{msg.text}</RNAlert>}

      <RNCard title="Pending Applications">
         {leaves.length === 0 ? <p className="p-4 text-gray-500">No pending applications.</p> : <RNTable data={leaves} columns={columns} />}
      </RNCard>
    </div>
  );
}

export default LeaveApprovals;
