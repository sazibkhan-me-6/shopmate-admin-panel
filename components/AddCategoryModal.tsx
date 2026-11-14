'use client';
import { useState, useRef } from 'react';
import { X, Upload, Sparkles, Check } from 'lucide-react';

export interface CategoryItem {
  id: number;
  name: string;
  count: string;
  image: string;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: {
    name: string;
    count: string;
    image: string;
  }) => void;
}

const PRESET_CATEGORY_IMAGES = [
  { name: 'Electronics', url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fashion & Apparel', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80' },
  { name: 'Home & Living', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80' },
  { name: 'Accessories', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
  { name: 'Beauty & Wellness', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sports & Outdoors', url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80' },
];

export default function AddCategoryModal({
  isOpen,
  onClose,
  onAddCategory,
}: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [productCount, setProductCount] = useState('0 products');
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

    onAddCategory({
      name: name.trim(),
      count: productCount.trim() || '0 products',
      image: imageUrl.trim() || PRESET_CATEGORY_IMAGES[0].url,
    });

    setName('');
    setProductCount('0 products');
    setImageUrl('');
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
            <h2>Add New Category</h2>
            <p>Create a store category with a cover photo</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Category Name */}
        <label>
          Category Name *
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Sports & Fitness"
          />
        </label>

        {/* Product Count / Label */}
        <label>
          Display Subtitle / Count
          <input
            value={productCount}
            onChange={e => setProductCount(e.target.value)}
            placeholder="e.g. 12 products or New Arrival"
          />
        </label>

        {/* Photo Section */}
        <div className="photo-input-section">
          <div className="photo-section-header">
            <label>Category Cover Photo</label>
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
                  <b>Click to choose category cover photo</b>
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
              placeholder="https://images.unsplash.com/..."
              style={{ width: '100%' }}
            />
          )}

          {/* Presets */}
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} color="#6b5ce7" /> Or choose a preset cover:
            </span>
            <div className="preset-chips">
              {PRESET_CATEGORY_IMAGES.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  className={`preset-chip ${imageUrl === preset.url ? 'active' : ''}`}
                  onClick={() => {
                    setImageUrl(preset.url);
                    if (!name) setName(preset.name.split(' ')[0]);
                  }}
                >
                  {imageUrl === preset.url && <Check size={11} />}
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {imageUrl && (
            <div className="image-preview-container">
              <img
                src={imageUrl}
                alt="Category preview"
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
            Save Category
          </button>
        </div>
      </form>
    </div>
  );
}
