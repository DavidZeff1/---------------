import { Resend } from 'resend'
import { recipientEmails, recipientNames, urgencyLabels, typeLabels } from './_recipients.js'

const FROM = process.env.RESEND_FROM || 'onboarding@resend.dev'

export async function notifyRecipients(record) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY missing — skipping email notification')
    return { skipped: true }
  }

  const targets =
    record.recipient === 'any'
      ? Object.values(recipientEmails)
      : [recipientEmails[record.recipient]].filter(Boolean)

  if (targets.length === 0) return { skipped: true, reason: 'no recipients' }

  const resend = new Resend(apiKey)
  const subject = `[פנייה חדשה – ${urgencyLabels[record.urgency] || ''}] ${record.subject}`
  const html = renderEmail(record)

  const replyTo = record.email || undefined

  await resend.emails.send({
    from: FROM,
    to: targets,
    subject,
    html,
    replyTo,
  })
  return { sent: targets.length }
}

function renderEmail(r) {
  const rows = [
    ['פונה', `${escape(r.fullName)} – ${escape(r.title)}${r.department ? ` (${escape(r.department)})` : ''}`],
    ['אימייל', r.email ? `<a href="mailto:${escape(r.email)}" dir="ltr">${escape(r.email)}</a>` : '—'],
    ['טלפון', r.phone ? `<span dir="ltr">${escape(r.phone)}</span>` : '—'],
    ['ערוץ קשר מועדף', r.preferredContact === 'email' ? 'אימייל' : r.preferredContact === 'phone' ? 'טלפון' : 'לא משנה'],
    ['נמען', recipientNames[r.recipient] || r.recipient],
    ['סוג פנייה', typeLabels[r.type] || r.type],
    ['דחיפות', urgencyLabels[r.urgency] || r.urgency],
    ['מספר תיק', r.caseNumber ? `<span dir="ltr">${escape(r.caseNumber)}</span>` : '—'],
  ]

  const attachmentsHtml =
    r.attachments && r.attachments.length
      ? `<h3 style="margin-top:24px">קבצים מצורפים</h3>
         <ul>${r.attachments
           .map(
             (a) =>
               `<li><a href="${escape(a.url)}">${escape(a.name)}</a> (${fmtSize(a.size)})</li>`,
           )
           .join('')}</ul>`
      : ''

  return `<!doctype html>
<html lang="he" dir="rtl">
<body style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:24px">
    <h2 style="margin:0 0 4px">פנייה חדשה: ${escape(r.subject)}</h2>
    <p style="margin:0 0 16px;color:#64748b;font-size:13px">התקבלה ב-${new Date(r.createdAt).toLocaleString('he-IL')}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 0;color:#64748b;width:140px;vertical-align:top">${k}</td><td style="padding:6px 0">${v}</td></tr>`,
        )
        .join('')}
    </table>
    <h3 style="margin-top:24px">תיאור הפנייה</h3>
    <div style="white-space:pre-wrap;background:#f1f5f9;border-radius:6px;padding:12px;font-size:14px">${escape(r.body)}</div>
    ${attachmentsHtml}
    <p style="margin-top:24px;font-size:12px;color:#94a3b8">
      ניתן להשיב למייל זה כדי לחזור לפונה ישירות.
    </p>
  </div>
</body>
</html>`
}

function escape(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function fmtSize(b) {
  if (!b) return ''
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}
