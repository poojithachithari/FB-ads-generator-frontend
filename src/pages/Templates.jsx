import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../api'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'yesterday'
  return `${days}d ago`
}

function dateLabel(dateStr) {
  if (!dateStr) return 'Unknown date'
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

/* ── Custom confirm modal ───────────────────────────────── */
function ConfirmModal({ imageUrl, onConfirm, onCancel }) {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Image preview */}
        {imageUrl && (
          <img loading="lazy" src={imageUrl} alt="" className="w-full aspect-video object-cover" />
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🗑️</span>
            <h3 className="font-bold text-gray-900 text-lg">Delete this image?</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">This will permanently remove the image and cannot be undone.</p>
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
            >
              Yes, delete
            </button>
            <button
              onClick={onCancel}
              className="flex-1 btn-secondary text-sm py-2.5"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Templates() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sessions, setSessions] = useState([])
  const [details, setDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [regenerating, setRegenerating] = useState(null)
  const [editPrompt, setEditPrompt] = useState({})
  const [editingKey, setEditingKey] = useState(null)
  const [newImages, setNewImages] = useState({})
  const [deleting, setDeleting] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null) // { sessionId, imgIndex, imageKey, imageUrl }

  const loadAllSessions = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError('')
    try {
      const { data: list } = await api.get('/api/sessions')
      const withImages = list.filter(s => s.hasGeneratedImages)
      setSessions(withImages)
      const detailResults = await Promise.all(
        withImages.map(s => api.get(`/api/sessions/${s.id}`).then(r => [s.id, r.data]))
      )
      setDetails(Object.fromEntries(detailResults))
    } catch (err) {
      setError('Could not load sessions. Make sure the backend is running.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { loadAllSessions() }, [location.key])

  const getConceptForImage = (session, img) =>
    session.concepts?.find(c => c.id === img.conceptId) || null

  const handleRegenerate = async (sessionId, img, imageKey) => {
    setRegenerating(imageKey)
    setNewImages(prev => ({ ...prev, [imageKey]: null }))
    const session = details[sessionId]
    const concept = getConceptForImage(session, img)
    try {
      const { data } = await api.post('/api/generate-image', {
        visualDescription: editPrompt[imageKey] || img.prompt,
        brandName: session.brief?.brandName,
        tone: session.brief?.toneOfVoice,
        creativeAngle: concept?.creative_angle,
        sessionId,
        conceptId: img.conceptId,
        hasProductImage: !!session.productImageUrl
      })
      setNewImages(prev => ({ ...prev, [imageKey]: data.imageUrl }))
      const { data: updated } = await api.get(`/api/sessions/${sessionId}`)
      setDetails(prev => ({ ...prev, [sessionId]: updated }))
    } catch (err) {
      setError('Regeneration failed: ' + (err.response?.data?.error || err.message))
    } finally {
      setRegenerating(null)
    }
  }

  const handleDownload = async (imageUrl, brandName, angle) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(brandName || 'ad').replace(/\s+/g, '_')}_${(angle || 'image').replace(/\s+/g, '_')}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      window.open(imageUrl, '_blank')
    }
  }

  const confirmDelete = (sessionId, imgIndex, imageKey, imageUrl) => {
    setConfirmTarget({ sessionId, imgIndex, imageKey, imageUrl })
  }

  const executeDelete = async () => {
    if (!confirmTarget) return
    const { sessionId, imgIndex, imageKey } = confirmTarget
    setConfirmTarget(null)
    setDeleting(imageKey)
    try {
      await api.delete(`/api/sessions/${sessionId}/images/${imgIndex}`)
      const { data: updated } = await api.get(`/api/sessions/${sessionId}`)
      setDetails(prev => ({ ...prev, [sessionId]: updated }))
      if (!updated.generatedImages?.length) {
        setSessions(prev => prev.filter(s => s.id !== sessionId))
      }
    } catch (err) {
      setError('Delete failed: ' + (err.response?.data?.error || err.message))
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-16 flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-500">Loading your ad history…</p>
      </main>
    )
  }

  const allImages = sessions.flatMap(s => {
    const session = details[s.id]
    if (!session?.generatedImages?.length) return []
    return session.generatedImages.map((img, idx) => ({
      sessionId: s.id,
      session,
      img,
      imgIndex: idx,
      imageKey: `${s.id}_${idx}`,
      concept: getConceptForImage(session, img)
    }))
  }).sort((a, b) => {
    const ta = a.img.generatedAt ? new Date(a.img.generatedAt).getTime() : 0
    const tb = b.img.generatedAt ? new Date(b.img.generatedAt).getTime() : 0
    return tb - ta
  })

  const groups = []
  let currentLabel = null
  for (const item of allImages) {
    const label = dateLabel(item.img.generatedAt)
    if (label !== currentLabel) {
      groups.push({ type: 'date', label })
      currentLabel = label
    }
    groups.push({ type: 'image', ...item })
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ad Templates</h2>
          <p className="text-gray-500 mt-1">
            {allImages.length} image{allImages.length !== 1 ? 's' : ''} · newest first
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => loadAllSessions(true)}
            disabled={refreshing}
            className="btn-secondary py-2 px-4 text-sm"
          >
            {refreshing
              ? <><div className="spinner border-gray-400 border-t-gray-700" /> Refreshing…</>
              : '↺ Refresh'
            }
          </button>
          <button onClick={() => navigate('/')} className="btn-primary py-2 px-5 text-sm">
            + New Brief
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">⚠️ {error}</div>
      )}

      {allImages.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">🖼️</div>
          <p className="font-semibold text-gray-600">No generated images yet</p>
          <p className="text-sm text-gray-400 mt-2">Generate your first ad to see it here</p>
          <button onClick={() => navigate('/')} className="btn-primary mt-6 inline-flex">Start Creating</button>
        </div>
      ) : (
        <div>
          {(() => {
            const rows = []
            let gridItems = []

            const flushGrid = () => {
              if (gridItems.length > 0) {
                rows.push(
                  <div key={`grid-${rows.length}`} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {gridItems}
                  </div>
                )
                gridItems = []
              }
            }

            for (const item of groups) {
              if (item.type === 'date') {
                flushGrid()
                rows.push(
                  <div key={`date-${item.label}`} className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                )
              } else {
                const { sessionId, session, img, imgIndex, imageKey, concept } = item
                const displayImage = newImages[imageKey] || img.imageUrl
                const isRegenerating = regenerating === imageKey
                const isDeleting = deleting === imageKey
                const isEditing = editingKey === imageKey

                gridItems.push(
                  <div key={imageKey} className="card overflow-hidden">
                    {/* Image */}
                    <div className="relative">
                      {isRegenerating ? (
                        <div className="w-full aspect-square bg-gray-100 flex flex-col items-center justify-center">
                          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-3" />
                          <p className="text-sm text-gray-500">Regenerating…</p>
                        </div>
                      ) : (
                        <img
                          src={displayImage}
                          alt="Generated ad"
                          className="w-full aspect-square object-cover"
                          onError={e => {
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f3f4f6" width="100" height="100"/><text y="50" x="50" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="8">Image expired</text></svg>'
                          }}
                        />
                      )}
                      {concept && (
                        <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {concept.creative_angle}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        {timeAgo(img.generatedAt)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-5 space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                          {session.brief?.brandName}
                          {img.method && img.method !== 'placeholder' && (
                            <span className="ml-2 normal-case font-normal text-gray-300">
                              · {img.method === 'gemini-product' ? '✨ Imagen 4 (product)' :
                                 img.method === 'gemini-composite' ? '✨ Imagen 4 composite' :
                                 img.method === 'gemini' ? '✨ Imagen 4' : img.method}
                            </span>
                          )}
                        </p>
                        {concept && <p className="font-bold text-gray-900">"{concept.headline}"</p>}
                      </div>

                      {/* Prompt */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase">Image Prompt</p>
                          <button
                            onClick={() => {
                              if (isEditing) { setEditingKey(null) }
                              else {
                                setEditingKey(imageKey)
                                setEditPrompt(prev => ({ ...prev, [imageKey]: img.prompt }))
                              }
                            }}
                            className="text-xs text-brand-600 font-semibold hover:text-brand-700"
                          >
                            {isEditing ? 'Cancel' : 'Edit'}
                          </button>
                        </div>
                        {isEditing ? (
                          <textarea
                            className="input-field text-xs resize-none"
                            rows={5}
                            value={editPrompt[imageKey] || img.prompt}
                            onChange={e => setEditPrompt(prev => ({ ...prev, [imageKey]: e.target.value }))}
                          />
                        ) : (
                          <p className="text-xs text-gray-600 leading-relaxed line-clamp-4 italic">
                            {editPrompt[imageKey] || img.prompt}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRegenerate(sessionId, img, imageKey)}
                          disabled={isRegenerating || isDeleting}
                          className="btn-primary flex-1 text-sm py-2.5"
                        >
                          {isRegenerating
                            ? <><div className="spinner" /> Generating…</>
                            : '🔄 Regenerate'
                          }
                        </button>
                        <button
                          onClick={() => handleDownload(displayImage, session.brief?.brandName, concept?.creative_angle)}
                          disabled={isRegenerating || isDeleting}
                          className="btn-secondary text-sm py-2.5 px-4"
                          title="Download"
                        >
                          ⬇️
                        </button>
                        <button
                          onClick={() => confirmDelete(sessionId, imgIndex, imageKey, displayImage)}
                          disabled={isRegenerating || isDeleting}
                          className="text-sm py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-colors disabled:opacity-40"
                          title="Delete"
                        >
                          {isDeleting ? (
                            <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                          ) : '🗑️'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }
            }

            flushGrid()
            return rows
          })()}
        </div>
      )}

      {/* Custom delete confirm modal */}
      {confirmTarget && (
        <ConfirmModal
          imageUrl={confirmTarget.imageUrl}
          onConfirm={executeDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </main>
  )
}
