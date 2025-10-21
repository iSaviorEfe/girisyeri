import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Invoice, InvoiceItem } from './InvoiceManager';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { InvoiceDraftList } from './InvoiceDraftList';
import { Separator } from './ui/separator';

interface InvoiceFormProps {
  onSubmit: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingInvoice: Invoice | null;
  onCancelEdit: () => void;
  draftInvoices: Invoice[];
  onEditDraft: (invoice: Invoice) => void;
  onDeleteDraft: (id: string) => void;
  onSendInvoice: (invoice: Invoice) => void;
  senderName: string;
}

export function InvoiceForm({ 
  onSubmit, 
  editingInvoice, 
  onCancelEdit,
  draftInvoices,
  onEditDraft,
  onDeleteDraft,
  onSendInvoice,
  senderName
}: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    company: '',
    invoiceNo: '',
    date: new Date().toISOString().split('T')[0],
    invoiceDescription: '',
    additionalDescription: '',
    loadingCompany: '',
    loadingLocation: '',
    shippingCompany: '',
    shippingLocation: '',
    operator: '',
    salesRepresentative: '',
    supplier: '',
    licensePlate: '',
    contact: '',
    delivery: '',
    paymentDate: '',
    payment: '',
    status: 'draft' as const,
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', price: 0, vat: 0, total: 0 },
    { description: '', price: 0, vat: 0, total: 0 }
  ]);

  // Invoice Details section amounts
  const [invoiceDetailsAmount, setInvoiceDetailsAmount] = useState(0);
  const invoiceDetailsVat = invoiceDetailsAmount * 0.2;
  const invoiceDetailsTotal = invoiceDetailsAmount + invoiceDetailsVat;

  // Payment Information section amounts
  const [paymentAmount, setPaymentAmount] = useState(0);
  const paymentVat = paymentAmount * 0.2;
  const paymentTevrikat = paymentAmount * 0.2;
  const paymentTotal = paymentAmount + paymentVat - paymentTevrikat;

  useEffect(() => {
    if (editingInvoice) {
      setFormData({
        company: editingInvoice.company,
        invoiceNo: editingInvoice.invoiceNo,
        date: editingInvoice.date,
        invoiceDescription: editingInvoice.invoiceDescription,
        additionalDescription: editingInvoice.additionalDescription,
        loadingCompany: editingInvoice.loadingCompany,
        loadingLocation: editingInvoice.loadingLocation,
        shippingCompany: editingInvoice.shippingCompany,
        shippingLocation: editingInvoice.shippingLocation,
        operator: editingInvoice.operator,
        salesRepresentative: editingInvoice.salesRepresentative,
        supplier: editingInvoice.supplier,
        licensePlate: editingInvoice.licensePlate,
        contact: editingInvoice.contact,
        delivery: editingInvoice.delivery,
        paymentDate: editingInvoice.paymentDate,
        payment: editingInvoice.payment,
        status: editingInvoice.status,
      });
      setItems(editingInvoice.items && editingInvoice.items.length > 0 ? editingInvoice.items : [
        { description: '', price: 0, vat: 0, total: 0 },
        { description: '', price: 0, vat: 0, total: 0 }
      ]);
      setInvoiceDetailsAmount(editingInvoice.invoiceDetailsAmount || 0);
      setPaymentAmount(editingInvoice.paymentAmount || 0);
    }
  }, [editingInvoice]);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    
    if (field === 'price') {
      const price = typeof value === 'number' ? value : parseFloat(value) || 0;
      const vat = price * 0.2; // 20% VAT
      const total = price + vat;
      newItems[index] = {
        ...newItems[index],
        price: parseFloat(price.toFixed(2)),
        vat: parseFloat(vat.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', price: 0, vat: 0, total: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const vatTotal = items.reduce((sum, item) => sum + item.vat, 0);
    const total = subtotal + vatTotal;
    
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      vatTotal: parseFloat(vatTotal.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  };

  const totals = calculateTotals();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoiceData = {
      ...formData,
      senderName,
      items,
      subtotal: totals.subtotal,
      vatTotal: totals.vatTotal,
      total: totals.total,
      invoiceDetailsAmount: parseFloat(invoiceDetailsAmount.toFixed(2)),
      invoiceDetailsVat: parseFloat(invoiceDetailsVat.toFixed(2)),
      invoiceDetailsTotal: parseFloat(invoiceDetailsTotal.toFixed(2)),
      paymentAmount: parseFloat(paymentAmount.toFixed(2)),
      paymentVat: parseFloat(paymentVat.toFixed(2)),
      paymentTevrikat: parseFloat(paymentTevrikat.toFixed(2)),
      paymentTotal: parseFloat(paymentTotal.toFixed(2)),
    };
    
    onSubmit(invoiceData);
    
    // Reset form
    setFormData({
      company: '',
      invoiceNo: '',
      date: new Date().toISOString().split('T')[0],
      invoiceDescription: '',
      additionalDescription: '',
      loadingCompany: '',
      loadingLocation: '',
      shippingCompany: '',
      shippingLocation: '',
      operator: '',
      salesRepresentative: '',
      supplier: '',
      licensePlate: '',
      contact: '',
      delivery: '',
      paymentDate: '',
      payment: '',
      status: 'draft',
    });
    setItems([
      { description: '', price: 0, vat: 0, total: 0 },
      { description: '', price: 0, vat: 0, total: 0 }
    ]);
    setInvoiceDetailsAmount(0);
    setPaymentAmount(0);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h2 className="text-muted-foreground">{editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}</h2>
              </div>
              {editingInvoice && (
                <Button variant="ghost" onClick={onCancelEdit} type="button">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>

            {/* Invoice Details */}
            <div className="space-y-6">
              <h3 className="text-muted-foreground">Invoice Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceNo">Invoice No</Label>
                  <Input
                    id="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, invoiceNo: e.target.value }))}
                    placeholder="INV-001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="invoiceDescription">Invoice Description</Label>
                  <Textarea
                    id="invoiceDescription"
                    value={formData.invoiceDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, invoiceDescription: e.target.value }))}
                    placeholder="Brief description of the invoice"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalDescription">Additional Description</Label>
                  <Textarea
                    id="additionalDescription"
                    value={formData.additionalDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalDescription: e.target.value }))}
                    placeholder="Additional notes or details"
                    rows={3}
                  />
                </div>
              </div>

              {/* Invoice Details Amounts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="space-y-2">
                  <Label htmlFor="invoiceDetailsAmount">Tutar (Amount)</Label>
                  <Input
                    id="invoiceDetailsAmount"
                    type="number"
                    step="0.01"
                    value={invoiceDetailsAmount}
                    onChange={(e) => setInvoiceDetailsAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceDetailsVat">KDV (20%)</Label>
                  <Input
                    id="invoiceDetailsVat"
                    type="number"
                    step="0.01"
                    value={invoiceDetailsVat.toFixed(2)}
                    readOnly
                    className="bg-white cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceDetailsTotal">Toplam (Total)</Label>
                  <Input
                    id="invoiceDetailsTotal"
                    type="number"
                    step="0.01"
                    value={invoiceDetailsTotal.toFixed(2)}
                    readOnly
                    className="bg-white cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Shipping Details */}
            <div className="space-y-6">
              <h3 className="text-muted-foreground">Shipping Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="loadingCompany">Loading Company</Label>
                  <Input
                    id="loadingCompany"
                    value={formData.loadingCompany}
                    onChange={(e) => setFormData(prev => ({ ...prev, loadingCompany: e.target.value }))}
                    placeholder="Company handling loading"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loadingLocation">Loading Location</Label>
                  <Input
                    id="loadingLocation"
                    value={formData.loadingLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, loadingLocation: e.target.value }))}
                    placeholder="Loading address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingCompany">Shipping Company</Label>
                  <Input
                    id="shippingCompany"
                    value={formData.shippingCompany}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingCompany: e.target.value }))}
                    placeholder="Company handling shipping"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingLocation">Shipping Location</Label>
                  <Input
                    id="shippingLocation"
                    value={formData.shippingLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingLocation: e.target.value }))}
                    placeholder="Shipping address"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Personnel & Supplier */}
            <div className="space-y-6">
              <h3 className="text-muted-foreground">Personnel & Supplier</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="operator">Operator</Label>
                  <Input
                    id="operator"
                    value={formData.operator}
                    onChange={(e) => setFormData(prev => ({ ...prev, operator: e.target.value }))}
                    placeholder="Operator name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salesRepresentative">Sales Representative</Label>
                  <Input
                    id="salesRepresentative"
                    value={formData.salesRepresentative}
                    onChange={(e) => setFormData(prev => ({ ...prev, salesRepresentative: e.target.value }))}
                    placeholder="Sales rep name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                    placeholder="Supplier name"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Line Items */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground">Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg bg-gray-50">
                    <div className="md:col-span-5 space-y-2">
                      <Label htmlFor={`item-desc-${index}`}>Description</Label>
                      <Input
                        id={`item-desc-${index}`}
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Item description"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor={`item-price-${index}`}>Price</Label>
                      <Input
                        id={`item-price-${index}`}
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor={`item-vat-${index}`}>VAT (20%)</Label>
                      <Input
                        id={`item-vat-${index}`}
                        type="number"
                        step="0.01"
                        value={item.vat}
                        readOnly
                        className="bg-white cursor-not-allowed"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor={`item-total-${index}`}>Total</Label>
                      <Input
                        id={`item-total-${index}`}
                        type="number"
                        step="0.01"
                        value={item.total}
                        readOnly
                        className="bg-white cursor-not-allowed"
                      />
                    </div>

                    <div className="md:col-span-1 flex items-end">
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-full md:w-96 space-y-3 p-6 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">VAT Total</span>
                    <span>${totals.vatTotal.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span>Grand Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-6">
              <h3 className="text-muted-foreground">Additional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value }))}
                    placeholder="ABC-1234"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                    placeholder="Contact person or number"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Information */}
            <div className="space-y-6">
              <h3 className="text-muted-foreground">Payment Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="delivery">Delivery</Label>
                  <Input
                    id="delivery"
                    value={formData.delivery}
                    onChange={(e) => setFormData(prev => ({ ...prev, delivery: e.target.value }))}
                    placeholder="Delivery method"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment">Payment</Label>
                  <Input
                    id="payment"
                    value={formData.payment}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment: e.target.value }))}
                    placeholder="Payment method"
                  />
                </div>
              </div>

              {/* Payment Amounts */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">Tutar (Amount)</Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentVat">KDV (20%)</Label>
                  <Input
                    id="paymentVat"
                    type="number"
                    step="0.01"
                    value={paymentVat.toFixed(2)}
                    readOnly
                    className="bg-white cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTevrikat">Tevrikat</Label>
                  <Input
                    id="paymentTevrikat"
                    type="number"
                    step="0.01"
                    value={paymentTevrikat.toFixed(2)}
                    readOnly
                    className="bg-white cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTotal">Toplam (Total)</Label>
                  <Input
                    id="paymentTotal"
                    type="number"
                    step="0.01"
                    value={paymentTotal.toFixed(2)}
                    readOnly
                    className="bg-white cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="in_process">In Process</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="w-full h-12">
                <Save className="w-4 h-4 mr-2" />
                {editingInvoice ? 'Update Invoice' : 'Save Invoice'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Draft Invoices List */}
      {!editingInvoice && draftInvoices.length > 0 && (
        <InvoiceDraftList
          invoices={draftInvoices}
          onEdit={onEditDraft}
          onDelete={onDeleteDraft}
          onSend={onSendInvoice}
        />
      )}
    </div>
  );
}
