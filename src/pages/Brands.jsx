import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

// ── Create brand modal ────────────────────────────────────
function CreateBrandModal({ onCreated, onClose }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const handleCreate = async () => {
    if (!name.trim()) return setError('Please enter a brand name.')
    setSaving(true)
    setError('')
    try {
      const { data } = await api.post('/api/brands', { name: name.trim() })
      onCreated(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create brand.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Create a new brand</h3>
        <input
          autoFocus
          className="input-field mb-2"
          placeholder="Brand name (e.g. Eco Protein)"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
        />
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleCreate} disabled={saving} className="btn-primary flex-1">
            {saving ? 'Creating…' : 'Create Brand'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Ad session card ───────────────────────────────────────
function SessionCard({ session, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const date = new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const handleDownload = async () => {
    if (!session.imageUrl) return
    try {
      const response = await fetch(session.imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeName = (session.concept?.headline || 'ad').replace(/[^a-z0-9]/gi, '_').substring(0, 40)
      a.download = `${safeName}_${session.id.substring(0, 8)}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      window.open(session.imageUrl, '_blank')
    }
  }

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {session.imageUrl ? (
          <img
            src={session.imageUrl}
            alt={session.concept?.headline || 'Ad'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">🖼️</div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs font-semibold text-gray-800 truncate">{session.concept?.headline || 'Untitled ad'}</p>
        <p className="text-xs text-gray-400 mt-0.5">{session.concept?.creative_angle || ''}</p>
        {session.template && (
          <span className="inline-block mt-1.5 text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium">
            {session.template.name}
          </span>
        )}
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-gray-300">{date}</p>
          {session.imageUrl && (
            <button
              onClick={handleDownload}
              className="text-xs text-brand-500 hover:text-brand-700 font-semibold flex items-center gap-0.5"
              title="Download"
            >
              ⬇ <span>Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Action buttons — visible on hover */}
      {!confirmDelete ? (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          {session.imageUrl && (
            <button
              onClick={handleDownload}
              className="w-6 h-6 bg-white/90 hover:bg-brand-500 hover:text-white text-gray-500 rounded-full text-xs flex items-center justify-center shadow"
              title="Download image"
            >⬇</button>
          )}
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-6 h-6 bg-white/90 hover:bg-red-500 hover:text-white text-gray-400 rounded-full text-xs flex items-center justify-center shadow"
            title="Delete"
          >✕</button>
        </div>
      ) : (
        <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-2 p-3">
          <p className="text-xs text-gray-600 text-center">Remove this ad?</p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmDelete(false)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
            <button onClick={onDelete} className="text-xs px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600">Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Brand folder ──────────────────────────────────────────
function BrandFolder({ brand, onNewAd, onSessionDelete, onBrandDelete, onOpen }) {
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next) onOpen?.()   // fetch full sessions on first expand
  }

  return (
    <div className="card overflow-hidden">
      {/* Header row */}
      <button
        onClick={toggle}
        className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors text-left"
      >
        {/* Folder icon + last image stack */}
        <div className="relative w-14 h-14 shrink-0">
          {brand.lastImage ? (
            <>
              <div className="absolute inset-0 bg-brand-100 rounded-xl rotate-3" />
              <img
                src={brand.lastImage}
                alt={brand.name}
                className="absolute inset-0 w-full h-full object-cover rounded-xl shadow"
              />
            </>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center text-2xl">📁</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base truncate">{brand.name}</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {brand.sessionCount} ad{brand.sessionCount !== 1 ? 's' : ''}
            {brand.lastCreatedAt && (
              <> · Last generated {new Date(brand.lastCreatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-gray-300 text-sm">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-gray-100 p-5">
          {/* Action bar */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">{brand.sessionCount} saved ad{brand.sessionCount !== 1 ? 's' : ''}</p>
            <div className="flex gap-2">
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-xs text-gray-400 hover:text-red-500 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 transition-colors"
                >
                  Delete brand
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Are you sure?</span>
                  <button onClick={() => setConfirmDelete(false)} className="text-xs px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
                  <button onClick={onBrandDelete} className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600">Delete</button>
                </div>
              )}
              <button
                onClick={() => onNewAd(brand)}
                className="btn-primary text-sm py-2 px-4"
              >
                + New Ad
              </button>
            </div>
          </div>

          {/* Session grid */}
          {brand.sessions && brand.sessions.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[...brand.sessions].reverse().map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onDelete={() => onSessionDelete(brand.id, session.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p className="text-sm">No ads yet. Click <strong>+ New Ad</strong> to create your first one.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────
export default function Brands() {
  const navigate = useNavigate()
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/brands')
      setBrands(data)
    } catch (_) {
      setBrands([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch full brand data (with sessions) when expanding
  const fetchBrandFull = async (brandId) => {
    try {
      const { data } = await api.get(`/api/brands/${brandId}`)
      setBrands(prev => prev.map(b => b.id === brandId ? { ...b, ...data } : b))
    } catch (_) {}
  }

  const handleNewAd = (brand) => {
    // Clear any existing session state
    ['fb_ads_brief', 'fb_ads_template', 'fb_ads_copies', 'fb_ads_image'].forEach(k => sessionStorage.removeItem(k))
    // Navigate to brief form with brand pre-fill + brand context
    navigate('/', { state: { prefill: brand.briefTemplate, brandId: brand.id, brandName: brand.name } })
  }

  const handleBrandCreated = (brand) => {
    setBrands(prev => [...prev, { ...brand, sessionCount: 0, lastImage: null }])
    setShowCreate(false)
    // Immediately start a new ad for this brand
    handleNewAd(brand)
  }

  const handleSessionDelete = async (brandId, sessionId) => {
    try {
      await api.delete(`/api/brands/${brandId}/sessions/${sessionId}`)
      setBrands(prev => prev.map(b => {
        if (b.id !== brandId) return b
        const sessions = (b.sessions || []).filter(s => s.id !== sessionId)
        return {
          ...b,
          sessions,
          sessionCount: sessions.length,
          lastImage: sessions.slice(-1)[0]?.imageUrl || null,
          lastCreatedAt: sessions.slice(-1)[0]?.createdAt || null
        }
      }))
    } catch (_) {}
  }

  const handleBrandDelete = async (brandId) => {
    try {
      await api.delete(`/api/brands/${brandId}`)
      setBrands(prev => prev.filter(b => b.id !== brandId))
    } catch (_) {}
  }

  // Expand brand: fetch full sessions
  const handleOpen = (brand) => {
    if (!brand.sessions) fetchBrandFull(brand.id)
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Brands</h2>
          <p className="text-gray-500 mt-1">All your generated ads grouped by brand</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary text-sm py-2.5 px-5">
          + New Brand
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading brands…</p>
        </div>
      ) : brands.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">📁</div>
          <h3 className="font-semibold text-gray-700 text-lg mb-2">No brands yet</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-6">
            Create a brand folder to group all your generated ads together.
          </p>
          <button onClick={() => setShowCreate(true)} className="btn-primary text-sm py-2.5 px-6">
            + Create your first brand
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {brands.map(brand => (
            <BrandFolder
              key={brand.id}
              brand={brand}
              onNewAd={handleNewAd}
              onSessionDelete={handleSessionDelete}
              onBrandDelete={() => handleBrandDelete(brand.id)}
              onOpen={() => handleOpen(brand)}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateBrandModal
          onCreated={handleBrandCreated}
          onClose={() => setShowCreate(false)}
        />
      )}
    </main>
  )
}
