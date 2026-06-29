import { Helmet } from 'react-helmet-async';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { useDashboard } from '@/hooks/useAdmin';
import { Spinner } from '@shared/components';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <div className={styles.loader}><Spinner size="lg" /></div>;
  if (!data) return null;

  return (
    <>
      <Helmet><title>Dashboard — Admin</title></Helmet>

      <div className={styles.page}>
        {/* Stat cards */}
        <div className={styles.stats}>
          <StatCard icon={<DollarSign size={20} />} label="Today's Revenue" value={`₹${data.revenue.daily.toLocaleString('en-IN')}`} />
          <StatCard icon={<ShoppingCart size={20} />} label="Total Orders" value={data.totals.orders.toLocaleString()} />
          <StatCard icon={<Users size={20} />} label="Total Users" value={data.totals.users.toLocaleString()} />
          <StatCard icon={<Package size={20} />} label="Total Products" value={data.totals.products.toLocaleString()} />
        </div>

        {/* Revenue overview */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Revenue</h2>
          <div className={styles.revenueGrid}>
            <div className={styles.revenueItem}>
              <span className={styles.revenueLabel}>Daily</span>
              <span className={styles.revenueValue}>₹{data.revenue.daily.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.revenueItem}>
              <span className={styles.revenueLabel}>Weekly</span>
              <span className={styles.revenueValue}>₹{data.revenue.weekly.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.revenueItem}>
              <span className={styles.revenueLabel}>Monthly</span>
              <span className={styles.revenueValue}>₹{data.revenue.monthly.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.revenueItem}>
              <span className={styles.revenueLabel}>Yearly</span>
              <span className={styles.revenueValue}>₹{data.revenue.yearly.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        {data.revenueChart.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Monthly Revenue</h2>
            <div className={styles.chart}>
              {(() => {
                const maxRevenue = Math.max(...data.revenueChart.map((d) => d.revenue), 1);
                return data.revenueChart.map((d) => (
                  <div key={d._id} className={styles.chartBar}>
                    <div className={styles.chartBarFill} style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
                    <span className={styles.chartBarLabel}>{d._id.split('-')[1]}</span>
                    <span className={styles.chartBarValue}>₹{(d.revenue / 1000).toFixed(0)}k</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* Orders by status */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Orders by Status</h2>
          <div className={styles.statusGrid}>
            {data.ordersByStatus.map((item) => (
              <div key={item._id} className={styles.statusItem}>
                <span className={styles.statusLabel}>{item._id}</span>
                <span className={styles.statusCount}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Top Selling Products</h2>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Product</span>
              <span>Sold</span>
              <span>Price</span>
            </div>
            {data.topProducts.map((p) => (
              <div key={p._id} className={styles.tableRow}>
                <span className={styles.productName}>{p.name}</span>
                <span>{p.totalSold}</span>
                <span>₹{p.basePrice.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statInfo}>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </div>
  );
}
