import { useStore } from '../lib/store'
import { salaryPlan } from '../lib/engine'
import { formatMoney } from '../lib/format'

export default function Forecast() {
  const { engine, state } = useStore()
  const salary = state.recurring.find((r) => r.type === 'income')
  const plan = salaryPlan(salary?.amount || 0)
  const rows = [
    { t: 'الرصيد الحالي', v: engine.cashOnHand, sign: '' },
    { t: '+ دخل متوقع', v: engine.incoming, sign: '+' },
    { t: '- التزامات قادمة', v: engine.outgoing, sign: '-' },
    { t: '= الرصيد المتوقع', v: engine.expectedBalance, sign: '=' },
  ]

  return (
    <>
      <div className="topbar">
        <div className="page-title">
          <h2>التوقع المالي</h2>
          <p>يحسب من الرصيد الحالي + الدخل المجدول − الالتزامات. الأرقام من المحرك فقط.</p>
        </div>
      </div>
      <div className="grid g-2">
        <div className="card">
          <h3 style={{ marginBottom: 10 }}>معادلة الرصيد المتوقع</h3>
          <div className="list">
            {rows.map((r) => (
              <div className="row" key={r.t}>
                <span>{r.t}</span>
                <b className="num">{formatMoney(r.v, engine.currency)}</b>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>خطة الراتب</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 10 }}>اقتراح توزيع عند حلول الراتب — يمكن تعديله لاحقاً.</p>
          <div className="list">
            {plan.map((p) => (
              <div className="row" key={p.name}>
                <span>{p.name} · {p.pct}%</span>
                <b className="num">{formatMoney(p.amount, engine.currency)}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
