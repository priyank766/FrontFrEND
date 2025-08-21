FrontFrEND — Frontend Implementation Prompt
1 — Purpose (one line)

Build the FrontFrEND frontend: a polished, responsive SPA that lets users drop in a GitHub repo (or choose a new-feature/ example), view AI-generated frontend changes as side-by-side previews, inspect file diffs, and — optionally — create GitHub pull requests via the backend.

things to remember : this are suggestions so if it is relevant for project only then you have to add  

2 — Inspirations & visual style

Design and behavior should be informed by two reference sites:

Lovable — chat-driven, minimal, product-led UI with a clear hero, quick “get started” flow, and focus on visual previews and templates. 
Lovable

GitForMe / Gitforme.tech — repository exploration dashboard: file tree, code insights, "good first issues", and AI assistant that explains code and shows contextual info. 
gitforme.tech
Product Hunt

Combine Lovable’s preview-focused simplicity with GitForMe’s repository/insights layout:

Hero + onboarding (Lovable)

Repo dashboard + file tree + code explorer (GitForMe)

Side-by-side visual preview + code diff panel (Lovable-like preview UX)

3 — High-level feature list (deliverables)

Landing / Connect page

GitHub OAuth sign-in button

Input: repo URL and branch selector

Quick demo: button to load new-feature/ example locally

Repo analysis / dashboard

Top-level repo info (name, description, owner, branch)

Status tile: AI analysis status, last run, tests passed

File explorer

Collapsible tree of repo frontend files (filter by .html, .css, .js, .jsx, .tsx)

Click to view file content in editor / viewer

AI suggestion panel

Natural-language summary of suggested changes

UI to accept/reject suggestions per file or per change group

Live side-by-side preview

Left: Original UI (iframe)

Right: AI-modified UI (iframe)

Toggle to view diff overlay or switch to full-window preview

Code diff & patch viewer

Unified diff view (with syntax highlighting)

Inline comments (from AI explanations)

Buttons: Create PR (calls backend), Download patch, Apply locally

PR & commit flow UI

Form to customize PR title, description, branch name

Show CI/test status returned from backend after PR creation

Examples & local demo

A “Preview new-feature” shortcut that loads the example code in new-feature/

4 — Visual & UX requirements (detailed)

Layout

Desktop: 3-column layout

Left column (20–25%): file explorer & repo metadata

Middle column (35–40%): code editor / diff viewer

Right column (35–40%): side-by-side preview (two stacked iframes) and AI notes

Mobile/tablet: stacked layout with toggles (Explorer / Editor / Preview)

Look & Feel

Minimal, soft color palette (light background; accent color e.g., #3B82F6 or similar)

Clean typography: system UI or Inter. Clear headings and smallcaps for metadata

Subtle shadows, rounded cards, adequate spacing (mobile-first breakpoints)

Accessibility: aria labels for interactive elements, keyboard navigation for file tree

Interactions

Live preview updates when user accepts a change (no full page reloads)

Smooth transitions between original and modified previews (fade/slide)

Clicking any highlighted issue in the AI panel scrolls to the relevant diff line

Show toast notifications for background actions (clone started, AI analysis in progress, PR created)

5 — Frontend tech stack (recommended)

Framework: React (Vite or Next.js as optional upgrade)

State management: React Query (data fetching) + Context or Zustand for UI state

Editor: Monaco Editor (file content and diff); Prism.js for read-only highlights

Styling: Tailwind CSS (or plain CSS modules)

Iframes: use iframe with srcdoc for direct rendering or URL provided by backend

HTTP: fetch or axios for REST calls

Authentication: GitHub OAuth via backend (frontend triggers OAuth redirect)

(If you prefer Svelte/Vue, adjust impressions accordingly — but the UI descriptions assume React.)

6 — File structure (suggested)
frontend/
├─ public/
├─ src/
│  ├─ App.jsx
│  ├─ index.jsx
│  ├─ routes/
│  │  ├─ Home.jsx
│  │  ├─ Dashboard.jsx
│  │  └─ RepoView.jsx
│  ├─ components/
│  │  ├─ FileExplorer/
│  │  ├─ CodeEditor/
│  │  ├─ PreviewPanel/
│  │  ├─ AiSummary/
│  │  └─ PrForm/
│  ├─ services/
│  │  └─ api.js
│  └─ styles/
│     └─ tailwind.css
└─ package.json

7 — Backend integration contract (APIs + examples)

Frontend must call the backend endpoints described below. Backend base URL: /api (adjust if proxied).

7.1 Authentication

GET /api/auth/github/url

Response: { "auth_url": "https://github.com/login/oauth/authorize?..." }

Frontend redirects user to auth_url. Backend handles the OAuth callback and issues a session cookie or token.

GET /api/auth/me

Returns authenticated user info: { "login": "...", "avatar": "...", "installed": true|false }

7.2 Repo & analysis

POST /api/clone

Body: { "repo": "https://github.com/owner/repo", "branch": "main" }

Response (async): { "job_id": "abc123", "status": "queued" }

GET /api/status?job_id=abc123

Response: { "job_id":"abc123", "status": "done", "files": [...], "analysis_summary": "..." }

GET /api/files?repo=owner/repo&branch=main

Response: { "files": [ { "path": "index.html", "type":"html" }, ... ] }

GET /api/file?repo=owner/repo&path=path/to/file

Response: { "path":"...", "content":"<...>" }

7.3 AI suggestion & patch generation

POST /api/ai/suggest

Body: { "repo":"owner/repo", "branch":"main", "areas":["ui","accessibility","css"], "files":["src/Button.jsx"] }

Response: { "suggestion_id":"s1", "summary":"Fix contrast on primary button", "changes":[ { "path":"src/Button.jsx", "patch":"<unified-diff>" } ] }

GET /api/ai/suggestion?suggestion_id=s1

Response: { "summary":"...", "changes":[ { "path":"...", "diff":"@@ -1 +1 ..." } ], "preview_html": { "original": "...", "modified": "..." } }

preview_html is optional: { original: "<html>...</html>", modified: "<html>...</html>" }

7.4 Preview & rendering

POST /api/preview

Body: { "files": { "index.html": "<...>", "style.css":"...", "script.js":"..." } }

Response: { "preview_url": "https://..." } OR { "preview_srcdoc": "<html>...</html>" }

If backend returns preview_url, frontend should embed it in an iframe; if preview_srcdoc, set iframe.srcdoc.

Note: For local/demo new-feature/, frontend may call a local backend route GET /api/demo/new-feature returning the files object.

7.5 Create Pull Request

POST /api/pr

Body: { "repo":"owner/repo", "branch":"auto/frontfrend-improvements", "title":"Improve UI — FrontFrEND", "body":"AI suggested changes...", "changes":[ { "path":"...", "content":"..." } ] }

Response: { "pr_url":"https://github.com/owner/repo/pull/123", "pr_number":123 }

8 — new-feature/ folder usage & example

The repo contains a folder new-feature/ with a small demo frontend. Frontend must include a demo loader:

A UI button Load demo that calls /api/demo/new-feature (or reads files from /static/new-feature/) and:

populates the file explorer with demo files,

populates the editor,

enables the side-by-side preview of original vs. AI-modified (AI-modified in demo may simply be a transformed version included in new-feature/modified/).

Expected structure of new-feature/ (in repo root):

new-feature/
  ├─ original/
  │   ├─ index.html
  │   ├─ styles.css
  │   └─ script.js
  └─ modified/
      ├─ index.html
      ├─ styles.css
      └─ script.js


Frontend behavior for demo:

When user clicks Load demo, show the file tree with original/ files on left.

Show Compare button that loads modified/ files and instantly renders original vs modified in preview panel.

9 — UI components & responsibilities

Header

Brand, user avatar, Connect/Disconnect, "Load demo"

FileExplorer

Render folder tree; filter; search

EditorPanel

Monaco editor; supports read-only diff and editable mode

PreviewPanel

Two iframes: original (left) and modified (right)

Controls: mobile/desktop toggle, reload, take screenshot

AISummaryPanel

Natural language summary, list of suggested fixes, accept/reject toggles

DiffViewer

Unified diff with line comments and apply buttons

PrFormModal

Title, description, branch name, create PR button

Notifications

Toasts for success/failure

10 — Data contracts for the UI (examples)

Sample files JSON returned by backend for preview:

{
  "files": {
    "index.html": "<!doctype html>...",
    "styles.css": "body { background: white; }",
    "script.js": "console.log('ok');"
  }
}


Sample suggestion JSON

{
  "suggestion_id": "s1",
  "summary": "Add alt text to img and fix button contrast",
  "changes": [
    {
      "path": "index.html",
      "diff": "@@ -12,7 +12,7 @@\n-<img src='...'>\n+<img src='...' alt='User avatar'>"
    }
  ],
  "preview_html": {
    "original": "<html>...</html>",
    "modified": "<html>...</html>"
  }
}

11 — Acceptance criteria (what "done" looks like)

 Sign-in flow triggers backend OAuth and frontend shows authenticated user.

 Repo cloning/analysis flow can be triggered and shows progress status.

 File explorer lists frontend files; clicking opens code in editor.

 AI Suggestion panel shows suggestions and per-file diffs.

 Side-by-side preview renders original and modified HTML identically to backend preview_html.

 Create PR button calls /api/pr and opens the returned PR URL in a new tab.

 new-feature/ demo loads and renders original vs modified example without needing GitHub auth.

 Responsive and accessible (keyboard nav, aria attributes, readable colors).

12 — Dev & build commands

npm install (or pnpm) — to install dependencies

npm run dev — start dev server (Vite/Next)

npm run build — production build

Frontend should be configured to proxy API calls to Flask backend in development (e.g., Vite proxy or Next.js rewrites).

13 — Tests

Unit tests for key components (FileExplorer, PreviewPanel)

Integration test: simulate loading new-feature/ and confirm preview shows both versions

E2E: Cypress/Playwright to test full flow: connect demo → run analysis → accept changes → create PR

14 — Accessibility & internationalization

Use semantic HTML and ARIA roles for file-tree and diff controls

Keyboard shortcuts: open file (Enter), toggle diff (D), accept suggestion (A)

Prepare strings for extraction (i18n-ready)

15 — Handoff notes for AI agent / frontend dev

Start by implementing the new-feature/ demo loader and the PreviewPanel using iframe.srcdoc (fastest path).

Implement FileExplorer and Editor with Monaco (read-only for MVP).

Add API service (src/services/api.js) with wrapper functions for endpoints in Section 7.

Use React Query for polling clone/analysis status.

Implement PR creation once preview + diff flows are stable.

Keep UI simple; prioritize clarity and preview fidelity over bells-and-whistles.

16 — Styling tokens (starter)

Primary: #3B82F6 (blue)

Accent: #10B981 (green)

Background: #F8FAFC (light)

Text: #0F172A (dark)

Border radius: 8px

Shadow: 0 4px 16px rgba(2,6,23,0.08)

17 — Deliverables for the first milestone (MVP)

SPA with header + Load demo button

File Explorer that reads new-feature/original/ and new-feature/modified/

Code editor (read-only acceptable) showing selected file content

Side-by-side preview showing original (left) and modified (right)

Minimal AI panel that reads change descriptions from new-feature/changes.json (or call /api/ai/suggestion) and shows diff

Create PR button wired to /api/pr (works for demo via backend stub)

18 — Example new-feature/changes.json

Place this file alongside new-feature/original and new-feature/modified to let frontend demo the AI suggestions:

{
  "suggestions": [
    {
      "id": "demo-s1",
      "summary": "Add alt text to hero image and increase CTA contrast",
      "changes": [
        {
          "path": "index.html",
          "diff": "@@ -10,7 +10,7 @@\n-<img src=\"hero.jpg\">\n+<img src=\"hero.jpg\" alt=\"Product screenshot\">"
        }
      ]
    }
  ]
}

19 — Notes & edge cases

Some repos will be heavy; prefer to only fetch frontend files. Backend should support --depth=1 clones and file filters.

For private repos, OAuth must return a token that the backend uses to fetch code — frontend does not store PATs.

If preview HTML includes external resources, load them in sandboxed iframe (set sandbox attribute) to avoid XSS.

20 — Final checklist before handing off to UI dev or AI

Provide backend stub endpoints for demo (see Section 7)

Ensure new-feature/ example content is present and follows the structure in Section 8

Provide design assets (logo, color tokens, fonts) or accept the starter tokens above

Confirm authentication flow and CORS settings for development