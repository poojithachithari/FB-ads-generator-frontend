// 50 creative ad templates — each defines a visual style for image generation
// thumb: { bg, accent, secondary?, layout } — drives the CSS thumbnail renderer
// imageInstruction — injected into the image prompt

export const TEMPLATE_CATEGORIES = [
  'All', 'Lifestyle', 'Product', 'Typography', 'Editorial', 'Social Proof', 'Promotional', 'Aesthetic'
]

export const TEMPLATES = [
  // ── LIFESTYLE ─────────────────────────────────────────────────────────────
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    category: 'Lifestyle',
    description: 'Warm amber sunlight bathes the scene in a rich, aspirational glow. Product placed naturally in an outdoor or window-lit environment.',
    thumb: { bg: '#c97c2a', accent: '#f5c842', secondary: '#7a3d0a', layout: 'gradient-warm' },
    imageInstruction: 'Golden hour lifestyle photography. Warm amber and honey tones, late afternoon sun casting long soft shadows, rim lighting on product edges, shallow depth of field, bokeh background, aspirational outdoor or window-side setting. Cinematic warmth.'
  },
  {
    id: 'cozy-interior',
    name: 'Cozy Interior',
    category: 'Lifestyle',
    description: 'Warm home environment with textured surfaces — linen, wood, ceramic. Product feels lived-in and trusted.',
    thumb: { bg: '#d4b896', accent: '#8b5e3c', secondary: '#f0e8dc', layout: 'h-split' },
    imageInstruction: 'Cozy interior lifestyle photography. Warm cream and terracotta palette, soft diffused window light, textured surfaces (linen, wood grain, ceramic), product resting naturally on a styled surface, home environment, shallow depth of field.'
  },
  {
    id: 'urban-street',
    name: 'Urban Street',
    category: 'Lifestyle',
    description: 'Cool, concrete city energy. Product shown in an urban context — pavement, brick walls, city life.',
    thumb: { bg: '#2d2d2d', accent: '#5c8aff', secondary: '#888888', layout: 'v-split' },
    imageInstruction: 'Urban street photography style. Cool grey concrete tones, overcast city light or dramatic shadow from buildings, raw textures — brick, pavement, metal. Product placed in authentic street context. Slightly desaturated edit.'
  },
  {
    id: 'outdoor-adventure',
    name: 'Outdoor Adventure',
    category: 'Lifestyle',
    description: 'Fresh air, open skies, natural textures. Product positioned in an expansive outdoor setting for an active, free-spirited feel.',
    thumb: { bg: '#2d6a4f', accent: '#74c69d', secondary: '#a8d8b9', layout: 'diagonal' },
    imageInstruction: 'Outdoor adventure lifestyle photography. Lush greens and sky blues, bright natural daylight, wide environmental framing, nature textures (grass, stone, water), product in active outdoor context, energetic and aspirational.'
  },
  {
    id: 'fitness-energy',
    name: 'Fitness Energy',
    category: 'Lifestyle',
    description: 'High-energy athletic aesthetic. Dark background, powerful lighting, motion-forward composition.',
    thumb: { bg: '#0d0d1a', accent: '#00d4ff', secondary: '#ff6b35', layout: 'dark-lines' },
    imageInstruction: 'Fitness and sports photography. Dark studio or gym environment, high-contrast dramatic lighting with strong key light, electric blue or neon accents, product in dynamic athletic context, powerful composition suggesting motion and energy.'
  },
  {
    id: 'beauty-glow',
    name: 'Beauty & Glow',
    category: 'Lifestyle',
    description: 'Luminous, radiant beauty aesthetic. Soft pink or champagne tones, flawless skin-inspired glow.',
    thumb: { bg: '#f9c6d0', accent: '#d4a0b0', secondary: '#f5e6ea', layout: 'center-circle' },
    imageInstruction: 'Beauty photography aesthetic. Soft pink, blush, and champagne gold palette, diffused backlight creating a luminous skin-like glow, flawless and refined, studio-soft lighting with minimal shadows, clean and radiant.'
  },
  {
    id: 'food-moment',
    name: 'Food Moment',
    category: 'Lifestyle',
    description: 'Warm, sensory food photography energy. Textured surfaces, natural ingredients, appetite-forward styling.',
    thumb: { bg: '#c4622d', accent: '#f0a830', secondary: '#e8d5b0', layout: 'gradient-warm' },
    imageInstruction: 'Food and lifestyle photography. Warm earthy palette — terracotta, saffron, cream. Styled flat surfaces with natural props (herbs, linen, ceramic), warm side lighting, textural richness. Appetite-forward and sensory.'
  },
  {
    id: 'desk-aesthetic',
    name: 'Desk & Workspace',
    category: 'Lifestyle',
    description: 'Clean, productive desk setup. Slate and neutral tones, minimal props, professional focus.',
    thumb: { bg: '#e8e8e8', accent: '#4a4a5a', secondary: '#c0c0c8', layout: 'editorial-bar' },
    imageInstruction: 'Workspace and desk aesthetic photography. Clean slate and neutral tones, soft overhead or north-facing diffused light, minimal carefully chosen props (notebook, coffee, plant), product as the desk hero, organised and aspirational.'
  },

  // ── PRODUCT ──────────────────────────────────────────────────────────────
  {
    id: 'studio-white',
    name: 'Studio White Hero',
    category: 'Product',
    description: 'Clean white studio with a soft shadow. Every detail of the product visible. Timeless and premium.',
    thumb: { bg: '#ffffff', accent: '#e0e0e0', secondary: '#f5f5f5', layout: 'center-circle' },
    imageInstruction: 'Pure studio white product hero shot. All-white seamless background, soft even shadowbox lighting from both sides, subtle drop shadow beneath product, product fills 60% of frame, ultra-sharp detail, reflections on surface if applicable.'
  },
  {
    id: 'dark-studio',
    name: 'Dark Studio Premium',
    category: 'Product',
    description: 'Dark moody studio background makes the product luminous. High-end, premium feel.',
    thumb: { bg: '#111111', accent: '#333333', secondary: '#555555', layout: 'center-dot' },
    imageInstruction: 'Dark studio product photography. Near-black or deep charcoal seamless background, single dramatic key light from camera-left creating product glow and deep shadows right, product appears luminous against the dark, premium and authoritative.'
  },
  {
    id: 'flat-lay',
    name: 'Flat Lay Overhead',
    category: 'Product',
    description: 'Overhead flat lay with curated props. Clean, organised, editorial.',
    thumb: { bg: '#f0ede8', accent: '#c8b8a8', secondary: '#a89880', layout: 'grid-2x2' },
    imageInstruction: 'Overhead flat lay product photography. Directly top-down 90° angle, clean linen or marble surface, product as central hero surrounded by thoughtfully curated complementary props, even soft diffused natural light, no shadows.'
  },
  {
    id: 'macro-detail',
    name: 'Macro Close-Up',
    category: 'Product',
    description: 'Extreme close-up that reveals texture and quality. Tactile, detailed, premium.',
    thumb: { bg: '#6a8faf', accent: '#3d6080', secondary: '#9ab8d0', layout: 'overlay-fade' },
    imageInstruction: 'Macro close-up product photography. Extreme shallow depth of field, only a portion of product in sharp focus, blurred surroundings, reveals texture and material quality in microscopic detail, dramatic directional light to emphasise surface texture.'
  },
  {
    id: 'color-pop',
    name: 'Color Pop Hero',
    category: 'Product',
    description: 'Product against a vivid, saturated background. Bold, thumb-stopping, energetic.',
    thumb: { bg: '#e63946', accent: '#ffffff', secondary: '#c1121f', layout: 'badge-circle' },
    imageInstruction: 'Color pop product photography. Single vivid saturated background color (chosen to complement or contrast the product), product perfectly centered as the absolute hero, bright even studio lighting, product slightly elevated with minimal shadow.'
  },
  {
    id: 'floating-product',
    name: 'Floating & Clean',
    category: 'Product',
    description: 'Product appears to float against a sky-blue or gradient background. Modern, digital-native feel.',
    thumb: { bg: '#b8d4f0', accent: '#6aaed6', secondary: '#e8f4ff', layout: 'gradient-cool' },
    imageInstruction: 'Floating product photography. Sky blue or soft gradient background, product suspended mid-air with no surface, invisible retouched shadow beneath giving float effect, bright even studio lighting, clean and modern digital-native aesthetic.'
  },
  {
    id: 'unboxing-style',
    name: 'Unboxing Reveal',
    category: 'Product',
    description: 'Product partially revealed from premium packaging. Excitement and discovery narrative.',
    thumb: { bg: '#8b6914', accent: '#c4a020', secondary: '#f0e0a0', layout: 'h-split' },
    imageInstruction: 'Unboxing product photography. Product partially emerging from premium packaging, kraft or matte black box partially open, top-down or 45° angle, warm studio lighting, tissue paper and packaging elements visible, reveals luxury and care of presentation.'
  },

  // ── TYPOGRAPHY ───────────────────────────────────────────────────────────
  {
    id: 'bold-headline',
    name: 'Bold Headline',
    category: 'Typography',
    description: 'Copy-first. Large commanding text dominates the frame. Product is secondary to the message.',
    thumb: { bg: '#0f0f23', accent: '#ff2d55', secondary: '#ffffff', layout: 'text-bars' },
    imageInstruction: 'Bold headline typography-first ad design. Deep navy or charcoal background, product small in one corner, composition leaves dominant space for large white headline typography overlay. Dramatic single-source lighting on product. High contrast.'
  },
  {
    id: 'quote-card',
    name: 'Quote Card',
    category: 'Typography',
    description: 'Clean centered quote or testimonial on a refined background. Minimal, trustworthy.',
    thumb: { bg: '#f8f8f8', accent: '#1a1a2e', secondary: '#dddddd', layout: 'corner-tri' },
    imageInstruction: 'Quote card editorial design. Clean white or very light background, product positioned small bottom-left or right, centered composition leaves space for large quotation marks and testimonial text. Soft diffused lighting, refined and minimal.'
  },
  {
    id: 'stats-numbers',
    name: 'Stats & Numbers',
    category: 'Typography',
    description: 'Data-forward design. Big numbers and stats are the visual hero alongside the product.',
    thumb: { bg: '#1a2744', accent: '#4ecdc4', secondary: '#2d4a8a', layout: 'dark-lines' },
    imageInstruction: 'Data and statistics focused ad design. Dark navy background, product on right side, left side composition is clear for large bold number overlays (e.g. "94%", "10,000+"). Grid-like structured feel, cool blue accents, professional and authoritative.'
  },
  {
    id: 'retro-serif',
    name: 'Retro Serif',
    category: 'Typography',
    description: 'Vintage-inspired with aged paper tones, serif fonts, and classic advertising cues.',
    thumb: { bg: '#d4b483', accent: '#5c3a1e', secondary: '#8b6914', layout: 'stripes' },
    imageInstruction: 'Retro vintage advertising aesthetic. Aged cream or parchment-warm background, warm sepia or deep brown product lighting, composition evokes classic 1950s-70s print ads, space for serif headline typography, warm and nostalgic.'
  },
  {
    id: 'neon-type',
    name: 'Neon Type',
    category: 'Typography',
    description: 'Dark background with vivid neon typography zones. Night-life energy and edgy brand personality.',
    thumb: { bg: '#0a0a0a', accent: '#39ff14', secondary: '#ff073a', layout: 'neon-glow' },
    imageInstruction: 'Neon typography ad design. Near-black background, product lit with coloured neon side lighting (magenta or cyan rim), composition leaves space for neon-glow text overlay, cyberpunk-adjacent energy, vivid electric accents.'
  },

  // ── EDITORIAL ────────────────────────────────────────────────────────────
  {
    id: 'magazine-spread',
    name: 'Magazine Spread',
    category: 'Editorial',
    description: 'Classic editorial layout. Clean white background with product as a fashion-magazine hero.',
    thumb: { bg: '#ffffff', accent: '#1a1a1a', secondary: '#e0e0e0', layout: 'v-split' },
    imageInstruction: 'Magazine editorial photography. Clean white studio background, product styled as a fashion-magazine hero image, vertical orientation, strong negative space for copy, soft wrapping light from large softbox, elegant and aspirational.'
  },
  {
    id: 'minimal-editorial',
    name: 'Minimal White Space',
    category: 'Editorial',
    description: 'Extreme minimalism. One product, one surface, infinite breathing room. Luxury through restraint.',
    thumb: { bg: '#fafafa', accent: '#c8c8c8', secondary: '#f0f0f0', layout: 'center-dot' },
    imageInstruction: 'Extreme minimalism editorial photography. Pure white or very pale grey seamless background, product occupies maximum 30% of frame centered or rule-of-thirds, massive negative space around, soft even studio light, no props, luxury through restraint.'
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Dark Gold',
    category: 'Editorial',
    description: 'Deep black with gold accents. The aesthetic language of ultra-premium brands.',
    thumb: { bg: '#0d0d0d', accent: '#c9a84c', secondary: '#8a6520', layout: 'dark-accent' },
    imageInstruction: 'Luxury dark gold editorial photography. Near-black background, product lit with warm golden rim light (candle-warmth 2700K), gold surface reflections, deep shadows with rich shadow detail, small elegant gold decorative elements if appropriate, ultra-premium feel.'
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    category: 'Editorial',
    description: 'Black, white, and grey only. Removes colour distraction and focuses on form and texture.',
    thumb: { bg: '#3a3a3a', accent: '#ffffff', secondary: '#888888', layout: 'diagonal' },
    imageInstruction: 'Black and white monochrome photography. All colour removed in post, strong tonal contrast, product form and texture are the heroes, dramatic directional lighting creating deep shadows and bright highlights, timeless and artistic.'
  },
  {
    id: 'abstract-art',
    name: 'Abstract Artistic',
    category: 'Editorial',
    description: 'Product within an abstract painted or sculptural composition. Art-forward, conversation-starting.',
    thumb: { bg: '#e63946', accent: '#457b9d', secondary: '#f1faee', layout: 'grid-2x2' },
    imageInstruction: 'Abstract artistic ad photography. Product placed within a bold abstract composition — geometric painted shapes or sculptural forms, high-saturation complementary color palette, editorial art-directed, unconventional angle, gallery-worthy aesthetic.'
  },
  {
    id: 'pattern-bg',
    name: 'Repeat Pattern',
    category: 'Editorial',
    description: 'Product set against a bold repeating pattern background. Graphic, eye-catching, design-led.',
    thumb: { bg: '#2a4858', accent: '#88c0d0', secondary: '#5e81ac', layout: 'pattern-dots' },
    imageInstruction: 'Pattern background product photography. Product centered in front of a bold repeating geometric or organic pattern (chevron, polka dot, floral), pattern color coordinates with product, strong studio product lighting, graphic design aesthetic.'
  },

  // ── SOCIAL PROOF ─────────────────────────────────────────────────────────
  {
    id: 'testimonial-card',
    name: 'Testimonial Card',
    category: 'Social Proof',
    description: 'Customer review is the hero. Product supporting. Builds trust through real voice.',
    thumb: { bg: '#f0f4ff', accent: '#4a6cf7', secondary: '#d0d8ff', layout: 'corner-tri' },
    imageInstruction: 'Testimonial card design photography. Clean light blue-white background, product small on one side, composition deliberately leaves space for large quotation marks and review text overlay, soft diffused light, trustworthy and professional.'
  },
  {
    id: 'star-rating',
    name: 'Star Rating Hero',
    category: 'Social Proof',
    description: 'Five-star rating visually prominent. Product surrounded by evidence of social trust.',
    thumb: { bg: '#fffbea', accent: '#f59e0b', secondary: '#fcd34d', layout: 'badge-circle' },
    imageInstruction: 'Star rating social proof photography. Warm cream or yellow-tinted background, product as hero, composition deliberately clear space above product for star rating overlay (5 gold stars), warm even lighting, approachable and trusted.'
  },
  {
    id: 'before-after',
    name: 'Before & After',
    category: 'Social Proof',
    description: 'Dramatic left-right or top-bottom split showing the transformation the product creates.',
    thumb: { bg: '#555555', accent: '#4ade80', secondary: '#22c55e', layout: 'v-split' },
    imageInstruction: 'Before and after split composition. Clean center dividing line, left half desaturated/grey representing "before" state, right half vibrant and lit representing "after" state, product shown on "after" side, high contrast between the two halves.'
  },
  {
    id: 'ugc-authentic',
    name: 'UGC Authentic',
    category: 'Social Proof',
    description: 'Raw, real, phone-shot energy. Deliberately un-produced to feel like a genuine user post.',
    thumb: { bg: '#e8e0d8', accent: '#8b7355', secondary: '#c0a880', layout: 'h-split' },
    imageInstruction: 'User-generated content aesthetic photography. Slightly casual composition as if shot on a modern phone, warm natural light from a window, real home environment background, product in natural hand-held or surface position, authentic and unscripted feel.'
  },
  {
    id: 'community-grid',
    name: 'Community Collage',
    category: 'Social Proof',
    description: 'Multi-photo grid showing different people using the product. Community and belonging.',
    thumb: { bg: '#ffffff', accent: '#6366f1', secondary: '#a5b4fc', layout: 'grid-2x2' },
    imageInstruction: 'Community collage layout photography. Grid-divided composition showing product in multiple different lifestyle contexts, varied environments and users suggested, product consistent across all sections, vibrant and inclusive, diverse usage occasions.'
  },

  // ── PROMOTIONAL ──────────────────────────────────────────────────────────
  {
    id: 'limited-time-red',
    name: 'Limited Time Offer',
    category: 'Promotional',
    description: 'Urgent red creates immediate pressure. Product prominent, deal is unmistakable.',
    thumb: { bg: '#dc2626', accent: '#fbbf24', secondary: '#991b1b', layout: 'badge-circle' },
    imageInstruction: 'Urgent promotional photography. Bold red and high-energy background, product prominently lit and front-and-center, composition leaves clear space for large "LIMITED TIME" or price overlay text, high saturation, immediate visual urgency.'
  },
  {
    id: 'sale-badge',
    name: 'Sale Badge',
    category: 'Promotional',
    description: 'Classic circular badge "SALE" or percentage off is the primary visual hook.',
    thumb: { bg: '#f97316', accent: '#ffffff', secondary: '#ea580c', layout: 'center-dot' },
    imageInstruction: 'Sale badge promotional photography. Bright orange or red background, product on one side, composition deliberately reserves circular space for a bold percentage-off badge overlay, clean even studio lighting, simple and punchy.'
  },
  {
    id: 'bundle-value',
    name: 'Bundle Value Stack',
    category: 'Promotional',
    description: 'Multiple products stacked or arranged together showing the full value of the bundle.',
    thumb: { bg: '#1e3a5f', accent: '#60a5fa', secondary: '#3b82f6', layout: 'v-split' },
    imageInstruction: 'Bundle product photography. Multiple products arranged in a stacked or spread composition showing the complete bundle offer, overhead or 45° angle, clean dark navy background makes products pop, each product clearly visible, premium but accessible.'
  },
  {
    id: 'free-offer',
    name: 'Free Offer',
    category: 'Promotional',
    description: 'Trust-green evokes free trial confidence. Clean, honest, and welcoming.',
    thumb: { bg: '#065f46', accent: '#34d399', secondary: '#10b981', layout: 'editorial-bar' },
    imageInstruction: 'Free trial offer photography. Trustworthy green or teal background, product front and center with open friendly lighting, composition leaves space for "FREE" or trial offer text overlay, clean and inviting, removes risk psychologically.'
  },
  {
    id: 'flash-sale',
    name: 'Flash Sale',
    category: 'Promotional',
    description: 'Electric yellow and black. Maximum energy and urgency for a time-limited sale event.',
    thumb: { bg: '#0a0a0a', accent: '#facc15', secondary: '#ca8a04', layout: 'neon-glow' },
    imageInstruction: 'Flash sale photography. Electric yellow accents against black background, product hit with harsh dramatic directional yellow-tinted light, high energy and urgency, composition leaves strong space for bold promotional text, no softness — all impact.'
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Style',
    category: 'Promotional',
    description: 'Countdown clock blocks suggest time is running out. Structured urgency.',
    thumb: { bg: '#18181b', accent: '#e11d48', secondary: '#9f1239', layout: 'text-bars' },
    imageInstruction: 'Countdown urgency photography. Dark background, product in lower frame, upper composition deliberately structured with box-like sections to accommodate countdown timer digits overlay, red accent lighting on product edges, time pressure aesthetic.'
  },
  {
    id: 'seasonal',
    name: 'Seasonal Special',
    category: 'Promotional',
    description: 'Festive seasonal palette adapts to the relevant holiday or season for timely relevance.',
    thumb: { bg: '#14532d', accent: '#dc2626', secondary: '#fbbf24', layout: 'diagonal' },
    imageInstruction: 'Seasonal promotional photography. Festive seasonal color palette (warm reds and greens for winter, pastels for spring), product surrounded by subtle seasonal props and decorative elements, warm celebratory lighting, joyful and timely.'
  },
  {
    id: 'referral',
    name: 'Referral & Friends',
    category: 'Promotional',
    description: 'Lavender and purple suggest community and sharing. Social referral energy.',
    thumb: { bg: '#7c3aed', accent: '#c4b5fd', secondary: '#5b21b6', layout: 'gradient-cool' },
    imageInstruction: 'Referral and social sharing photography. Friendly purple and lavender background, product with open composition for two implied users (hands, shadows, or double placement), warm inclusive lighting, community and sharing aesthetic.'
  },

  // ── AESTHETIC ────────────────────────────────────────────────────────────
  {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    category: 'Aesthetic',
    description: 'Soft pinks, lavenders, and mints. Gentle, feminine, and aspirationally soft.',
    thumb: { bg: '#fce4ec', accent: '#f8bbd0', secondary: '#e1bee7', layout: 'gradient-cool' },
    imageInstruction: 'Pastel dream aesthetic photography. Soft pink, lavender, and mint palette, diffused wrapping studio light creating zero harsh shadows, product placed on matching pastel surface, subtle pastel props, dreamy and romantic atmosphere.'
  },
  {
    id: 'earthy-organic',
    name: 'Earthy & Organic',
    category: 'Aesthetic',
    description: 'Terracotta, sage, linen, and clay. Grounded, natural, and sustainably-minded.',
    thumb: { bg: '#8b5e3c', accent: '#6b8f71', secondary: '#d4a574', layout: 'h-split' },
    imageInstruction: 'Earthy organic aesthetic photography. Terracotta, sage green, warm linen, and clay palette, natural diffused light from large window, organic textures (stone, jute, dried botanicals), product feels part of nature, slow and intentional atmosphere.'
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    category: 'Aesthetic',
    description: 'Near-black with electric neon pink and green accents. Edgy, futuristic, rule-breaking.',
    thumb: { bg: '#0a0a0a', accent: '#ff2d78', secondary: '#00ff87', layout: 'neon-glow' },
    imageInstruction: 'Cyberpunk neon aesthetic photography. Near-black background, product hit with electric magenta and cyan neon rim lighting creating dramatic colour splits, smoke or haze element, futuristic and edgy, high contrast neon glow effect.'
  },
  {
    id: 'retro-vintage',
    name: 'Retro Vintage',
    category: 'Aesthetic',
    description: 'Aged warm tones and a film-like quality. Nostalgia and heritage credibility.',
    thumb: { bg: '#c9956c', accent: '#7a4f3a', secondary: '#e8c9a0', layout: 'stripes' },
    imageInstruction: 'Retro vintage aesthetic photography. Aged warm amber and sepia tones, film grain texture overlay, slightly faded highlights, warm tungsten or retro-flashbulb lighting quality, product styled with vintage-appropriate props, nostalgic and heritage feel.'
  },
  {
    id: 'futuristic-tech',
    name: 'Futuristic Tech',
    category: 'Aesthetic',
    description: 'Cool blue-white with geometric precision. Signals innovation and forward-thinking design.',
    thumb: { bg: '#0c1929', accent: '#00d4ff', secondary: '#0066aa', layout: 'dark-accent' },
    imageInstruction: 'Futuristic technology aesthetic photography. Deep blue-black background, product lit with cool blue-white LED-style light, geometric elements or subtle grid-line overlays implied in composition, clean precise lines, signals innovation and cutting-edge design.'
  },
  {
    id: 'dark-moody',
    name: 'Dark Moody',
    category: 'Aesthetic',
    description: 'Deep shadows, minimal highlights, rich textures. Dramatic and emotionally intense.',
    thumb: { bg: '#0a0a12', accent: '#2d1b4e', secondary: '#1a0a2e', layout: 'overlay-fade' },
    imageInstruction: 'Dark moody atmospheric photography. Very deep shadows dominating 70% of the frame, product revealed by a single narrow beam of dramatic light, rich shadow detail with no pure black clipping, textures visible in shadows, emotionally intense and cinematic.'
  },
  {
    id: 'gradient-wash',
    name: 'Gradient Wash',
    category: 'Aesthetic',
    description: 'Smooth multi-color gradient background fills the frame. Modern, digital-native, and vibrant.',
    thumb: { bg: '#667eea', accent: '#764ba2', secondary: '#f093fb', layout: 'gradient-cool' },
    imageInstruction: 'Gradient wash aesthetic photography. Smooth flowing gradient background transitioning across complementary colors (purple to pink, blue to teal), product centered and cleanly lit with studio light, modern digital-native aesthetic, vibrant and contemporary.'
  },
  {
    id: 'illustrated',
    name: 'Illustrated Playful',
    category: 'Aesthetic',
    description: 'Bright, graphic, illustration-adjacent. Product sits in a hand-drawn or graphic designed world.',
    thumb: { bg: '#fbbf24', accent: '#ef4444', secondary: '#3b82f6', layout: 'grid-2x2' },
    imageInstruction: 'Illustrated playful aesthetic photography. Bright saturated primary color background, product surrounded by hand-drawn style graphic elements and playful props, flat graphic design aesthetic approaching illustration, joyful and energetic.'
  }
]
