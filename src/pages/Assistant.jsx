import { useState } from 'react'
import { useStore } from '../lib/store'
import { answerQuestion, canIBuy } from '../lib/engine'
import { CATEGORIES, formatMoney } from '../lib/format'

const questions = [
  { id: 'owe', label: 'كم عليّ ديون؟' },
  { id: 'owed', label: 'كم لي عند الآخرين؟' },
  { id: 'spent', label: 'كم صرفت هذا الشهر؟' },
  { id: 'food', label: 'كم صرفت على الطعام؟' },
  { id: 'income', label: 'كم دخلي هذا الشهر؟' },
  { id: 'salary', label: 'متى راتبي القادم؟' },
  { id: 'coming', label: 'ما هي التزاماتي القادمة؟' },
  { id: 'goal', label: 'كم تبقى لهدفي؟' },
  { id: 'where', label: 'أين ذهب مالي؟' },
  { id: 'budget', label: 'كم بقي من ميزانيتي؟' },
]

export default function Assistant() {
  const { engine, state } = useStore()
  const [active, setActive] = useState(null)
  const [price, setPrice] = useState('120000')
  const cats = CATEGORIES
  const ans = active ? answerQuestion(active.id, engine, { ...state, categories: cats }) : null
  const buy = canIBuy(Number(price), engine, state.settings.floor)

  return (
    <>
      <div className="topbar">
        <div className="page-title">
          <h2>أسئلة جاهزة بدون AI</h2>
          <p>كل إجابة استعلام محدد على بياناتك. الأرقام لا تُختلق.</p>
        </div>
      </div>
      <div className="q-grid">
        {questions.map((q) => (
          <button key={q.id} className="q-btn" onClick={() => setActive(q)}>{q.label}</button>
        ))}
      </div>
      {ans && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>{ans.title}</h3>
          <div className="value num" style={{ fontSize: 36, fontWeight: 800 }}>{formatMoney(ans.value, engine.currency)}</div>
          <p style={{ color: 'var(--muted)' }}>{ans.detail}</p>
        </div>
      )}
      <div className="card" style={{ marginTop: 16 }}>
        <h3>هل أستطيع شراء هذا؟</h3>
        <div className="form" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end', marginTop: 10 }}>
          <label>السعر<input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
          <div className={`verdict ${buy.verdict}`}>{buy.label}</div>
        </div>
        <p style={{ marginTop: 10, color: 'var(--muted)' }}>{buy.reason}</p>
      </div>
    </>
  )
}
