import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import * as Tabs from '@radix-ui/react-tabs';
import { Skeleton, BackButton } from '@shared/components';
import { useProductDetail } from '@/hooks/useProducts';
import { GeneralTab } from './tabs/GeneralTab';
import { ImagesTab } from './tabs/ImagesTab';
import { VariantsTab } from './tabs/VariantsTab';
import styles from './ProductEdit.module.css';

export default function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useProductDetail(id || '');

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Skeleton width="100px" height="1rem" />
        <div style={{ display: 'flex', gap: 'var(--space-4)', borderBottom: '1px solid var(--border-secondary)', paddingBottom: 'var(--space-3)' }}>
          <Skeleton width="70px" height="1rem" />
          <Skeleton width="80px" height="1rem" />
          <Skeleton width="90px" height="1rem" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Skeleton width="100%" height="2.5rem" />
            <Skeleton width="100%" height="2.5rem" />
          </div>
          <Skeleton width="100%" height="6rem" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Skeleton width="100%" height="2.5rem" />
            <Skeleton width="100%" height="2.5rem" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Skeleton width="100%" height="2.5rem" />
            <Skeleton width="100%" height="2.5rem" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className={styles.notFound}>Product not found</div>;
  }

  const { product, variants } = data;

  return (
    <>
      <Helmet><title>{product.name} — Edit — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <BackButton to="/admin/products" label="Products" />
        </div>

        <Tabs.Root defaultValue="general" className={styles.tabs}>
          <Tabs.List className={styles.tabList}>
            <Tabs.Trigger value="general" className={styles.tabTrigger}>General</Tabs.Trigger>
            <Tabs.Trigger value="images" className={styles.tabTrigger}>Images ({product.images.length})</Tabs.Trigger>
            <Tabs.Trigger value="variants" className={styles.tabTrigger}>Variants ({variants.length})</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="general" className={styles.tabContent}>
            <GeneralTab product={product} />
          </Tabs.Content>
          <Tabs.Content value="images" className={styles.tabContent}>
            <ImagesTab productId={product._id} images={product.images} />
          </Tabs.Content>
          <Tabs.Content value="variants" className={styles.tabContent}>
            <VariantsTab productId={product._id} variants={variants} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </>
  );
}
