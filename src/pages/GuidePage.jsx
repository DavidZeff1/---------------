import DecisionTree from '../components/DecisionTree.jsx'
import DeepGuide from '../components/DeepGuide.jsx'

export default function GuidePage({ guide }) {
  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-10 pb-8 border-b border-slate-200">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
          {guide.title}
        </h1>
        {guide.description && (
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">{guide.description}</p>
        )}
      </header>

      {guide.tree ? (
        <DecisionTree tree={guide.tree} />
      ) : guide.sections ? (
        <DeepGuide sections={guide.sections} />
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-6 text-center italic shadow-inner">
          תוכן המדריך יתווסף בהמשך.
        </div>
      )}
    </article>
  )
}
