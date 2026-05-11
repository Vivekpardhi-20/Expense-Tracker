import React, { useEffect, useState } from 'react';
import { Download, FileSpreadsheet, FileText, PieChart, TrendingUp } from 'lucide-react';
import { Header } from '../components/Header';
import { dashboardService } from '../services/dashboard';
import { investmentService } from '../services/investment';
import { lentMoneyService } from '../services/lentMoney';
import { BudgetStatus, CategoryWiseExpense, DashboardHistoryItem, DashboardStats, Investment, LentMoney } from '../types';

const formatMoney = (value: number) => `Rs. ${value.toLocaleString('en-IN')}`;

const emptyStats: DashboardStats = {
  total_expenses: 0,
  total_income: 0,
  savings: 0,
  receivable_amount: 0,
  total_investments: 0,
  total_transactions: 0,
  expenses_change_percent: 0,
  income_change_percent: 0,
  savings_change_percent: 0,
  transactions_change_percent: 0,
};

export const Reports: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [categories, setCategories] = useState<CategoryWiseExpense[]>([]);
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [lentMoney, setLentMoney] = useState<LentMoney[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [moneyMovements, setMoneyMovements] = useState<DashboardHistoryItem[]>([]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [summary, categoryData, budgetData, movementData] = await Promise.all([
          dashboardService.getStats(selectedMonth),
          dashboardService.getCategoryWiseExpenses(selectedMonth),
          dashboardService.getBudgetStatus(selectedMonth),
          dashboardService.getHistory('transactions', selectedMonth),
        ]);
        setStats(summary);
        setCategories(categoryData);
        setBudgets(budgetData);
        setMoneyMovements(movementData);
        setLentMoney(await lentMoneyService.list(selectedMonth));
        setInvestments(await investmentService.list(selectedMonth));
      } catch (error) {
        console.error('Error loading reports:', error);
        setStats(emptyStats);
        setCategories([]);
        setBudgets([]);
        setMoneyMovements([]);
      }
    };

    loadReports();
  }, [selectedMonth]);

  const markReturned = async (id: string) => {
    const updated = await lentMoneyService.markReturned(id);
    setLentMoney((entries) => entries.map((entry) => (entry.id === id ? updated : entry)));
    setStats((current) => ({
      ...current,
      receivable_amount: Math.max(0, current.receivable_amount - updated.amount),
      total_expenses: Math.max(0, current.total_expenses - updated.amount),
      savings: current.savings + updated.amount,
    }));
  };

  return (
    <div className="min-h-screen">
      <Header title="Reports" subtitle="Monthly summaries, category reports, and exports." selectedMonth={selectedMonth} onDateRangeChange={setSelectedMonth} />
      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Monthly Expenses</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{formatMoney(stats.total_expenses)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Monthly Income</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{formatMoney(stats.total_income)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Net Savings</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">{formatMoney(stats.savings)}</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <PieChart className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-950">Category-wise Report</h2>
            </div>
            {categories.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="font-semibold text-slate-800">No category report yet</p>
                <p className="mt-1 text-sm text-slate-500">Add categorized expenses to generate this report.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-800">{category.name}</span>
                      <span className="text-slate-500">{formatMoney(category.value)} | {category.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${category.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-950">Budget Audit</h2>
            </div>
            {budgets.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="font-semibold text-slate-800">No budgets configured yet</p>
                <p className="mt-1 text-sm text-slate-500">Budgets will appear here once added.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {budgets.map((budget) => (
                  <div key={budget.category} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900">{budget.category}</p>
                      <p className="text-sm text-slate-500">{formatMoney(budget.spent)} of {formatMoney(budget.limit)}</p>
                    </div>
                    <span className="text-sm font-semibold text-orange-600">{budget.percentage}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Money Movement Ledger</h2>
          {moneyMovements.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">No money movements found for this month.</div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[920px] text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    {['Date', 'Type', 'Title / Name', 'Category / Person', 'Amount', 'Impact', 'Status'].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {moneyMovements.map((movement) => {
                    const isNegative = ['EXPENSE', 'MONEY_LENT', 'INVESTMENT'].includes(movement.impact);
                    return (
                      <tr key={movement.id}>
                        <td className="px-4 py-3">{new Date(movement.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{movement.type}</td>
                        <td className="px-4 py-3">{movement.title}</td>
                        <td className="px-4 py-3">{movement.category}</td>
                        <td className={`px-4 py-3 font-bold ${isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
                          {isNegative ? '-' : '+'}Rs. {movement.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3">{movement.impact}</td>
                        <td className="px-4 py-3">{movement.status || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Money Lent Report</h2>
          {lentMoney.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">No money lent entries yet.</div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[920px] text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    {['Person Name', 'Amount', 'Given Date', 'Expected Return Date', 'Status', 'Returned Date', 'Notes', 'Action'].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lentMoney.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{entry.person_name}</td>
                      <td className="px-4 py-3">Rs. {entry.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">{new Date(entry.given_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{entry.expected_return_date ? new Date(entry.expected_return_date).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3">{entry.status}</td>
                      <td className="px-4 py-3">{entry.returned_date ? new Date(entry.returned_date).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3">{entry.notes || '-'}</td>
                      <td className="px-4 py-3">
                        {entry.status === 'PENDING' && <button onClick={() => markReturned(entry.id)} className="rounded-lg bg-emerald-600 px-3 py-2 font-semibold text-white hover:bg-emerald-700">Mark Returned</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Investment Report</h2>
          {investments.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">No investment transactions yet.</div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    {['Investment Type', 'Investment Name', 'Amount Invested', 'Purchase Date', 'Broker / Platform', 'Notes', 'Action'].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {investments.map((investment) => (
                    <tr key={investment.id}>
                      <td className="px-4 py-3">{investment.investment_type}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{investment.investment_name}</td>
                      <td className="px-4 py-3">Rs. {investment.amount_invested.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">{new Date(investment.purchase_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{investment.broker_name || '-'}</td>
                      <td className="px-4 py-3">{investment.notes || '-'}</td>
                      <td className="px-4 py-3 text-slate-400">Edit / Delete</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Export</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              <FileSpreadsheet className="h-4 w-4" />
              Export to Excel
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <FileText className="h-4 w-4" />
              Export to PDF
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Download className="h-4 w-4" />
              Download CSV
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
