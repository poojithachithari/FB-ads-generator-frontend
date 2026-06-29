import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

/* ── Image dropzone ─────────────────────────────────────── */
function ImageDropzone({ imageUrl, onFile }) {
  const inputRef = useRef()
  const [preview, setPreview] = useState(imageUrl || null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => { setPreview(imageUrl || null) }, [imageUrl])

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setPreview(URL.createObjectURL(file))
    onFile(file)
  }

  if (preview) {
    return (
      <div className="relative group cursor-pointer aspect-square" onClick={() => inputRef.current.click()}>
        <img src={preview} alt="" className="w-full h-full object-cover rounded-xl" />
        <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1.5 rounded-full">🔄 Change</span>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
      </div>
    )
  }

  return (
    <div
      className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${dragging ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-brand-300 bg-gray-50'}`}
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
    >
      <span className="text-3xl mb-1">🖼️</span>
      <p className="text-xs font-semibold text-gray-400">Drop or click</p>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
    </div>
  )
}

/* ── Detail modal ───────────────────────────────────────── */
function DetailModal({ ex, idx, onClose, onEdit, onDelete }) {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-bold z-10">
          ✕
        </button>

        {/* Image */}
        {ex.imageUrl ? (
          <img src={ex.imageUrl} alt={ex.label || `Example ${idx + 1}`}
            className="w-full aspect-video object-cover rounded-t-3xl"
            onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-3xl flex items-center justify-center">
            <span className="text-5xl opacity-30">🖼️</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
              {idx + 1}
            </span>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">
              {ex.label || <span className="text-gray-400 italic font-normal text-base">No label</span>}
            </h3>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Image Prompt</p>
            <p className="text-sm text-gray-700 leading-relaxed">{ex.prompt}</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => { onClose(); onEdit(ex) }}
              className="btn-primary text-sm py-2 px-5">Edit</button>
            <button onClick={() => { onClose(); onDelete(ex.id) }}
              className="text-sm text-red-400 font-semibold hover:text-red-600 transition-colors">Remove</button>
            <p className="text-xs text-gray-300 ml-auto">{ex.prompt.length} chars</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Product-style card ─────────────────────────────────── */
function ExampleCard({ ex, idx, onSeeMore, onEdit, onDelete }) {
  const truncated = ex.prompt.length > 100 ? ex.prompt.slice(0, 100) + '…' : ex.prompt

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer" onClick={() => onSeeMore(ex)}>
        {ex.imageUrl ? (
          <img src={ex.imageUrl} alt={ex.label || `Example ${idx + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.parentElement.classList.add('no-img') }} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <span className="text-4xl mb-2 opacity-30">🖼️</span>
            <p className="text-xs text-gray-300 font-medium">No image</p>
          </div>
        )}
        {/* Index badge */}
        <span className="absolute top-2 left-2 w-6 h-6 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-gray-700 flex items-center justify-center shadow-sm">
          {idx + 1}
        </span>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
          <span className="bg-white/95 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">See full prompt →</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Label */}
        <p className="font-semibold text-gray-800 text-sm leading-snug truncate">
          {ex.label || <span className="text-gray-400 italic font-normal">Untitled</span>}
        </p>

        {/* Truncated prompt */}
        <p className="text-xs text-gray-400 leading-relaxed flex-1">{truncated}</p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button onClick={() => onSeeMore(ex)}
            className="flex-1 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 py-2 rounded-lg transition-colors">
            See more
          </button>
          <button onClick={() => onEdit(ex)}
            className="text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
            Edit
          </button>
          <button onClick={() => onDelete(ex.id)}
            className="text-xs font-semibold text-red-400 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors">
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Add / Edit drawer ──────────────────────────────────── */
function ExampleForm({ initial, onSave, onCancel, saving }) {
  const [entry, setEntry] = useState(initial || { label: '', prompt: '' })
  const [file, setFile] = useState(null)
  const imageUrl = initial?.imageUrl || null

  return (
    <div className="bg-white border-2 border-brand-200 rounded-2xl p-6 mb-8">
      <p className="font-bold text-gray-900 mb-5">{initial?.id ? 'Edit example' : 'New example'}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Result image</label>
          <ImageDropzone imageUrl={imageUrl} onFile={setFile} />
          <p className="text-xs text-gray-400 mt-2 text-center">Optional — shows alongside the prompt</p>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Label</label>
            <input className="input-field text-sm" placeholder="e.g. Chamomile bedside lifestyle"
              value={entry.label} onChange={e => setEntry(p => ({ ...p, label: e.target.value }))} />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
              Prompt <span className="text-red-400">*</span>
            </label>
            <textarea className="input-field text-sm resize-none flex-1" rows={8}
              placeholder="Paste the full image prompt that created this result…"
              value={entry.prompt} onChange={e => setEntry(p => ({ ...p, prompt: e.target.value }))} autoFocus />
            <p className="text-xs text-gray-400 mt-1">{entry.prompt.length} chars</p>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button onClick={() => onSave(entry, file)} disabled={saving || !entry.prompt.trim()}
          className="btn-primary text-sm py-2.5 px-6 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Example'}
        </button>
        <button onClick={onCancel} className="btn-secondary text-sm py-2.5 px-4">Cancel</button>
      </div>
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────── */
export default function PromptExamples() {
  const navigate = useNavigate()
  const [examples, setExamples] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState(null)   // example object being edited
  const [modalEx, setModalEx] = useState(null)         // example shown in detail popup
  const [flash, setFlash] = useState(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    try { const { data } = await api.get('/api/example-prompts'); setExamples(data) }
    catch (_) {}
    finally { setLoading(false) }
  }

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(null), 2500) }

  const handleAdd = async (entry, file) => {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('prompt', entry.prompt.trim())
      fd.append('label', entry.label.trim())
      if (file) fd.append('image', file)
      const { data } = await api.post('/api/example-prompts', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setExamples(prev => [...prev, data])
      setShowAdd(false)
      showFlash('Example added ✓')
    } catch (_) {}
    finally { setSaving(false) }
  }

  const handleEdit = async (entry, file) => {
    setSaving(true)
    try {
      await api.put(`/api/example-prompts/${editTarget.id}`, entry)
      if (file) {
        const fd = new FormData(); fd.append('image', file)
        await api.post(`/api/example-prompts/${editTarget.id}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      const { data } = await api.get('/api/example-prompts')
      setExamples(data)
      setEditTarget(null)
      showFlash('Saved ✓')
    } catch (_) {}
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this example?')) return
    await api.delete(`/api/example-prompts/${id}`)
    setExamples(prev => prev.filter(e => e.id !== id))
    showFlash('Removed')
  }

  const startEdit = (ex) => { setEditTarget(ex); setShowAdd(false) }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Train AI with Examples</h2>
          <p className="text-gray-500 mt-1 max-w-xl text-sm">
            Add prompt + image pairs. Claude and GPT study these before every generation — learning your exact style, detail, and quality level.
          </p>
        </div>
        <button onClick={() => navigate('/')} className="btn-secondary text-sm py-2 px-4 shrink-0">← Back</button>
      </div>

      {/* How it works */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-7 flex gap-3">
        <span className="text-xl shrink-0">💡</span>
        <p className="text-sm text-amber-800 leading-relaxed">
          Upload the <strong>result image</strong> alongside the <strong>prompt that created it</strong>.
          The AI will match this style for every new ad it generates. Aim for <strong>3–7 examples</strong>.
          {examples.length > 0 && <span className="text-amber-700 font-semibold"> · {examples.length} active now.</span>}
        </p>
      </div>

      {flash && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-5">✓ {flash}</div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold text-gray-500">
          {examples.length} example{examples.length !== 1 ? 's' : ''}
          {examples.length > 0 && <span className="text-brand-600 ml-2">· Active on all generations</span>}
        </p>
        <button
          onClick={() => { setShowAdd(true); setEditTarget(null) }}
          className="btn-primary text-sm py-2 px-4">
          + Add Example
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <ExampleForm saving={saving} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      )}

      {/* Edit form */}
      {editTarget && (
        <ExampleForm initial={editTarget} saving={saving} onSave={handleEdit} onCancel={() => setEditTarget(null)} />
      )}

      {/* Cards grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : examples.length === 0 && !showAdd ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="text-6xl mb-4">🎓</div>
          <p className="font-semibold text-gray-600 text-lg">No examples yet</p>
          <p className="text-sm text-gray-400 mt-2 mb-6">Add 3–7 prompt + image pairs to guide the AI</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary">+ Add First Example</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {examples.map((ex, idx) => (
            <ExampleCard
              key={ex.id}
              ex={ex}
              idx={idx}
              onSeeMore={setModalEx}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
          ))}

          {/* Add new card (ghost) */}
          {!showAdd && (
            <button
              onClick={() => { setShowAdd(true); setEditTarget(null) }}
              className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-brand-300 bg-gray-50 hover:bg-brand-50 flex flex-col items-center justify-center gap-2 transition-colors group"
            >
              <span className="text-3xl text-gray-300 group-hover:text-brand-400 transition-colors">+</span>
              <span className="text-xs font-semibold text-gray-400 group-hover:text-brand-500 transition-colors">Add Example</span>
            </button>
          )}
        </div>
      )}

      {/* Detail modal */}
      {modalEx && (
        <DetailModal
          ex={modalEx}
          idx={examples.findIndex(e => e.id === modalEx.id)}
          onClose={() => setModalEx(null)}
          onEdit={(ex) => { setEditTarget(ex); setModalEx(null) }}
          onDelete={(id) => { handleDelete(id); setModalEx(null) }}
        />
      )}
    </main>
  )
}
