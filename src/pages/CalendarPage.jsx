import { useMemo, useState } from 'react'
import { useStore } from '../lib/store'
import { formatMoney } from '../lib/format'

const names = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']

export default function CalendarPage() {
  const { engine } = useStore()
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return { y: d.getFullYear(), m: d.getMonth() }
  })
  const [day, setDay] = useState(engine.today)

  const days = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1)
    const start = first.getDay()
    const count = new Date(cursor.y, cursor.m + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < start; i++) cells.push(null)
    for (let d = 1; d <= count; d++) {
      const iso = `${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      cells.push(iso)
    }
    return cells
  }, [cursor])

  const events = engine.upcoming.filter((u) => u.date === day)

  return (
    <>
      <div className="topbar">
        <div className="page-title">
          <h2>التقويم المالي</h2>
          <p>راتب، إيجار، أقساط، ديون واشتراكات على تواريخها.</p>
        </div>
        <div className="cta" style={{ margin: 0 }}>
          <button className="btn btn-ghost" onClick={() => setCursor((c) => ({ y: c.m === 0 ? c.y - 1 : c.y, m: c.m === 0 ? 11 : c.m - 1 }))}>السابق</button>
          <button className="btn btn-ghost" onClick={() => setCursor((c) => ({ y: c.m === 11 ? c.y + 1 : c.y, m: c.m === 11 ? 0 : c.m + 1 }))}>التالي</button>
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>{new Date(cursor.y, cursor.m, 1).toLocaleDateString('ar', { month: 'long', year: 'numeric' })}</h3>
        <div className="cal">
          {names.map((n) => <div className="head" key={n}>{n}</div>)}
          {days.map((iso, i) => (
            <button
              key={i}
              className={`day ${iso === engine.today ? 'today' : ''}`}
              disabled={!iso}
              onClick={() => iso && setDay(iso)}
              style={{ textAlign: 'right', background: iso === day ? '#ecf7f5' : undefined }}
            >
              {iso && <b>{Number(iso.slice(8))}</b>}
              <div>
                {engine.upcoming.filter((u) => u.date === iso).slice(0, 3).map((u) => (
                  <span key={u.id} className="dot" style={{ background: u.amount >= 0 ? '#1f8a5b' : '#c2413b' }} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>أحداث {day}</h3>
        <div className="list" style={{ marginTop: 10 }}>
          {events.length === 0 && <div className="empty">لا أحداث في هذا اليوم</div>}
          {events.map((u) => (
            <div className="row" key={u.id}>
              <b>{u.title}</b>
              <span className="num">{formatMoney(u.amount, engine.currency)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
