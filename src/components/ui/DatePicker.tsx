/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DatePickerProps {
  id: string;
  label?: string;
  value: string; // Expected format: 'YYYY-MM-DD' or ''
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  id,
  label,
  value,
  onChange,
  error,
  helperText,
  placeholder = 'Select date (YYYY-MM-DD)...',
  className = '',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Parse current value or default to today's date
  const parsedDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [currentYear, setCurrentYear] = useState(parsedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(parsedDate.getMonth()); // 0-indexed

  // Update calendar view when value props change
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setCurrentYear(d.getFullYear());
        setCurrentMonth(d.getMonth());
      }
    }
  }, [value]);

  // Handle click outside to close popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Year list: e.g. from 1900 to current year + 5
  const years: number[] = [];
  const startYear = 1900;
  const endYear = new Date().getFullYear() + 5;
  for (let y = endYear; y >= startYear; y--) {
    years.push(y);
  }

  // Get number of days in a month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get starting day of the month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const paddedMonth = String(currentMonth + 1).padStart(2, '0');
    const paddedDay = String(day).padStart(2, '0');
    const formattedDate = `${currentYear}-${paddedMonth}-${paddedDay}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  const handleSetToday = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  // Generate blank spots for the first week
  const blankDays = Array(firstDayIndex).fill(null);
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Format the input text
  const getFormattedValue = () => {
    if (!value) return '';
    try {
      const d = new Date(value + 'T00:00:00');
      if (isNaN(d.getTime())) return value;
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return value;
    }
  };

  return (
    <div ref={containerRef} className={`w-full flex flex-col gap-1.5 ${className}`} id={`${id}-container`}>
      {label && (
        <label
          id={`${id}-label`}
          className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative w-full" id={`${id}-wrapper`}>
        <div className="relative flex items-center">
          <input
            id={id}
            type="text"
            readOnly
            onClick={() => setIsOpen(!isOpen)}
            placeholder={placeholder}
            value={getFormattedValue()}
            className={`w-full bg-card border text-sm font-sans rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-cinema-amber-500 focus:border-transparent text-foreground pl-10 pr-10 py-2.5 text-left cursor-pointer ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-border'
            }`}
          />
          <CalendarIcon className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
          
          {value && (
            <button
              type="button"
              id={`${id}-clear-btn`}
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="absolute right-3.5 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded-md hover:bg-muted/80 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isOpen && (
          <div
            className="absolute top-full left-0 w-80 mt-1.5 bg-card border border-border rounded-xl shadow-2xl p-4 z-50 text-foreground flex flex-col gap-3 select-none"
            id={`${id}-calendar-popover`}
          >
            {/* Header controls: month/year select */}
            <div className="flex items-center justify-between gap-1.5" id={`${id}-calendar-header`}>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-border hover:bg-muted text-foreground cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex gap-1 flex-grow justify-center">
                {/* Month Dropdown */}
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                  className="bg-card text-foreground border border-border rounded-md px-1.5 py-1 text-xs font-semibold focus:outline-none focus:border-cinema-amber-500"
                >
                  {months.map((m, idx) => (
                    <option key={m} value={idx}>{m}</option>
                  ))}
                </select>

                {/* Year Dropdown */}
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                  className="bg-card text-foreground border border-border rounded-md px-1.5 py-1 text-xs font-semibold focus:outline-none focus:border-cinema-amber-500"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-border hover:bg-muted text-foreground cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-muted-foreground tracking-wider border-b border-border pb-1">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {blankDays.map((_, index) => (
                <div key={`blank-${index}`} className="aspect-square" />
              ))}
              
              {dayNumbers.map((day) => {
                const paddedMonth = String(currentMonth + 1).padStart(2, '0');
                const paddedDay = String(day).padStart(2, '0');
                const dateStr = `${currentYear}-${paddedMonth}-${paddedDay}`;
                const isSelected = value === dateStr;
                const isToday = new Date().toISOString().split('T')[0] === dateStr;

                return (
                  <button
                    key={`day-${day}`}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={`aspect-square w-full rounded-lg font-semibold transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-cinema-amber-500 text-slate-950 font-black scale-105 shadow-md shadow-cinema-amber-500/10'
                        : isToday
                        ? 'bg-cinema-amber-500/15 border border-cinema-amber-500/30 text-cinema-amber-500 font-bold'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="flex items-center justify-between border-t border-border pt-2 mt-1">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold text-muted-foreground hover:text-red-400 cursor-pointer transition-colors px-2 py-1 rounded"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleSetToday}
                className="text-xs font-semibold text-cinema-amber-500 hover:text-cinema-amber-600 cursor-pointer transition-colors px-2 py-1 rounded"
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-500 font-sans mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-xs text-muted-foreground font-sans mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
