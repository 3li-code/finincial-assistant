import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { useStore } from '../lib/store'
import { formatMoney, formatDate } from '../lib/format'
import { answerQuestion, canIBuy } from '../lib/engine'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { state, engine } = useStore()
  const [q, setQ] = useState(null)
  const [price, setPrice] = useState('80000')
  const buy = canIBuy(Number(price), engine, state.settings.floor)
  const ans = q ? answerQuestion(q.id, engine, { ...state, categories: [{ id: 'food', name: 'طعام' }, { id: 'home', name: 'منزل' }, { id: 'shop', name: 'تسوق' }, { id: 'fun', name: 'ترفيه' }, { id: 'transport', name: 'مواصلات' }, { id: 'telecom', name: 'اتصالات' }] }) : null

  const donut = [
    { name: 'لك', value: Math.max(0, engine.cashOnHand + engine.theyOwe), color: '#1f8a5b' },
    { name: 'عليك', value: Math.max(1, engine.youOwe), color: '#c2413b' },
    { name: 'التزامات', value: Math.max(1, engine.outgoing), color: '#c47a12' },
  ]

  const questions = [
    { id: 'owe', label: 'كم عليّ؟' },
    { id: 'owed', label: 'كم لي؟' },
    { id: 'spent', label: 'كم صرفت؟' },
    { id: 'coming', label: 'ماذا ينتظرني؟' },
  ]

  return (
    <>
      <div className="topbar">
        <div className="page-title">
          <h2>{state.settings.name ? `مرحباً بك، ${state.settings.name}` : 'مرحباً بك'}</h2>
          <p>إليك وضعك المالي اليوم — لك · عليك · القادم</p>
        </div>
        <span className="chip">الصحة المالية {engine.score}/100</span>
      </div>

      <div className="grid g-2">
        <div className="card hero-net">
          <h3>صافي أموالك</h3>
          <div className="value num">{formatMoney(engine.netWorth, engine.currency)}</div>
          <div className="pills">
            <span className="pill">لك {formatMoney(engine.cashOnHand + engine.theyOwe, engine.currency)}</span>
            <span className="pill">عليك {formatMoney(engine.youOwe, engine.currency)}</span>
            <span className="pill">متوقع {formatMoney(engine.expectedBalance, engine.currency)}</span>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 8 }}>وضعك المالي</h3>
          <div style={{ height: 210 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={donut} dataKey="value" innerRadius={58} outerRadius={90} paddingAngle={3}>
                  {donut.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pills">
            <span className="badge green">لك</span>
            <span className="badge red">عليك</span>
            <span className="badge amber">التزامات</span>
          </div>
        </div>
      </div>

      <div className="grid g-3" style={{ marginTop: 16 }}>
        <div className="card stat green">
          <div className="label">لك</div>
          <div className="value num">{formatMoney(engine.cashOnHand + engine.theyOwe, engine.currency)}</div>
        </div>
        <div className="card stat red">
          <div className="label">عليك</div>
          <div className="value num">{formatMoney(engine.youOwe, engine.currency)}</div>
        </div>
        <div className="card stat amber">
          <div className="label">القادم خلال 30 يوماً</div>
          <div className="value num">{formatMoney(engine.outgoing, engine.currency)}</div>
        </div>
      </div>

      <div className="grid g-2" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="topbar" style={{ marginBottom: 8 }}>
            <h3>القادم</h3>
            <Link to="/app/calendar" className="btn btn-ghost btn-sm">التقويم</Link>
          </div>
          <div className="list">
            {engine.upcoming.slice(0, 5).map((u) => (
              <div className="row" key={u.id + u.date}>
                <div>
                  <b>{u.title}</b>
                  <div className="meta">{formatDate(u.date)}</div>
                </div>
                <b className="num" style={{ color: u.amount >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {u.amount >= 0 ? '+' : ''}{formatMoney(u.amount, engine.currency)}
                </b>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 10 }}>أسئلة سريعة بدون AI</h3>
          <div className="q-grid">
            {questions.map((item) => (
              <button key={item.id} className="q-btn" onClick={() => setQ(item)}>{item.label}</button>
            ))}
          </div>
          {ans && (
            <div className="row" style={{ marginTop: 14 }}>
              <div>
                <b>{ans.title}</b>
                <div className="meta">{ans.detail}</div>
              </div>
              <b className="num">{formatMoney(ans.value, engine.currency)}</b>
            </div>
          )}
          <Link to="/app/assistant" className="btn btn-primary" style={{ marginTop: 14 }}>كل الأسئلة</Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>هل أستطيع شراء هذا؟</h3>
        <p className="meta" style={{ color: 'var(--muted)', marginBottom: 10 }}>محرك قرار برمجي فوق الرصيد والالتزامات — بدون AI.</p>
        <div className="form" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
          <label>سعر المنتج
            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" />
          </label>
          <div className={`verdict ${buy.verdict}`}>{buy.label}</div>
        </div>
        <p style={{ marginTop: 10, color: 'var(--muted)' }}>{buy.reason}</p>
      </div>
    </>
  )
}
