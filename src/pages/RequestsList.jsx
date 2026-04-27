import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadRequests, deleteRequest } from '../lib/requestsStore.js'
import { recipients, urgencyLevels, requestTypes } from '../data/recipients.js'

const recipientName = (id) =>
  id === 'any' ? 'כל הצוות' : recipients.find((r) => r.id === id)?.name || id
const urgencyLabel = (id) => urgencyLevels.find((u) => u.id === id)?.label || id
const typeLabel = (id) => requestTypes.find((t) => t.id === id)?.label || id

const urgencyColor = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-amber-100 text-amber-800',
  critical: 'bg-red-100 text-red-800',
}

export default function RequestsList() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await loadRequests())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  const remove = async (id) => {
    if (!confirm('למחוק את הפנייה?')) return
    try {
      await deleteRequest(id)
      await refresh()
    } catch (e) {
      alert(e.message)
    }
  }

  const filtered = filter === 'all' ? items : items.filter((r) => r.recipient === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">פניות</h1>
          <p className="text-slate-600 text-sm">רשימת פניות שנשלחו לצוות התחשיב.</p>
        </div>
        <Link to="/requests/new" className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">
          פנייה חדשה
        </Link>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>הכל</FilterBtn>
        {recipients.map((r) => (
          <FilterBtn key={r.id} active={filter === r.id} onClick={() => setFilter(r.id)}>
            {r.name}
          </FilterBtn>
        ))}
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-500">טוען…</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-4 text-sm">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-lg p-10 text-center text-slate-500">
          אין פניות להצגה.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => {
            const open = openId === r.id
            return (
              <li key={r.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenId(open ? null : r.id)}
                  className="w-full text-right p-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${urgencyColor[r.urgency]}`}>
                          {urgencyLabel(r.urgency)}
                        </span>
                        <h3 className="font-semibold text-slate-900 truncate">{r.subject}</h3>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        מאת {r.fullName} · אל {recipientName(r.recipient)} · {typeLabel(r.type)}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{fmtDate(r.createdAt)}</span>
                  </div>
                </button>

                {open && (
                  <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-3 text-sm">
                    <Detail label="פונה">
                      {r.fullName} – {r.title}{r.department && ` (${r.department})`}
                    </Detail>
                    {(r.email || r.phone) && (
                      <Detail label="יצירת קשר">
                        <span dir="ltr" className="inline-block">
                          {[r.email, r.phone].filter(Boolean).join(' · ')}
                        </span>
                      </Detail>
                    )}
                    {r.caseNumber && <Detail label="מספר תיק"><span dir="ltr">{r.caseNumber}</span></Detail>}
                    <Detail label="תיאור">
                      <p className="whitespace-pre-wrap text-slate-800">{r.body}</p>
                    </Detail>
                    {r.attachments?.length > 0 && (
                      <Detail label="קבצים מצורפים">
                        <ul className="space-y-1">
                          {r.attachments.map((a, i) => (
                            <li key={i}>
                              {a.url ? (
                                <a href={a.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                  {a.name}
                                </a>
                              ) : (
                                <span className="text-slate-700">{a.name}</span>
                              )}
                              <span className="text-slate-500 text-xs mr-2">({fmtSize(a.size)})</span>
                            </li>
                          ))}
                        </ul>
                      </Detail>
                    )}
                    <div className="pt-2">
                      <button onClick={() => remove(r.id)} className="text-xs text-red-600 hover:underline">
                        מחיקת פנייה
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-sm border transition ${
        active
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  )
}

function Detail({ label, children }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-500 mb-0.5">{label}</div>
      <div className="text-slate-800">{children}</div>
    </div>
  )
}

function fmtDate(iso) {
  return new Date(iso).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' })
}
function fmtSize(b) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}
