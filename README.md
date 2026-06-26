# FB Ads Generator — Frontend

React single-page application for generating Facebook/Instagram ads. Guides users through a creative brief, template selection, AI copy generation, image generation, and brand management.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Language | JavaScript (JSX) |

## Prerequisites

- Node.js 18+
- The [backend server](../backend/README.md) running on port 3001 (or configured via `VITE_API_URL`)

## Installation

```bash
cd frontend
npm install
```

## Environment Setup

Copy the example file:

```bash
cp .env.example .env
```

Edit `.env` if your backend runs on a different URL:

```
VITE_API_URL=http://localhost:3001
```

If not set, defaults to `http://localhost:3001`.

## Running

**Development:**
```bash
npm run dev
```

App runs at `http://localhost:5173`.

**Production build:**
```bash
npm run build
```

Output goes to `dist/`. Serve with any static host (Netlify, Vercel, nginx, etc.).

## Pages

| Page | Route | Description |
|---|---|---|
| Brief Form | `/` | Enter product details and creative brief |
| Template Select | `/templates` | Browse and select an ad template |
| Ad Copies | `/ad-copies` | Review and mix-and-match AI-generated copy |
| Image Generator | `/generate` | Generate and preview the final ad image |
| Brands | `/brands` | Manage brands and saved ads |
| Prompt Examples | `/examples` | Browse example prompts |

## Folder Structure

```
frontend/
├── src/
│   ├── pages/          # One component per page/route
│   │   ├── BriefForm.jsx
│   │   ├── TemplateSelect.jsx
│   │   ├── Templates.jsx
│   │   ├── AdCopies.jsx
│   │   ├── ImageGenerator.jsx
│   │   ├── Brands.jsx
│   │   └── PromptExamples.jsx
│   ├── App.jsx         # Router setup
│   └── main.jsx        # Entry point
├── public/
├── vite.config.js      # Vite + proxy config
├── tailwind.config.js
├── .env.example
└── package.json
```
