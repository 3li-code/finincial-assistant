import { createContext, useContext, useMemo, useState } from 'react'
import { computeEngine } from './engine'
import { uid } from './format'

const Store = createContext(null)

/** حالة أول دخول: لا حسابات ولا عمليات حتى يضيفها المستخدم */
const seed = {
  settings: { currency: 'YER', name: '', floor: 50000 },
  accounts: [],
  transactions: [],
  debts: [],
  recurring: [],
  subscriptions: [],
  budgets: [],
  goals: [],
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
        { id: uid('t'), type: 'debt_payment', amount: Number(amount), accountId: s.accounts[0]?.id, categoryId: 'debt', date, payee: 'سداد دين', notes: '' },
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
