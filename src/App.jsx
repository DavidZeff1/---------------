import { Routes, Route, Link } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import GuidePage from './pages/GuidePage.jsx'
import { guides } from './data/guides.js'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {guides.map((g) => (
          <Route key={g.id} path={`guide/${g.id}`} element={<GuidePage guide={g} />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold mb-4">הדף לא נמצא</h1>
      <Link to="/" className="text-blue-600 hover:underline">חזרה לדף הבית</Link>
    </div>
  )
}
