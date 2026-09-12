import { useState } from 'react'
import { useStore } from '../lib/store'
import { remainingDebt } from '../lib/engine'
import { formatMoney, formatDate, todayISO } from '../lib/format'

export default function Debts() {
  const { state, engine, addDebt, payDebt } = useStore()
  const [open, setOpen] = useState(false)
  const [pay, setPay] = useState(null)
  const [form, setForm] = useState({ direction: 'owed_by_me', counterparty: '', original: '', createdAt: todayISO(), dueDate: todayISO() })
  const [amount, setAmount] = useState('')

  const mine = state.debts.filter((d) => d.direction === 'owed_by_me')
  const theirs = state.debts.filter((d) => d.direction === 'owed_to_me')

  function Card({ d }) {
    const left = remainingDebt(d)
    return (
      <div className="card">
        <div className="topbar" style={{ marginBottom: 8 }}>
          <h3>{d.counterparty}</h3>
          <span className={`badge ${d.direction === 'owed_by_me' ? 'red' : 'green'}`}>
            {d.direction === 'owed_by_me' ? 'دين عليك' : 'أموال لك'}
          </span>
        </div>
        <div className="list">
          <div className="row"><span>الأصلي</span><b className="num">{formatMoney(d.original, engine.currency)}</b></div>
          <div className="row"><span>المدفوع</span><b className="num">{formatMoney(d.original - left, engine.currency)}</b></div>
          <div className="row"><span>المتبقي</span><b className="num">{formatMoney(left, engine.currency)}</b></div>
          <div className="row"><span>الاستحقاق</span><b>{formatDate(d.dueDate)}</b></div>
        </div>
        <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => { setPay(d); setAmount('') }}>
          تسجيل دفعة
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="topbar">
        <div className="page-title">
          <h2>نظام الديون</h2>
          <p>ديونك للآخرين، وأموالك المستحقة لدى الآخرين.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>دين جديد</button>
      </div>
      <div className="grid g-2" style={{ marginBottom: 16 }}>
        <div className="card stat red"><div className="label">عليك</div><div className="value num">{formatMoney(engine.youOwe, engine.currency)}</div></div>
        <div className="card stat green"><div className="label">لك</div><div className="value num">{formatMoney(engine.theyOwe, engine.currency)}</div></div>
      </div>
      <h3 style={{ margin: '8px 0' }}>عليك</h3>
      <div className="grid g-2">{mine.map((d) => <Card key={d.id} d={d} />)}</div>
      <h3 style={{ margin: '18px 0 8px' }}>لك</h3>
      <div className="grid g-2">{theirs.map((d) => <Card key={d.id} d={d} />)}</div>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>إضافة دين</h3>
            <form className="form" onSubmit={(e) => { e.preventDefault(); addDebt({ ...form, original: Number(form.original) }); setOpen(false) }}>
              <label>الاتجاه
                <select value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })}>
                  <option value="owed_by_me">دين عليّ</option>
                  <option value="owed_to_me">مستحق لي</option>
                </select>
              </label>
              <label>الطرف<input value={form.counterparty} onChange={(e) => setForm({ ...form, counterparty: e.target.value })} required /></label>
              <label>المبلغ الأصلي<input type="number" value={form.original} onChange={(e) => setForm({ ...form, original: e.target.value })} required /></label>
              <label>تاريخ الدين<input type="date" value={form.createdAt} onChange={(e) => setForm({ ...form, createdAt: e.target.value })} /></label>
              <label>موعد السداد<input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label>
              <button className="btn btn-primary" type="submit">حفظ</button>
            </form>
          </div>
        </div>
      )}

      {pay && (
        <div className="modal-backdrop" onClick={() => setPay(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>دفعة — {pay.counterparty}</h3>
            <form className="form" onSubmit={(e) => { e.preventDefault(); payDebt(pay.id, amount, todayISO()); setPay(null) }}>
              <label>المبلغ<input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required /></label>
              <button className="btn btn-primary" type="submit">تأكيد</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
