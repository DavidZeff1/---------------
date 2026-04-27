import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { recipients, urgencyLevels, requestTypes } from '../data/recipients.js'
import { saveRequest, fileToBase64 } from '../lib/requestsStore.js'

const empty = {
  fullName: '',
  title: '',
  department: '',
  email: '',
  phone: '',
  recipient: '',
  type: '',
  urgency: 'low',
  subject: '',
  body: '',
  caseNumber: '',
  preferredContact: 'email',
}

export default function NewRequest() {
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'שדה חובה'
    if (!form.title.trim()) e.title = 'שדה חובה'
    if (!form.recipient) e.recipient = 'יש לבחור נמען'
    if (!form.type) e.type = 'יש לבחור סוג פנייה'
    if (!form.subject.trim()) e.subject = 'שדה חובה'
    if (!form.body.trim()) e.body = 'שדה חובה'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'אימייל לא תקין'
    if (form.preferredContact === 'email' && !form.email.trim()) e.email = 'נדרש אימייל ליצירת קשר'
    if (form.preferredContact === 'phone' && !form.phone.trim()) e.phone = 'נדרש טלפון ליצירת קשר'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onFiles = (e) => {
    const list = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...list])
    e.target.value = ''
  }

  const removeFile = (i) => setFiles(files.filter((_, idx) => idx !== i))

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return
    const totalSize = files.reduce((s, f) => s + f.size, 0)
    if (totalSize > 8 * 1024 * 1024) {
      setSubmitError('סך גודל הקבצים חורג מ-8MB. אנא הסר/י קבצים גדולים.')
      return
    }
    setSubmitting(true)
    try {
      const attachments = await Promise.all(
        files.map(async (f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
          base64: await fileToBase64(f),
        })),
      )
      await saveRequest({ ...form, attachments })
      navigate('/requests')
    } catch (err) {
      setSubmitError(err.message || 'שגיאה בשליחה')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">פנייה חדשה</h1>
        <p className="text-slate-600 text-sm">
          טופס פנייה לצוות התחשיב. כל השדות המסומנים בכוכבית הם חובה.
        </p>
      </header>

      <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        <Section title="פרטי הפונה">
          <Grid>
            <Field label="שם מלא" required error={errors.fullName}>
              <input className={inp(errors.fullName)} value={form.fullName} onChange={update('fullName')} />
            </Field>
            <Field label="תפקיד" required error={errors.title}>
              <input className={inp(errors.title)} value={form.title} onChange={update('title')} placeholder="עו״ס משפחה / מנהל/ת תחום וכד׳" />
            </Field>
            <Field label="מחלקה / יחידה">
              <input className={inp()} value={form.department} onChange={update('department')} />
            </Field>
            <Field label="אימייל" error={errors.email}>
              <input type="email" className={inp(errors.email)} value={form.email} onChange={update('email')} dir="ltr" />
            </Field>
            <Field label="טלפון" error={errors.phone}>
              <input type="tel" className={inp(errors.phone)} value={form.phone} onChange={update('phone')} dir="ltr" />
            </Field>
            <Field label="ערוץ קשר מועדף">
              <select className={inp()} value={form.preferredContact} onChange={update('preferredContact')}>
                <option value="email">אימייל</option>
                <option value="phone">טלפון</option>
                <option value="any">לא משנה</option>
              </select>
            </Field>
          </Grid>
        </Section>

        <Section title="פרטי הפנייה">
          <Grid>
            <Field label="נמען" required error={errors.recipient}>
              <select className={inp(errors.recipient)} value={form.recipient} onChange={update('recipient')}>
                <option value="">בחר/י נמען</option>
                {recipients.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
                <option value="any">כל אחד מהצוות</option>
              </select>
            </Field>
            <Field label="סוג פנייה" required error={errors.type}>
              <select className={inp(errors.type)} value={form.type} onChange={update('type')}>
                <option value="">בחר/י סוג</option>
                {requestTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="דחיפות">
              <select className={inp()} value={form.urgency} onChange={update('urgency')}>
                {urgencyLevels.map((u) => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
            </Field>
            <Field label="מספר תיק / לקוח (אם רלוונטי)">
              <input className={inp()} value={form.caseNumber} onChange={update('caseNumber')} dir="ltr" />
            </Field>
          </Grid>
          <Field label="נושא" required error={errors.subject}>
            <input className={inp(errors.subject)} value={form.subject} onChange={update('subject')} />
          </Field>
          <Field label="תיאור הפנייה" required error={errors.body}>
            <textarea
              rows={6}
              className={inp(errors.body)}
              value={form.body}
              onChange={update('body')}
              placeholder="תאר/י את הבקשה בצורה מפורטת ככל הניתן: רקע, מה ניסית, ומה נדרש."
            />
          </Field>
        </Section>

        <Section title="קבצים מצורפים">
          <label className="block">
            <input type="file" multiple onChange={onFiles} className="block w-full text-sm text-slate-700 file:ml-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <p className="text-xs text-slate-500 mt-1">ניתן לצרף מספר קבצים. תמונות, PDF, מסמכי Word וכד׳.</p>
          </label>
          {files.length > 0 && (
            <ul className="space-y-1">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm">
                  <span className="truncate">
                    {f.name} <span className="text-slate-500">({fmtSize(f.size)})</span>
                  </span>
                  <button type="button" onClick={() => removeFile(i)} className="text-red-600 hover:underline text-xs mr-2">
                    הסר
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 text-sm">
            {submitError}
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t border-slate-100">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'שולח…' : 'שליחת פנייה'}
          </button>
          <button
            type="button"
            onClick={() => { setForm(empty); setFiles([]); setErrors({}) }}
            className="px-5 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50"
          >
            ניקוי טופס
          </button>
        </div>
      </form>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Grid({ children }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {error && <span className="block text-xs text-red-600 mt-1">{error}</span>}
    </label>
  )
}

const inp = (err) =>
  `w-full px-3 py-2 border rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
    err ? 'border-red-400' : 'border-slate-300'
  }`

function fmtSize(b) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}
