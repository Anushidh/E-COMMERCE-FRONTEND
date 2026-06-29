import { useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@shared/components';
import { adminService } from '@/services/admin.service';
import styles from './Tabs.module.css';

interface ImagesTabProps {
  productId: string;
  images: string[];
}

export function ImagesTab({ productId, images }: ImagesTabProps) {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('productImages', f));
      await adminService.updateProduct(productId, formData);
      qc.invalidateQueries({ queryKey: ['product'] });
      toast.success('Images uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemove = async (imageUrl: string) => {
    setRemoving(imageUrl);
    try {
      await adminService.removeProductImage(productId, imageUrl);
      qc.invalidateQueries({ queryKey: ['product'] });
      toast.success('Image removed');
    } catch {
      toast.error('Failed to remove');
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.uploadArea}>
        <label className={styles.uploadLabel}>
          <Upload size={20} />
          <span>{uploading ? 'Uploading...' : 'Upload Images'}</span>
          <input type="file" multiple accept="image/*" onChange={handleUpload} hidden disabled={uploading} />
        </label>
      </div>

      {images.length === 0 ? (
        <p className={styles.empty}>No images uploaded yet</p>
      ) : (
        <div className={styles.imageGrid}>
          {images.map((url, i) => (
            <div key={i} className={styles.imageItem}>
              <img src={url} alt={`Product image ${i + 1}`} className={styles.imageThumb} />
              <Button
                variant="danger"
                size="sm"
                loading={removing === url}
                onClick={() => handleRemove(url)}
                className={styles.imageRemoveBtn}
              >
                <Trash2 size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
