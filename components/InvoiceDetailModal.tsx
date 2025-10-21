import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Invoice } from './InvoiceManager';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceDetailModal({ invoice, isOpen, onClose }: InvoiceDetailModalProps) {
  if (!invoice) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Invoice Details - {invoice.invoiceNo}</span>
            <Badge variant={
              invoice.status === 'sent' ? 'default' :
              invoice.status === 'in_process' ? 'secondary' :
              invoice.status === 'completed' ? 'outline' : 'default'
            }>
              {invoice.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Complete invoice information including sender details, items, and payment information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sender & Date Info */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">Gönderenin İsmi (Sender)</div>
              <div>{invoice.senderName}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Gönderilme Tarihi (Sent Date)</div>
              <div>{formatDate(invoice.sentDate || invoice.createdAt || '')}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Benzersiz ID (Unique ID)</div>
              <div className="text-xs">{invoice.id}</div>
            </div>
          </div>

          <Separator />

          {/* Audit Trail - Show if any audit info exists */}
          {(invoice.creator || invoice.sender || invoice.processor || invoice.completer || invoice.logger) && (
            <>
              <div className="space-y-4">
                <h3 className="text-muted-foreground">Audit Trail</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Oluşturan (Creator)</div>
                    <div>{invoice.creator || '-'}</div>
                    {invoice.createdAt && (
                      <div className="text-xs text-muted-foreground mt-1">{formatDate(invoice.createdAt)}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Gönderen (Sender)</div>
                    <div>{invoice.sender || '-'}</div>
                    {invoice.sentDate && (
                      <div className="text-xs text-muted-foreground mt-1">{formatDate(invoice.sentDate)}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">In Process'e Atan</div>
                    <div>{invoice.processor || '-'}</div>
                    {invoice.processDate && (
                      <div className="text-xs text-muted-foreground mt-1">{formatDate(invoice.processDate)}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Completed Yapan</div>
                    <div>{invoice.completer || '-'}</div>
                    {invoice.completedDate && (
                      <div className="text-xs text-muted-foreground mt-1">{formatDate(invoice.completedDate)}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Loglayan</div>
                    <div>{invoice.logger || '-'}</div>
                    {invoice.approvedDate && (
                      <div className="text-xs text-muted-foreground mt-1">{formatDate(invoice.approvedDate)}</div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}


          {/* Invoice Details */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground">Invoice Details</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Company</div>
                <div>{invoice.company}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Invoice No</div>
                <div>{invoice.invoiceNo}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Date</div>
                <div>{invoice.date}</div>
              </div>
            </div>

            {invoice.invoiceDescription && (
              <div>
                <div className="text-sm text-muted-foreground">Invoice Description</div>
                <div>{invoice.invoiceDescription}</div>
              </div>
            )}

            {invoice.additionalDescription && (
              <div>
                <div className="text-sm text-muted-foreground">Additional Description</div>
                <div>{invoice.additionalDescription}</div>
              </div>
            )}

            {/* Invoice Details Amounts */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Tutar (Amount)</div>
                <div>${invoice.invoiceDetailsAmount?.toFixed(2) || '0.00'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">KDV (20%)</div>
                <div>${invoice.invoiceDetailsVat?.toFixed(2) || '0.00'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Toplam (Total)</div>
                <div>${invoice.invoiceDetailsTotal?.toFixed(2) || '0.00'}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Details */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground">Shipping Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Loading Company</div>
                <div>{invoice.loadingCompany || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Loading Location</div>
                <div>{invoice.loadingLocation || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Shipping Company</div>
                <div>{invoice.shippingCompany || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Shipping Location</div>
                <div>{invoice.shippingLocation || '-'}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Personnel */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground">Personnel & Supplier</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Operator</div>
                <div>{invoice.operator || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Sales Representative</div>
                <div>{invoice.salesRepresentative || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Supplier</div>
                <div>{invoice.supplier || '-'}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          {invoice.items && invoice.items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-muted-foreground">Items</h3>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm">Description</th>
                      <th className="px-4 py-2 text-right text-sm">Price</th>
                      <th className="px-4 py-2 text-right text-sm">VAT</th>
                      <th className="px-4 py-2 text-right text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">{item.description || '-'}</td>
                        <td className="px-4 py-2 text-right">${(item.price || 0).toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">${(item.vat || 0).toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">${(item.total || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2">
                    <tr>
                      <td className="px-4 py-2" colSpan={3}>
                        <div className="text-sm text-muted-foreground">Subtotal</div>
                      </td>
                      <td className="px-4 py-2 text-right">${(invoice.subtotal || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2" colSpan={3}>
                        <div className="text-sm text-muted-foreground">VAT Total</div>
                      </td>
                      <td className="px-4 py-2 text-right">${(invoice.vatTotal || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2" colSpan={3}>
                        <div>Grand Total</div>
                      </td>
                      <td className="px-4 py-2 text-right">${(invoice.total || 0).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          <Separator />

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground">Additional Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">License Plate</div>
                <div>{invoice.licensePlate || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Contact</div>
                <div>{invoice.contact || '-'}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground">Payment Information</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Delivery</div>
                <div>{invoice.delivery || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Payment Date</div>
                <div>{invoice.paymentDate ? formatDate(invoice.paymentDate) : '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Payment</div>
                <div>{invoice.payment || '-'}</div>
              </div>
            </div>

            {/* Payment Amounts */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-green-50 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Tutar (Amount)</div>
                <div>${invoice.paymentAmount?.toFixed(2) || '0.00'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">KDV (20%)</div>
                <div>${invoice.paymentVat?.toFixed(2) || '0.00'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Tevrikat</div>
                <div>${invoice.paymentTevrikat?.toFixed(2) || '0.00'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Toplam (Total)</div>
                <div>${invoice.paymentTotal?.toFixed(2) || '0.00'}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
