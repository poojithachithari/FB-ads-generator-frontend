import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const STORAGE_KEY = 'fb_ads_template'

// ── Confirm delete modal ──────────────────────────────────
function ConfirmModal({ template, onConfirm, onCancel }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-2">Delete template?</h3>
        <p className="text-sm text-gray-500 mb-5">
          "<span className="font-semibold text-gray-700">{template.name}</span>" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}  className="btn-secondary flex-1">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Preview modal ─────────────────────────────────────────
function PreviewModal({ template, onClose, onSelect, analyzing }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape' && !analyzing) onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose, analyzing])

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
      onClick={(e) => { if (e.target === e.currentTarget && !analyzing) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gray-100 overflow-hidden flex items-center justify-center relative" style={{ maxHeight: '400px' }}>
          <img
            src={template.imageUrl}
            alt={template.name}
            className="w-full object-contain"
            style={{ maxHeight: '400px' }}
          />
          {analyzing && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              <p className="text-white font-semibold text-sm">Analysing template…</p>
              <p className="text-white/70 text-xs">Claude is reading the layout & style</p>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
            {!analyzing && (
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {analyzing
              ? 'Claude is analysing the template\'s layout, text zones, and visual style to tailor your ad copies and image prompt…'
              : 'The AI will analyse this template\'s layout, text elements, and visual style — then generate ad copies and an image prompt specifically shaped for it.'}
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} disabled={analyzing} className="btn-secondary flex-1 disabled:opacity-40">Cancel</button>
            <button
              onClick={onSelect}
              disabled={analyzing}
              className="btn-primary flex-1 whitespace-nowrap disabled:opacity-60"
            >
              {analyzing ? 'Analysing…' : 'Use This Template →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────
export default function TemplateSelect() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const fileRef = useRef()

  // Restore from sessionStorage on back navigation
  let pageData = state
  if (!pageData?.brief) {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) pageData = JSON.parse(saved)
    } catch (_) {}
  }

  useEffect(() => {
    if (pageData?.brief) {
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pageData)) } catch (_) {}
    }
  }, [])

  if (!pageData?.brief) {
    navigate('/')
    return null
  }

  // ── State ──────────────────────────────────────────────
  const [templates, setTemplates]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [preview, setPreview]           = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [selected, setSelected]         = useState(null)
  const [adminVisible, setAdminVisible] = useState(false)
  const [analyzing, setAnalyzing]       = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')

  // Admin form
  const [newName, setNewName]           = useState('')
  const [newFile, setNewFile]           = useState(null)
  const [newPreview, setNewPreview]     = useState(null)
  const [uploading, setUploading]       = useState(false)
  const [formError, setFormError]       = useState('')

  // ── Load templates ────────────────────────────────────
  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/ad-templates')
      setTemplates(data)
    } catch (_) {
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  // ── Select & navigate ─────────────────────────────────
  const handleSelect = async (template) => {
    setSelected(template.id)
    setAnalyzeError('')
    setAnalyzing(true)

    let templateAnalysis = null
    try {
      const { data } = await axios.post('/api/analyze-template', {
        imageUrl: template.imageUrl,
        templateName: template.name
      })
      templateAnalysis = data
    } catch (err) {
      // Non-fatal — fall back to name-only instruction
      console.warn('[TemplateSelect] Analysis failed, using fallback:', err.message)
      setAnalyzeError('Template analysis failed — using basic style matching.')
    } finally {
      setAnalyzing(false)
    }

    navigate('/copies', {
      state: {
        ...pageData,
        template: {
          id: template.id,
          name: template.name,
          imageUrl: template.imageUrl,
          templateAnalysis,
          // Fallback instruction used only if analysis failed
          imageInstruction: templateAnalysis
            ? templateAnalysis.promptInstruction
            : `Use the visual style from this template: "${template.name}". Match its composition, lighting mood, colour palette, and overall aesthetic as closely as possible.`
        },
        brandId: pageData.brandId || null,
        brandName: pageData.brandName || null
      }
    })
  }

  // ── Admin: add template ───────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setNewFile(file)
    setNewPreview(URL.createObjectURL(file))
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleAdd = async () => {
    if (!newName.trim()) return setFormError('Please enter a style name.')
    if (!newFile)        return setFormError('Please choose an image.')
    setFormError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('name',  newName.trim())
      fd.append('image', newFile)
      const { data } = await axios.post('/api/ad-templates', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setTemplates(prev => [...prev, data])
      setNewName(''); setNewFile(null); setNewPreview(null)
    } catch (err) {
      setFormError(err.response?.data?.error || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  // ── Admin: delete template ────────────────────────────
  const handleDelete = async (template) => {
    try {
      await axios.delete(`/api/ad-templates/${template.id}`)
      setTemplates(prev => prev.filter(t => t.id !== template.id))
    } catch (_) {}
    setConfirmTarget(null)
  }

  // ── Render ────────────────────────────────────────────
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">

      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
          <p className="text-gray-500 mt-1">
            Pick a visual style — the AI will match its composition, lighting, and mood when generating your ad image
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Hidden toggle */}
          <button
            onClick={() => setAdminVisible(v => !v)}
            className="btn-secondary text-sm py-2 px-4"
            title={adminVisible ? 'Hide manage panel' : 'Add templates'}
          >
            {adminVisible ? '✕ Close' : '+ Add'}
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary text-sm py-2 px-4">
            ← Edit Brief
          </button>
        </div>
      </div>

      {/* ── Admin panel (hidden by default) ── */}
      {adminVisible && (
        <div className="card p-6 mb-8 border-2 border-dashed border-brand-200 bg-brand-50/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-brand-700 text-sm uppercase tracking-wider">Manage Templates</h3>
            <button onClick={() => setAdminVisible(false)} className="text-xs text-gray-400 hover:text-gray-600">Hide ✕</button>
          </div>

          {/* Add form */}
          <div className="flex items-start gap-4 flex-wrap">
            {/* Image picker */}
            <div
              onClick={() => fileRef.current?.click()}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-400 cursor-pointer overflow-hidden flex items-center justify-center bg-white shrink-0 transition-colors"
            >
              {newPreview
                ? <img src={newPreview} className="w-full h-full object-cover" alt="preview" />
                : <span className="text-2xl text-gray-300">+</span>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            {/* Name + submit */}
            <div className="flex-1 min-w-48 space-y-2">
              <input
                className="input-field"
                placeholder="Style name (e.g. Golden Hour Lifestyle)"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
              />
              {formError && <p className="text-xs text-red-500">{formError}</p>}
              <button
                onClick={handleAdd}
                disabled={uploading}
                className="btn-primary text-sm py-2 px-5"
              >
                {uploading ? 'Uploading…' : '+ Add Template'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Template grid ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading templates…</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🖼️</div>
          <h3 className="font-semibold text-gray-700 text-lg mb-2">No templates yet</h3>
          <p className="text-sm text-gray-400 max-w-xs">
            Click the <span className="font-semibold">⊕</span> button at the top right to open the manage panel and add your first template.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {templates.map(template => (
            <div key={template.id} className="group relative">
              <button
                onClick={() => setPreview(template)}
                className={`w-full rounded-xl overflow-hidden border-2 transition-all duration-150 text-left ${
                  selected === template.id
                    ? 'border-brand-500 shadow-lg shadow-brand-100'
                    : 'border-transparent hover:border-brand-300 hover:shadow-md'
                }`}
              >
                {/* Square image thumbnail */}
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={template.imageUrl}
                    alt={template.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center pointer-events-none">
                  <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-3 py-1.5 rounded-full">
                    Preview
                  </span>
                </div>

                {/* Selected badge */}
                {selected === template.id && (
                  <div className="absolute top-2 right-2 bg-brand-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">✓</div>
                )}

                {/* Name label */}
                <div className="p-2.5 bg-white">
                  <p className="text-xs font-semibold text-gray-800 truncate">{template.name}</p>
                </div>
              </button>

              {/* Delete button — only visible in admin mode */}
              {adminVisible && (
                <button
                  onClick={() => setConfirmTarget(template)}
                  className="absolute top-2 left-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center shadow transition-colors"
                  title="Delete"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-sm text-gray-400 mt-10">
        Click a template to preview, then choose "Use This Template" to continue
      </p>

      {/* Preview modal */}
      {analyzeError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-5 py-3 text-sm shadow-lg z-50">
          ⚠️ {analyzeError}
        </div>
      )}

      {preview && (
        <PreviewModal
          template={preview}
          onClose={() => { if (!analyzing) setPreview(null) }}
          onSelect={() => handleSelect(preview)}
          analyzing={analyzing}
        />
      )}

      {/* Delete confirm modal */}
      {confirmTarget && (
        <ConfirmModal
          template={confirmTarget}
          onConfirm={() => handleDelete(confirmTarget)}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </main>
  )
}
