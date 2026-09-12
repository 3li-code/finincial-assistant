import { createContext, useContext, useMemo, useState } from 'react'
import { computeEngine } from './engine'
import { uid } from './format'

const Store = createContext(null)

const seed = {
  settings: { currency: 'YER', name: 'أحمد', floor: 50000 },
  accounts: [
    { id: 'acc_cash', name: 'نقد', type: 'cash', opening: 85000 },
    { id: 'acc_bank', name: 'حساب بنكي', type: 'bank', opening: 720000 },
    { id: 'acc_wallet', name: 'محفظة إلكترونية', type: 'wallet', opening: 45000 },
    { id: 'acc_save', name: 'حساب ادخار', type: 'savings', opening: 210000 },
  ],
  transactions: [
    { id: 't1', type: 'income', amount: 500000, accountId: 'acc_bank', categoryId: 'salary', date: '2026-08-30', payee: 'الراتب', notes: '' },
    { id: 't2', type: 'expense', amount: 120000, accountId: 'acc_bank', categoryId: 'home', date: '2026-09-01', payee: 'الإيجار', notes: '' },
    { id: 't3', type: 'expense', amount: 18500, accountId: 'acc_cash', categoryId: 'food', date: '2026-09-05', payee: 'سوبرماركت', notes: '' },
    { id: 't4', type: 'expense', amount: 7200, accountId: 'acc_wallet', categoryId: 'transport', date: '2026-09-07', payee: 'بنزين', notes: '' },
    { id: 't5', type: 'expense', amount: 30000, accountId: 'acc_bank', categoryId: 'telecom', date: '2026-09-03', payee: 'إنترنت', notes: '' },
    { id: 't6', type: 'expense', amount: 14000, accountId: 'acc_cash', categoryId: 'fun', date: '2026-09-08', payee: 'مطعم', notes: '' },
    { id: 't7', type: 'expense', amount: 22000, accountId: 'acc_bank', categoryId: 'shop', date: '2026-09-10', payee: 'ملابس', notes: '' },
    { id: 't8', type: 'income', amount: 35000, accountId: 'acc_wallet', categoryId: 'freelance', date: '2026-09-06', payee: 'عمل حر', notes: '' },
    { id: 't9', type: 'debt_payment', amount: 40000, accountId: 'acc_bank', categoryId: 'debt', date: '2026-09-04', payee: 'أحمد', notes: 'دفعة دين' },
  ],
  debts: [
    {
      id: 'd1',
      direction: 'owed_by_me',
      counterparty: 'أحمد',
      original: 100000,
      createdAt: '2026-09-01',
      dueDate: '2026-10-20',
      status: 'open',
      payments: [{ id: 'p1', amount: 40000, date: '2026-09-04' }],
    },
    {
      id: 'd2',
      direction: 'owed_to_me',
      counterparty: 'محمد',
      original: 50000,
      createdAt: '2026-08-20',
      dueDate: '2026-10-05',
      status: 'open',
      payments: [],
    },
    {
      id: 'd3',
      direction: 'owed_by_me',
      counterparty: 'بنك التقسيط',
      original: 180000,
      createdAt: '2026-07-01',
      dueDate: '2026-10-05',
      status: 'open',
      payments: [{ id: 'p2', amount: 55000, date: '2026-08-05' }],
    },
  ],
  recurring: [
    { id: 'r1', type: 'income', title: 'راتب', amount: 500000, nextDate: '2026-09-30', frequency: 'monthly' },
    { id: 'r2', type: 'expense', title: 'إيجار', amount: 120000, nextDate: '2026-10-01', frequency: 'monthly' },
    { id: 'r3', type: 'expense', title: 'قسط', amount: 50000, nextDate: '2026-10-05', frequency: 'monthly' },
  ],
  subscriptions: [
    { id: 's1', name: 'إنترنت', amount: 30000, nextDate: '2026-10-03', frequency: 'monthly' },
    { id: 's2', name: 'منصة رقمية', amount: 4500, nextDate: '2026-09-20', frequency: 'monthly' },
  ],
  budgets: [
    { id: 'b1', categoryId: 'food', limit: 100000 },
    { id: 'b2', categoryId: 'transport', limit: 70000 },
    { id: 'b3', categoryId: 'fun', limit: 30000 },
    { id: 'b4', categoryId: 'shop', limit: 50000 },
  ],
  goals: [
    { id: 'g1', name: 'لابتوب', target: 1000000, current: 600000, due: '2027-01-12', priority: 'عالية' },
    { id: 'g2', name: 'صندوق طوارئ', target: 400000, current: 210000, due: '2026-12-01', priority: 'متوسطة' },
  ],
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(seed)
  const engine = useMemo(() => computeEngine(state), [state])

  function addTx(tx) {
    setState((s) => ({ ...s, transactions: [{ ...tx, id: uid('t') }, ...s.transactions] }))
  }
  function addAccount(acc) {
    setState((s) => ({ ...s, accounts: [...s.accounts, { ...acc, id: uid('acc') }] }))
  }
  function addDebt(debt) {
    setState((s) => ({ ...s, debts: [...s.debts, { ...debt, id: uid('d'), payments: [], status: 'open' }] }))
  }
  function payDebt(id, amount, date) {
    setState((s) => ({
      ...s,
      debts: s.debts.map((d) =>
        d.id === id ? { ...d, payments: [...d.payments, { id: uid('p'), amount: Number(amount), date }] } : d
      ),
      transactions: [
        { id: uid('t'), type: 'debt_payment', amount: Number(amount), accountId: s.accounts[1]?.id || s.accounts[0].id, categoryId: 'debt', date, payee: 'سداد دين', notes: '' },
        ...s.transactions,
      ],
    }))
  }
  function addBudget(b) {
    setState((s) => ({ ...s, budgets: [...s.budgets, { ...b, id: uid('b') }] }))
  }
  function addGoal(g) {
    setState((s) => ({ ...s, goals: [...s.goals, { ...g, id: uid('g') }] }))
  }
  function addSub(sub) {
    setState((s) => ({ ...s, subscriptions: [...s.subscriptions, { ...sub, id: uid('s') }] }))
  }
  function addRecurring(r) {
    setState((s) => ({ ...s, recurring: [...s.recurring, { ...r, id: uid('r') }] }))
  }
  function contributeGoal(id, amount) {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g) => (g.id === id ? { ...g, current: Number(g.current) + Number(amount) } : g)),
    }))
  }
  function setCurrency(currency) {
    setState((s) => ({ ...s, settings: { ...s.settings, currency } }))
  }

  return (
    <Store.Provider
      value={{
        state,
        engine,
        addTx,
        addAccount,
        addDebt,
        payDebt,
        addBudget,
        addGoal,
        addSub,
        addRecurring,
        contributeGoal,
        setCurrency,
      }}
    >
      {children}
    </Store.Provider>
  )
}

export function useStore() {
  return useContext(Store)
}
