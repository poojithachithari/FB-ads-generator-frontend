import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import BriefForm from './pages/BriefForm'
import TemplateSelect from './pages/TemplateSelect'
import AdCopies from './pages/AdCopies'
import ImageGenerator from './pages/ImageGenerator'
import Templates from './pages/Templates'
import PromptExamples from './pages/PromptExamples'
import Brands from './pages/Brands'

const BRIEF_STORAGE_KEYS = ['fb_ads_brief', 'fb_ads_template', 'fb_ads_copies', 'fb_ads_image']

function clearBriefState() {
  BRIEF_STORAGE_KEYS.forEach(k => sessionStorage.removeItem(k))
}

function Header({ step }) {
  const navigate = useNavigate()
  const location = useLocation()
  const steps = ['Brief', 'Template', 'Concepts', 'Image']
  const isTemplates = location.pathname === '/templates'
  const isExamples = location.pathname === '/prompt-examples'
  const isBrandsPage = location.pathname === '/brands'
  const isBrief = !isTemplates && !isExamples && !isBrandsPage

  const goNewBrief = () => {
    clearBriefState()
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      {/* Top row: logo + main tabs */}
      <div className="max-w-6xl mx-auto px-6 pt-4 pb-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={goNewBrief}>
          <h1 className="text-xl font-bold text-gray-900">FB Ads Creative Generator</h1>
        </div>

        {/* Main tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => navigate('/brands')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              isBrandsPage ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📁 Brands
          </button>
          <button
            onClick={goNewBrief}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              isBrief ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ✦ New Brief
          </button>
          <button
            onClick={() => navigate('/templates')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              isTemplates ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🖼️ Templates
          </button>
          <button
            onClick={() => navigate('/prompt-examples')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              isExamples ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🎓 Train AI
          </button>
        </div>
      </div>

      {/* Step progress bar — only shown during brief flow */}
      {isBrief && (
        <div className="max-w-6xl mx-auto px-6 pb-3 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                i + 1 === step
                  ? 'bg-brand-600 text-white'
                  : i + 1 < step
                  ? 'bg-brand-100 text-brand-700'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <span className={`w-3.5 h-3.5 rounded-full text-xs flex items-center justify-center font-bold ${
                  i + 1 === step ? 'bg-white text-brand-600' :
                  i + 1 < step ? 'bg-brand-600 text-white' : 'bg-gray-300 text-gray-500'
                }`}>{i + 1 < step ? '✓' : i + 1}</span>
                {s}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${i + 1 < step ? 'bg-brand-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/"        element={<><Header step={1} /><BriefForm /></>} />
        <Route path="/style"   element={<><Header step={2} /><TemplateSelect /></>} />
        <Route path="/copies"  element={<><Header step={3} /><AdCopies /></>} />
        <Route path="/image"   element={<><Header step={4} /><ImageGenerator /></>} />
        <Route path="/templates"     element={<><Header step={0} /><Templates /></>} />
        <Route path="/prompt-examples" element={<><Header step={0} /><PromptExamples /></>} />
        <Route path="/brands"        element={<><Header step={0} /><Brands /></>} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
