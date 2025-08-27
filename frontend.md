1.change backgroung image to bg saved in assets

background.
then

Color palette (swatches + usage)

Use these as CSS variables. I sampled tones that match the dark navy → cool mid-blue → orange glow in the image.

:root{
  /* background / surfaces */
  --bg-deep:    #0F2A38; /* deep navy (left background) */
  --bg-shadow:  #071219; /* near-black shadow */

  /* mid / neutral */
  --cool-mid:   #627780; /* cool blue-gray (mid area) */
  --muted:      #AAB9C3; /* muted text / secondary */

  /* oranges (main accents) */
  --orange:     #FF7A2B; /* primary accent blob */
  --orange-2:   #FF9C57; /* highlight / hover */
  --peach-glow: #FFC79A; /* soft outer glow */

  /* text */
  --text-light: #F5F8FA; /* headings on dark */
  --text-dark:  #071826; /* text on light surfaces */
}

How to use each color

--bg-deep — page background (under the image overlay or fallback solid).

--bg-shadow — very dark panels, footer, top nav background.

--cool-mid — card backs, subtle borders, secondary backgrounds.

--muted — captions, meta info, disabled text.

--orange — primary CTA, highlights, link color.

--orange-2 / --peach-glow — button hover gradient / soft glows and badges.

--text-light — main headings and nav on dark backgrounds.

--text-dark — body text on light cards or light overlays.

Typography (desktop-focused)

Primary font: Inter (or Poppins if you want rounder shapes) — Google Fonts.

Heading: font-weight: 700; letter-spacing: -0.02em;

Desktop sizes: h1: 48px, h2: 36px, h3: 28px

Body: font-weight: 400; line-height: 1.5;

Desktop: 16px body size; 20px for large paragraph

UI / micro: font-weight: 600; font-size: 14px;

Example Google Fonts import:

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
body { font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }

Text styles & contrast suggestions

Headline on dark background: color: var(--text-light); text-shadow: 0 2px 6px rgba(0,0,0,0.45);

Body on dark background: color: var(--muted);

Headline on orange accent: use var(--bg-shadow) or pure white depending on contrast (test WCAG).

Links / inline accent: color: var(--orange); text-decoration: underline-offset: 3px;

Buttons & UI components

Primary CTA (glossy, orange gradient):

.btn-primary{
  background: linear-gradient(180deg, var(--orange) 0%, var(--orange-2) 100%);
  color: var(--text-light);
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(255,122,43,0.18), inset 0 1px 0 rgba(255,255,255,0.12);
  transition: transform .18s ease, box-shadow .18s ease;
}
.btn-primary:hover{
  transform: translateY(-4px);
  box-shadow: 0 14px 40px rgba(255,122,43,0.22), inset 0 1px 0 rgba(255,255,255,0.14);
}


Ghost / secondary button (glass feel):

.btn-ghost {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  color: var(--text-light);
  backdrop-filter: blur(6px);
}


Cards (glass + glossy highlight):

.card {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(2,6,11,0.45);
  border: 1px solid rgba(255,255,255,0.03);
}

Background / glossy effect (how to layer your image)

For a desktop webpage you’ll often want the image plus an overlay that creates the glossy, high-contrast UI.

Example CSS to use the abstract image as desktop background with a soft gloss overlay:

html,body { height:100%; margin:0; }

.hero {
  min-height:100vh;
  background:
    linear-gradient(180deg, rgba(11,18,24,0.25), rgba(11,18,24,0.35)), /* dark gradient overlay */
    radial-gradient(800px 400px at 70% 25%, rgba(255,199,154,0.12), transparent 20%), /* warm glow */
    url('/assets/abstract-bg.jpg') center/cover no-repeat;
  display:flex;
  align-items:center;
  justify-content:center;
}

/* glossy highlight (thin band near the blob) */
.gloss-band {
  position:absolute;
  inset:0;
  pointer-events:none;
  background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.06) 12%, rgba(255,255,255,0.02) 24%);
  mix-blend-mode: soft-light;
  filter: blur(12px) saturate(120%);
}


Notes: place the radial-gradient warm glow at a position aligned with orange blob (adjust at 70% 25% as needed).

Small UI details that sell the look

Rounded corners: border-radius: 10–16px for cards and inputs.

Soft shadows with warm tint for elements near orange area: box-shadow: 0 8px 30px rgba(255,122,43,0.08).

Use backdrop-filter: blur(8px) on translucent overlays to create a glossy, glassy feel.

Micro-interactions: subtle parallax on the background blob on mousemove (very subtle, 5–10px).

Add a very light film grain overlay (1–2% opacity) to echo the textured look in your example image.

Accessibility & contrast

Ensure body text over --bg-deep is at least 14–16px and uses --muted/--text-light with sufficient contrast.

For text placed directly on --orange, prefer --bg-shadow (dark) or bold white — test with an accessibility tool. If contrast fails, add a 0.6 semi-transparent dark overlay behind text.

Example quick HTML snippet (hero)
<section class="hero">
  <div class="gloss-band"></div>
  <div style="max-width:980px; padding:40px;" class="card">
    <h1 style="color:var(--text-light); margin:0 0 12px 0;">Product name</h1>
    <p style="color:var(--muted); font-size:18px;">Short subheading that complements the visual theme — concise and confident.</p>
    <div style="margin-top:18px;">
      <button class="btn-primary">Get started</button>
      <button class="btn-ghost" style="margin-left:12px;">Learn more</button>
    </div>
  </div>
</section>

above thing is done 
below 

it looks weird 
Repository Details at left and next to it What FrontFrEND Analyzes
undeer What FrontFrEND Analyzes there is Security & Privacy 
bottom left is blank 

and in processing page 
evrything stacked up in one line with short strip so make changes into that and allign in horizontal or think something better