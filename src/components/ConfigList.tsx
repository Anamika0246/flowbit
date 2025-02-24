'use client';

interface Config {
  id: number;
  emailAddress: string;
  connectionType: string;
  active: boolean;
}

interface ConfigListProps {
  configs: Config[];
  onConfigUpdated: () => void;
}

export function ConfigList({ configs, onConfigUpdated }: ConfigListProps) {
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this configuration?')) {
      return;
    }

    try {
      const response = await fetch(`/api/email-ingestion/configs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete configuration');
      }

      onConfigUpdated();
    } catch (error) {
      console.error('Error deleting config:', error);
      alert('Failed to delete configuration');
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/email-ingestion/configs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !currentActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update configuration');
      }

      onConfigUpdated();
    } catch (error) {
      console.error('Error updating config:', error);
      alert('Failed to update configuration');
    }
  };

  const handleCheckInbox = async (id: number) => {
    try {
      const response = await fetch(`/api/email-ingestion/check-inbox/${id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to check inbox');
      }

      alert('Inbox check completed successfully');
    } catch (error) {
      console.error('Error checking inbox:', error);
      alert('Failed to check inbox');
    }
  };

  return (
    <div className="space-y-4">
      {configs.map((config) => (
        <div key={config.id} className="border p-4 rounded">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{config.emailAddress}</h3>
              <p className="text-sm text-gray-600">{config.connectionType}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleCheckInbox(config.id)}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                Check Inbox
              </button>
              <button
                onClick={() => handleToggleActive(config.id, config.active)}
                className={`${
                  config.active ? 'bg-yellow-500' : 'bg-blue-500'
                } text-white px-3 py-1 rounded text-sm hover:opacity-80`}
              >
                {config.active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleDelete(config.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      {configs.length === 0 && (
        <p className="text-gray-500">No configurations found</p>
      )}
    </div>
  );
}
