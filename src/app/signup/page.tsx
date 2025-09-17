// app/test-signup/page.tsx
'use client';
import { useState } from 'react';

export default function TestSignup() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    const requestData = {
      name: formData.get('name'),
      email: formData.get('email'),
      mobileNumber: formData.get('mobileNumber'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    };
    
    console.log('Sending data:', requestData); // Debug log
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();
      setResult({ 
        status: response.status, 
        statusText: response.statusText,
        data,
        requestData // Show what was sent
      });
    } catch (error) {
      setResult({ 
        error: 'Network error: ' + (error as Error).message,
        requestData
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Signup API Test</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input 
            name="name" 
            placeholder="John Doe" 
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
          <small className="text-gray-500">2-50 characters</small>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            name="email" 
            type="email"
            placeholder="john@example.com" 
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
          <small className="text-gray-500">Valid email format</small>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Mobile Number</label>
          <input 
            name="mobileNumber" 
            placeholder="+1234567890" 
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
          <small className="text-gray-500">International format with + (e.g., +1234567890)</small>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            name="password" 
            type="password" 
            placeholder="SecurePass123!" 
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
          <small className="text-gray-500">8+ chars, uppercase, lowercase, number, special char</small>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input 
            name="confirmPassword" 
            type="password" 
            placeholder="SecurePass123!" 
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
          <small className="text-gray-500">Must match password exactly</small>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-3 rounded font-medium"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      
      {result && (
        <div className="bg-gray-50 border rounded-lg p-4">
          <h2 className="font-bold text-lg mb-2">API Response</h2>
          
          {result.status && (
            <p className={`mb-2 font-medium ${result.status >= 400 ? 'text-red-600' : 'text-green-600'}`}>
              <strong>Status:</strong> {result.status} {result.statusText}
            </p>
          )}
          
          {result.error && (
            <p className="text-red-600 mb-2"><strong>Error:</strong> {result.error}</p>
          )}
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Response Data:</h3>
            <pre className="bg-white p-3 border rounded text-sm overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Request Data Sent:</h3>
            <pre className="bg-white p-3 border rounded text-sm overflow-auto">
              {JSON.stringify(result.requestData, null, 2)}
            </pre>
          </div>
          
          {result.data?.errors && (
            <div className="mt-4">
              <h3 className="font-medium text-red-600 mb-2">Validation Errors:</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.data.errors.map((error: any, index: number) => (
                  <li key={index} className="text-red-600">
                    <strong>{error.path?.join('.')}:</strong> {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-medium text-blue-800 mb-2">Quick Test Values:</h3>
        <p className="text-sm text-blue-700">
          Use these values to test: Name: "John Doe", Email: "test@example.com", 
          Mobile: "+1234567890", Password: "SecurePass123!"
        </p>
      </div>
    </div>
  );
}