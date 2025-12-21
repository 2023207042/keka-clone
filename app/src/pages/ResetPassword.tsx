import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RNCard } from '@/components/RNCard';
import { RNInput } from '@/components/RNInput';
import { RNButton } from '@/components/RNButton';
import { RNAlert } from '@/components/RNAlert';
import api from '@/services/api';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!token) {
        setMsg({ type: 'error', text: 'Invalid or missing reset link.' });
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
        await api.post('/auth/reset-password', { token, password });
        navigate('/login?msg=reset_success');
    } catch (err: any) {
        setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to reset password' });
        setLoading(false);
    }
  };

  if (!token) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
              <RNCard className="max-w-md w-full text-center p-8">
                  <h1 className="text-xl font-bold text-red-600 mb-2">Invalid Link</h1>
                  <p className="text-gray-600">This password reset link appears to be invalid or expired.</p>
              </RNCard>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <RNCard className="max-w-md w-full p-8" title="Reset Password">
          <p className="mb-6 text-gray-500 text-sm">Please set a new secure password for your account.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
              <RNInput label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              <RNInput label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
              
              {msg.text && <RNAlert variant={msg.type as any}>{msg.text}</RNAlert>}
              
              <RNButton type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
              </RNButton>
          </form>
      </RNCard>
    </div>
  );
}

export default ResetPassword;
