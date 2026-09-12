function monthKey(iso) {
  return (iso || '').slice(0, 7)
}

export function computeEngine(state) {
  const currency = state.settings.currency
  const now = new Date()
  const thisMonth = now.toISOString().slice(0, 7)
  const today = now.toISOString().slice(0, 10)

  const accounts = state.accounts || []
  const txs = state.transactions || []
  const debts = state.debts || []
  const goals = state.goals || []
  const budgets = state.budgets || []
  const subscriptions = state.subscriptions || []
  const recurring = state.recurring || []

  const accountBalances = {}
  for (const a of accounts) accountBalances[a.id] = Number(a.opening) || 0

  for (const t of txs) {
    const amt = Number(t.amount) || 0
    if (t.type === 'income') accountBalances[t.accountId] = (accountBalances[t.accountId] || 0) + amt
    if (t.type === 'expense' || t.type === 'debt_payment') accountBalances[t.accountId] = (accountBalances[t.accountId] || 0) - amt
    if (t.type === 'transfer') {
      accountBalances[t.accountId] = (accountBalances[t.accountId] || 0) - amt
      accountBalances[t.toAccountId] = (accountBalances[t.toAccountId] || 0) + amt
    }
  }

  const cashOnHand = Object.values(accountBalances).reduce((s, n) => s + n, 0)

  const owedByMe = debts.filter((d) => d.direction === 'owed_by_me' && d.status !== 'closed')
  const owedToMe = debts.filter((d) => d.direction === 'owed_to_me' && d.status !== 'closed')
  const youOwe = owedByMe.reduce((s, d) => s + remainingDebt(d), 0)
  const theyOwe = owedToMe.reduce((s, d) => s + remainingDebt(d), 0)
  const netWorth = cashOnHand + theyOwe - youOwe

  const monthTx = txs.filter((t) => monthKey(t.date) === thisMonth)
  const monthExpense = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const monthIncome = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const monthByCat = {}
  for (const t of monthTx.filter((x) => x.type === 'expense')) {
    monthByCat[t.categoryId] = (monthByCat[t.categoryId] || 0) + Number(t.amount)
  }

  const upcoming = []
  for (const r of recurring) {
    if (r.nextDate && r.nextDate >= today) {
      upcoming.push({
        id: r.id,
        date: r.nextDate,
        title: r.title,
        amount: r.type === 'income' ? Number(r.amount) : -Number(r.amount),
        kind: r.type === 'income' ? 'income' : 'expense',
      })
    }
  }
  for (const s of subscriptions) {
    if (s.nextDate && s.nextDate >= today) {
      upcoming.push({
        id: s.id,
        date: s.nextDate,
        title: s.name,
        amount: -Number(s.amount),
        kind: 'sub',
      })
    }
  }
  for (const d of debts) {
    if (d.dueDate && d.dueDate >= today && d.status !== 'closed') {
      upcoming.push({
        id: d.id,
        date: d.dueDate,
        title: d.direction === 'owed_by_me' ? `سداد ${d.counterparty}` : `تحصيل من ${d.counterparty}`,
        amount: d.direction === 'owed_by_me' ? -remainingDebt(d) : remainingDebt(d),
        kind: 'debt',
      })
    }
  }
  upcoming.sort((a, b) => a.date.localeCompare(b.date))

  const next30 = upcoming.filter((u) => u.date <= addDaysLocal(today, 30))
  const incoming = next30.filter((u) => u.amount > 0).reduce((s, u) => s + u.amount, 0)
  const outgoing = next30.filter((u) => u.amount < 0).reduce((s, u) => s + Math.abs(u.amount), 0)
  const expectedBalance = cashOnHand + incoming - outgoing

  const budgetUsage = budgets.map((b) => {
    const spent = monthByCat[b.categoryId] || 0
    const limit = Number(b.limit) || 0
    return {
      ...b,
      spent,
      remaining: limit - spent,
      pct: limit ? Math.min(100, Math.round((spent / limit) * 100)) : 0,
    }
  })

  const goalProgress = goals.map((g) => {
    const current = Number(g.current) || 0
    const target = Number(g.target) || 1
    return { ...g, pct: Math.min(100, Math.round((current / target) * 100)), left: Math.max(0, target - current) }
  })

  const savingsRate = monthIncome ? Math.max(0, (monthIncome - monthExpense) / monthIncome) : 0
  const debtBurden = cashOnHand + theyOwe > 0 ? youOwe / (cashOnHand + theyOwe) : youOwe > 0 ? 1 : 0
  const budgetOver = budgetUsage.filter((b) => b.pct >= 100).length
  const emergency = accounts.filter((a) => a.type === 'savings').reduce((s, a) => s + (accountBalances[a.id] || 0), 0)
  const emergencyMonths = monthExpense ? emergency / monthExpense : emergency > 0 ? 3 : 0
  let score = 50
  score += Math.min(20, savingsRate * 40)
  score -= Math.min(25, debtBurden * 25)
  score -= budgetOver * 6
  score += Math.min(15, emergencyMonths * 5)
  if (monthIncome > 0) score += 8
  score = Math.max(0, Math.min(100, Math.round(score)))

  return {
    currency,
    today,
    thisMonth,
    accountBalances,
    cashOnHand,
    youOwe,
    theyOwe,
    netWorth,
    monthExpense,
    monthIncome,
    monthByCat,
    upcoming: upcoming.slice(0, 12),
    next30,
    expectedBalance,
    incoming,
    outgoing,
    budgetUsage,
    goalProgress,
    score,
    savingsRate,
    debtBurden,
    emergency,
  }
}

export function remainingDebt(d) {
  const paid = (d.payments || []).reduce((s, p) => s + Number(p.amount), 0)
  return Math.max(0, Number(d.original) - paid)
}

function addDaysLocal(iso, days) {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function canIBuy(price, engine, floor = 50000) {
  const after = engine.expectedBalance - Number(price)
  if (after >= floor && engine.cashOnHand >= price) {
    return {
      verdict: 'ok',
      label: 'مناسب',
      reason: `بعد الشراء سيبقى الرصيد المتوقع ${Math.round(after).toLocaleString('ar')} فوق الحد الذي حددته.`,
    }
  }
  if (engine.cashOnHand >= price && after >= 0) {
    return {
      verdict: 'warn',
      label: 'ممكن مع تأثير',
      reason: 'يمكنك الشراء نقداً، لكن الرصيد المتوقع بعد الالتزامات سيقترب من الحد الأدنى.',
    }
  }
  return {
    verdict: 'no',
    label: 'يفضّل التأجيل',
    reason: 'بعد الشراء سيهبط الرصيد المتوقع تحت الحد الذي حددته لنفسك أو لن يكفي النقد الحالي.',
  }
}

export function salaryPlan(salary) {
  const n = Number(salary) || 0
  return [
    { name: 'الالتزامات', amount: Math.round(n * 0.36), pct: 36 },
    { name: 'المصاريف', amount: Math.round(n * 0.34), pct: 34 },
    { name: 'الادخار', amount: Math.round(n * 0.15), pct: 15 },
    { name: 'الطوارئ', amount: Math.round(n * 0.10), pct: 10 },
    { name: 'الترفيه', amount: Math.round(n * 0.05), pct: 5 },
  ]
}

export function answerQuestion(id, engine, state) {
  const catName = (cid) => state.categories?.find((c) => c.id === cid)?.name || cid
  switch (id) {
    case 'owe':
      return {
        title: 'كم عليّ ديون؟',
        value: engine.youOwe,
        detail: `${state.debts.filter((d) => d.direction === 'owed_by_me' && d.status !== 'closed').length} دين نشط`,
      }
    case 'owed':
      return {
        title: 'كم لي عند الآخرين؟',
        value: engine.theyOwe,
        detail: `${state.debts.filter((d) => d.direction === 'owed_to_me' && d.status !== 'closed').length} مستحق`,
      }
    case 'spent':
      return { title: 'كم صرفت هذا الشهر؟', value: engine.monthExpense, detail: engine.thisMonth }
    case 'food':
      return { title: 'كم صرفت على الطعام؟', value: engine.monthByCat.food || 0, detail: 'تصنيف طعام' }
    case 'income':
      return { title: 'كم دخلي هذا الشهر؟', value: engine.monthIncome, detail: engine.thisMonth }
    case 'salary': {
      const next = engine.upcoming.find((u) => u.kind === 'income')
      return { title: 'متى راتبي القادم؟', value: next ? next.amount : 0, detail: next ? next.date : 'لا يوجد راتب مجدول' }
    }
    case 'coming':
      return { title: 'ما هي التزاماتي القادمة؟', value: engine.outgoing, detail: `${engine.next30.length} حدث خلال 30 يوماً` }
    case 'goal': {
      const g = engine.goalProgress[0]
      return { title: 'كم تبقى لهدفي؟', value: g ? g.left : 0, detail: g ? g.name : 'لا يوجد هدف' }
    }
    case 'where': {
      const top = Object.entries(engine.monthByCat).sort((a, b) => b[1] - a[1])[0]
      return { title: 'أين ذهب مالي؟', value: top ? top[1] : 0, detail: top ? `أكبر بند: ${catName(top[0])}` : 'لا مصروف بعد' }
    }
    case 'budget': {
      const left = engine.budgetUsage.reduce((s, b) => s + b.remaining, 0)
      return { title: 'كم بقي من ميزانيتي؟', value: left, detail: `${engine.budgetUsage.length} تصنيف` }
    }
    default:
      return { title: 'نتيجة', value: 0, detail: '' }
  }
}
