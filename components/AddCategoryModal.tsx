'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Upload, Sparkles, Check, Star, Image as ImageIcon, Eye } from 'lucide-react';

export interface CategoryItem {
  id: number;
  name: string;
  count: string;
  image: string;
  featured?: boolean;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCategory: (category: {
    id?: number;
    name: string;
    count: string;
    image: string;
    featured?: boolean;
  }) => void;
  initialData?: CategoryItem | null;
}

export const PRESET_CATEGORY_IMAGES = [
  {
    name: 'Electronics',
    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80',
    tag: 'Laptops, phones & tech',
  },
  {
    name: 'Fashion',
    url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80',
    tag: 'Apparel & streetwear',
  },
  {
    name: 'Home & Living',
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80',
    tag: 'Furniture & modern decor',
  },
  {
    name: 'Beauty & Health',
    url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80',
    tag: 'Skincare & makeup brushes',
  },
  {
    name: 'Sports & Fitness',
    url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80',
    tag: 'Gym weights & training gear',
  },
  {
    name: 'Books',
    url: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=500&q=80',
    tag: 'Books on shelf & reading',
  },
  {
    name: 'Toys & Games',
    url: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=500&q=80',
    tag: 'Blue Lego bricks & play',
  },
  {
    name: 'Accessories',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80',
    tag: 'Everyday backpacks & bags',
  },
];

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSaveCategory,
  initialData,
}: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [productCount, setProductCount] = useState('0 products');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(true);
  const [imageTab, setImageTab] = useState<'file' | 'url'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(initialData && initialData.id);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setProductCount(initialData.count || '0 products');
      setImageUrl(initialData.image || '');
      setFeatured(initialData.featured !== undefined ? initialData.featured : true);
    } else {
      setName('');
      setProductCount('0 products');
      setImageUrl('');
      setFeatured(true);
    }
  }, [initialData, isOpen]);

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

    onSaveCategory({
      id: initialData?.id,
      name: name.trim(),
      count: productCount.trim() || '0 products',
      image: imageUrl.trim() || PRESET_CATEGORY_IMAGES[0].url,
      featured,
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="modal modal-lg"
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '92vh', overflowY: 'auto' }}
      >
        <div className="panel-head">
          <div>
            <h2>{isEditing ? `Edit Category: ${initialData?.name}` : 'Add New Category'}</h2>
            <p>
              {isEditing
                ? 'Update category name, cover photo, and storefront featured visibility'
                : 'Create a new visual category with photo for the storefront'}
            </p>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <label>
            Display Subtitle / Count
            <input
              value={productCount}
              onChange={e => setProductCount(e.target.value)}
              placeholder="e.g. 4 products or Trending"
            />
          </label>

          <label style={{ justifyContent: 'center' }}>
            Featured on Storefront
            <div
              onClick={() => setFeatured(!featured)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: featured ? '#f0edff' : '#f8f8fb',
                border: `1px solid ${featured ? '#6b5ce7' : '#dedede'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                userSelect: 'none',
                marginTop: '4px',
              }}
            >
              <Star
                size={16}
                fill={featured ? '#6b5ce7' : 'none'}
                color={featured ? '#6b5ce7' : '#888'}
              />
              <span style={{ fontSize: '12px', fontWeight: 600, color: featured ? '#6b5ce7' : '#666' }}>
                {featured ? '★ Featured on Homepage Strip' : 'Standard Category'}
              </span>
            </div>
          </label>
        </div>

        {/* Photo Section */}
        <div className="photo-input-section" style={{ marginTop: '10px' }}>
          <div className="photo-section-header">
            <label style={{ fontWeight: 700, fontSize: '12px' }}>
              Category Photo (Storefront Square Card)
            </label>
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
                style={{
                  border: '2px dashed #b9b1ff',
                  borderRadius: '12px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: '#faf9fe',
                }}
              >
                <Upload size={24} color="#6b5ce7" style={{ margin: '0 auto 8px' }} />
                <div>
                  <b style={{ color: '#202033', fontSize: '13px' }}>Click to upload category photo</b>
                  <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#888' }}>
                    Square photo recommended (PNG, JPG, WEBP up to 5MB)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          )}

          {/* Quick Presets matching the 8 storefront categories */}
          <div style={{ marginTop: '12px' }}>
            <span
              style={{
                fontSize: '11px',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              <Sparkles size={13} color="#6b5ce7" /> Select from official storefront category presets:
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '8px',
              }}
            >
              {PRESET_CATEGORY_IMAGES.map(preset => {
                const isSelected = imageUrl === preset.url;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      if (!name) setName(preset.name);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      background: isSelected ? '#f0edff' : '#fff',
                      border: `1px solid ${isSelected ? '#6b5ce7' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all .15s',
                    }}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                      }}
                    />
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <b
                        style={{
                          display: 'block',
                          fontSize: '11px',
                          color: isSelected ? '#6b5ce7' : '#1e293b',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {preset.name}
                      </b>
                      <small style={{ fontSize: '9px', color: '#888', display: 'block' }}>
                        Preset
                      </small>
                    </div>
                    {isSelected && <Check size={12} color="#6b5ce7" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Storefront Card Preview */}
          {imageUrl && (
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <Eye size={13} color="#6b5ce7" /> Live Storefront Card Preview
                </span>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#ef4444',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <X size={13} /> Remove photo
                </button>
              </div>

              {/* Exact Card Preview */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '140px',
                    background: '#f1f5f9',
                    borderRadius: '16px',
                    padding: '12px 10px 14px',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      margin: '0 auto 10px',
                      background: '#fff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={name || 'Category'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                  </div>
                  <b
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0f172a',
                    }}
                  >
                    {name || 'Category Name'}
                  </b>
                  <small style={{ color: '#64748b', fontSize: '10px', display: 'block', marginTop: '2px' }}>
                    {productCount}
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" type="submit">
            {isEditing ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
