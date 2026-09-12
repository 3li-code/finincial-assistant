import { useState } from 'react'
import { useStore } from '../lib/store'
import { formatMoney, formatDate, todayISO } from '../lib/format'

export default function Goals() {
  const { engine, addGoal, contributeGoal } = useStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', target: '', current: '', due: todayISO(), priority: 'متوسطة' })

  return (
    <>
      <div className="topbar">
        <div className="page-title">
          <h2>أهداف الادخار</h2>
          <p>القيمة الحالية، المتبقي، والخطة للوصول في الموعد.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>هدف جديد</button>
      </div>
      <div className="grid g-2">
        {engine.goalProgress.map((g) => {
          const months = Math.max(1, Math.ceil((new Date(g.due) - new Date()) / (1000 * 60 * 60 * 24 * 30)))
          const monthly = Math.ceil(g.left / months)
          return (
            <div className="card" key={g.id}>
              <div className="topbar">
                <h3>{g.name}</h3>
                <span className="badge teal">{g.priority}</span>
              </div>
              <div className="progress"><span style={{ width: `${g.pct}%` }} /></div>
              <p style={{ margin: '10px 0' }}>{g.pct}% · تبقى {formatMoney(g.left, engine.currency)} حتى {formatDate(g.due)}</p>
              <div className="row">
                <span>الخطة الشهرية المقترحة</span>
                <b className="num">{formatMoney(monthly, engine.currency)}</b>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => contributeGoal(g.id, 10000)}>+ 10,000 للهدف</button>
            </div>
          )
        })}
      </div>
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>هدف ادخار</h3>
            <form className="form" onSubmit={(e) => { e.preventDefault(); addGoal({ ...form, target: Number(form.target), current: Number(form.current) || 0 }); setOpen(false) }}>
              <label>الاسم<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
              <label>القيمة<input type="number" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} required /></label>
              <label>المبلغ الحالي<input type="number" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} /></label>
              <label>الموعد<input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} /></label>
              <button className="btn btn-primary" type="submit">حفظ</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
