import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wallet, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useWallet, useWalletTransactions } from '@/hooks/useUser';
import { apiClient } from '@shared/api/client';
import { Button, Input, Spinner } from '@shared/components';
import styles from './WalletPage.module.css';

const QUICK_AMOUNTS = [100, 500, 1000, 2000];

export default function WalletPage() {
  const [page, setPage] = useState(1);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { data: txData, isLoading: txLoading } = useWalletTransactions({ page });
  const qc = useQueryClient();

  const handleAddMoney = async () => {
    const value = Number(amount);
    if (!value || value < 10) {
      toast.error('Minimum top-up is ₹10');
      return;
    }
    if (value > 50000) {
      toast.error('Maximum top-up is ₹50,000');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/wallet/add-money', { amount: value });
      const { razorpayOrder } = res.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: 'STORE',
        description: 'Wallet Top-up',
        handler: async (response: any) => {
          try {
            await apiClient.post('/wallet/verify-topup', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: value,
            });
            toast.success(`₹${value} added to wallet!`);
            setAmount('');
            qc.invalidateQueries({ queryKey: ['wallet'] });
            qc.invalidateQueries({ queryKey: ['walletTransactions'] });
          } catch {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  if (walletLoading) return <div className={styles.loader}><Spinner size="lg" /></div>;

  return (
    <>
      <Helmet><title>Wallet — STORE</title></Helmet>
      <div className={styles.page}>
        {/* Balance Card */}
        <div className={styles.balance}>
          <Wallet size={24} />
          <div>
            <span className={styles.balanceLabel}>Wallet Balance</span>
            <span className={styles.balanceValue}>₹{(wallet?.balance || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Add Money Section */}
        <div className={styles.addMoney}>
          <h2 className={styles.sectionTitle}>Add Money</h2>
          <div className={styles.quickAmounts}>
            {QUICK_AMOUNTS.map((amt) => (
              <button key={amt} className={`${styles.quickBtn} ${amount === String(amt) ? styles.quickBtnActive : ''}`} onClick={() => setAmount(String(amt))}>
                ₹{amt}
              </button>
            ))}
          </div>
          <div className={styles.addMoneyRow}>
            <Input
              placeholder="Enter amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              leftIcon={<span className={styles.rupee}>₹</span>}
            />
            <Button onClick={handleAddMoney} loading={loading} leftIcon={<Plus size={16} />}>
              Add Money
            </Button>
          </div>
        </div>

        {/* Transaction History */}
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
                    <span className={styles.txDate}>{new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
