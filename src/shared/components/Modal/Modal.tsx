import { type ReactNode, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnOutsideClick?: boolean;
}

export function Modal({ open, onClose, title, description, children, size = 'md', closeOnOutsideClick = false, }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <Dialog.Root open={open} onOpenChange={() => {}} modal={false}>
      <Dialog.Portal>
        <div className={styles.overlay} onClick={() => { if (closeOnOutsideClick) onClose(); }} />
        <Dialog.Content
          className={`${styles.content} ${styles[size]}`}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          {title && (
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
          )}
          {description && (
            <Dialog.Description className={styles.description}>{description}</Dialog.Description>
          )}
          {children}
          <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
