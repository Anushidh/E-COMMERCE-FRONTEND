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

/** Reusable table skeleton for admin pages */
interface TableSkeletonProps {
  columns: number;
  rows?: number;
  gridTemplate?: string;
  minWidth?: string;
}

export function TableSkeleton({ columns, rows = 6, gridTemplate, minWidth }: TableSkeletonProps) {
  const columnWidths = Array.from({ length: columns }, (_, i) => {
    if (i === 0) return '40%';
    if (i === columns - 1) return '50%';
    return `${60 + Math.round(Math.random() * 20)}%`;
  });

  return (
    <div className={styles.tableWrapper}>
      <div
        className={styles.tableHeaderSkeleton}
        style={{
          ...(gridTemplate ? { gridTemplateColumns: gridTemplate } : { gridTemplateColumns: `repeat(${columns}, 1fr)` }),
          ...(minWidth ? { minWidth } : {})
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width="70%" height="0.625rem" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className={styles.tableRowSkeleton}
          style={{
            ...(gridTemplate ? { gridTemplateColumns: gridTemplate } : { gridTemplateColumns: `repeat(${columns}, 1fr)` }),
            ...(minWidth ? { minWidth } : {})
          }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} width={columnWidths[colIdx]} height="0.75rem" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Reusable card grid skeleton for admin pages (e.g. Categories) */
interface CardGridSkeletonProps {
  cards?: number;
}

export function CardGridSkeleton({ cards = 6 }: CardGridSkeletonProps) {
  return (
    <div className={styles.cardGrid}>
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className={styles.cardSkeleton}>
          <Skeleton height="140px" borderRadius="var(--radius-none)" />
          <div className={styles.cardSkeletonBody}>
            <Skeleton width="60%" height="0.75rem" />
            <Skeleton width="90%" height="0.625rem" />
            <Skeleton width="40%" height="0.625rem" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Reusable list skeleton for admin pages (e.g. Reviews) */
interface ListSkeletonProps {
  items?: number;
}

export function ListSkeleton({ items = 5 }: ListSkeletonProps) {
  return (
    <div className={styles.listSkeleton}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className={styles.listItemSkeleton}>
          <div className={styles.listItemHeader}>
            <Skeleton width="120px" height="0.75rem" />
            <Skeleton width="80px" height="0.625rem" />
          </div>
          <Skeleton width="100%" height="0.625rem" />
          <Skeleton width="75%" height="0.625rem" />
        </div>
      ))}
    </div>
  );
}
