import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { calendarService } from '../services/calendar';
import { CalendarDay } from '../types';
import { parseMonthKey } from '../utils/dateFilters';

export const CalendarPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const { month, year } = parseMonthKey(selectedMonth);
  const daysInMonth = new Date(year, month, 0).getDate();
  useEffect(() => { calendarService.month(month, year).then(setDays).catch(console.error); }, [selectedMonth]);
  const byDate = new Map(days.map((day) => [day.date, day]));

  return (
    <div className="min-h-screen">
      <Header title="Calendar" subtitle="Monthly transaction calendar." selectedMonth={selectedMonth} onDateRangeChange={setSelectedMonth} />
      <main className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_360px] lg:p-8">
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {Array.from({ length: daysInMonth }, (_, index) => {
            const date = `${year}-${String(month).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`;
            const item = byDate.get(date);
            return <button key={date} onClick={() => setSelectedDay(item || { date, expenses: 0, income: 0, transactions: [] })} className="min-h-24 rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm hover:border-blue-300"><p className="font-semibold">{index + 1}</p><p className="mt-2 text-xs text-red-600">Out Rs. {(item?.expenses || 0).toLocaleString('en-IN')}</p><p className="text-xs text-emerald-600">In Rs. {(item?.income || 0).toLocaleString('en-IN')}</p></button>;
          })}
        </section>
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-950">{selectedDay ? selectedDay.date : 'Select a date'}</h2>
          {!selectedDay || selectedDay.transactions.length === 0 ? <p className="mt-4 text-sm text-slate-500">No transactions for this day.</p> : <div className="mt-4 space-y-3">{selectedDay.transactions.map((tx, i) => <div key={i} className="rounded-lg bg-slate-50 p-3 text-sm"><p className="font-medium">{tx.title}</p><p className="text-slate-500">{tx.type} | Rs. {tx.amount.toLocaleString('en-IN')}</p></div>)}</div>}
        </aside>
      </main>
    </div>
  );
};
