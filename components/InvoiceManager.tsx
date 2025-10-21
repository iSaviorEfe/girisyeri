import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { InvoiceForm } from './InvoiceForm';
import { InvoiceListView } from './InvoiceListView';
import { NameSetup } from './NameSetup';
import { useInvoices } from '../hooks/useInvoices';
import { FileText, Send, Clock, CheckCircle, BookOpen } from 'lucide-react';

export interface InvoiceItem {
  description: string;
  price: number;
  vat: number;
  total: number;
}

export interface Invoice {
  id: string;
  senderName: string;
  company: string;
  invoiceNo: string;
  date: string;
  invoiceDescription: string;
  additionalDescription: string;
  loadingCompany: string;
  loadingLocation: string;
  shippingCompany: string;
  shippingLocation: string;
  operator: string;
  salesRepresentative: string;
  supplier: string;
  // Invoice Details section amounts
  invoiceDetailsAmount: number;
  invoiceDetailsVat: number;
  invoiceDetailsTotal: number;
  // Line items
  items: InvoiceItem[];
  subtotal: number;
  vatTotal: number;
  total: number;
  licensePlate: string;
  contact: string;
  delivery: string;
  paymentDate: string;
  payment: string;
  // Payment Information section amounts
  paymentAmount: number;
  paymentVat: number;
  paymentTevrikat: number;
  paymentTotal: number;
  status: 'draft' | 'sent' | 'in_process' | 'completed' | 'logged';
  // Audit trail
  creator?: string;
  sender?: string;
  processor?: string;
  completer?: string;
  logger?: string;
  sentDate?: string;
  processDate?: string;
  completedDate?: string;
  approvedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface InvoiceManagerProps {
  senderName: string;
  onSaveName: (name: string) => void;
}

export function InvoiceManager({ senderName, onSaveName }: InvoiceManagerProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'sent' | 'in_process' | 'completed' | 'logs'>('create');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { invoices, loading, createInvoice, updateInvoice, deleteInvoice, refetch } = useInvoices();

  // Set up polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  if (!senderName) {
    return <NameSetup onSaveName={onSaveName} />;
  }

  const handleCreateInvoice = async (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingInvoice) {
      await updateInvoice(editingInvoice.id, invoiceData);
      setEditingInvoice(null);
    } else {
      // Add creator to the invoice data
      const invoiceWithCreator = {
        ...invoiceData,
        creator: senderName,
      };
      await createInvoice(invoiceWithCreator);
    }
    setActiveTab('create');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setActiveTab('create');
  };

  const handleCancelEdit = () => {
    setEditingInvoice(null);
  };

  const handleStatusChange = async (invoice: Invoice, newStatus: Invoice['status']) => {
    const updateData: any = { ...invoice, status: newStatus };
    
    // Add appropriate date and user tracking
    if (newStatus === 'sent' && !invoice.sentDate) {
      updateData.sentDate = new Date().toISOString();
      updateData.sender = senderName;
    } else if (newStatus === 'in_process' && !invoice.processDate) {
      updateData.processDate = new Date().toISOString();
      updateData.processor = senderName;
    } else if (newStatus === 'completed' && !invoice.completedDate) {
      updateData.completedDate = new Date().toISOString();
      updateData.completer = senderName;
    }
    
    await updateInvoice(invoice.id, updateData);
  };

  const handleApprove = async (invoice: Invoice) => {
    const updateData: any = { 
      ...invoice, 
      status: 'logged',
      approvedDate: new Date().toISOString(),
      logger: senderName,
    };
    
    await updateInvoice(invoice.id, updateData);
    setActiveTab('logs');
  };

  const draftInvoices = invoices.filter(inv => inv.status === 'draft');
  const sentInvoices = invoices.filter(inv => inv.status === 'sent');
  const inProcessInvoices = invoices.filter(inv => inv.status === 'in_process');
  const completedInvoices = invoices.filter(inv => inv.status === 'completed');
  const loggedInvoices = invoices.filter(inv => inv.status === 'logged');

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1>Invoice Management System</h1>
              <p className="text-muted-foreground">Sender: {senderName}</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={activeTab === 'create' ? 'default' : 'outline'}
              onClick={() => setActiveTab('create')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Invoice
              {draftInvoices.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {draftInvoices.length}
                </span>
              )}
            </Button>
            <Button
              variant={activeTab === 'sent' ? 'default' : 'outline'}
              onClick={() => setActiveTab('sent')}
            >
              <Send className="w-4 h-4 mr-2" />
              Sent Invoices
              {sentInvoices.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                  {sentInvoices.length}
                </span>
              )}
            </Button>
            <Button
              variant={activeTab === 'in_process' ? 'default' : 'outline'}
              onClick={() => setActiveTab('in_process')}
            >
              <Clock className="w-4 h-4 mr-2" />
              In Process
              {inProcessInvoices.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
                  {inProcessInvoices.length}
                </span>
              )}
            </Button>
            <Button
              variant={activeTab === 'completed' ? 'default' : 'outline'}
              onClick={() => setActiveTab('completed')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed
              {completedInvoices.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {completedInvoices.length}
                </span>
              )}
            </Button>
            <Button
              variant={activeTab === 'logs' ? 'default' : 'outline'}
              onClick={() => setActiveTab('logs')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Logs
              {loggedInvoices.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {loggedInvoices.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'create' && (
          <InvoiceForm
            onSubmit={handleCreateInvoice}
            editingInvoice={editingInvoice}
            onCancelEdit={handleCancelEdit}
            draftInvoices={draftInvoices}
            onEditDraft={handleEditInvoice}
            onDeleteDraft={deleteInvoice}
            onSendInvoice={(invoice) => handleStatusChange(invoice, 'sent')}
            senderName={senderName}
          />
        )}
        {activeTab === 'sent' && (
          <InvoiceListView
            invoices={sentInvoices}
            title="Gönderilen Faturalar (Sent Invoices)"
            onEdit={handleEditInvoice}
            onDelete={deleteInvoice}
            onStatusChange={handleStatusChange}
            allowedActions={['in_process', 'edit', 'delete']}
            loading={loading}
          />
        )}
        {activeTab === 'in_process' && (
          <InvoiceListView
            invoices={inProcessInvoices}
            title="Invoices In Process"
            onEdit={handleEditInvoice}
            onDelete={deleteInvoice}
            onStatusChange={handleStatusChange}
            allowedActions={['completed', 'edit', 'delete']}
            loading={loading}
          />
        )}
        {activeTab === 'completed' && (
          <InvoiceListView
            invoices={completedInvoices}
            title="Completed Invoices"
            onEdit={handleEditInvoice}
            onDelete={deleteInvoice}
            onStatusChange={handleStatusChange}
            onApprove={handleApprove}
            allowedActions={['approve', 'edit', 'delete']}
            loading={loading}
          />
        )}
        {activeTab === 'logs' && (
          <InvoiceListView
            invoices={loggedInvoices}
            title="Logs"
            onEdit={handleEditInvoice}
            onDelete={deleteInvoice}
            onStatusChange={handleStatusChange}
            allowedActions={[]}
            loading={loading}
            isLogsView={true}
          />
        )}
      </main>
    </div>
  );
}
