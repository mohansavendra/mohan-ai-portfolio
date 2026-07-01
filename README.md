# Mohan AI Portfolio — Live Assistant Version

This package is ready for GitHub + Vercel.

## Files

- `index.html` — portfolio frontend
- `api/chat.js` — Vercel serverless function for the live assistant
- `portfolio-context.json` — verified context the assistant must use
- `package.json` — dependencies and local dev command
- `.gitignore` — prevents secrets and node_modules from being committed

## Important

Do not put your OpenAI API key inside `index.html`.
Add it later in Vercel as an Environment Variable:

```txt
OPENAI_API_KEY=your_key_here
```

Optional model override:

```txt
OPENAI_MODEL=gpt-5.4-mini
```

## Assets / pictures

No separate pictures are required for the current version.

- The resume download is embedded inside `index.html`.
- The visuals are CSS/SVG/HTML-based.
- Stack logos load from Simple Icons CDN.
- There is no required `images/` folder right now.

## Local test

```bash
npm install
npx vercel dev
```

Then open:

```txt
http://localhost:3000
```
