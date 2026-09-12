import { useState } from 'react'
import { useStore } from '../lib/store'
import { CATEGORIES, formatMoney } from '../lib/format'

export default function Budgets() {
  const { engine, addBudget } = useStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ categoryId: 'food', limit: '' })

  return (
    <>
      <div className="topbar">
        <div className="page-title">
          <h2>الميزانية</h2>
          <p>المستهلك والمتبقي ونسبة الاستخدام لكل تصنيف.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>تصنيف جديد</button>
      </div>
      <div className="grid g-2">
        {engine.budgetUsage.map((b) => {
          const name = CATEGORIES.find((c) => c.id === b.categoryId)?.name || b.categoryId
          return (
            <div className="card" key={b.id}>
              <div className="topbar" style={{ marginBottom: 8 }}>
                <h3>{name}</h3>
                <span className={`badge ${b.pct >= 100 ? 'red' : b.pct >= 80 ? 'amber' : 'green'}`}>{b.pct}%</span>
              </div>
              <div className="progress"><span style={{ width: `${b.pct}%`, background: b.pct >= 100 ? 'var(--red)' : 'var(--teal)' }} /></div>
              <div className="row" style={{ marginTop: 10 }}>
                <span>صُرف {formatMoney(b.spent, engine.currency)}</span>
                <span>الحد {formatMoney(b.limit, engine.currency)}</span>
              </div>
            </div>
          )
        })}
      </div>
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>ميزانية تصنيف</h3>
            <form className="form" onSubmit={(e) => { e.preventDefault(); addBudget({ categoryId: form.categoryId, limit: Number(form.limit) }); setOpen(false) }}>
              <label>التصنيف
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label>الحد الشهري<input type="number" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} required /></label>
              <button className="btn btn-primary" type="submit">حفظ</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
