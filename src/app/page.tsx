'use client';

import { useState, useEffect } from 'react';
// import { EmailConfigForm } from '@/components/EmailConfigForm';
// import { ConfigList } from '@/components/ConfigList';
import { EmailConfigForm } from '../components/EmailConfigForm';
import { ConfigList } from '../components/ConfigList';
export default function Home() {
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/email-ingestion/configs');
      const data = await response.json();
      setConfigs(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching configs:', error);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Email PDF Ingestion</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New Configuration</h2>
          <EmailConfigForm onConfigAdded={fetchConfigs} />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Existing Configurations</h2>
          {isLoading ? (
            <p>Loading configurations...</p>
          ) : (
            <ConfigList configs={configs} onConfigUpdated={fetchConfigs} />
          )}
        </div>
      </div>
    </main>
  );
}
