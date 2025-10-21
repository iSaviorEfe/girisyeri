import { useState, useEffect } from 'react';
import { InvoiceManager } from './components/InvoiceManager';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [senderName, setSenderName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load sender name from localStorage on mount
    const savedName = localStorage.getItem('senderName');
    if (savedName) {
      setSenderName(savedName);
    }
    setIsLoading(false);
  }, []);

  const handleSaveName = (name: string) => {
    setSenderName(name);
    localStorage.setItem('senderName', name);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InvoiceManager senderName={senderName} onSaveName={handleSaveName} />
    </div>
  );
}
