import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--radius-sm)',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

/** Preset: Product card skeleton */
export function ProductCardSkeleton() {
  return (
    <div className={styles.productCard}>
      <Skeleton height="320px" borderRadius="var(--radius-none)" />
      <div className={styles.productCardBody}>
        <Skeleton width="60%" height="0.75rem" />
        <Skeleton width="40%" height="0.75rem" />
      </div>
    </div>
  );
}
