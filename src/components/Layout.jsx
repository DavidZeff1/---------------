import { Link, NavLink, Outlet } from 'react-router-dom'
import { guides } from '../data/guides.js'

export default function Layout() {
  return (
    <div className="min-h-full flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex flex-col">
            <span className="text-xl font-bold text-slate-900">מדריך התחשיבן</span>
            <span className="text-xs text-slate-500">שירותים חברתיים – מועצה אזורית גוש עציון</span>
          </Link>
          <nav className="hidden md:flex gap-2">
            <NavItem to="/">בית</NavItem>
          </nav>
        </div>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex gap-8">
        <aside className="hidden md:block w-64 shrink-0">
          <div className="bg-white rounded-lg border border-slate-200 p-4 sticky top-6">
            <h2 className="text-sm font-semibold text-slate-500 mb-3">מדריכים</h2>
            <ul className="space-y-1">
              {guides.map((g) => (
                <li key={g.id}>
                  <NavLink
                    to={`/guide/${g.id}`}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded text-sm transition ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    {g.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-slate-500 text-center">
          מדריך פנימי – לשימוש צוות התחשיב
        </div>
      </footer>
    </div>
  )
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `px-3 py-2 rounded text-sm ${
          isActive ? 'text-blue-700 font-medium' : 'text-slate-600 hover:text-slate-900'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
