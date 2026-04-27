import { Link } from 'react-router-dom'
import { guides } from '../data/guides.js'

export default function Home() {
  return (
    <div>
      <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">ברוך הבא למדריך התחשיבן</h1>
        <p className="text-slate-600 leading-relaxed">
          מדריך פנימי לתפקיד התחשיבן במחלקת השירותים החברתיים. כולל עצי החלטה לתהליכי עבודה,
          התנהלות מול ה-CRM וה-ERP, וטיפול בניירת.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-slate-800 mb-4">בחר/י מדריך</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {guides.map((g) => (
          <Link
            key={g.id}
            to={`/guide/${g.id}`}
            className="block bg-white border border-slate-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-1">{g.title}</h3>
            <p className="text-sm text-slate-600">{g.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
