import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from '../Button';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Close on Escape key (capture phase so it fires before Radix)
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        e.preventDefault();
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [open, onCancel]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div key="confirm-dialog" className={styles.portal}>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby={description ? 'confirm-dialog-desc' : undefined}
          >
            <div className={`${styles.icon} ${styles[variant]}`}>
              <AlertTriangle size={20} />
            </div>
            <h2 id="confirm-dialog-title" className={styles.title}>{title}</h2>
            {description && (
              <p id="confirm-dialog-desc" className={styles.description}>{description}</p>
            )}
            <div className={styles.actions}>
              <Button
                variant="secondary"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
              >
                {cancelLabel}
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
