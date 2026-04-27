// TODO: החלף את כתובות המייל בכתובות האמיתיות
export const recipients = [
  { id: 'yeela', name: 'יעלה', email: 'yeela@example.com' },
  { id: 'rachel', name: 'רחל', email: 'rachel@example.com' },
  { id: 'david', name: 'דוד', email: 'david@example.com' },
]

export const urgencyLevels = [
  { id: 'low', label: 'רגילה' },
  { id: 'medium', label: 'בינונית' },
  { id: 'high', label: 'דחופה' },
  { id: 'critical', label: 'דחוף מאוד' },
]

export const erpFormTypes = [
  { id: 'tzav', label: 'צו' },
  { id: 'hachlata', label: 'החלטה' },
  { id: 'hasama', label: 'השמה' },
]

export const requestTypes = [
  { id: 'billing', label: 'חיוב / תחשיב' },
  { id: 'subsidy', label: 'השתתפות / סבסוד' },
  { id: 'crm', label: 'בעיה ב-CRM' },
  { id: 'erp', label: 'בעיה ב-ERP' },
  { id: 'document', label: 'בקשת מסמך / אישור' },
  { id: 'other', label: 'אחר' },
]
