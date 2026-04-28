import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { guides } from '../data/guides.js'

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="min-h-full flex flex-col rtl">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              title="תפריט צד"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <Link to="/" className="flex flex-col">
              <span className="text-xl font-bold text-slate-900">מדריך התחשיבן</span>
              <span className="text-xs text-slate-500">שירותים חברתיים – מועצה אזורית גוש עציון</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-2 items-center">
            <NavItem to="/">בית</NavItem>
            <NavItem to="/requests">פניות</NavItem>
            <Link
              to="/requests/new"
              className="mr-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              פנייה חדשה
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1 flex w-full max-w-7xl mx-auto px-6 py-8 gap-8 relative">
        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside 
          className={`
            fixed inset-y-0 right-0 z-30 w-72 bg-white border-l border-slate-200 transform transition-transform duration-300 ease-in-out px-6 py-8
            md:static md:block md:w-64 md:p-0 md:bg-transparent md:border-l-0 md:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:hidden'}
          `}
        >
          <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24 shadow-sm">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">מדריכים זמינים</h2>
            <ul className="space-y-1">
              {guides.map((g) => (
                <li key={g.id}>
                  <NavLink
                    to={`/guide/${g.id}`}
                    onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-100'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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

        <main className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarOpen ? 'md:mr-0' : 'md:mr-0'}`}>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm min-h-[600px]">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 text-sm text-slate-500 text-center flex flex-col items-center gap-2">
          <div className="font-bold text-slate-900">מדריך התחשיבן</div>
          <div className="max-w-md opacity-75">מדריך פנימי – לשימוש צוות התחשיב של מחלקת השירותים החברתיים, מועצה אזורית גוש עציון.</div>
          <div className="mt-4 text-xs">© {new Date().getFullYear()} כל הזכויות שמורות</div>
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
        `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'bg-slate-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
