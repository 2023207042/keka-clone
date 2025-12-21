import { useState } from 'react';
import { RNCard } from '@/components/RNCard';
import { RNInput } from '@/components/RNInput';
import { RNButton } from '@/components/RNButton';
import { RNAlert } from '@/components/RNAlert';
import { Link } from 'react-router-dom';
import api from '@/services/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    
    try {
        await api.post('/auth/request-password-reset', { email });
        setMsg({ type: 'success', text: 'If an account exists with this email, you will receive a password reset link.' });
    } catch (err: any) {
        setMsg({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <RNCard className="max-w-md w-full p-8" title="Forgot Password">
          <p className="mb-6 text-gray-500 text-sm">Enter your email address and we will send you a link to reset your password.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
              <RNInput label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              
              {msg.text && <RNAlert variant={msg.type as any}>{msg.text}</RNAlert>}
              
              <RNButton type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
              </RNButton>

              <div className="text-center mt-4">
                  <Link to="/login" className="text-sm text-blue-600 hover:underline">Back to Login</Link>
              </div>
          </form>
      </RNCard>
    </div>
  );
}

export default ForgotPassword;
