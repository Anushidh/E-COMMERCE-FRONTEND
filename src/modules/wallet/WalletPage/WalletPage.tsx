import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useWallet, useWalletTransactions } from '@/hooks/useUser';
import { Button, Spinner } from '@shared/components';
import styles from './WalletPage.module.css';

export default function WalletPage() {
  const [page, setPage] = useState(1);
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { data: txData, isLoading: txLoading } = useWalletTransactions({ page });

  if (walletLoading) return <div className={styles.loader}><Spinner size="lg" /></div>;

  return (
    <>
      <Helmet><title>Wallet — STORE</title></Helmet>
      <div className={styles.page}>
        <div className={styles.balance}>
          <Wallet size={24} />
          <div>
            <span className={styles.balanceLabel}>Wallet Balance</span>
            <span className={styles.balanceValue}>₹{(wallet?.balance || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Transaction History</h2>

        {txLoading ? <Spinner /> : (
          <>
            <div className={styles.list}>
              {txData?.transactions.map((tx) => (
                <div key={tx._id} className={styles.txItem}>
                  <div className={styles.txIcon}>
                    {tx.type === 'credit' ? <ArrowDownRight size={16} className={styles.credit} /> : <ArrowUpRight size={16} className={styles.debit} />}
                  </div>
                  <div className={styles.txInfo}>
                    <span className={styles.txDesc}>{tx.description}</span>
                    <span className={styles.txDate}>{new Date(tx.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <span className={`${styles.txAmount} ${tx.type === 'credit' ? styles.credit : styles.debit}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
              {txData?.transactions.length === 0 && <p className={styles.empty}>No transactions yet</p>}
            </div>

            {txData && txData.pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <span className={styles.pageInfo}>Page {page} of {txData.pagination.totalPages}</span>
                <Button variant="secondary" size="sm" disabled={page >= txData.pagination.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
