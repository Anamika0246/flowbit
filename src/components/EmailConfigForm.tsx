'use client';

import { useState } from 'react';

interface EmailConfigFormProps {
  onConfigAdded: () => void;
}

export function EmailConfigForm({ onConfigAdded }: EmailConfigFormProps) {
  const [formData, setFormData] = useState({
    emailAddress: '',
    connectionType: 'IMAP',
    username: '',
    password: '',
    host: '',
    port: '',
    useSSL: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/email-ingestion/configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add configuration');
      }

      setFormData({
        emailAddress: '',
        connectionType: 'IMAP',
        username: '',
        password: '',
        host: '',
        port: '',
        useSSL: true
      });
      
      onConfigAdded();
    } catch (error) {
      console.error('Error adding config:', error);
      alert('Failed to add configuration');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email Address</label>
        <input
          type="email"
          value={formData.emailAddress}
          onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Connection Type</label>
        <select
          value={formData.connectionType}
          onChange={(e) => setFormData({ ...formData, connectionType: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="IMAP">IMAP</option>
          <option value="POP3">POP3</option>
          <option value="GMAIL_API">Gmail API</option>
          <option value="OUTLOOK_API">Outlook API</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password/Token</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Host</label>
        <input
          type="text"
          value={formData.host}
          onChange={(e) => setFormData({ ...formData, host: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Port</label>
        <input
          type="number"
          value={formData.port}
          onChange={(e) => setFormData({ ...formData, port: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.useSSL}
          onChange={(e) => setFormData({ ...formData, useSSL: e.target.checked })}
          className="mr-2"
        />
        <label className="text-sm font-medium">Use SSL</label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Add Configuration
      </button>
    </form>
  );
}
