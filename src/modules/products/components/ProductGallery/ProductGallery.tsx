import { useState, MouseEvent } from 'react';
import styles from './ProductGallery.module.css';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseEnter = () => setIsZooming(true);
  const handleMouseLeave = () => {
    setIsZooming(false);
    // Reset to center smoothly when mouse leaves
    setZoomStyle({
      transformOrigin: 'center center',
    });
  };

  if (images.length === 0) {
    return (
      <div className={styles.placeholder}>
        <span>No image available</span>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      <div 
        className={styles.mainImage}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={images[activeIndex]}
          alt={`${name} - Image ${activeIndex + 1}`}
          className={`${styles.image} ${isZooming ? styles.zoomed : ''}`}
          style={zoomStyle}
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
