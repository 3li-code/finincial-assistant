import { useState } from 'react'
import { useStore } from '../lib/store'
import { CATEGORIES, INCOME_TYPES, formatMoney, formatDate, todayISO } from '../lib/format'

export default function Transactions() {
  const { state, engine, addTx, addRecurring } = useStore()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({
    type: 'expense', amount: '', accountId: state.accounts[0]?.id, categoryId: 'food', date: todayISO(), payee: '', notes: '', recurring: false, frequency: 'monthly',
  })

  const list = state.transactions.filter((t) => filter === 'all' || t.type === filter)

  return (
    <>
      <div className="topbar">
        <div className="page-title">
          <h2>العمليات</h2>
          <p>إضافة مصروف في أقل عدد من الخطوات. التحويل لا يُحسب مصروفاً.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>+ إدخال سريع</button>
      </div>
      <div className="pills" style={{ marginBottom: 14 }}>
        {[
          ['all', 'الكل'], ['expense', 'مصروف'], ['income', 'دخل'], ['transfer', 'تحويل'], ['debt_payment', 'سداد'],
        ].map(([id, n]) => (
          <button key={id} className={`btn btn-sm ${filter === id ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(id)}>{n}</button>
        ))}
      </div>
      <div className="card">
        <div className="list">
          {list.map((t) => (
            <div className="row" key={t.id}>
              <div>
                <b>{t.payee || t.type}</b>
                <div className="meta">{formatDate(t.date)} · {state.accounts.find((a) => a.id === t.accountId)?.name}</div>
              </div>
              <b className="num" style={{ color: t.type === 'income' ? 'var(--green)' : t.type === 'transfer' ? 'var(--teal)' : 'var(--red)' }}>
                {t.type === 'income' ? '+' : t.type === 'transfer' ? '↔ ' : '-'}
                {formatMoney(t.amount, engine.currency)}
              </b>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>إدخال سريع</h3>
            <form className="form" onSubmit={(e) => {
              e.preventDefault()
              addTx({ ...form, amount: Number(form.amount) })
              if (form.recurring) {
                addRecurring({ type: form.type, title: form.payee || form.type, amount: Number(form.amount), nextDate: form.date, frequency: form.frequency })
              }
              setOpen(false)
            }}>
              <label>النوع
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="expense">مصروف</option>
                  <option value="income">دخل</option>
                </select>
              </label>
              <label>المبلغ<input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></label>
              <label>الحساب
                <select value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })}>
                  {state.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </label>
              <label>التصنيف
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  {(form.type === 'income' ? INCOME_TYPES : CATEGORIES).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label>المتجر / المصدر<input value={form.payee} onChange={(e) => setForm({ ...form, payee: e.target.value })} /></label>
              <label>التاريخ<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
              <label>ملاحظة<input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} />
                عملية متكررة
              </label>
              <button className="btn btn-primary" type="submit">حفظ</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
