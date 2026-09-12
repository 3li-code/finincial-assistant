import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Wallet, ArrowLeftRight, Landmark, CalendarDays,
  PieChart, Target, Repeat, LineChart, BarChart3, MessageCircleQuestion,
  Settings, Menu, X
} from 'lucide-react'

const links = [
  { to: '/app', label: 'لوحة اليوم', icon: LayoutDashboard, end: true },
  { to: '/app/accounts', label: 'الحسابات', icon: Wallet },
  { to: '/app/transactions', label: 'العمليات', icon: ArrowLeftRight },
  { to: '/app/debts', label: 'الديون', icon: Landmark },
  { to: '/app/calendar', label: 'التقويم', icon: CalendarDays },
  { to: '/app/budgets', label: 'الميزانية', icon: PieChart },
  { to: '/app/goals', label: 'الأهداف', icon: Target },
  { to: '/app/subs', label: 'الاشتراكات', icon: Repeat },
  { to: '/app/forecast', label: 'التوقع', icon: LineChart },
  { to: '/app/reports', label: 'التقارير', icon: BarChart3 },
  { to: '/app/assistant', label: 'أسئلة جاهزة', icon: MessageCircleQuestion },
  { to: '/app/settings', label: 'الإعدادات', icon: Settings },
]

export default function AppShell() {
  const [open, setOpen] = useState(false)
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">ح</div>
          <div>
            <h1>حسبها</h1>
            <p>مساعدك المالي الشخصي</p>
          </div>
        </div>
        <div className="nav-group">
          <span className="nav-label">لك · عليك · القادم</span>
          {links.map((l) => {
            const Icon = l.icon
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                {l.label}
              </NavLink>
            )
          })}
        </div>
      </aside>
      <main className="main">
        <button className="btn btn-ghost btn-sm mobile-toggle" onClick={() => setOpen((v) => !v)} style={{ marginBottom: 12 }}>
          {open ? <X size={16} /> : <Menu size={16} />} القائمة
        </button>
        <Outlet />
      </main>
    </div>
  )
}
