import { useState, useRef, useEffect, useId } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './DatePicker.module.css';

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  minDate?: string;
  fullWidth?: boolean;
  className?: string;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  const year = parseInt(parts[0] || '0', 10);
  const month = parseInt(parts[1] || '1', 10);
  const day = parseInt(parts[2] || '1', 10);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  error,
  minDate,
  fullWidth = true,
  className = '',
}: DatePickerProps) {
  const today = new Date();
  const parsedValue = value ? new Date(value + 'T00:00:00') : null;

  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(parsedValue ? parsedValue.getMonth() : today.getMonth());
  const [viewYear, setViewYear] = useState(parsedValue ? parsedValue.getFullYear() : today.getFullYear());
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Update view when value changes externally
  useEffect(() => {
    if (parsedValue) {
      setViewMonth(parsedValue.getMonth());
      setViewYear(parsedValue.getFullYear());
    }
  }, [value]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectDate = (day: number, month: number, year: number) => {
    const dateStr = toDateString(year, month, day);
    onChange?.(dateStr);
    setIsOpen(false);
  };

  const isDisabled = (day: number, month: number, year: number): boolean => {
    if (!minDate) return false;
    const date = new Date(year, month, day);
    const min = new Date(minDate + 'T00:00:00');
    return date < min;
  };

  const isSelected = (day: number, month: number, year: number): boolean => {
    if (!parsedValue) return false;
    return parsedValue.getDate() === day && parsedValue.getMonth() === month && parsedValue.getFullYear() === year;
  };

  const isToday = (day: number, month: number, year: number): boolean => {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  // Build calendar grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays: { day: number; month: number; year: number; outside: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
    calendarDays.push({ day: daysInPrevMonth - i, month: prevM, year: prevY, outside: true });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, month: viewMonth, year: viewYear, outside: false });
  }

  // Next month leading days
  const remaining = 42 - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
    calendarDays.push({ day: d, month: nextM, year: nextY, outside: true });
  }

  const wrapperClasses = [styles.wrapper, fullWidth ? styles.fullWidth : '', className].filter(Boolean).join(' ');
  const triggerClasses = [styles.trigger, isOpen ? styles.triggerOpen : '', error ? styles.triggerError : ''].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses} ref={wrapperRef}>
      {label && <label className={styles.label} id={`${triggerId}-label`}>{label}</label>}
      <div className={styles.pickerWrapper}>
        <button
          type="button"
          className={triggerClasses}
          onClick={() => setIsOpen(!isOpen)}
          aria-labelledby={label ? `${triggerId}-label` : undefined}
        >
          <span className={value ? undefined : styles.placeholder}>
            {value ? formatDisplay(value) : placeholder}
          </span>
          <span className={styles.icon}>
            <Calendar size={16} />
          </span>
        </button>

        {isOpen && (
          <div className={styles.calendar}>
            <div className={styles.calendarHeader}>
              <button type="button" className={styles.navBtn} onClick={prevMonth} aria-label="Previous month">
                <ChevronLeft size={16} />
              </button>
              <span className={styles.calendarTitle}>{MONTHS[viewMonth]} {viewYear}</span>
              <button type="button" className={styles.navBtn} onClick={nextMonth} aria-label="Next month">
                <ChevronRight size={16} />
              </button>
            </div>

            <div className={styles.weekdays}>
              {WEEKDAYS.map((d) => (
                <span key={d} className={styles.weekday}>{d}</span>
              ))}
            </div>

            <div className={styles.days}>
              {calendarDays.map((cell, i) => {
                const disabled = isDisabled(cell.day, cell.month, cell.year);
                const selected = isSelected(cell.day, cell.month, cell.year);
                const todayCell = isToday(cell.day, cell.month, cell.year);

                const dayClasses = [
                  styles.day,
                  cell.outside ? styles.dayOutside : '',
                  selected ? styles.daySelected : '',
                  todayCell && !selected ? styles.dayToday : '',
                  disabled ? styles.dayDisabled : '',
                ].filter(Boolean).join(' ');

                return (
                  <button
                    key={i}
                    type="button"
                    className={dayClasses}
                    onClick={() => !disabled && selectDate(cell.day, cell.month, cell.year)}
                    disabled={disabled}
                    tabIndex={-1}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
