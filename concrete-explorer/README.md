# Concrete XYZ — Profile Explorer
**Built by [@fishacrypt](https://x.com/fishacrypt)**

AI-powered X/Twitter profile analyzer for the Concrete Protocol ecosystem.

---

## Deploy to Netlify (5 minutes)

### 1. Upload this folder to GitHub
Create a new repo and push this entire folder.

### 2. Connect to Netlify
- Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
- Select your repo
- Build settings are auto-detected from `netlify.toml`

### 3. Add your Anthropic API key
- In Netlify dashboard → Site → Environment variables
- Add: `ANTHROPIC_API_KEY` = your key from [console.anthropic.com](https://console.anthropic.com)

### 4. Deploy
Hit Deploy. Done. Your site is live and the API key stays secure server-side.

---

## How it works
- `public/index.html` — the frontend UI
- `netlify/functions/claude.js` — serverless proxy that holds the API key
- The frontend calls `/.netlify/functions/claude` (never Anthropic directly)
- Your API key is never exposed to the browser

## Get an API key
→ https://console.anthropic.com
