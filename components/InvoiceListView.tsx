import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Invoice } from './InvoiceManager';
import { Edit, Trash2, Send, Clock, CheckCircle, FileText, Eye, Check } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { InvoiceDetailModal } from './InvoiceDetailModal';
import { Badge } from './ui/badge';

interface InvoiceListViewProps {
  invoices: Invoice[];
  title: string;
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onStatusChange: (invoice: Invoice, status: Invoice['status']) => void;
  onApprove?: (invoice: Invoice) => void;
  allowedActions: ('edit' | 'delete' | 'in_process' | 'completed' | 'approve')[];
  loading?: boolean;
  isLogsView?: boolean;
}

export function InvoiceListView({
  invoices,
  title,
  onEdit,
  onDelete,
  onStatusChange,
  onApprove,
  allowedActions,
  loading,
  isLogsView = false
}: InvoiceListViewProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSender, setFilterSender] = useState<string>('all');

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500">🟢 Sent</Badge>;
      case 'in_process':
        return <Badge className="bg-orange-500">🟠 In Process</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">🔵 Completed</Badge>;
      case 'logged':
        return <Badge className="bg-gray-500">📚 Logged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get unique senders for filter
  const uniqueSenders = Array.from(new Set(invoices.map(inv => inv.senderName).filter(Boolean)));

  // Filter and search invoices
  const filteredInvoices = invoices.filter(invoice => {
    // Filter by sender
    if (filterSender !== 'all' && invoice.senderName !== filterSender) {
      return false;
    }

    // Search by invoice number, company, or supplier
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        invoice.invoiceNo?.toLowerCase().includes(search) ||
        invoice.company?.toLowerCase().includes(search) ||
        invoice.supplier?.toLowerCase().includes(search)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="space-y-4">
        <h2>{title}</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No invoices in this category</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if this is the sent invoices view
  const isSentInvoices = title.includes('Gönderilen') || title.includes('Sent');
  const showFilters = title.includes('Process') || isLogsView;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2>{title} ({filteredInvoices.length})</h2>
        </div>

        {/* Filters and Search */}
        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Search by Invoice No, Company, or Supplier</label>
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Filter by Gönderen (Sender)</label>
                  <Select value={filterSender} onValueChange={setFilterSender}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Senders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Senders</SelectItem>
                      {uniqueSenders.map((sender) => (
                        <SelectItem key={sender} value={sender}>
                          {sender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {isSentInvoices ? (
          // Special layout for sent invoices
          <div className="grid gap-4">
            {filteredInvoices.map((invoice) => (
              <Card 
                key={invoice.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewDetails(invoice)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Gönderenin İsmi (Sender Name)</div>
                        <div>{invoice.senderName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Bugünün Tarihi (Date)</div>
                        <div>{formatDate(invoice.sentDate || invoice.createdAt || '')}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Benzersiz ID (Unique ID)</div>
                        <div className="text-xs font-mono">{invoice.id.substring(0, 20)}...</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Durum (Status)</div>
                        {getStatusBadge(invoice.status)}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(invoice);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {allowedActions.includes('in_process') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(invoice, 'in_process');
                          }}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Process
                        </Button>
                      )}
                      {allowedActions.includes('edit') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(invoice);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {allowedActions.includes('delete') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(invoice.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isLogsView ? (
          // Special layout for logs with audit trail
          <div className="grid gap-4">
            {filteredInvoices.map((invoice) => (
              <Card 
                key={invoice.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewDetails(invoice)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header with status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h3>Invoice #{invoice.invoiceNo}</h3>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(invoice);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Details
                      </Button>
                    </div>

                    {/* Audit Trail */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground">Oluşturan (Creator)</div>
                        <div>{invoice.creator || '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Gönderen (Sender)</div>
                        <div>{invoice.sender || '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">In Process'e Atan</div>
                        <div>{invoice.processor || '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Completed Yapan</div>
                        <div>{invoice.completer || '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Loglayan</div>
                        <div>{invoice.logger || '-'}</div>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Company</div>
                        <div>{invoice.company}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Date</div>
                        <div>{invoice.date}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total</div>
                        <div>${(invoice.total || 0).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Default layout for in_process and completed
          <div className="grid gap-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {invoice.invoiceNo}
                        {getStatusBadge(invoice.status)}
                      </CardTitle>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {invoice.date}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Sender info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">Gönderenin İsmi</div>
                      <div>{invoice.senderName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Tarih</div>
                      <div>{formatDate(invoice.sentDate || invoice.createdAt || '')}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Benzersiz ID</div>
                      <div className="text-xs font-mono">{invoice.id.substring(0, 20)}...</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Company</div>
                      <div>{invoice.company}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Contact</div>
                      <div>{invoice.contact || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">License Plate</div>
                      <div>{invoice.licensePlate || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Supplier</div>
                      <div>{invoice.supplier || '-'}</div>
                    </div>
                  </div>

                  {invoice.invoiceDescription && (
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground">Description</div>
                      <div>{invoice.invoiceDescription}</div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total:</span>
                        <span>${(invoice.total || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(invoice)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {allowedActions.includes('approve') && onApprove && (
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => onApprove(invoice)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Onayla (Approve)
                        </Button>
                      )}
                      {allowedActions.includes('edit') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(invoice)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      )}
                      {allowedActions.includes('in_process') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStatusChange(invoice, 'in_process')}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Mark In Process
                        </Button>
                      )}
                      {allowedActions.includes('completed') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStatusChange(invoice, 'completed')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Completed
                        </Button>
                      )}
                      {allowedActions.includes('delete') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(invoice.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedInvoice(null);
        }}
      />
    </>
  );
}
