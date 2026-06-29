import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ConfirmDialog } from '../ConfirmDialog';
import styles from './BackButton.module.css';

interface BackButtonProps {
  to?: string;
  label?: string;
  isDirty?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
}

export function BackButton({
  to,
  label = 'Back',
  isDirty = false,
  confirmTitle = 'Unsaved changes',
  confirmDescription = 'You have unsaved changes. Are you sure you want to leave without saving?',
}: BackButtonProps) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      navigateAway();
    }
  };

  const navigateAway = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <button type="button" className={styles.back} onClick={handleClick}>
        <ArrowLeft size={16} className={styles.arrow} />
        {label}
      </button>
      <ConfirmDialog
        open={showConfirm}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel="Leave"
        cancelLabel="Stay"
        variant="warning"
        onConfirm={() => { setShowConfirm(false); navigateAway(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
