export const CURRENCIES = {
  YER: { code: 'YER', name: 'ريال يمني', symbol: 'ر.ي' },
  SAR: { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س' },
  USD: { code: 'USD', name: 'دولار أمريكي', symbol: '$' },
  AED: { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ' },
  OMR: { code: 'OMR', name: 'ريال عماني', symbol: 'ر.ع' },
  KWD: { code: 'KWD', name: 'دينار كويتي', symbol: 'د.ك' },
  QAR: { code: 'QAR', name: 'ريال قطري', symbol: 'ر.ق' },
  BHD: { code: 'BHD', name: 'دينار بحريني', symbol: 'د.ب' },
  EUR: { code: 'EUR', name: 'يورو', symbol: '€' },
}

export function formatMoney(amount, currency = 'YER') {
  const n = Number(amount) || 0
  const formatted = new Intl.NumberFormat('ar-YE', {
    maximumFractionDigits: 0,
  }).format(Math.round(n))
  const symbol = CURRENCIES[currency]?.symbol || currency
  return `${formatted} ${symbol}`
}

export function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return new Intl.DateTimeFormat('ar-YE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function addDays(iso, days) {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`
}

export const CATEGORIES = [
  { id: 'home', name: 'منزل' },
  { id: 'food', name: 'طعام' },
  { id: 'transport', name: 'مواصلات' },
  { id: 'bills', name: 'فواتير' },
  { id: 'telecom', name: 'اتصالات' },
  { id: 'health', name: 'علاج' },
  { id: 'edu', name: 'تعليم' },
  { id: 'shop', name: 'تسوق' },
  { id: 'fun', name: 'ترفيه' },
  { id: 'travel', name: 'سفر' },
  { id: 'gifts', name: 'هدايا' },
  { id: 'debt', name: 'ديون' },
  { id: 'save', name: 'ادخار' },
  { id: 'invest', name: 'استثمار' },
  { id: 'other', name: 'أخرى' },
]

export const ACCOUNT_TYPES = [
  { id: 'cash', name: 'نقد' },
  { id: 'bank', name: 'حساب بنكي' },
  { id: 'wallet', name: 'محفظة إلكترونية' },
  { id: 'card', name: 'بطاقة' },
  { id: 'savings', name: 'حساب ادخار' },
  { id: 'dedicated', name: 'حساب مخصص' },
]

export const INCOME_TYPES = [
  { id: 'salary', name: 'راتب' },
  { id: 'freelance', name: 'عمل حر' },
  { id: 'project', name: 'مشروع' },
  { id: 'commission', name: 'عمولة' },
  { id: 'bonus', name: 'مكافأة' },
  { id: 'rent', name: 'إيجار' },
  { id: 'transfer', name: 'تحويل' },
  { id: 'extra', name: 'دخل إضافي' },
]

export const FREQUENCIES = [
  { id: 'daily', name: 'يومي' },
  { id: 'weekly', name: 'أسبوعي' },
  { id: 'biweekly', name: 'كل أسبوعين' },
  { id: 'monthly', name: 'شهري' },
  { id: 'bimonthly', name: 'كل شهرين' },
  { id: 'quarterly', name: 'ربع سنوي' },
  { id: 'semiannual', name: 'نصف سنوي' },
  { id: 'yearly', name: 'سنوي' },
]
