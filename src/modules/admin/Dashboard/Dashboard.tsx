import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { DollarSign, ShoppingCart, Users, Package, RotateCcw } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useDashboard, useLowStock, useAdminUsers } from '@/hooks/useAdmin';
import { Skeleton } from '@shared/components';
import styles from './Dashboard.module.css';

const CATEGORY_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const { data, isLoading } = useDashboard();
  const { data: lowStockItems } = useLowStock();
  const { data: usersData } = useAdminUsers({ page: 1 });

  if (isLoading) return <DashboardSkeleton />;
  if (!data) return null;

  // Compute return rate
  const returnedCount = data.ordersByStatus.find((s) => s._id === 'Returned')?.count || 0;
  const deliveredCount = data.ordersByStatus.find((s) => s._id === 'Delivered')?.count || 0;
  const returnRate = deliveredCount > 0 ? ((returnedCount / deliveredCount) * 100).toFixed(1) : '0';

  // Generate sparkline data from revenue chart (or fake if not enough data)
  const revenueSparkline = data.revenueChart.length > 1
    ? data.revenueChart.map((d) => ({ v: d.revenue }))
    : [{ v: 10 }, { v: 25 }, { v: 18 }, { v: 35 }, { v: 28 }, { v: 42 }, { v: 38 }];

  const ordersSparkline = data.revenueChart.length > 1
    ? data.revenueChart.map((d) => ({ v: d.orders }))
    : [{ v: 3 }, { v: 5 }, { v: 4 }, { v: 8 }, { v: 6 }, { v: 10 }, { v: 7 }];

  const usersSparkline = data.newUsers.length > 1
    ? data.newUsers.slice(-7).map((d) => ({ v: d.count }))
    : [{ v: 1 }, { v: 2 }, { v: 1 }, { v: 3 }, { v: 2 }, { v: 4 }, { v: 3 }];

  return (
    <>
      <Helmet><title>Dashboard — Admin</title></Helmet>
      <div className={styles.page}>
        {/* Greeting */}
        <div className={styles.greeting}>
          <h1 className={styles.greetingTitle}>Good {getGreeting()}</h1>
          <p className={styles.greetingSubtitle}>Here's what's happening with your store today.</p>
        </div>

        {/* Stat Cards */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={`${styles.statIcon} ${styles.iconSales}`}><DollarSign size={16} /></div>
              <span className={styles.statLabel}>Total Sales</span>
            </div>
            <span className={styles.statValue}>₹{data.revenue.monthly.toLocaleString('en-IN')}</span>
            <span className={styles.statChange}>This month</span>
            <div className={styles.sparkline}>
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={revenueSparkline}>
                  <Area type="monotone" dataKey="v" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={`${styles.statIcon} ${styles.iconOrders}`}><ShoppingCart size={16} /></div>
              <span className={styles.statLabel}>Orders</span>
            </div>
            <span className={styles.statValue}>{data.totals.orders.toLocaleString()}</span>
            <span className={styles.statChange}>All time</span>
            <div className={styles.sparkline}>
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={ordersSparkline}>
                  <Area type="monotone" dataKey="v" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={`${styles.statIcon} ${styles.iconCustomers}`}><Users size={16} /></div>
              <span className={styles.statLabel}>Customers</span>
            </div>
            <span className={styles.statValue}>{data.totals.users.toLocaleString()}</span>
            <span className={styles.statChange}>Registered</span>
            <div className={styles.sparkline}>
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={usersSparkline}>
                  <Area type="monotone" dataKey="v" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={`${styles.statIcon} ${styles.iconReturns}`}><RotateCcw size={16} /></div>
              <span className={styles.statLabel}>Return Rate</span>
            </div>
            <span className={styles.statValue}>{returnRate}%</span>
            <span className={styles.statChange}>{returnedCount} of {deliveredCount} delivered</span>
            <div className={styles.sparkline}>
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={[{ v: 2 }, { v: 1 }, { v: 3 }, { v: 1 }, { v: 2 }, { v: 0 }, { v: 1 }]}>
                  <Area type="monotone" dataKey="v" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Main grid — chart + top products + recent orders */}
        <div className={styles.mainGrid}>
          {/* Revenue Chart */}
          <div className={styles.chartSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Sales Overview</h2>
            </div>
            {data.revenueChart.length > 0 ? (
              <div className={styles.areaChart}>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data.revenueChart.map((d) => ({ month: getMonthLabel(d._id), revenue: d.revenue, orders: d.orders }))}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`} width={50} />
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGradient)" dot={false} activeDot={{ r: 4, fill: '#6366f1' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className={styles.chartEmpty}>No revenue data yet</div>
            )}
          </div>

          {/* Top Selling Products */}
          <div className={styles.sideSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Top Products</h2>
              <Link to="/admin/products" className={styles.viewAll}>View all</Link>
            </div>
            <div className={styles.productList}>
              {data.topProducts.slice(0, 5).map((p) => (
                <div key={p._id} className={styles.productItem}>
                  <div className={styles.productImg}>
                    {p.images?.[0] ? <img src={p.images[0]} alt="" /> : <Package size={16} />}
                  </div>
                  <div className={styles.productInfo}>
                    <span className={styles.productName}>{p.name}</span>
                    <span className={styles.productPrice}>₹{p.basePrice.toLocaleString('en-IN')}</span>
                  </div>
                  <span className={styles.productSold}>{p.totalSold} sold</span>
                </div>
              ))}
              {data.topProducts.length === 0 && <p className={styles.empty}>No sales yet</p>}
            </div>
          </div>
        </div>

        {/* Bottom grid — low stock + sales by category + recent customers */}
        <div className={styles.bottomGrid}>
          {/* Low Stock Alert */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Low Stock Alert</h2>
              <Link to="/admin/inventory" className={styles.viewAll}>View all</Link>
            </div>
            <div className={styles.lowStockList}>
              {lowStockItems && lowStockItems.length > 0 ? (
                lowStockItems.slice(0, 4).map((item: any) => (
                  <div key={item._id} className={styles.lowStockItem}>
                    <div className={styles.lowStockImg}>
                      {item.product?.images?.[0] ? <img src={item.product.images[0]} alt="" /> : <Package size={14} />}
                    </div>
                    <div className={styles.lowStockInfo}>
                      <span className={styles.lowStockName}>{item.product?.name || 'Unknown'}</span>
                      <span className={styles.lowStockVariant}>{item.size} / {item.color}</span>
                    </div>
                    <span className={`${styles.lowStockCount} ${item.stock === 0 ? styles.outOfStock : ''}`}>
                      {item.stock} left
                    </span>
                  </div>
                ))
              ) : (
                <p className={styles.empty}>All stock levels healthy</p>
              )}
            </div>
          </div>

          {/* Sales by Category */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Sales by Category</h2>
            </div>
            {data.topCategories.length > 0 ? (
              <div className={styles.categoryChart}>
                <div className={styles.pieWrapper}>
                  <ResponsiveContainer width={140} height={140}>
                    <PieChart>
                      <Pie
                        data={data.topCategories.slice(0, 5)}
                        dataKey="totalSold"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        strokeWidth={2}
                        stroke="#fff"
                      >
                        {data.topCategories.slice(0, 5).map((_: any, i: number) => (
                          <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className={styles.categoryLegend}>
                  {data.topCategories.slice(0, 5).map((cat: any, i: number) => (
                    <div key={cat._id} className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                      <span className={styles.legendLabel}>{cat.name}</span>
                      <span className={styles.legendValue}>{cat.totalSold} sold</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className={styles.empty}>No category sales data yet</p>
            )}
          </div>

          {/* Recent Customers */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Customers</h2>
              <Link to="/admin/users" className={styles.viewAll}>View all</Link>
            </div>
            <div className={styles.customerList}>
              {usersData?.users && usersData.users.length > 0 ? (
                usersData.users.slice(0, 5).map((user: any) => (
                  <Link to={`/admin/users/${user._id}`} key={user._id} className={styles.customerItem}>
                    <div className={styles.customerAvatar}>
                      {user.avatar ? <img src={user.avatar} alt="" className={styles.customerAvatarImg} /> : user.name[0].toUpperCase()}
                    </div>
                    <div className={styles.customerInfo}>
                      <span className={styles.customerName}>{user.name}</span>
                      <span className={styles.customerEmail}>{user.email}</span>
                    </div>
                    <span className={styles.customerJoined}>{new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </Link>
                ))
              ) : (
                <p className={styles.empty}>No customers yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <Skeleton width="250px" height="1.75rem" />
        <Skeleton width="300px" height="1rem" />
      </div>
      <div className={styles.stats}>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} width="100%" height="120px" borderRadius="var(--radius-md)" />)}
      </div>
      <div className={styles.mainGrid}>
        <Skeleton width="100%" height="280px" borderRadius="var(--radius-md)" />
        <Skeleton width="100%" height="280px" borderRadius="var(--radius-md)" />
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getMonthLabel(dateStr: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = parseInt(dateStr.split('-')[1] || '1', 10) - 1;
  return months[monthIndex] || '';
}
