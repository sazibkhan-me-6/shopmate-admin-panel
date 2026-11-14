'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Upload, Sparkles, Check, Tag, DollarSign, Percent } from 'lucide-react';

interface CategoryOption {
  id: number;
  name: string;
}

export interface ProductFormData {
  id?: number;
  name: string;
  sku?: string;
  category: string;
  price: number;
  discountPercent?: number;
  discountedPrice?: number;
  stock: number;
  status: 'Active' | 'Low stock' | 'Draft';
  image: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryOption[];
  initialData?: ProductFormData | null;
  onSaveProduct: (product: ProductFormData) => void;
}

const PRESET_PRODUCT_IMAGES = [
  { name: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
  { name: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
  { name: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
  { name: 'Coffee Cup', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' },
  { name: 'Desk Lamp', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80' },
];

export default function AddProductModal({
  isOpen,
  onClose,
  categories,
  initialData,
  onSaveProduct,
}: AddProductModalProps) {
  const isEditMode = !!initialData?.id;

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Electronics');
  const [price, setPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('0');
  const [stock, setStock] = useState('10');
  const [status, setStatus] = useState<'Active' | 'Low stock' | 'Draft'>('Active');
  const [imageUrl, setImageUrl] = useState('');
  const [imageTab, setImageTab] = useState<'file' | 'url'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSku(initialData.sku || '');
      setCategory(initialData.category || categories[0]?.name || 'Electronics');
      setPrice(initialData.price !== undefined ? String(initialData.price) : '');
      setDiscountPercent(
        initialData.discountPercent !== undefined ? String(initialData.discountPercent) : '0'
      );
      setStock(initialData.stock !== undefined ? String(initialData.stock) : '10');
      setStatus(initialData.status || 'Active');
      setImageUrl(initialData.image || '');
    } else {
      setName('');
      setSku('');
      setCategory(categories[0]?.name || 'Electronics');
      setPrice('');
      setDiscountPercent('0');
      setStock('10');
      setStatus('Active');
      setImageUrl('');
    }
  }, [initialData, isOpen, categories]);

  if (!isOpen) return null;

  const numPrice = parseFloat(price) || 0;
  const numDiscount = Math.min(100, Math.max(0, parseFloat(discountPercent) || 0));
  const finalPrice = numDiscount > 0 ? numPrice * (1 - numDiscount / 100) : numPrice;
  const savings = numPrice - finalPrice;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numStock = parseInt(stock, 10) || 0;
    const determinedStatus =
      status || (numStock > 5 ? 'Active' : numStock > 0 ? 'Low stock' : 'Draft');
    const assignedSku =
      sku.trim() || initialData?.sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000);

    onSaveProduct({
      id: initialData?.id,
      name: name.trim(),
      sku: assignedSku,
      category,
      price: numPrice,
      discountPercent: numDiscount,
      discountedPrice: parseFloat(finalPrice.toFixed(2)),
      stock: numStock,
      status: determinedStatus,
      image: imageUrl.trim(),
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="modal modal-lg"
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="panel-head">
          <div>
            <h2>{isEditMode ? 'Edit Product Details' : 'Add New Product'}</h2>
            <p>{isEditMode ? 'Update product pricing, discount, stock & photos' : 'Enter details and upload product photo'}</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Product Name */}
        <label>
          Product Name *
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Premium Leather Backpack"
          />
        </label>

        {/* Category & Status */}
        <div className="form-row">
          <label>
            Category
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Status
            <select value={status} onChange={e => setStatus(e.target.value as any)}>
              <option value="Active">Active</option>
              <option value="Low stock">Low stock</option>
              <option value="Draft">Draft</option>
            </select>
          </label>
        </div>

        {/* Price, Discount & Final Sale Price */}
        <div className="form-row">
          <label>
            Regular Price ($) *
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="49.99"
                style={{ width: '100%' }}
              />
            </div>
          </label>

          <label>
            Discount (%)
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min="0"
                max="99"
                step="1"
                value={discountPercent}
                onChange={e => setDiscountPercent(e.target.value)}
                placeholder="15"
                style={{ width: '100%' }}
              />
            </div>
          </label>
        </div>

        {/* Live Discount Calculation Banner */}
        {numPrice > 0 && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: numDiscount > 0 ? '#f0fbf5' : '#f8f8fb',
              border: numDiscount > 0 ? '1px solid #c5edd7' : '1px solid #eeedf3',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
            }}
          >
            <div>
              <span style={{ color: '#666' }}>Final Selling Price: </span>
              <strong style={{ fontSize: '15px', color: numDiscount > 0 ? '#1b7d56' : '#202033', marginLeft: '4px' }}>
                ${finalPrice.toFixed(2)}
              </strong>
              {numDiscount > 0 && (
                <span
                  style={{
                    textDecoration: 'line-through',
                    color: '#9998aa',
                    marginLeft: '8px',
                    fontSize: '12px',
                  }}
                >
                  ${numPrice.toFixed(2)}
                </span>
              )}
            </div>
            {numDiscount > 0 && (
              <span
                style={{
                  background: '#e3f7ed',
                  color: '#1b7d56',
                  fontWeight: 700,
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '12px',
                }}
              >
                Save ${savings.toFixed(2)} ({numDiscount}% OFF)
              </span>
            )}
          </div>
        )}

        {/* Stock & SKU */}
        <div className="form-row">
          <label>
            Stock Quantity *
            <input
              type="number"
              min="0"
              required
              value={stock}
              onChange={e => setStock(e.target.value)}
              placeholder="25"
            />
          </label>
          <label>
            SKU Code
            <input
              value={sku}
              onChange={e => setSku(e.target.value)}
              placeholder="Auto-generated if empty"
            />
          </label>
        </div>

        {/* Product Photo Section */}
        <div className="photo-input-section">
          <div className="photo-section-header">
            <label>Product Photo</label>
            <div className="tab-pills">
              <button
                type="button"
                className={`tab-pill ${imageTab === 'file' ? 'active' : ''}`}
                onClick={() => setImageTab('file')}
              >
                Upload File
              </button>
              <button
                type="button"
                className={`tab-pill ${imageTab === 'url' ? 'active' : ''}`}
                onClick={() => setImageTab('url')}
              >
                Photo URL
              </button>
            </div>
          </div>

          {imageTab === 'file' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <div
                className="image-upload-zone"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={22} color="#6b5ce7" />
                <div style={{ marginTop: '6px' }}>
                  <b>Click to choose product photo</b>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#888' }}>
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/images/product.jpg"
              style={{ width: '100%' }}
            />
          )}

          {/* Preset sample photos */}
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} color="#6b5ce7" /> Or pick a sample photo:
            </span>
            <div className="preset-chips">
              {PRESET_PRODUCT_IMAGES.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  className={`preset-chip ${imageUrl === preset.url ? 'active' : ''}`}
                  onClick={() => setImageUrl(preset.url)}
                >
                  {imageUrl === preset.url && <Check size={11} />}
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Image Preview Box */}
          {imageUrl && (
            <div className="image-preview-container">
              <img
                src={imageUrl}
                alt="Product preview"
                onError={() => alert('Unable to load image from URL. Please check the URL or upload a file.')}
              />
              <button
                type="button"
                className="image-preview-remove"
                onClick={() => setImageUrl('')}
                title="Remove photo"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <div
          className="modal-actions"
          style={{
            position: 'sticky',
            bottom: '-22px',
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
            padding: '12px 0 0',
            marginTop: '16px',
            borderTop: '1px solid #eeedf3',
            zIndex: 3,
          }}
        >
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" type="submit">
            {isEditMode ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
