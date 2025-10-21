import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Invoice } from './InvoiceManager';
import { Edit, Trash2, Send } from 'lucide-react';

interface InvoiceDraftListProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onSend: (invoice: Invoice) => void;
}

export function InvoiceDraftList({ invoices, onEdit, onDelete, onSend }: InvoiceDraftListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Draft Invoices ({invoices.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div>
                    <div>{invoice.invoiceNo}</div>
                    <div className="text-sm text-muted-foreground">
                      {invoice.company} - ${invoice.total.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{invoice.date}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(invoice)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSend(invoice)}
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(invoice.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
