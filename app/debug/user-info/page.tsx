'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function UserInfoPage() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
      });
    }
  }, [user]);

  if (!isLoaded) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  if (!user) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Please sign in to view user info</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Clerk User Information</h1>
        
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Clerk User Data:</h2>
          <pre className="bg-black p-4 rounded text-sm overflow-auto">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>

        <div className="mt-8 bg-blue-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Next Steps:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Copy your Clerk User ID: <code className="bg-gray-800 px-2 py-1 rounded">{userData?.id}</code></li>
            <li>Copy your email: <code className="bg-gray-800 px-2 py-1 rounded">{userData?.email}</code></li>
            <li>We'll use this to update the Supabase records</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
