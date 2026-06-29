import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../api'

// ── Save to Brand modal ───────────────────────────────────
function SaveToBrandModal({ defaultBrandId, onSave, onClose }) {
  const [brands, setBrands]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [selectedId, setSelectedId] = useState(defaultBrandId || '')
  const [newName, setNewName]     = useState('')
  const [mode, setMode]           = useState(defaultBrandId ? 'existing' : 'existing') // 'existing' | 'new'
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    api.get('/api/brands').then(r => {
      setBrands(r.data)
      if (!defaultBrandId && r.data.length === 0) setMode('new')
    }).catch(() => setBrands([])).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      let brandId = selectedId
      if (mode === 'new') {
        if (!newName.trim()) { setError('Enter a brand name.'); setSaving(false); return }
        const { data } = await api.post('/api/brands', { name: newName.trim() })
        brandId = data.id
      }
      if (!brandId) { setError('Select a brand.'); setSaving(false); return }
      onSave(brandId)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed.')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Save to Brand</h3>

        {loading ? (
          <div className="flex justify-center py-6"><div className="w-6 h-6 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" /></div>
        ) : (
          <>
            {brands.length > 0 && (
              <div className="flex gap-2 mb-4">
                <button onClick={() => setMode('existing')} className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${mode === 'existing' ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}>
                  Existing brand
                </button>
                <button onClick={() => setMode('new')} className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${mode === 'new' ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}>
                  New brand
                </button>
              </div>
            )}

            {mode === 'existing' ? (
              <select className="input-field mb-3" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                <option value="">Select a brand…</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            ) : (
              <input autoFocus className="input-field mb-3" placeholder="Brand name" value={newName}
                onChange={e => setNewName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSave() }} />
            )}

            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <div className="flex gap-3">
              <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const STORAGE_KEY = 'fb_ads_image'

const ZONE_ICONS = {
  headline: '🔤', subheadline: '📝', body: '📄', cta: '👆', badge: '🏷️',
  price: '💰', testimonial_card: '⭐', checklist: '✅', arrow_callout: '➜',
  stat_box: '📊', pill_tag_row: '🔖', logo: '🔷', rating: '⭐',
}

const ZONE_COLORS = {
  headline: 'bg-green-50 border-green-200 text-green-700',
  subheadline: 'bg-blue-50 border-blue-200 text-blue-700',
  body: 'bg-gray-100 border-gray-200 text-gray-600',
  cta: 'bg-purple-50 border-purple-200 text-purple-700',
  badge: 'bg-orange-50 border-orange-200 text-orange-700',
  price: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  testimonial_card: 'bg-amber-50 border-amber-200 text-amber-700',
  checklist: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  arrow_callout: 'bg-slate-100 border-slate-200 text-slate-700',
  stat_box: 'bg-teal-50 border-teal-200 text-teal-700',
  pill_tag_row: 'bg-pink-50 border-pink-200 text-pink-700',
  logo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  rating: 'bg-yellow-50 border-yellow-200 text-yellow-700',
}

const ANGLE_COLORS = {
  'Social Proof': 'bg-green-100 text-green-700',
  'Urgency': 'bg-red-100 text-red-700',
  'Problem-Solution': 'bg-blue-100 text-blue-700',
  'FOMO': 'bg-orange-100 text-orange-700',
  'Transformation': 'bg-purple-100 text-purple-700',
  'Curiosity': 'bg-yellow-100 text-yellow-700',
  'How-To': 'bg-teal-100 text-teal-700',
  'Authority': 'bg-indigo-100 text-indigo-700',
}

function PromptCard({ label, icon, prompt, selected, onSelect, loading, error, editable, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftPrompt, setDraftPrompt] = useState(prompt || '')

  useEffect(() => {
    setDraftPrompt(prompt || '')
    setIsEditing(false)
  }, [prompt])

  if (loading) {
    return (
      <div className={`relative rounded-2xl border-2 p-5 flex flex-col items-center justify-center min-h-[220px] transition-all ${selected ? 'border-brand-500 shadow-md' : 'border-gray-200'}`}>
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-3" />
        <p className="text-sm text-gray-400">{label} is thinking…</p>
      </div>
    )
  }

  if (error || !prompt) {
    return (
      <div className="relative rounded-2xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center min-h-[220px]">
        <div className="text-3xl mb-2">⚠️</div>
        <p className="text-sm text-gray-500 text-center">{error || 'Prompt unavailable'}</p>
      </div>
    )
  }

  return (
    <div
      onClick={() => !isEditing && onSelect()}
      className={`relative rounded-2xl border-2 p-5 flex flex-col gap-3 cursor-pointer transition-all ${
        selected
          ? 'border-brand-500 bg-brand-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-brand-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-semibold text-sm text-gray-700">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {editable && !isEditing && (
            <button
              onClick={e => { e.stopPropagation(); setIsEditing(true) }}
              className="text-xs text-gray-400 hover:text-brand-600 font-medium"
            >Edit</button>
          )}
          {isEditing && (
            <>
              <button
                onClick={e => { e.stopPropagation(); onEdit(draftPrompt); setIsEditing(false); onSelect() }}
                className="text-xs text-brand-600 font-semibold hover:text-brand-700"
              >✓ Save</button>
              <button
                onClick={e => { e.stopPropagation(); setDraftPrompt(prompt); setIsEditing(false) }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >Cancel</button>
            </>
          )}
          {selected && !isEditing && (
            <span className="bg-brand-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">✓ Selected</span>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="input-field text-sm resize-none"
          rows={7}
          value={draftPrompt}
          onChange={e => setDraftPrompt(e.target.value)}
          onClick={e => e.stopPropagation()}
          autoFocus
        />
      ) : (
        <p className="text-sm text-gray-600 leading-relaxed italic">{prompt}</p>
      )}

      {!selected && !isEditing && (
        <p className="text-xs text-gray-400 text-right">Click to select →</p>
      )}
    </div>
  )
}

export default function ImageGenerator() {
  const navigate = useNavigate()
  const { state } = useLocation()

  // Restore from sessionStorage if navigating back (state lost)
  let pageData = state
  if (!pageData?.concept) {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) pageData = JSON.parse(saved)
    } catch (_) {}
  }

  // Persist current page data to sessionStorage
  useEffect(() => {
    if (pageData?.concept) {
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pageData)) } catch (_) {}
    }
  }, [])

  if (!pageData?.concept) {
    navigate('/')
    return null
  }

  const { concept, allConcepts, copyOptions, sessionId, brief, productImageUrl, hasProductImage, template, brandId, brandName } = pageData

  const [promptsLoading, setPromptsLoading] = useState(true)
  const [claudePrompt, setClaudePrompt] = useState(null)
  const [gptPrompt, setGptPrompt] = useState(null)
  const [gptLabel, setGptLabel] = useState({ icon: '⚡', label: "GPT's Prompt" })
  const [claudeError, setClaudeError] = useState(null)
  const [gptError, setGptError] = useState(null)
  const [selectedSource, setSelectedSource] = useState(null)
  const [activePrompt, setActivePrompt] = useState(null)

  const [imageLoading, setImageLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageFilename, setImageFilename] = useState(null)
  const [imageMethod, setImageMethod] = useState('')
  const [error, setError] = useState('')

  // Save to Brand state
  const [showBrandModal, setShowBrandModal] = useState(false)
  const [brandSaved, setBrandSaved] = useState(false)
  const [savedBrandName, setSavedBrandName] = useState(brandName || null)

  useEffect(() => { generatePrompts() }, [])

  const generatePrompts = async () => {
    setPromptsLoading(true)
    setClaudePrompt(null); setGptPrompt(null)
    setClaudeError(null); setGptError(null)
    setSelectedSource(null); setActivePrompt(null)
    setImageUrl(null); setImageFilename(null)
    setError(''); setBrandSaved(false)
    setGptLabel({ icon: '⚡', label: "GPT's Prompt" })

    try {
      const { data } = await api.post('/api/generate-prompts', {
        concept, brief, hasProductImage: !!hasProductImage,
        templateStyle: template?.imageInstruction || null,
        templateAnalysis: template?.templateAnalysis || null
      })
      setClaudePrompt(data.claude || null)
      setGptPrompt(data.gpt || null)
      if (data.claudeError) setClaudeError(data.claudeError)
      // If GPT failed, slot 2 is Claude cinematic fallback — update the label
      if (data.gptError || (data.gpt && !data.gptError)) {
        setGptLabel({ icon: '🎬', label: 'Claude (Cinematic)' })
      }

      if (data.claude) { setSelectedSource('claude'); setActivePrompt(data.claude) }
      else if (data.gpt) { setSelectedSource('gpt'); setActivePrompt(data.gpt) }
    } catch (err) {
      setClaudeError('Failed to generate')
      setGptError(err.response?.data?.error || err.message)
    } finally {
      setPromptsLoading(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!activePrompt) return
    setImageLoading(true)
    setError('')
    setImageUrl(null); setImageFilename(null)
    setBrandSaved(false)
    try {
      const { data } = await api.post('/api/generate-image', {
        visualDescription: activePrompt,
        brandName: brief.brandName,
        tone: Array.isArray(brief.toneOfVoice) ? brief.toneOfVoice.join(', ') : brief.toneOfVoice,
        creativeAngle: concept.creative_angle,
        sessionId,
        conceptId: concept.id,
        hasProductImage: !!hasProductImage,
        concept,
        copyOptions: copyOptions || null,
        templateAnalysis: template?.templateAnalysis || null
      })
      setImageUrl(data.imageUrl)
      setImageFilename(data.filename)
      setImageMethod(data.method || '')
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Image generation failed.')
    } finally {
      setImageLoading(false)
    }
  }

  const handleSaveToBrand = async (targetBrandId) => {
    setShowBrandModal(false)
    try {
      const brandRes = await api.get(`/api/brands/${targetBrandId}`)
      const bName = brandRes.data.name
      await api.post(`/api/brands/${targetBrandId}/sessions`, {
        brief,
        template: template || null,
        concept,
        imageUrl,
        prompts: { claude: claudePrompt, gpt: gptPrompt, used: activePrompt }
      })
      setBrandSaved(true)
      setSavedBrandName(bName)
    } catch (err) {
      setError('Save failed: ' + (err.response?.data?.error || err.message))
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(brief.brandName || 'ad').replace(/\s+/g, '_')}_${(concept.creative_angle || 'ad').replace(/\s+/g, '_')}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      window.open(imageUrl, '_blank')
    }
  }

  const goBackToCopies = () => {
    navigate('/copies', {
      state: {
        concepts: allConcepts || [concept],
        brief,
        sessionId,
        productImageUrl,
        hasProductImage,
        template
      }
    })
  }

  const angleColor = ANGLE_COLORS[concept.creative_angle] || 'bg-gray-100 text-gray-600'

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Image Generator</h2>
          <p className="text-gray-500 mt-1">Claude and GPT each wrote a prompt — pick the one you prefer, then generate</p>
        </div>
        <button onClick={goBackToCopies} className="btn-secondary text-sm py-2 px-4">
          ← Back to Concepts
        </button>
      </div>

      {/* Selected concept recap */}
      <div className="card p-5 mb-7 flex items-start gap-5">
        {productImageUrl && (
          <img src={productImageUrl} alt="Product" className="w-20 h-20 object-contain rounded-xl border border-gray-100 bg-gray-50 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${angleColor}`}>{concept.creative_angle}</span>
            <span className="text-xs text-gray-400">{brief.brandName}</span>
            {template && (
              <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-semibold">🎨 {template.name}</span>
            )}
          </div>
          {/* Template zone pills */}
          {template?.templateAnalysis?.textZones?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {template.templateAnalysis.textZones.map((z, i) => {
                const icon = ZONE_ICONS[z.type] || '📌'
                const cls  = ZONE_COLORS[z.type] || 'bg-gray-100 border-gray-200 text-gray-600'
                return (
                  <span key={i} title={z.purpose || z.position} className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
                    {icon} {z.type.replace(/_/g, ' ')}
                  </span>
                )
              })}
            </div>
          )}
          <h3 className="font-bold text-gray-900 text-lg truncate">"{concept.headline}"</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{concept.primary_text}</p>
        </div>
        <button
          onClick={generatePrompts}
          disabled={promptsLoading}
          className="btn-secondary text-sm py-2 px-3 shrink-0"
        >
          {promptsLoading ? <div className="spinner border-gray-400 border-t-gray-700" /> : '↺ New prompts'}
        </button>
      </div>

      {/* Prompt selection */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Choose a prompt</h3>
          {!promptsLoading && (claudePrompt || gptPrompt) && (
            <p className="text-xs text-gray-400">Both prompts were written specifically for this concept</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PromptCard
            label="Claude's Prompt" icon="🤖"
            prompt={claudePrompt} selected={selectedSource === 'claude'}
            onSelect={() => { setSelectedSource('claude'); setActivePrompt(claudePrompt); setImageUrl(null); setBrandSaved(false) }}
            loading={promptsLoading} error={claudeError} editable={!!claudePrompt}
            onEdit={p => { setClaudePrompt(p); setActivePrompt(p) }}
          />
          <PromptCard
            label={gptLabel.label} icon={gptLabel.icon}
            prompt={gptPrompt} selected={selectedSource === 'gpt'}
            onSelect={() => { setSelectedSource('gpt'); setActivePrompt(gptPrompt); setImageUrl(null); setBrandSaved(false) }}
            loading={promptsLoading} error={gptError} editable={!!gptPrompt}
            onEdit={p => { setGptPrompt(p); setActivePrompt(p) }}
          />
        </div>
      </div>

      {/* Generate / Result */}
      {!imageUrl ? (
        <div className="space-y-4">
          <button
            onClick={handleGenerateImage}
            disabled={imageLoading || promptsLoading || !activePrompt}
            className="btn-primary w-full py-4 text-base disabled:opacity-50"
          >
            {imageLoading ? (
              <><div className="spinner" /> Generating image… (~15s)</>
            ) : (
              `🎨 Generate with ${selectedSource === 'gpt' ? gptLabel.label : selectedSource === 'claude' ? "Claude's Prompt" : '...'}`
            )}
          </button>

          {!activePrompt && !promptsLoading && (
            <p className="text-center text-sm text-gray-400">Select a prompt above to enable generation</p>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button onClick={handleGenerateImage} className="underline font-semibold ml-3">Retry</button>
            </div>
          )}
        </div>
      ) : (
        <div className="fade-in space-y-5">
          {/* Method badge */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              Generated with {selectedSource === 'gpt' ? gptLabel.label : "Claude's Prompt"}
            </h3>
            {imageMethod && (
              <span className={`text-xs px-3 py-1 rounded-full ${imageMethod === 'placeholder' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'}`}>
                {imageMethod === 'gemini-product' ? '✨ Imagen 4 · your exact product' :
                 imageMethod === 'gemini' ? '✨ Imagen 4' :
                 imageMethod === 'placeholder' ? 'Preview placeholder' : imageMethod}
              </span>
            )}
          </div>

          {/* Image */}
          <div className="card overflow-hidden">
            <img src={imageUrl} alt="Generated ad" className="w-full object-cover" />
          </div>

          {/* Primary actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleDownload} className="btn-primary py-3">
              ⬇️ Download PNG
            </button>
            <button
              onClick={() => { setImageUrl(null); setImageFilename(null); setImageMethod(''); setError(''); setBrandSaved(false) }}
              className="btn-secondary py-3"
            >
              🔄 Regenerate
            </button>
          </div>

          {/* Save to Brand */}
          {brandSaved ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl py-3 px-4">
              <span className="text-lg">✓</span>
              <span className="font-semibold text-sm">Saved to <strong>{savedBrandName}</strong>!</span>
              <button onClick={() => navigate('/brands')} className="ml-auto text-xs text-green-600 underline font-semibold whitespace-nowrap">
                View Brands →
              </button>
            </div>
          ) : brandId ? (
            <button
              onClick={() => handleSaveToBrand(brandId)}
              className="w-full py-3 rounded-xl border-2 border-brand-600 text-brand-700 font-semibold text-sm hover:bg-brand-50 transition-colors flex items-center justify-center gap-2"
            >
              <span>📁</span> Save to {brandName || 'Brand'}
            </button>
          ) : (
            <button
              onClick={() => setShowBrandModal(true)}
              className="w-full py-3 rounded-xl border-2 border-brand-600 text-brand-700 font-semibold text-sm hover:bg-brand-50 transition-colors flex items-center justify-center gap-2"
            >
              <span>📁</span> Save to Brand
            </button>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">⚠️ {error}</div>
          )}

          {/* Secondary actions */}
          <div className="grid grid-cols-3 gap-3">
            <button onClick={generatePrompts} className="btn-secondary text-sm py-2.5">
              ✨ New prompts
            </button>
            <button onClick={goBackToCopies} className="btn-secondary text-sm py-2.5">
              ← Other concepts
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary text-sm py-2.5">
              ✦ New brief
            </button>
          </div>

          {/* Prompt used */}
          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Prompt used</p>
            <p className="text-xs text-gray-500 leading-relaxed italic">{activePrompt}</p>
          </div>
        </div>
      )}
      {showBrandModal && (
        <SaveToBrandModal
          defaultBrandId={brandId || null}
          onSave={handleSaveToBrand}
          onClose={() => setShowBrandModal(false)}
        />
      )}
    </main>
  )
}
