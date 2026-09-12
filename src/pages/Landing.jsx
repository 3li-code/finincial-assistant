import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, WifiOff, Calculator, Bell, Landmark, Wallet } from 'lucide-react'

export default function Landing() {
  return (
    <div className="landing">
      <nav className="nav-landing">
        <div className="brand" style={{ border: 0, margin: 0, padding: 0, color: '#0c3a36' }}>
          <div className="brand-mark">ح</div>
          <div>
            <h1 style={{ color: '#0c3a36' }}>حسبها</h1>
            <p>مساعدك المالي الشخصي</p>
          </div>
        </div>
        <div className="cta" style={{ margin: 0 }}>
          <Link className="btn btn-ghost" to="/app">تجربة اللوحة</Link>
          <Link className="btn btn-primary" to="/app">ابدأ الآن</Link>
        </div>
      </nav>

      <section className="hero">
        <div>
          <div className="kicker">FINTECH عربية · سبتمبر 2026</div>
          <h1>اعرف كم تملك، كم عليك، وماذا ينتظرك.</h1>
          <p className="lead">
            راتبك، مصاريفك، ديونك، التزاماتك وأهدافك في مكان واحد. محرك مالي دقيق يحسب الأرقام، لا تخمينات.
          </p>
          <div className="cta">
            <Link className="btn btn-primary" to="/app">افتح لوحة التحكم</Link>
            <a className="btn btn-gold" href="#pricing">خطط الاشتراك</a>
          </div>
          <div className="pills" style={{ marginTop: 22 }}>
            <span className="chip">لك وعليك والقادم</span>
            <span className="chip">بدون ذكاء اصطناعي في الحساب</span>
            <span className="chip">عربي RTL أولاً</span>
          </div>
        </div>
        <div className="phone">
          <div style={{ fontSize: 13, opacity: .75 }}>مرحباً بك</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>إليك وضعك المالي اليوم</div>
          <div style={{ fontSize: 13, opacity: .8 }}>صافي أموالك</div>
          <div className="num" style={{ fontSize: 36, fontWeight: 800 }}>1,065,000 ر.ي</div>
          <div className="pills" style={{ margin: '14px 0 18px' }}>
            <span className="pill">لك 1,250,000</span>
            <span className="pill">عليك 185,000</span>
            <span className="pill">القادم واضح</span>
          </div>
          <div className="list">
            <div className="row" style={{ background: 'rgba(255,255,255,.08)', color: '#fff' }}>
              <span>30 سبتمبر · راتب</span><b className="num">+500,000</b>
            </div>
            <div className="row" style={{ background: 'rgba(255,255,255,.08)', color: '#fff' }}>
              <span>1 أكتوبر · إيجار</span><b className="num">-120,000</b>
            </div>
            <div className="row" style={{ background: 'rgba(255,255,255,.08)', color: '#fff' }}>
              <span>5 أكتوبر · قسط</span><b className="num">-50,000</b>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>لماذا حسبها؟</h2>
        <p className="sub">ليس تطبيق مصاريف تقليدي. هو لوحة قيادة مالية شخصية للمستخدم العربي.</p>
        <div className="grid g-3">
          {[
            { icon: Wallet, t: 'لك', d: 'الأرصدة، الأموال المستحقة لك، الدخل القادم، والمدخرات.' },
            { icon: Landmark, t: 'عليك', d: 'الديون، الأقساط، الفواتير، الاشتراكات والالتزامات.' },
            { icon: Bell, t: 'القادم', d: 'الراتب، مواعيد السداد، التزامات الشهر والرصيد المتوقع.' },
            { icon: Calculator, t: 'محرك مالي', d: 'كل رقم يأتي من Financial Engine وليس من نموذج لغوي.' },
            { icon: WifiOff, t: 'Offline-first', d: 'أضف مصروفاً أو ديناً حتى بدون إنترنت ثم تُزامن لاحقاً.' },
            { icon: Shield, t: 'خصوصية أولاً', d: 'قفل، تشفير، وعدم بيع بياناتك. الأمان جزء من المنتج.' },
          ].map((f) => (
            <article className="feat" key={f.t}>
              <f.icon color="#0f766e" />
              <h3 style={{ margin: '10px 0 6px' }}>{f.t}</h3>
              <p style={{ color: 'var(--muted)' }}>{f.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="pricing">
        <h2>نموذج Freemium واضح</h2>
        <p className="sub">مجاني للوظائف الأساسية. Premium للتحليلات المتقدمة والمساعد لاحقاً.</p>
        <div className="grid g-2">
          <div className="price">
            <div className="chip">Free</div>
            <h3 style={{ fontSize: 28, margin: '10px 0' }}>الأساسيات</h3>
            <ul className="list">
              {['المصاريف والدخل', 'الحسابات والتحويلات', 'الديون لك وعليك', 'العمليات المتكررة', 'تنبيهات أساسية', 'ميزانية وأهداف'].map((x) => (
                <li className="row" key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="price hot">
            <div className="chip">Premium</div>
            <h3 style={{ fontSize: 28, margin: '10px 0' }}>المساعد المالي</h3>
            <ul className="list">
              {['تحليلات متقدمة', 'توقع مالي أعمق', 'Financial Health', 'OCR للفواتير (V2)', 'تقارير وتصدير', 'AI لاحقاً فوق أرقام موثوقة'].map((x) => (
                <li className="row" key={x}>{x}</li>
              ))}
            </ul>
            <Link className="btn btn-gold" to="/app" style={{ marginTop: 16 }}>جرّب اللوحة الآن</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>حسبها</strong>
          <div>اعرف أين يذهب مالك، ماذا عليك، وما الذي ينتظرك.</div>
        </div>
        <Link to="/app" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          ادخل التطبيق <ArrowLeft size={16} />
        </Link>
      </footer>
    </div>
  )
}
