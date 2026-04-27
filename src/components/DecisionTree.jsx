import { useState } from 'react'

export default function DecisionTree({ tree }) {
  const [path, setPath] = useState([tree.start])

  const currentId = path[path.length - 1]
  const node = tree.nodes[currentId]

  const reset = () => setPath([tree.start])
  const goBack = () => setPath((p) => (p.length > 1 ? p.slice(0, -1) : p))
  const choose = (nextId) => setPath((p) => [...p, nextId])

  return (
    <div className="space-y-6">
      {path.length > 1 && (
        <Breadcrumbs path={path} nodes={tree.nodes} onJump={(i) => setPath(path.slice(0, i + 1))} />
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        {node.title && (
          <h3 className="text-lg font-semibold text-slate-900 mb-3">{node.title}</h3>
        )}
        {node.body && <p className="text-slate-700 leading-relaxed mb-4">{node.body}</p>}

        {node.notes && node.notes.length > 0 && (
          <ul className="list-disc pr-5 space-y-1 text-sm text-slate-600 mb-4">
            {node.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        )}

        {node.options && node.options.length > 0 ? (
          <div className="grid gap-2 mt-4">
            <p className="text-sm font-medium text-slate-500 mb-1">בחר/י את הצעד הבא:</p>
            {node.options.map((opt) => (
              <button
                key={opt.next}
                onClick={() => choose(opt.next)}
                className="text-right px-4 py-3 rounded border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition text-slate-800"
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-sm">
            סוף התהליך
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={goBack}
          disabled={path.length <= 1}
          className="px-4 py-2 text-sm rounded border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          חזרה לצעד קודם
        </button>
        <button
          onClick={reset}
          disabled={path.length <= 1}
          className="px-4 py-2 text-sm rounded border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          התחלה מחדש
        </button>
      </div>
    </div>
  )
}

function Breadcrumbs({ path, nodes, onJump }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
      {path.map((id, i) => (
        <span key={i} className="flex items-center gap-1">
          <button
            onClick={() => onJump(i)}
            className="hover:text-blue-600 hover:underline"
          >
            {nodes[id].title || `צעד ${i + 1}`}
          </button>
          {i < path.length - 1 && <span className="text-slate-300">←</span>}
        </span>
      ))}
    </nav>
  )
}
