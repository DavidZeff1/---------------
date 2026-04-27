import DecisionTree from '../components/DecisionTree.jsx'

export default function GuidePage({ guide }) {
  return (
    <article>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{guide.title}</h1>
        {guide.description && (
          <p className="text-slate-600">{guide.description}</p>
        )}
      </header>

      {guide.tree ? (
        <DecisionTree tree={guide.tree} />
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded p-4 text-sm">
          תוכן המדריך יתווסף בהמשך.
        </div>
      )}
    </article>
  )
}
