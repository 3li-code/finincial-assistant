import { useStore } from '../lib/store'
import { CURRENCIES } from '../lib/format'

export default function Settings() {
  const { state, setCurrency } = useStore()
  return (
    <>
      <div className="topbar">
        <div className="page-title">
          <h2>الإعدادات</h2>
          <p>العملة الأساسية، الخصوصية، ومسار المنتج.</p>
        </div>
      </div>
      <div className="grid g-2">
        <div className="card">
          <h3>العملة الأساسية</h3>
          <select value={state.settings.currency} onChange={(e) => setCurrency(e.target.value)} style={{ marginTop: 12, width: '100%', padding: 12, borderRadius: 12, border: '1px solid var(--line)' }}>
            {Object.values(CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>
            ))}
          </select>
        </div>
        <div className="card">
          <h3>الخصوصية والأمان</h3>
          <div className="list" style={{ marginTop: 10 }}>
            {['قفل PIN / بصمة', 'تشفير أثناء النقل والتخزين', 'عدم بيع البيانات', 'تصدير البيانات', 'حذف الحساب'].map((x) => (
              <div className="row" key={x}>{x}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>خارطة الطريق</h3>
        <p style={{ color: 'var(--muted)', margin: '8px 0 12px' }}>MVP الآن · AI وOCR في V2 · تكاملات بنكية في V3</p>
        <div className="grid g-3">
          <div className="feat"><b>MVP</b><p>لوحة، حسابات، عمليات، ديون، تكرار، ميزانية، أهداف، أسئلة جاهزة</p></div>
          <div className="feat"><b>V2</b><p>مساعد AI فوق أرقام موثوقة، OCR، توقع أعمق، خطة راتب</p></div>
          <div className="feat"><b>V3</b><p>Open Banking، عائلة، استثمارات، مزامنة متعددة الأجهزة</p></div>
        </div>
      </div>
    </>
  )
}
