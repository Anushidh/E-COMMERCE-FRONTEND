import { Helmet } from 'react-helmet-async';
import { Copy, Gift, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReferrals } from '@/hooks/useUser';
import { Badge, Spinner, Button } from '@shared/components';
import styles from './Referrals.module.css';

export default function Referrals() {
  const { data, isLoading } = useReferrals();

  if (isLoading) return <div className={styles.loader}><Spinner size="lg" /></div>;
  if (!data) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(data.referralCode);
    toast.success('Referral code copied!');
  };

  return (
    <>
      <Helmet><title>Referrals — Wearhaus</title></Helmet>
      <div className={styles.page}>
        <div className={styles.codeCard}>
          <Gift size={24} />
          <div>
            <p className={styles.codeLabel}>Your Referral Code</p>
            <div className={styles.codeRow}>
              <span className={styles.code}>{data.referralCode}</span>
              <button className={styles.copyBtn} onClick={copyCode} aria-label="Copy code"><Copy size={14} /></button>
            </div>
            <p className={styles.codeHint}>Share this code. When your friend signs up and completes their first order, you earn ₹100 in your wallet.</p>
            <div className={styles.shareActions}>
              <Button size="sm" variant="secondary" leftIcon={<Copy size={14} />} onClick={copyCode}>
                Copy Code
              </Button>
              <Button size="sm" variant="secondary" leftIcon={<Share2 size={14} />} onClick={() => {
                const signupUrl = `${window.location.origin}/signup?ref=${data.referralCode}`;
                const message = `Hey! Use my referral code *${data.referralCode}* to sign up on Wearhaus and get exciting offers!\n\n${signupUrl}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
              }}>
                Share on WhatsApp
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}><span className={styles.statValue}>{data.stats.totalReferrals}</span><span className={styles.statLabel}>Total</span></div>
          <div className={styles.statItem}><span className={styles.statValue}>{data.stats.totalRewarded}</span><span className={styles.statLabel}>Rewarded</span></div>
          <div className={styles.statItem}><span className={styles.statValue}>{data.stats.totalPending}</span><span className={styles.statLabel}>Pending</span></div>
        </div>

        {data.referrals.length > 0 && (
          <div className={styles.list}>
            <h2 className={styles.sectionTitle}>Referral History</h2>
            {data.referrals.map((ref) => (
              <div key={ref._id} className={styles.refItem}>
                <div>
                  <span className={styles.refName}>{ref.referee.name}</span>
                  <span className={styles.refEmail}>{ref.referee.email}</span>
                </div>
                <Badge variant={ref.status === 'Rewarded' ? 'success' : 'default'}>{ref.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
