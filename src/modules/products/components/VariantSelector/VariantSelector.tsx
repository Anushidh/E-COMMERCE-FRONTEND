import { useMemo } from 'react';
import type { Variant } from '@shared/types/product';
import styles from './VariantSelector.module.css';

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onSelect: (variant: Variant) => void;
}

export function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
  const sizes = useMemo(() => [...new Set(variants.map((v) => v.size))], [variants]);
  const colors = useMemo(() => [...new Set(variants.map((v) => v.color))], [variants]);

  const selectedSize = selectedVariant?.size || '';
  const selectedColor = selectedVariant?.color || '';

  const selectByAttributes = (size: string, color: string) => {
    const match = variants.find((v) => v.size === size && v.color === color);
    if (match) onSelect(match);
  };

  const handleSizeChange = (size: string) => {
    if (selectedColor) {
      selectByAttributes(size, selectedColor);
    } else {
      // Select first available color for this size
      const match = variants.find((v) => v.size === size && v.stock > 0);
      if (match) onSelect(match);
    }
  };

  const handleColorChange = (color: string) => {
    if (selectedSize) {
      selectByAttributes(selectedSize, color);
    } else {
      // Select first available size for this color
      const match = variants.find((v) => v.color === color && v.stock > 0);
      if (match) onSelect(match);
    }
  };

  const isVariantAvailable = (size: string, color: string) => {
    const v = variants.find((variant) => variant.size === size && variant.color === color);
    return v ? v.stock > 0 : false;
  };

  return (
    <div className={styles.selector}>
      {/* Size */}
      {sizes.length > 0 && (
        <div className={styles.group}>
          <span className={styles.label}>
            Size{selectedSize && <span className={styles.selected}>: {selectedSize}</span>}
          </span>
          <div className={styles.options}>
            {sizes.map((size) => {
              const available = selectedColor
                ? isVariantAvailable(size, selectedColor)
                : variants.some((v) => v.size === size && v.stock > 0);
              return (
                <button
                  key={size}
                  className={`${styles.option} ${selectedSize === size ? styles.active : ''} ${!available ? styles.disabled : ''}`}
                  onClick={() => handleSizeChange(size)}
                  disabled={!available}
                  aria-label={`Size ${size}${!available ? ' — out of stock' : ''}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color */}
      {colors.length > 0 && (
        <div className={styles.group}>
          <span className={styles.label}>
            Color{selectedColor && <span className={styles.selected}>: {selectedColor}</span>}
          </span>
          <div className={styles.options}>
            {colors.map((color) => {
              const available = selectedSize
                ? isVariantAvailable(selectedSize, color)
                : variants.some((v) => v.color === color && v.stock > 0);
              return (
                <button
                  key={color}
                  className={`${styles.colorOption} ${selectedColor === color ? styles.active : ''} ${!available ? styles.disabled : ''}`}
                  onClick={() => handleColorChange(color)}
                  disabled={!available}
                  aria-label={`Color ${color}${!available ? ' — out of stock' : ''}`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock info */}
      {selectedVariant && (
        <p className={styles.stock}>
          {selectedVariant.stock > 0
            ? selectedVariant.stock <= 5
              ? `Only ${selectedVariant.stock} left`
              : 'In Stock'
            : 'Out of Stock'}
        </p>
      )}
    </div>
  );
}
