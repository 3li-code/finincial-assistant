import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useStore } from '../lib/store'
import { CATEGORIES, formatMoney } from '../lib/format'

export default function Reports() {
  const { engine, state } = useStore()
  const data = Object.entries(engine.monthByCat).map(([id, v]) => ({
    name: CATEGORIES.find((c) => c.id === id)?.name || id,
    v,
  }))
  const scoreBits = [
    { t: 'نسبة الادخار', v: `${Math.round(engine.savingsRate * 100)}%` },
    { t: 'عبء الديون', v: `${Math.round(engine.debtBurden * 100)}%` },
    { t: 'صندوق الطوارئ', v: formatMoney(engine.emergency, engine.currency) },
    { t: 'دخل الشهر', v: formatMoney(engine.monthIncome, engine.currency) },
  ]

  return (
    <>
      <div className="topbar">
        <div className="page-title">
          <h2>التقارير والصحة المالية</h2>
          <p>مؤشر من 100 قابل للشرح: ادخار، ديون، ميزانية، طوارئ، وانتظام الدخل.</p>
        </div>
        <span className="chip">{engine.score}/100</span>
      </div>
      <div className="grid g-4">
        {scoreBits.map((s) => (
          <div className="card stat" key={s.t}>
            <div className="label">{s.t}</div>
            <div className="value" style={{ fontSize: 22 }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 16, height: 340 }}>
        <h3>أين ذهب المال هذا الشهر؟</h3>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="v" fill="#0f766e" radius={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p style={{ color: 'var(--muted)', marginTop: 12 }}>عدد العمليات المسجلة: {state.transactions.length}</p>
    </>
  )
}
