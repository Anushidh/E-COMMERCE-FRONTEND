import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input } from '@shared/components';
import { useCategories } from '@/hooks/useCategories';
import type { ProductFilters } from '@shared/types/product';
import styles from './ShopFilters.module.css';

interface ShopFiltersProps {
  filters: ProductFilters;
  onFilterChange: (key: string, value: string | undefined) => void;
  onClear: () => void;
  onClose: () => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const GENDERS = ['Men', 'Women', 'Unisex'] as const;

export function ShopFilters({ filters, onFilterChange, onClear, onClose }: ShopFiltersProps) {
  const { data: categories } = useCategories();

  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Filters</h2>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close filters">
          <X size={18} />
        </button>
      </div>

      <div className={styles.filters}>
        {/* Category */}
        <div className={styles.group}>
          <h3 className={styles.groupTitle}>Category</h3>
          <div className={styles.chips}>
            {categories?.map((cat) => (
              <button
                key={cat._id}
                className={`${styles.chip} ${filters.category === cat._id ? styles.chipActive : ''}`}
                onClick={() =>
                  onFilterChange('category', filters.category === cat._id ? undefined : cat._id)
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className={styles.group}>
          <h3 className={styles.groupTitle}>Gender</h3>
          <div className={styles.chips}>
            {GENDERS.map((g) => (
              <button
                key={g}
                className={`${styles.chip} ${filters.gender === g ? styles.chipActive : ''}`}
                onClick={() => onFilterChange('gender', filters.gender === g ? undefined : g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className={styles.group}>
          <h3 className={styles.groupTitle}>Price</h3>
          <div className={styles.priceRange}>
            <Input
              placeholder="Min"
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value || undefined)}
            />
            <span className={styles.priceSeparator}>—</span>
            <Input
              placeholder="Max"
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value || undefined)}
            />
          </div>
        </div>

        {/* Size */}
        <div className={styles.group}>
          <h3 className={styles.groupTitle}>Size</h3>
          <div className={styles.chips}>
            {SIZES.map((s) => (
              <button
                key={s}
                className={`${styles.chip} ${filters.size === s ? styles.chipActive : ''}`}
                onClick={() => onFilterChange('size', filters.size === s ? undefined : s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className={styles.group}>
          <h3 className={styles.groupTitle}>Availability</h3>
          <div className={styles.chips}>
            <button
              className={`${styles.chip} ${filters.availability === 'instock' ? styles.chipActive : ''}`}
              onClick={() =>
                onFilterChange('availability', filters.availability === 'instock' ? undefined : 'instock')
              }
            >
              In Stock
            </button>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear all
        </Button>
        <Button size="sm" onClick={onClose}>
          Apply
        </Button>
      </div>
    </motion.div>
  );
}
