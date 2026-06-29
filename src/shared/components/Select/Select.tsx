import { useState, useRef, useEffect, useId, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select...',
  error,
  disabled = false,
  fullWidth = true,
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const listId = useId();

  const selectedOption = options.find((o) => o.value === value);

  const open = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    const idx = options.findIndex((o) => o.value === value);
    setHighlightedIndex(idx >= 0 ? idx : 0);
  }, [disabled, options, value]);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const selectOption = useCallback((optionValue: string) => {
    onChange?.(optionValue);
    close();
  }, [onChange, close]);

  // Close on outside click
  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, close]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) return;
    const dropdown = dropdownRef.current;
    if (!dropdown) return;
    const option = dropdown.children[highlightedIndex] as HTMLElement;
    if (option) {
      option.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && options[highlightedIndex]) {
          selectOption(options[highlightedIndex].value);
        } else {
          open();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          open();
        } else {
          setHighlightedIndex((prev) => (prev + 1) % options.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          open();
        } else {
          setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        }
        break;
      case 'Escape':
        close();
        break;
      case 'Tab':
        close();
        break;
    }
  };

  const wrapperClasses = [
    styles.wrapper,
    fullWidth ? styles.fullWidth : '',
    className,
  ].filter(Boolean).join(' ');

  const triggerClasses = [
    styles.trigger,
    isOpen ? styles.triggerOpen : '',
    error ? styles.triggerError : '',
    disabled ? styles.triggerDisabled : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses} ref={wrapperRef}>
      {label && <label className={styles.label} id={`${triggerId}-label`}>{label}</label>}
      <div className={styles.selectWrapper}>
        <button
          type="button"
          className={triggerClasses}
          onClick={() => isOpen ? close() : open()}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? `${triggerId}-label` : undefined}
          aria-controls={isOpen ? listId : undefined}
          aria-activedescendant={isOpen && highlightedIndex >= 0 ? `${listId}-${highlightedIndex}` : undefined}
          disabled={disabled}
        >
          <span className={selectedOption ? undefined : styles.placeholder}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
            <ChevronDown size={16} />
          </span>
        </button>

        {isOpen && (
          <div
            className={styles.dropdown}
            ref={dropdownRef}
            role="listbox"
            id={listId}
            aria-labelledby={label ? `${triggerId}-label` : undefined}
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={option.value === value}
                className={[
                  styles.option,
                  index === highlightedIndex ? styles.optionHighlighted : '',
                  option.value === value ? styles.optionSelected : '',
                ].filter(Boolean).join(' ')}
                onClick={() => selectOption(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
