import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { healthAPI } from '../api/endpoints';

export default function APITest() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await healthAPI.check();
        setApiStatus('connected');
        setResult(response);
        setError(null);
      } catch (err) {
        setApiStatus('disconnected');
        setError(err.message);
        setResult(null);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="bg-gradient-midnight min-h-screen text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-8">API Connection Test</h1>
        
        <div className={`p-6 rounded-lg mb-8 ${
          apiStatus === 'connected' 
            ? 'bg-green-900/20 border border-green-500' 
            : apiStatus === 'disconnected'
            ? 'bg-red-900/20 border border-red-500'
            : 'bg-blue-900/20 border border-blue-500'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${
              apiStatus === 'connected' 
                ? 'bg-green-500 animate-pulse' 
                : apiStatus === 'disconnected'
                ? 'bg-red-500'
                : 'bg-blue-500 animate-pulse'
            }`}></div>
            <span className="text-xl font-semibold">
              {apiStatus === 'connected' 
                ? 'Backend Connected ✓'
                : apiStatus === 'disconnected'
                ? 'Backend Disconnected ✗'
                : 'Testing Connection...'}
            </span>
          </div>

          {result && (
            <div className="mt-4 p-4 bg-black/30 rounded font-mono text-sm">
              <p className="text-green-400">{JSON.stringify(result)}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-black/30 rounded font-mono text-sm">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-secondary-900/50 p-8 rounded-lg border border-secondary-700">
          <h2 className="text-2xl font-bold mb-4">Available APIs</h2>
          <div className="space-y-2 font-mono text-sm">
            <p>✓ Authentication (Register/Login)</p>
            <p>✓ Financial Profile Management</p>
            <p>✓ FIRE Calculator</p>
            <p>✓ Money Health Score</p>
            <p>✓ Tax Optimization</p>
            <p>✓ Portfolio X-Ray</p>
            <p>✓ Life Event Advice</p>
            <p>✓ Couple's Money Planner</p>
          </div>
        </div>
      </div>
    </div>
  );
}
