// כל מדריך מכיל עץ החלטה. כדי להוסיף מדריך חדש - הוסף אובייקט חדש למערך.
// מבנה עץ: { start: 'מזהה_התחלה', nodes: { id: { title, body, notes?, options?: [{label, next}] } } }
// צומת ללא options נחשב כסוף התהליך.

export const guides = [
  {
    id: 'new-case',
    title: 'פתיחת תיק חדש',
    description: 'תהליך פתיחת תיק לקוח חדש במערכת ה-CRM.',
    tree: {
      start: 'start',
      nodes: {
        start: {
          title: 'סוג הפנייה',
          body: 'מהו מקור הפנייה?',
          options: [
            { label: 'פנייה ישירה של תושב', next: 'resident' },
            { label: 'הפניה מגורם חיצוני', next: 'external' },
            { label: 'העברה ממחלקה אחרת', next: 'internal' },
          ],
        },
        resident: {
          title: 'פנייה ישירה',
          body: 'בדוק/י אם התושב קיים כבר במערכת.',
          notes: ['חיפוש לפי תעודת זהות', 'אימות פרטי קשר'],
          options: [
            { label: 'תושב קיים', next: 'existing' },
            { label: 'תושב חדש', next: 'create' },
          ],
        },
        external: {
          title: 'הפניה חיצונית',
          body: 'תיעוד פרטי הגורם המפנה והעברה לבדיקת זכאות.',
          options: [{ label: 'המשך לבדיקת זכאות', next: 'eligibility' }],
        },
        internal: {
          title: 'העברה פנימית',
          body: 'פתח/י תיק מקושר לתיק המקור במחלקה המעבירה.',
          options: [{ label: 'המשך', next: 'eligibility' }],
        },
        existing: {
          title: 'עדכון תיק קיים',
          body: 'הוסף/י פנייה חדשה לתיק הקיים ועדכן/י סטטוס.',
        },
        create: {
          title: 'יצירת רשומת תושב חדש',
          body: 'הזן/י את כל פרטי התושב במערכת ופתח/י תיק.',
          options: [{ label: 'המשך לבדיקת זכאות', next: 'eligibility' }],
        },
        eligibility: {
          title: 'בדיקת זכאות',
          body: 'תוכן מפורט יתווסף בהמשך.',
        },
      },
    },
  },
  {
    id: 'monthly-billing',
    title: 'חיוב חודשי',
    description: 'תהליך הפקת חיובים חודשיים והעברתם ל-ERP.',
    tree: null,
  },
  {
    id: 'subsidy-request',
    title: 'בקשת השתתפות / סבסוד',
    description: 'טיפול בבקשות השתתפות תקציבית.',
    tree: null,
  },
  {
    id: 'crm-erp-sync',
    title: 'סנכרון CRM ↔ ERP',
    description: 'נהלי סנכרון בין המערכות והתאמת רשומות.',
    tree: null,
  },
  {
    id: 'erp-tzav',
    title: 'ERP – טופס צו',
    description: 'מילוי טופס צו במערכת ה-ERP.',
    tree: null,
  },
  {
    id: 'erp-hachlata',
    title: 'ERP – טופס החלטה',
    description: 'מילוי טופס החלטה במערכת ה-ERP.',
    tree: null,
  },
  {
    id: 'erp-hasama',
    title: 'ERP – טופס השמה',
    description: 'מילוי טופס השמה במערכת ה-ERP.',
    tree: null,
  },
]
