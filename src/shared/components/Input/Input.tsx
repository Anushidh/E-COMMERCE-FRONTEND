import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, fullWidth = true, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const wrapperClasses = [
      styles.wrapper,
      fullWidth ? styles.fullWidth : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      styles.input,
      error ? styles.inputError : '',
      leftIcon ? styles.hasLeftIcon : '',
      rightIcon ? styles.hasRightIcon : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            {...props}
          />
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>
        {error && (
          <p id={errorId} className={styles.error} role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
