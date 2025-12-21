import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RNCard } from '@/components/RNCard';
import { RNButton } from '@/components/RNButton';
import { RNInput } from '@/components/RNInput';
import { RNSelect } from '@/components/RNSelect';
import { RNAlert } from '@/components/RNAlert';
import { RNTable } from '@/components/RNTable';
import { RNBadge } from '@/components/RNBadge';
import { ArrowLeft, Edit } from 'lucide-react';
import api from '@/services/api';

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Employee');
  const [dept, setDept] = useState('');

  // Balance Modal
  const [editingBalanceUser, setEditingBalanceUser] = useState<any>(null);
  const [balances, setBalances] = useState({ sick: 10, casual: 10, earned: 15 });
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const res = await api.get('/users');
        setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    setInviteLink('');

    try {
        const res = await api.post('/users', {
            name, email, role, department: dept 
        });
        setMsg({ type: 'success', text: 'User invited successfully' });
        if (res.data.inviteLink) {
            setInviteLink(res.data.inviteLink);
        }
        fetchUsers();
        setName(''); setEmail(''); setDept('');
    } catch (err: any) {
        setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create user' });
    } finally {
        setLoading(false);
    }
  };

  const openBalanceModal = async (user: any) => {
      setEditingBalanceUser(user);
      setBalanceLoading(true);
      try {
          const res = await api.get('/leave/balances', { params: { userId: user.id } });
          // Note: API returns remaining balance, but for admin setting we want Total. 
          // For simplicity in this iteration, we will just default or fetch if we had a dedicated endpoint for totals.
          // Since our model has sickTotal/sickUsed, and getBalances returns (Total - Used), 
          // we surely need to update the UI to allow setting the TOTAL directly.
          // Let's assume defaults for now or 0 if unknown, since getBalances doesn't return totals.
          // Ideally getBalances should return structure like { sick: { total: 10, used: 0, remaining: 10 } }
          // But based on current simple implementation, we will just let admin set new Totals.
          setBalances({ sick: 10, casual: 10, earned: 15 }); 
      } catch (err) {
          console.error(err);
      } finally {
          setBalanceLoading(false);
      }
  };

  const saveBalance = async () => {
      if (!editingBalanceUser) return;
      try {
          await api.post('/leave/balance', {
              userId: editingBalanceUser.id,
              sickTotal: parseInt(balances.sick as any),
              casualTotal: parseInt(balances.casual as any),
              earnedTotal: parseInt(balances.earned as any)
          });
          setEditingBalanceUser(null);
          alert('Balances updated successfully');
      } catch (err) {
          alert('Failed to update balance');
      }
  };

  const copyLink = (link: string) => {
      navigator.clipboard.writeText(link);
      alert('Link copied to clipboard');
  };

  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => (
        <RNBadge variant={row.status === 'Active' ? 'success' : row.status === 'Invited' ? 'secondary' : 'default'}>
            {row.status}
        </RNBadge>
    )},
    { header: 'Role', accessorKey: 'role', cell: (row: any) => <RNBadge variant={row.role === 'Admin' ? 'destructive' : 'secondary'}>{row.role}</RNBadge> },
    { header: 'Actions', accessorKey: 'id', cell: (row: any) => (
        <div className="flex gap-2">
            {row.status === 'Invited' && row.inviteLink && (
                 <RNButton variant="ghost" className="h-8 text-xs text-blue-600" onClick={() => copyLink(row.inviteLink)}>
                    Copy Invite
                </RNButton>
            )}
            <RNButton variant="outline" className="h-8 text-xs" onClick={() => openBalanceModal(row)}>
                <Edit className="w-3 h-3 mr-1" /> Balance
            </RNButton>
        </div>
    )}
  ];

  return (
    <div className="p-8 space-y-8 relative">
       <div className="flex items-center gap-4">
           <RNButton variant="ghost" onClick={() => navigate('/admin/dashboard')}>
               <ArrowLeft className="w-5 h-5 mr-2" /> Back
           </RNButton>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
            User Management
           </h1>
       </div>

      <RNCard title="Add New Employee">
        <form onSubmit={handleCreate} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
                <RNInput label="Name" value={name} onChange={e => setName(e.target.value)} required />
                <RNInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <RNSelect label="Role" options={[{label:'Employee', value:'Employee'}, {label:'Admin', value:'Admin'}]} value={role} onChange={e => setRole(e.target.value)} />
                 <RNInput label="Department" value={dept} onChange={e => setDept(e.target.value)} />
            </div>
            
             {msg.text && <RNAlert variant={msg.type as any}>{msg.text}</RNAlert>}
             
             {inviteLink && (
                 <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                     <p className="text-sm text-green-800 font-medium mb-2">Invitation Link Generated:</p>
                     <div className="flex items-center gap-2">
                         <code className="flex-1 bg-white p-2 rounded border text-xs">{inviteLink}</code>
                         <RNButton size="xs" variant="outline" onClick={() => navigator.clipboard.writeText(inviteLink)} type="button">Copy</RNButton>
                     </div>
                 </div>
             )}
            
            <RNButton type="submit" disabled={loading}>{loading ? 'Sending Invitation...' : 'Invite User'}</RNButton>
        </form>
      </RNCard>

      <RNCard title="All Users">
         <RNTable data={users} columns={columns} />
      </RNCard>

      {/* Balance Modal */}
      {editingBalanceUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <RNCard className="w-full max-w-md bg-white">
                  <h2 className="text-xl font-bold mb-4">Manage Leave Balance: {editingBalanceUser.name}</h2>
                  <div className="space-y-4">
                      <RNInput label="Sick Leave Quota" type="number" value={balances.sick} onChange={e => setBalances({...balances, sick: e.target.value as any})} />
                      <RNInput label="Casual Leave Quota" type="number" value={balances.casual} onChange={e => setBalances({...balances, casual: e.target.value as any})} />
                      <RNInput label="Earned Leave Quota" type="number" value={balances.earned} onChange={e => setBalances({...balances, earned: e.target.value as any})} />
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                      <RNButton variant="ghost" onClick={() => setEditingBalanceUser(null)}>Cancel</RNButton>
                      <RNButton onClick={saveBalance}>Save Changes</RNButton>
                  </div>
              </RNCard>
          </div>
      )}
    </div>
  );
}

export default UserManagement;
