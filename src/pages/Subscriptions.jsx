import { useState } from 'react'
import { useStore } from '../lib/store'
import { FREQUENCIES, formatMoney, formatDate, todayISO } from '../lib/format'

export default function Subscriptions() {
  const { state, engine, addSub } = useStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', amount: '', nextDate: todayISO(), frequency: 'monthly' })
  const monthly = state.subscriptions.reduce((s, x) => s + Number(x.amount), 0)

  return (
    <>
      <div className="topbar">
        <div className="page-title">
          <h2>الاشتراكات</h2>
          <p>إنترنت، منصات، نوادي — مع الإجمالي الشهري والسنوي.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>اشتراك جديد</button>
      </div>
      <div className="grid g-2" style={{ marginBottom: 16 }}>
        <div className="card stat amber"><div className="label">شهرياً</div><div className="value num">{formatMoney(monthly, engine.currency)}</div></div>
        <div className="card stat teal"><div className="label">سنوياً</div><div className="value num">{formatMoney(monthly * 12, engine.currency)}</div></div>
      </div>
      <div className="card list">
        {state.subscriptions.map((s) => (
          <div className="row" key={s.id}>
            <div>
              <b>{s.name}</b>
              <div className="meta">{FREQUENCIES.find((f) => f.id === s.frequency)?.name} · القادم {formatDate(s.nextDate)}</div>
            </div>
            <b className="num">{formatMoney(s.amount, engine.currency)}</b>
          </div>
        ))}
      </div>
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>اشتراك</h3>
            <form className="form" onSubmit={(e) => { e.preventDefault(); addSub({ ...form, amount: Number(form.amount) }); setOpen(false) }}>
              <label>الاسم<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
              <label>المبلغ<input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></label>
              <label>التاريخ التالي<input type="date" value={form.nextDate} onChange={(e) => setForm({ ...form, nextDate: e.target.value })} /></label>
              <button className="btn btn-primary" type="submit">حفظ</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
