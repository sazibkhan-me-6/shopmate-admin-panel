'use client';
import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

interface CategoryOption {
  id: number;
  name: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryOption[];
  onAddProduct: (product: {
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: 'Active' | 'Low stock' | 'Draft';
    image: string;
  }) => void;
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
  onAddProduct,
}: AddProductModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Electronics');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [status, setStatus] = useState<'Active' | 'Low stock' | 'Draft'>('Active');
  const [imageUrl, setImageUrl] = useState('');
  const [imageTab, setImageTab] = useState<'file' | 'url'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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

    const numPrice = parseFloat(price) || 0;
    const numStock = parseInt(stock, 10) || 0;
    const determinedStatus = status || (numStock > 5 ? 'Active' : numStock > 0 ? 'Low stock' : 'Draft');
    const randomSku = 'SKU-' + Math.floor(1000 + Math.random() * 9000);

    onAddProduct({
      name: name.trim(),
      sku: randomSku,
      category,
      price: numPrice,
      stock: numStock,
      status: determinedStatus,
      image: imageUrl.trim(),
    });

    // Reset and close
    setName('');
    setPrice('');
    setStock('10');
    setImageUrl('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal modal-lg" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
        <div className="panel-head">
          <div>
            <h2>Add New Product</h2>
            <p>Enter details and upload product photo</p>
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

        {/* Price & Stock */}
        <div className="form-row">
          <label>
            Price ($) *
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="49.99"
            />
          </label>
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

        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" type="submit">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
