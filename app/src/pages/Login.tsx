import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [activeTab, setActiveTab] = useState<'employee' | 'admin'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend
    console.log('Login attempt:', { email, password, role: activeTab });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-white">
      {/* Left Side - Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 justify-center items-center relative overflow-hidden">
        <div className="z-10 text-center px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Keka Portal Clone</h1>
          <p className="text-indigo-100 text-xl">
            Seamless Attendance Management
          </p>
        </div>
        {/* Abstract shapes for visual interest */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
             <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay blur-xl"></div>
             <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              to your account
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              {/* Tabs */}
              <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('employee')}
                    className={`${
                      activeTab === 'employee'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-1`}
                  >
                    Employee
                  </button>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`${
                      activeTab === 'admin'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-1`}
                  >
                    Admin
                  </button>
                </nav>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign in as {activeTab === 'admin' ? 'Admin' : 'Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

