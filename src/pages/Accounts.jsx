import { useState } from 'react'
import { useStore } from '../lib/store'
import { ACCOUNT_TYPES, formatMoney } from '../lib/format'

export default function Accounts() {
  const { state, engine, addAccount, addTx } = useStore()
  const [open, setOpen] = useState(false)
  const [transfer, setTransfer] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'cash', opening: '' })
  const [tf, setTf] = useState({ from: state.accounts[0]?.id, to: state.accounts[1]?.id, amount: '', date: engine.today })

  return (
    <>
      <div className="topbar">
        <div className="page-title">
          <h2>الحسابات والمحافظ</h2>
          <p>نقد، بنك، محفظة، بطاقة، ادخار — التحويل لا يُحتسب مصروفاً.</p>
        </div>
        <div className="cta" style={{ margin: 0 }}>
          <button className="btn btn-ghost" onClick={() => setTransfer(true)}>تحويل</button>
          <button className="btn btn-primary" onClick={() => setOpen(true)}>حساب جديد</button>
        </div>
      </div>
      <div className="grid g-3">
        {state.accounts.map((a) => (
          <div className="card stat teal" key={a.id}>
            <div className="label">{ACCOUNT_TYPES.find((t) => t.id === a.type)?.name}</div>
            <h3>{a.name}</h3>
            <div className="value num">{formatMoney(engine.accountBalances[a.id] || 0, engine.currency)}</div>
          </div>
        ))}
      </div>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>إضافة حساب</h3>
            <form className="form" onSubmit={(e) => { e.preventDefault(); addAccount({ ...form, opening: Number(form.opening) || 0 }); setOpen(false) }}>
              <label>الاسم<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
              <label>النوع
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {ACCOUNT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </label>
              <label>الرصيد الافتتاحي<input type="number" value={form.opening} onChange={(e) => setForm({ ...form, opening: e.target.value })} /></label>
              <button className="btn btn-primary" type="submit">حفظ</button>
            </form>
          </div>
        </div>
      )}

      {transfer && (
        <div className="modal-backdrop" onClick={() => setTransfer(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>تحويل بين الحسابات</h3>
            <form className="form" onSubmit={(e) => {
              e.preventDefault()
              addTx({ type: 'transfer', amount: Number(tf.amount), accountId: tf.from, toAccountId: tf.to, categoryId: 'other', date: tf.date, payee: 'تحويل', notes: '' })
              setTransfer(false)
            }}>
              <label>من
                <select value={tf.from} onChange={(e) => setTf({ ...tf, from: e.target.value })}>
                  {state.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </label>
              <label>إلى
                <select value={tf.to} onChange={(e) => setTf({ ...tf, to: e.target.value })}>
                  {state.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </label>
              <label>المبلغ<input type="number" value={tf.amount} onChange={(e) => setTf({ ...tf, amount: e.target.value })} required /></label>
              <label>التاريخ<input type="date" value={tf.date} onChange={(e) => setTf({ ...tf, date: e.target.value })} /></label>
              <button className="btn btn-primary" type="submit">تنفيذ التحويل</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
