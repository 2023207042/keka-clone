import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RNCard } from '@/components/RNCard';
import { RNInput } from '@/components/RNInput';
import { RNButton } from '@/components/RNButton';
import { RNAlert } from '@/components/RNAlert';
import api from '@/services/api';

function SetupPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!token) {
        setMsg({ type: 'error', text: 'Invalid or missing invitation link.' });
    }
  }, [token]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== confirm) {
        setMsg({ type: 'error', text: 'Passwords do not match' });
        return;
    }
    
    setLoading(true);
    try {
        await api.post('/auth/setup-password', { token, password });
        // Success
        navigate('/login?msg=setup_success');
    } catch (err: any) {
        setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to set password' });
        setLoading(false);
    }
  };

  if (!token) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
              <RNCard className="max-w-md w-full text-center p-8">
                  <h1 className="text-xl font-bold text-red-600 mb-2">Invalid Link</h1>
                  <p className="text-gray-600">This invitation link appears to be invalid or expired.</p>
              </RNCard>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <RNCard className="max-w-md w-full p-8" title="Set Your Password">
          <p className="mb-6 text-gray-500 text-sm">Welcome to Keka Clone! Please set a secure password to activate your account.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
              <RNInput label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              <RNInput label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
              
              {msg.text && <RNAlert variant={msg.type as any}>{msg.text}</RNAlert>}
              
              <RNButton type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Activating Account...' : 'Set Password & Login'}
              </RNButton>
          </form>
      </RNCard>
    </div>
  );
}

export default SetupPassword;
