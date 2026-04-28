import React from 'react'

export default function DeepGuide({ sections }) {
  return (
    <div className="space-y-12 pb-20 rtl">
      <nav className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8">
        <h2 className="text-sm font-bold text-slate-900 mb-3 underline underline-offset-4 decoration-blue-500">תוכן המדריך</h2>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a 
                href={`#${section.id}`} 
                className="text-sm text-slate-600 hover:text-blue-600 hover:underline flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 border-r-4 border-blue-600 pr-3">
              {section.title}
            </h2>
            {section.summary && (
              <p className="text-slate-500 font-medium italic pr-4">{section.summary}</p>
            )}
          </div>

          <div className="space-y-5">
            {section.content.map((block, idx) => (
              <RenderBlock key={idx} block={block} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function RenderBlock({ block }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="text-slate-700 leading-relaxed text-lg">{block.text}</p>
    
    case 'heading':
      const Tag = `h${block.level || 3}`
      const sizeClass = block.level === 3 ? 'text-xl font-bold' : 'text-lg font-semibold'
      return <Tag className={`${sizeClass} text-slate-800 mt-8 mb-4`}>{block.text}</Tag>

    case 'callout':
      const variants = {
        info: 'bg-blue-50 border-blue-200 text-blue-900',
        warning: 'bg-amber-50 border-amber-200 text-amber-900',
        tip: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        error: 'bg-red-50 border-red-200 text-red-900'
      }
      return (
        <div className={`p-5 rounded-xl border-2 ${variants[block.variant || 'info']} my-6 shadow-sm`}>
          {block.title && <div className="font-bold mb-2 flex items-center gap-2">
            <span className="text-xl">
              {block.variant === 'warning' ? '⚠️' : block.variant === 'tip' ? '💡' : 'ℹ️'}
            </span>
            {block.title}
          </div>}
          <div className="leading-relaxed">{block.text}</div>
        </div>
      )

    case 'list':
      return (
        <ul className="list-disc pr-6 space-y-3 text-slate-700 text-lg">
          {block.items.map((item, i) => (
            <li key={i}>
              {typeof item === 'string' ? item : (
                <>
                  <span className="font-bold text-slate-900">{item.label}:</span> {item.text}
                </>
              )}
            </li>
          ))}
        </ul>
      )

    case 'definition':
      return (
        <div className="bg-slate-50 border-r-4 border-slate-400 p-4 rounded-l-lg my-4">
          <div className="font-bold text-slate-900 mb-1 underline underline-offset-4 decoration-slate-300">{block.term}</div>
          <div className="text-slate-700 leading-relaxed">{block.text}</div>
        </div>
      )

    case 'calculation':
      return (
        <div className="bg-slate-900 text-slate-100 p-6 rounded-xl font-mono text-sm shadow-lg overflow-x-auto my-6 border-b-4 border-blue-500">
          <div className="text-blue-400 mb-3 font-bold border-b border-slate-700 pb-2">{block.label || 'חישוב:'}</div>
          <div className="space-y-1">
            {block.steps.map((step, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-slate-500 select-none">[{i+1}]</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'table':
      return (
        <div className="my-8 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                {block.columns.map((col, i) => (
                  <th key={i} className="px-4 py-3 text-sm font-bold text-slate-900 border-l border-slate-200 last:border-l-0">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-sm text-slate-700 border-l border-slate-100 last:border-l-0">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    default:
      return <div className="text-red-500">Unknown block type: {block.type}</div>
  }
}
