import { useState } from 'react';
import styles from './ProductGallery.module.css';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className={styles.placeholder}>
        <span>No image available</span>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <img
          src={images[activeIndex]}
          alt={`${name} - Image ${activeIndex + 1}`}
          className={styles.image}
        />
      </div>
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((img, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${i === activeIndex ? styles.thumbActive : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img} alt="" className={styles.thumbImg} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
