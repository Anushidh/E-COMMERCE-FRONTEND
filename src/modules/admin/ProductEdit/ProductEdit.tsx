import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import * as Tabs from '@radix-ui/react-tabs';
import { Spinner, BackButton } from '@shared/components';
import { useProductDetail } from '@/hooks/useProducts';
import { GeneralTab } from './tabs/GeneralTab';
import { ImagesTab } from './tabs/ImagesTab';
import { VariantsTab } from './tabs/VariantsTab';
import styles from './ProductEdit.module.css';

export default function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useProductDetail(id || '');

  if (isLoading) {
    return <div className={styles.loader}><Spinner size="lg" /></div>;
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
