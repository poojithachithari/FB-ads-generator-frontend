import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../api'

const STORAGE_KEY = 'fb_ads_brief'

const TONES  = ['Urgent', 'Playful', 'Trust-building', 'Bold', 'Soft']
const GOALS  = ['Awareness', 'Traffic', 'Conversions', 'Retargeting']

function MultiCheckbox({ label, options, selected, onChange }) {
  const toggle = (opt) => {
    onChange(selected.includes(opt) ? selected.filter(o => o !== opt) : [...selected, opt])
  }
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
              selected.includes(opt)
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400 hover:text-brand-600'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function BriefForm() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const fileRef = useRef()

  // Pre-fill from brand if navigated from Brands page
  const prefill = state?.prefill || null
  const brandId   = state?.brandId   || null
  const brandName = state?.brandName || null

  const [form, setForm] = useState(() => {
    // If we have a prefill (from brand), use it — otherwise restore from sessionStorage
    if (prefill && Object.keys(prefill).length > 0) {
      return {
        brandName: '',
        productOffer: '',
        targetAudience: '',
        adGoal: 'Conversions',
        toneOfVoice: [],
        numConcepts: '3',
        additionalNotes: '',
        ...prefill
      }
    }
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch (_) {}
    return {
      brandName: '',
      productOffer: '',
      targetAudience: '',
      adGoal: 'Conversions',
      toneOfVoice: [],
      numConcepts: '3',
      additionalNotes: ''
    }
  })

  // Multiple product images — can't restore File objects from sessionStorage, so always start empty
  const [productImages, setProductImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Persist form to sessionStorage on every change
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form)) } catch (_) {}
  }, [form])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const newImgs = files.map(file => ({ file, preview: URL.createObjectURL(file) }))
    setProductImages(prev => [...prev, ...newImgs])
    // reset input so same file can be re-added after removal
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeImage = (idx) => {
    setProductImages(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.brandName.trim())      return setError('Brand name is required.')
    if (!form.productOffer.trim())   return setError('Product/Offer is required.')
    if (!form.targetAudience.trim()) return setError('Target audience is required.')
    if (form.toneOfVoice.length === 0) return setError('Select at least one tone of voice.')

    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) v.forEach(item => formData.append(k, item))
        else formData.append(k, v)
      })
      productImages.forEach(({ file }) => formData.append('productImages', file))

      // Just upload images + save session — concept generation happens after template selection
      const { data } = await api.post('/api/save-brief', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      navigate('/style', {
        state: {
          sessionId: data.sessionId,
          brief: form,
          productImageUrl: data.productImageUrl,
          hasProductImage: data.hasProductImage,
          brandId,
          brandName: brandName || form.brandName
        }
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save brief. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Creative Brief</h2>
        <p className="text-gray-500 mt-1">Fill in your brand details and we'll generate ad concepts with Claude AI.</p>
        {brandName && (
          <div className="mt-3 flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-xl px-4 py-2.5 text-sm text-brand-700">
            <span>📁</span>
            <span>Creating new ad for <strong>{brandName}</strong> — brief pre-filled from your last session</span>
            <button
              type="button"
              onClick={() => navigate('/brands')}
              className="ml-auto text-xs text-brand-500 underline font-semibold whitespace-nowrap"
            >← Back to brands</button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Brand & Product */}
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider text-brand-600">Brand & Product</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Name *</label>
              <input
                className="input-field"
                placeholder="e.g. VitaRoot"
                value={form.brandName}
                onChange={e => set('brandName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ad Goal *</label>
              <select className="input-field" value={form.adGoal} onChange={e => set('adGoal', e.target.value)}>
                {GOALS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product / Offer *</label>
            <input
              className="input-field"
              placeholder="e.g. GABA 600mg — natural sleep & stress support supplement"
              value={form.productOffer}
              onChange={e => set('productOffer', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience *</label>
            <input
              className="input-field"
              placeholder="e.g. Adults 30–55 struggling with sleep and work stress"
              value={form.targetAudience}
              onChange={e => set('targetAudience', e.target.value)}
            />
          </div>
        </div>

        {/* Creative Direction */}
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-brand-600">Creative Direction</h3>

          <MultiCheckbox
            label="Tone of Voice *"
            options={TONES}
            selected={form.toneOfVoice}
            onChange={v => set('toneOfVoice', v)}
          />

          {/* Number of Concepts */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Concepts</label>
            <div className="flex gap-3">
              {['3', '5'].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set('numConcepts', n)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    form.numConcepts === n
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400'
                  }`}
                >
                  {n} concepts
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Images — multiple */}
        <div className="card p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-brand-600">Product Images</h3>
            <p className="text-xs text-gray-400 mt-1">Upload one or more product photos — they'll be used as the base for ad image generation.</p>
          </div>

          {/* Existing thumbnails */}
          {productImages.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {productImages.map((img, idx) => (
                <div key={idx} className="relative group w-24 h-24">
                  <img
                    src={img.preview}
                    alt={`Product ${idx + 1}`}
                    className="w-full h-full object-contain rounded-xl border border-gray-200 bg-gray-50"
                  />
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow"
                  >
                    ✕
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 text-xs bg-brand-600 text-white px-1.5 py-0.5 rounded-md font-semibold leading-none">
                      Main
                    </span>
                  )}
                </div>
              ))}

              {/* Add more tile */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-brand-400 hover:bg-brand-50 transition-all text-gray-400 hover:text-brand-500"
              >
                <span className="text-xl">+</span>
                <span className="text-xs font-medium">Add more</span>
              </button>
            </div>
          )}

          {/* Empty drop zone */}
          {productImages.length === 0 && (
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-all"
            >
              <div className="text-3xl mb-2">📸</div>
              <p className="text-sm font-medium text-gray-600">Click to upload product image(s)</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · up to 15MB each · multiple allowed</p>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageChange}
            multiple
            className="hidden"
          />
        </div>

        {/* Additional Notes */}
        <div className="card p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            className="input-field resize-none"
            rows={3}
            placeholder="e.g. Don't use green backgrounds. Avoid showing pills. Focus on calm, nature-inspired visuals."
            value={form.additionalNotes}
            onChange={e => set('additionalNotes', e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base">
          {loading ? (
            <><div className="spinner" />Generating concepts… next up: choose a template</>
          ) : (
            <>✨ Generate Concepts →</>
          )}
        </button>
      </form>
    </main>
  )
}
