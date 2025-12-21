import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RNCard } from '@/components/RNCard';
import { RNInput } from '@/components/RNInput';
import { RNButton } from '@/components/RNButton';
import { RNAlert } from '@/components/RNAlert';
import { authService } from '@/services/auth';
import { Mail, Lock } from 'lucide-react';

// Extracted component to prevent re-renders losing focus
const LoginForm = ({ 
    email, setEmail, 
    password, setPassword, 
    loading, 
    error, onSubmit 
}: any) => (
    <form onSubmit={onSubmit} className="space-y-4 mt-6">
      <RNInput 
        label="Email" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        leftIcon={<Mail className="w-4 h-4" />}
        required
      />
      <RNInput 
        label="Password" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        showPasswordToggle
        leftIcon={<Lock className="w-4 h-4" />}
        required
      />
      
      {error && <RNAlert variant="error" title="Error">{error}</RNAlert>}

      <RNButton type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </RNButton>
    </form>
);

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const successMsg = searchParams.get('msg');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      
      // Auto-redirect based on role from backend
      if (response.user.role.toLowerCase() === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[var(--bg-app)] p-4">
      <RNCard className="w-full max-w-md" padding="xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)]">
            Welcome Back
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">Sign in to access your account</p>
        </div>

        {successMsg === 'setup_success' && (
            <RNAlert variant="success" className="mb-4">
                Your password has been set successfully. Please login.
            </RNAlert>
        )}

        <div className="animate-in fade-in zoom-in duration-300">
             <LoginForm 
                email={email} setEmail={setEmail}
                password={password} setPassword={setPassword}
                loading={loading} 
                error={error} onSubmit={handleLogin}
             />
        </div>
        
        <div className="mt-6 text-center text-sm text-[var(--text-secondary)] space-y-2">
           <RNButton variant="link" onClick={() => navigate('/forgot-password')}>
              Forgot Password?
           </RNButton>
           <div className="flex justify-center items-center gap-1">
             <span className="text-[var(--text-secondary)]">Don't have an account?</span>
             <RNButton variant="link" onClick={() => {}}>Sign up</RNButton>
           </div>
        </div>
      </RNCard>
    </div>
  );
}

export default Login;
