import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../api'

const STORAGE_KEY = 'fb_ads_copies'

const ANGLE_COLORS = {
  'Social Proof':     'bg-blue-100 text-blue-700',
  'Urgency':          'bg-red-100 text-red-700',
  'Problem-Solution': 'bg-orange-100 text-orange-700',
  'FOMO':             'bg-purple-100 text-purple-700',
  'Transformation':   'bg-teal-100 text-teal-700',
  'Curiosity':        'bg-yellow-100 text-yellow-700',
  'How-To':           'bg-indigo-100 text-indigo-700',
  'Authority':        'bg-gray-100 text-gray-700',
}

// Single selectable option pill
function OptionPill({ text, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm leading-relaxed transition-all duration-150
        ${selected
          ? 'border-brand-500 bg-brand-50 text-brand-900 font-semibold shadow-sm'
          : 'border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-gray-50'
        }`}
    >
      <div className="flex items-start gap-2">
        <span className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center
          ${selected ? 'border-brand-500 bg-brand-500' : 'border-gray-300'}`}>
          {selected && <span className="block w-1.5 h-1.5 rounded-full bg-white" />}
        </span>
        <span>{text}</span>
      </div>
    </button>
  )
}

// Column of 3 options
function OptionColumn({ title, icon, options, selectedIdx, onSelect }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{title}</h3>
      </div>
      <div className="flex flex-col gap-2">
        {(options || []).map((opt, i) => (
          <OptionPill
            key={i}
            text={opt}
            selected={selectedIdx === i}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  )
}

// ── Zone type display config ──────────────────────────────
const ZONE_CONFIG = {
  headline:         { icon: '🔤', label: 'Headline',        bg: 'bg-green-50',   border: 'border-green-200',   text: 'text-green-800'   },
  subheadline:      { icon: '📝', label: 'Subheadline',     bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-800'    },
  body:             { icon: '📄', label: 'Body text',        bg: 'bg-gray-50',    border: 'border-gray-200',    text: 'text-gray-700'    },
  cta:              { icon: '👆', label: 'CTA Button',       bg: 'bg-purple-50',  border: 'border-purple-200',  text: 'text-purple-800'  },
  badge:            { icon: '🏷️', label: 'Badge',           bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-800'  },
  price:            { icon: '💰', label: 'Price',            bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-800'  },
  testimonial_card: { icon: '⭐', label: 'Testimonial card', bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-800'   },
  checklist:        { icon: '✅', label: 'Checklist',        bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
  arrow_callout:    { icon: '➜',  label: 'Arrow callouts',   bg: 'bg-slate-50',   border: 'border-slate-200',   text: 'text-slate-700'   },
  stat_box:         { icon: '📊', label: 'Stat box',         bg: 'bg-teal-50',    border: 'border-teal-200',    text: 'text-teal-800'    },
  pill_tag_row:     { icon: '🔖', label: 'Tag row',          bg: 'bg-pink-50',    border: 'border-pink-200',    text: 'text-pink-800'    },
  logo:             { icon: '🔷', label: 'Logo',             bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-800'  },
  rating:           { icon: '⭐', label: 'Rating',           bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-800'  },
}

function ZoneCard({ zone }) {
  const c = ZONE_CONFIG[zone.type] || { icon: '📌', label: zone.type, bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' }

  let extraDetail = ''
  if (zone.elementDetails) {
    if (zone.type === 'checklist')     extraDetail = (zone.elementDetails.itemCount    || '?') + ' items'
    if (zone.type === 'arrow_callout') extraDetail = (zone.elementDetails.calloutCount || '?') + ' callouts'
    if (zone.type === 'stat_box')      extraDetail = (zone.elementDetails.calloutCount || '?') + ' boxes'
    if (zone.type === 'testimonial_card') {
      const parts = []
      if (zone.elementDetails.hasStars) parts.push('★ stars')
      if (zone.elementDetails.hasQuote) parts.push('quote')
      if (zone.elementDetails.hasCta)   parts.push('CTA')
      extraDetail = parts.join(' · ')
    }
  }

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-3 flex flex-col gap-1.5`}>
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm leading-none">{c.icon}</span>
          <span className={`text-xs font-bold uppercase tracking-wider ${c.text}`}>{c.label}</span>
        </div>
        {extraDetail && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.border} ${c.text}`}>{extraDetail}</span>
        )}
      </div>
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{zone.position}</p>
      {zone.approximateContent && (
        <p className="text-xs text-gray-600 italic leading-snug line-clamp-2">"{zone.approximateContent}"</p>
      )}
      {zone.typographyStyle && (
        <p className="text-[10px] text-gray-400 leading-snug truncate">{zone.typographyStyle}</p>
      )}
    </div>
  )
}

function TemplateAnalysisPanel({ template, templateAnalysis, analyzing }) {
  const [expanded, setExpanded] = useState(false)
  if (!template) return null

  // Loading state — analysis in progress
  if (analyzing) {
    return (
      <div className="card mb-6 overflow-hidden border border-brand-100">
        <div className="flex items-center gap-3 p-4">
          <img src={template.imageUrl} alt={template.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Template analysis</span>
              <span className="text-xs text-gray-400">Analyzing template elements…</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{template.name}</p>
          </div>
          <div className="w-4 h-4 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin shrink-0" />
        </div>
      </div>
    )
  }

  if (!templateAnalysis) return null
  const analysis = templateAnalysis
  const zones = analysis.textZones || []

  return (
    <div className="card mb-6 overflow-hidden border border-brand-100">
      {/* Header row */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50/60 transition-colors text-left"
      >
        <img src={template.imageUrl} alt={template.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Template analysis</span>
            <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-semibold">
              {analysis.templateType}
            </span>
            {analysis.recommendedAngle && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                {analysis.recommendedAngle}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {zones.length} element{zones.length !== 1 ? 's' : ''} detected · click to {expanded ? 'collapse' : 'view all'}
          </p>
        </div>
        {/* Compact zone pills */}
        <div className="hidden sm:flex items-center gap-1 flex-wrap justify-end max-w-[40%]">
          {zones.slice(0, 5).map((z, i) => {
            const c = ZONE_CONFIG[z.type] || { icon: '📌', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' }
            return (
              <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.bg} ${c.border} ${c.text}`}>
                {c.icon} {z.type.replace(/_/g, ' ')}
              </span>
            )
          })}
          {zones.length > 5 && (
            <span className="text-[10px] text-gray-400 font-medium">+{zones.length - 5}</span>
          )}
        </div>
        <span className="text-gray-400 text-sm ml-2">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-brand-100 px-4 pb-4 pt-3 bg-gray-50/40">
          {/* Zone grid */}
          {zones.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Detected elements</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                {zones.map((zone, i) => <ZoneCard key={i} zone={zone} />)}
              </div>
            </div>
          )}
          {/* Visual style */}
          {analysis.visualStyle && (
            <div className="mt-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visual style</p>
              <p className="text-xs text-gray-600 leading-relaxed">{analysis.visualStyle}</p>
            </div>
          )}
          {/* Prompt instruction preview */}
          {analysis.promptInstruction && (
            <div className="mt-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Scene instruction (sent to AI)</p>
              <p className="text-xs text-gray-500 italic leading-relaxed line-clamp-3">{analysis.promptInstruction}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdCopies() {
  const navigate = useNavigate()
  const { state } = useLocation()

  // Restore from sessionStorage on back navigation
  let pageData = state
  if (!pageData?.brief) {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) pageData = JSON.parse(saved)
    } catch (_) {}
  }

  const { brief, sessionId, productImageUrl, hasProductImage, template, brandId, brandName } = pageData || {}

  const [copyOptions, setCopyOptions] = useState(pageData?.copyOptions || null)
  const [generating, setGenerating]   = useState(false)
  const [genError, setGenError]       = useState('')

  // Selection indices (default: first option in each zone)
  const [selH, setSelH] = useState(0) // headline index
  const [selS, setSelS] = useState(0) // subheadline index
  const [selC, setSelC] = useState(0) // cta index

  // Template analysis state — live, re-fetched if missing from navigation state
  const [templateAnalysis, setTemplateAnalysis] = useState(template?.templateAnalysis || null)
  const [analyzingTemplate, setAnalyzingTemplate] = useState(false)

  // Auto-fetch analysis if template exists but analysis is missing
  useEffect(() => {
    if (template && !template.templateAnalysis && !templateAnalysis) {
      setAnalyzingTemplate(true)
      api.post('/api/analyze-template', {
        imageUrl: template.imageUrl,
        templateName: template.name
      }).then(({ data }) => {
        setTemplateAnalysis(data)
      }).catch(err => {
        console.warn('[AdCopies] Template re-analysis failed:', err.message)
      }).finally(() => setAnalyzingTemplate(false))
    }
  }, [])

  // Persist to sessionStorage (include live templateAnalysis)
  useEffect(() => {
    if (pageData?.brief && copyOptions) {
      try {
        const saveData = { ...pageData, copyOptions }
        if (templateAnalysis && saveData.template) {
          saveData.template = { ...saveData.template, templateAnalysis }
        }
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saveData))
      } catch (_) {}
    }
  }, [copyOptions, templateAnalysis])

  const generateOptions = async () => {
    setGenerating(true)
    setGenError('')
    try {
      const { data } = await api.post('/api/generate-copy', {
        brief,
        sessionId,
        templateAnalysis: templateAnalysis || null,
        hasProductImage: !!hasProductImage
      })
      setCopyOptions(data)
      setSelH(0); setSelS(0); setSelC(0)
    } catch (err) {
      setGenError(err.response?.data?.error || 'Failed to generate copy. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  // Generate options on mount if not already done
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (pageData?.brief && !copyOptions) generateOptions()
  }, [])

  if (!pageData?.brief) {
    navigate('/')
    return null
  }

  const handleGenerateImage = () => {
    if (!copyOptions) return

    // Build a concept object from the mix-and-match selections
    const concept = {
      id: `mix_${Date.now()}`,
      creative_angle:   copyOptions.creative_angle   || 'Authority',
      headline:         (copyOptions.headlines    || [])[selH] || '',
      primary_text:     (copyOptions.subheadlines || [])[selS] || '',
      cta:              (copyOptions.ctas         || [])[selC] || 'Shop Now',
      visual_description: copyOptions.visual_description || '',
    }

    navigate('/image', {
      state: {
        concept,
        copyOptions, // keep the options so the user can go back and change
        sessionId,
        brief,
        productImageUrl,
        hasProductImage,
        template: templateAnalysis ? { ...template, templateAnalysis } : template,
        brandId: brandId || null,
        brandName: brandName || null,
      }
    })
  }

  // ── Loading / generating state ────────────────────────────
  if (generating || !copyOptions) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center justify-center gap-5">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        <div className="text-center">
          <p className="font-semibold text-gray-800 text-lg">
            {templateAnalysis
              ? 'Writing copy options for your template…'
              : 'Writing ad copy options…'}
          </p>
          {templateAnalysis && (
            <p className="text-sm text-gray-500 mt-1">
              Claude is crafting headlines, body text, and CTAs for the <strong>{template.name}</strong> layout
            </p>
          )}
        </div>
        {template && (
          <div className="flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-2xl px-5 py-3 mt-2">
            <img src={template.imageUrl} alt={template.name} className="w-14 h-14 object-cover rounded-xl" />
            <div>
              <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider">Selected template</p>
              <p className="font-bold text-gray-900">{template.name}</p>
              {templateAnalysis?.templateType && (
                <p className="text-xs text-gray-500">{templateAnalysis.templateType}</p>
              )}
            </div>
          </div>
        )}
        {genError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm flex items-center gap-3">
            <span>⚠️ {genError}</span>
            <button onClick={generateOptions} className="underline font-semibold">Retry</button>
          </div>
        )}
      </main>
    )
  }

  const selectedHeadline    = (copyOptions.headlines    || [])[selH] || '—'
  const selectedSubheadline = (copyOptions.subheadlines || [])[selS] || '—'
  const selectedCta         = (copyOptions.ctas         || [])[selC] || 'Shop Now'
  const angleColor = ANGLE_COLORS[copyOptions.creative_angle] || 'bg-gray-100 text-gray-700'

  // ── Main UI ───────────────────────────────────────────────
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Build Your Ad Copy</h2>
          <p className="text-gray-500 mt-1">
            Pick one from each column — mix and match to find the best combination for <strong>{brief.brandName}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateOptions}
            disabled={generating}
            className="btn-secondary text-sm py-2 px-4"
          >
            ↺ Regenerate options
          </button>
          <button onClick={() => navigate('/style', { state: pageData })} className="btn-secondary text-sm py-2 px-4">
            ← Change Template
          </button>
        </div>
      </div>

      {/* Brief + angle chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: 'Goal',     value: brief.adGoal },
          { label: 'Audience', value: brief.targetAudience },
          { label: 'Tone',     value: Array.isArray(brief.toneOfVoice) ? brief.toneOfVoice.join(', ') : brief.toneOfVoice },
          ...(template ? [{ label: '🎨 Template', value: template.name }] : []),
          ...(hasProductImage ? [{ label: '📸', value: 'Product image' }] : [])
        ].map(({ label, value }) => (
          <span key={label} className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full">
            <span className="font-semibold">{label}:</span> {value}
          </span>
        ))}
        {copyOptions.creative_angle && (
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${angleColor}`}>
            ✦ {copyOptions.creative_angle} angle
          </span>
        )}
      </div>

      {/* Template analysis panel — full element breakdown */}
      <TemplateAnalysisPanel template={template} templateAnalysis={templateAnalysis} analyzing={analyzingTemplate} />

      {/* 3-column mix and match grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <OptionColumn
          title="Headline"
          icon="✍️"
          options={copyOptions.headlines}
          selectedIdx={selH}
          onSelect={setSelH}
        />
        <OptionColumn
          title="Body Text"
          icon="📝"
          options={copyOptions.subheadlines}
          selectedIdx={selS}
          onSelect={setSelS}
        />
        <OptionColumn
          title="CTA Button"
          icon="👆"
          options={copyOptions.ctas}
          selectedIdx={selC}
          onSelect={setSelC}
        />
      </div>

      {/* Selected combination + template elements — unified "what's going on this image" card */}
      <div className="card mb-6 border-2 border-brand-100 overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 bg-brand-50/30">
          <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-3">Your selected combination</p>
          <div className="space-y-2.5">
            <div className="flex gap-2">
              <span className="text-xs font-semibold text-gray-400 w-20 shrink-0 pt-0.5">HEADLINE</span>
              <p className="font-bold text-gray-900 leading-tight">"{selectedHeadline}"</p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs font-semibold text-gray-400 w-20 shrink-0 pt-0.5">BODY</span>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedSubheadline}</p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-xs font-semibold text-gray-400 w-20 shrink-0">CTA</span>
              <span className="inline-flex items-center bg-brand-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                {selectedCta}
              </span>
            </div>
          </div>
        </div>

        {/* Zone-by-zone content map — what goes where on the image */}
        {templateAnalysis?.textZones?.length > 0 && (
          <div className="border-t border-brand-100">
            <div className="px-5 py-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                What goes on this image
              </p>
              <div className="space-y-2">
                {templateAnalysis.textZones.map((zone, i) => {
                  const c = ZONE_CONFIG[zone.type] || { icon: '📌', label: zone.type, bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' }

                  // Resolve the actual content for this zone
                  let content = null
                  if (zone.type === 'headline')          content = { type: 'text',        value: selectedHeadline }
                  else if (zone.type === 'subheadline')  content = { type: 'text',        value: selectedSubheadline }
                  else if (zone.type === 'body')         content = { type: 'text',        value: selectedSubheadline }
                  else if (zone.type === 'cta')          content = { type: 'cta',         value: selectedCta }
                  else if (zone.type === 'rating' && copyOptions?.rating_text)
                                                         content = { type: 'rating',      value: copyOptions.rating_text }
                  else if (zone.type === 'testimonial_card' && copyOptions?.testimonial)
                                                         content = { type: 'testimonial', value: copyOptions.testimonial }
                  else if (zone.type === 'checklist' && copyOptions?.checklist_items?.length)
                                                         content = { type: 'checklist',   value: copyOptions.checklist_items }
                  else if ((zone.type === 'arrow_callout' || zone.type === 'stat_box') && copyOptions?.callout_labels?.length)
                                                         content = { type: 'callouts',    value: copyOptions.callout_labels }

                  return (
                    <div key={i} className={`rounded-xl border ${c.border} overflow-hidden`}>
                      {/* Zone label row */}
                      <div className={`flex items-center gap-2 px-3 py-2 ${c.bg}`}>
                        <span className="text-sm leading-none">{c.icon}</span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${c.text}`}>{c.label}</span>
                        <span className="text-[10px] text-gray-400 ml-1">{zone.position}</span>
                      </div>

                      {/* Content */}
                      <div className="px-3 py-2.5 bg-white">
                        {!content ? (
                          <p className="text-xs text-gray-300 italic">No content generated for this zone</p>
                        ) : content.type === 'text' ? (
                          <p className="text-sm font-semibold text-gray-800 leading-snug">"{content.value}"</p>
                        ) : content.type === 'cta' ? (
                          <span className="inline-flex items-center bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            {content.value}
                          </span>
                        ) : content.type === 'rating' ? (
                          <p className="text-base font-bold text-yellow-500 tracking-widest">{content.value}</p>
                        ) : content.type === 'testimonial' ? (
                          <div className="text-center py-1">
                            <p className="text-amber-400 text-sm tracking-widest mb-1">{'★'.repeat(content.value.stars || 5)}</p>
                            <p className="text-xs font-semibold text-gray-800 italic mb-1">"{content.value.quote}"</p>
                            <p className="text-[10px] text-gray-400">{content.value.attribution}</p>
                          </div>
                        ) : content.type === 'checklist' ? (
                          <div className="grid grid-cols-2 gap-1">
                            {content.value.map((item, j) => (
                              <div key={j} className="flex items-center gap-1.5">
                                <span className="text-emerald-500 font-bold text-xs shrink-0">✓</span>
                                <span className="text-xs text-gray-700 font-medium">{item}</span>
                              </div>
                            ))}
                          </div>
                        ) : content.type === 'callouts' ? (
                          <div className="flex flex-wrap gap-1.5">
                            {content.value.map((label, j) => (
                              <span key={j} className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                                j % 2 === 0
                                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                                  : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}>
                                {j % 2 === 0 ? <span className="text-slate-300 text-[10px]">L</span> : <span className="text-slate-300 text-[10px]">R</span>}
                                {label}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerateImage}
        className="btn-primary w-full py-4 text-base"
      >
        🎨 Generate Image with This Combination →
      </button>

      <p className="text-center text-xs text-gray-400 mt-3">
        You can change your selection any time and regenerate the image
      </p>
    </main>
  )
}
