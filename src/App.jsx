import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider } from './lib/store'
import Landing from './pages/Landing'
import AppShell from './pages/AppShell'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Transactions from './pages/Transactions'
import Debts from './pages/Debts'
import CalendarPage from './pages/CalendarPage'
import Budgets from './pages/Budgets'
import Goals from './pages/Goals'
import Forecast from './pages/Forecast'
import Assistant from './pages/Assistant'
import Settings from './pages/Settings'
import Subscriptions from './pages/Subscriptions'
import Reports from './pages/Reports'

export default function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="debts" element={<Debts />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="goals" element={<Goals />} />
          <Route path="subs" element={<Subscriptions />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="reports" element={<Reports />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<RedirectUnknown />} />
      </Routes>
    </StoreProvider>
  )
}

function RedirectUnknown() {
  const loc = useLocation()
  if (loc.pathname.startsWith('/app')) return <Navigate to="/app" replace />
  return <Navigate to="/" replace />
}
