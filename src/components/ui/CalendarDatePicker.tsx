import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
interface Props {
  value: string;
  min?: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  label?: string;
}
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseISO = (s?: string) => (s ? new Date(`${s}T00:00:00`) : new Date());
export const CalendarDatePicker: React.FC<Props> = ({ value, min, onChange, disabled, className, triggerClassName, label }) => {
  const [open, setOpen] = useState(false);
  const selected = parseISO(value);
  const minDate = parseISO(min);
  const [viewMonth, setViewMonth] = useState<Date>(() => new Date(selected));
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  useEffect(() => {
    if (value) setViewMonth(parseISO(value));
  }, [value]);
  const weeks = useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const last = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
    const startOffset = (first.getDay() + 6) % 7;
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= last.getDate(); d++) {
      cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
    }
    const rows: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [viewMonth]);
  const monthLabel = useMemo(() => {
    return viewMonth.toLocaleString("en-US", { month: "long", year: "numeric" });
  }, [viewMonth]);
  const isDisabled = (d: Date) => min ? d.getTime() < minDate.getTime() : false;
  const isSelected = (d: Date) => toISO(d) === toISO(selected);
  const onPick = (d: Date) => {
    if (disabled) return;
    if (isDisabled(d)) return;
    onChange(toISO(d));
    setOpen(false);
  };
  return (
    <div className={className} ref={ref}>
      <label className="block text-xs text-gray-500 mb-1 ml-1 font-medium">{label || "Tanggal"}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full justify-between ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-red-400 hover:bg-white"} ${triggerClassName || ""}`}
      >
        <div className="flex items-center">
          <FiCalendar className="text-gray-400 mr-3 text-lg" />
          <span className="text-gray-700 font-medium">{value ? parseISO(value).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "Pick a date"}</span>
        </div>
        <span className="text-xs text-gray-400">▼</span>
      </button>
      {open && !disabled && (
        <div className="absolute z-30 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="px-4 pt-3 pb-2 bg-gradient-to-b from-blue-50 to-transparent rounded-t-2xl">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              >
                <FiChevronLeft />
              </button>
              <div className="text-gray-800 font-semibold">{monthLabel}</div>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
          <div className="px-4 pb-3">
            <div className="grid grid-cols-7 text-center text-[12px] text-gray-500 mb-2">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div className="text-red-500">Sun</div>
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center pb-2">
              {weeks.map((row, ri) => (
                <React.Fragment key={ri}>
                  {row.map((cell, ci) =>
                    cell ? (
                      <button
                        key={`${ri}-${ci}`}
                        type="button"
                        onClick={() => onPick(cell)}
                        disabled={isDisabled(cell)}
                        className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center
                          ${isSelected(cell) ? "ring-2 ring-blue-400 text-blue-600" : ""}
                          ${cell.getDay() === 0 ? "text-red-500" : "text-gray-800"}
                          ${isDisabled(cell) ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-50"}
                        `}
                      >
                        {cell.getDate()}
                      </button>
                    ) : (
                      <span key={`${ri}-${ci}`} className="w-8 h-8" />
                    )
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
