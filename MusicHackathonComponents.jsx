import { useState } from "react";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* ── Figma colour variables ── */
    --purple-400:   #351033;
    --purple-300:   #ae70ab;
    --purple-200:   #ffccfd;
    --white:        #ffffff;
    --purple-400b:  #532550;
    --purple-500:   #2a0028;
    --purple-600:   #1b001a;

    /* ── Semantic aliases ── */
    --color-background-deep:      #120812;
    --color-background-panel:     #241224;
    --color-surface-input:        #1e0f1e;
    --color-accent-primary-start: #d100d1;
    --color-accent-primary-end:   #7a007a;
    --color-text-primary:         var(--white);
    --color-text-secondary:       var(--purple-300);
    --color-border-subtle:        rgba(255,255,255,0.12);
    --gradient-primary:           linear-gradient(90deg, #d100d1 0%, #7a007a 100%);

    --sp-4:  4px; --sp-8:  8px;  --sp-16: 16px; --sp-24: 24px;
    --sp-32: 32px; --sp-42: 42px; --sp-48: 48px; --sp-52: 52px;
    --sp-58: 58px; --sp-68: 68px;

    /*
     * Gradient stroke token — 90deg, white 20% → white 30%
     * Used as background on the 1px wrapper shell around each component.
     */
    --stroke-gradient: linear-gradient(90deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.30) 100%);
    --stroke-gradient-prompt: linear-gradient(90deg, rgba(174,112,171,0.40) 0%, rgba(174,112,171,0.20) 100%);
  }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--purple-400);
    color: var(--color-text-primary);
  }

  /* ────────────────────────────────────────────
     GRADIENT STROKE WRAPPER TECHNIQUE
     ─────────────────────────────────────────────
     The wrapper (.gs-wrap) is painted with the
     gradient as its background and has padding:1px.
     The inner element (.gs-inner) fills its own
     background and uses border: 1px solid transparent
     + background-clip: padding-box to block the fill
     from covering the 1px gradient edge visible
     around it. No pseudo-elements, no overflow bleed.
  ──────────────────────────────────────────────── */

  /* ── Typography ── */
  .t-label {
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
    line-height: 1.4; letter-spacing: 0.02em; color: var(--color-text-primary);
  }
  .t-small-label {
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
    line-height: 1.4; letter-spacing: 0.02em;
    color: var(--color-text-secondary); text-transform: uppercase;
  }
  .slider-wrapper .t-small-label { color: var(--purple-200); }
  .t-body {
    font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 400;
    line-height: 1.5; color: var(--color-text-primary);
  }
  .t-small-body {
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 400;
    line-height: 1.5; color: var(--color-text-primary);
  }
  .t-button {
    font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 500;
    line-height: 1; color: var(--color-text-primary); pointer-events: none;
  }

  /* ── Button gradient-stroke wrapper ──
     border-radius is 1px larger than the inner button (10px → 11px)
     so the gradient peeks through as a 1px ring, strictly inside the
     wrapper's own bounding box.
  */
  .btn-gs-wrap {
    display: inline-flex;
    border-radius: 11px;
    background: var(--stroke-gradient);
    padding: 1px;
    flex-shrink: 0;
  }

  /* ── Button base (inner) ── */
  .btn-base {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-4);
    height: 40px; /* 42px total with 1px padding top+bottom on wrapper */
    padding: 0 15px; /* 16px total with 1px padding left+right on wrapper */
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 1;
    color: var(--color-text-primary);
    transition: background 0.15s ease;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }
  .btn-base:focus-visible {
    outline: 2px solid #d100d1;
    outline-offset: 3px;
  }

  /* PRIMARY */
  .btn-primary {
    background: linear-gradient(135deg, #e70bdd 0%, var(--purple-500) 100%);
  }
  /* Hover: dark overlay above fill, below text */
  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: transparent;
    transition: background 0.15s ease;
    pointer-events: none;
  }
  .btn-primary:hover::after  { background: rgba(0,0,0,0.10); }
  /* Active: returns to initial — no separate active fill */

  /* SECONDARY */
  .btn-secondary { background: var(--purple-600); }
  .btn-secondary:hover  { background: #270022; }
  .btn-secondary:active { background: var(--purple-400); }

  /* TERTIARY — no stroke wrapper needed */
  .btn-tertiary-wrap {
    display: inline-flex;
    border-radius: 11px;
    padding: 1px;
    flex-shrink: 0;
    /* transparent wrapper — no stroke */
    background: transparent;
  }
  .btn-tertiary {
    background: transparent;
  }
  .btn-tertiary:hover  { background: var(--purple-600); }
  .btn-tertiary:active { background: transparent; }

  /* ── Slider ──
     Wrapper: gradient stroke, border-radius 41px (40 + 1)
     Inner:   purple-600 fill, border-radius 40px, overflow hidden to clip fill
  */
  .slider-wrapper {
    display: flex; flex-direction: column; gap: var(--sp-8); width: 100%;
  }
  .slider-header {
    display: flex; justify-content: space-between; align-items: center;
  }
  .slider-gs-wrap {
    border-radius: 41px;
    background: var(--stroke-gradient);
    padding: 1px;
  }
  .slider-track-outer {
    position: relative;
    height: 40px; /* 42px total with wrapper padding */
    background: var(--purple-600);
    border-radius: 40px;
    overflow: hidden;
    cursor: pointer;
  }
  .slider-fill {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    background: var(--purple-200);
    border-radius: 0;
    transition: width 0.05s linear;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 4px;
  }
  .slider-thumb {
    width: 4px; height: 24px;
    background: var(--purple-500);
    border-radius: 2px;
    flex-shrink: 0;
  }
  .slider-input {
    position: absolute; inset: 0;
    opacity: 0; cursor: pointer;
    width: 100%; height: 100%; z-index: 2;
  }

  /* ── Prompt Input ──
     Wrapper: AE70AB gradient stroke, border-radius 11px
     Inner:   animated dark purple bg, border-radius 10px
  */
  @keyframes bgShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes analysingPulse {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.55; }
  }
  .prompt-gs-wrap {
    width: 889px;
    max-width: 100%;
    border-radius: 11px;
    background: var(--stroke-gradient-prompt);
    padding: 1px;
  }
  .prompt-input-inner {
    width: 100%; height: 96px; /* 98px with wrapper */
    border-radius: 10px;
    background: linear-gradient(135deg, #260025, #3e003c, #260025);
    background-size: 200% 200%;
    animation: bgShift 4s ease infinite;
    display: flex;
    align-items: flex-start;
    padding: 15px; /* 16px with wrapper */
    gap: 8px;
  }
  .prompt-input-inner input {
    background: transparent; border: none; outline: none;
    font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 400; flex: 1;
  }
  .pi-search input            { color: var(--purple-200); }
  .pi-search input::placeholder { color: var(--purple-200); opacity: 0.8; }
  .pi-analysing input {
    color: transparent;
    background: linear-gradient(90deg, var(--purple-200) 0%, rgba(255,204,253,0.40) 100%);
    -webkit-background-clip: text; background-clip: text;
    animation: analysingPulse 1.5s ease infinite;
  }
  .pi-typing input { color: var(--white); }
  .pi-icon {
    display: flex; align-items: center;
    color: var(--purple-200); flex-shrink: 0; margin-top: 1px;
  }

  /* ── Checkbox ──
     Wrapper: gradient stroke, border-radius 5px (4 + 1)
     Inner:   purple-500 fill, border-radius 4px
  */
  .checkbox-wrap {
    display: inline-flex; align-items: center; gap: 8px;
    cursor: pointer; user-select: none;
  }
  .checkbox-gs-wrap {
    border-radius: 5px;
    background: var(--stroke-gradient);
    padding: 1px;
    flex-shrink: 0;
    transition: background 0.12s;
  }
  .checkbox-gs-wrap.checked { background: transparent; }
  .checkbox-box {
    width: 22px; height: 22px; /* 24px total with wrapper */
    border-radius: 4px;
    background: var(--purple-500);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.12s;
  }
  .checkbox-box.checked { background: var(--purple-200); }

  /* ── Layout grid ── */
  .layout-grid {
    display: grid; grid-template-columns: repeat(6, 1fr);
    gap: 20px; padding: 0 48px; width: 100%;
  }
  .layout-main    { grid-column: 1 / 5; }
  .layout-sidebar { grid-column: 5 / 7; }
  .layout-modal   { grid-column: 2 / 6; }

  /* ── Showcase chrome ── */
  .section-title {
    font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--color-text-secondary);
    margin-bottom: 20px; padding-bottom: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .demo-section { margin-bottom: 48px; }
  .demo-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 16px; }
  .demo-label {
    font-size: 11px; color: var(--color-text-secondary);
    margin-bottom: 8px; letter-spacing: 0.06em; text-transform: uppercase;
  }
  .swatch-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .swatch { width: 40px; height: 40px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); }
  .type-stack > * { margin-bottom: 8px; }
  .panel-box {
    background: var(--color-background-panel); border-radius: 12px; padding: 20px;
    border: 1px solid rgba(255,255,255,0.06); height: 120px;
  }
`;

/* ─── Typography ─── */
export const Label      = ({ children, style }) => <span className="t-label"       style={style}>{children}</span>;
export const SmallLabel = ({ children, style }) => <span className="t-small-label" style={style}>{children}</span>;
export const Body       = ({ children, style }) => <span className="t-body"        style={style}>{children}</span>;
export const SmallBody  = ({ children, style }) => <span className="t-small-body"  style={style}>{children}</span>;
export const ButtonText = ({ children, style }) => <span className="t-button"      style={style}>{children}</span>;

/* ─── Icon placeholder ─── */
const ButtonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ pointerEvents:"none" }}>
    <path d="M9 2L3 9h5l-1 5 6-7H8l1-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);

/* ─────────────────────────────────────────────
   BUTTONS
   Gradient stroke is achieved via a 1px-padding wrapper div
   painted with the gradient. The inner button clips its own
   fill with border: 1px solid transparent + background-clip:
   padding-box — so the gradient ring is always strictly inside.
───────────────────────────────────────────── */
export const PrimaryButton = ({ children, withIcon = false, disabled = false }) => (
  <div className="btn-gs-wrap">
    <button className="btn-base btn-primary" disabled={disabled}>
      {withIcon && <ButtonIcon />}
      <ButtonText>{children}</ButtonText>
    </button>
  </div>
);

export const SecondaryButton = ({ children, withIcon = false, disabled = false }) => (
  <div className="btn-gs-wrap">
    <button className="btn-base btn-secondary" disabled={disabled}>
      {withIcon && <ButtonIcon />}
      <ButtonText>{children}</ButtonText>
    </button>
  </div>
);

export const TertiaryButton = ({ children, withIcon = false, disabled = false }) => (
  <div className="btn-tertiary-wrap">
    <button className="btn-base btn-tertiary" disabled={disabled}>
      {withIcon && <ButtonIcon />}
      <ButtonText>{children}</ButtonText>
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   SLIDER
───────────────────────────────────────────── */
export const Slider = ({ label = "BUFFER", min = 0, max = 100, defaultValue = 80 }) => {
  const [value, setValue] = useState(defaultValue);
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="slider-wrapper">
      <div className="slider-header">
        <SmallLabel>{label}</SmallLabel>
        <ButtonText>{value}</ButtonText>
      </div>
      <div className="slider-gs-wrap">
        <div className="slider-track-outer">
          <div className="slider-fill" style={{ width: `${pct}%` }}>
            <div className="slider-thumb" />
          </div>
          <input
            className="slider-input"
            type="range" min={min} max={max} value={value}
            onChange={e => setValue(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PROMPT INPUT
───────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5" stroke="var(--purple-200)" strokeWidth="1.5"/>
    <path d="M12 12L15.5 15.5" stroke="var(--purple-200)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const PromptInput = ({ state = "search" }) => {
  const [value, setValue] = useState(
    state === "analysing" ? "Analysing..." : state === "typing" ? "Ma" : ""
  );
  const stateClass =
    state === "search" ? "pi-search" : state === "analysing" ? "pi-analysing" : "pi-typing";

  return (
    <div className="prompt-gs-wrap">
      <div className={`prompt-input-inner ${stateClass}`}>
        {state === "search" && <div className="pi-icon"><SearchIcon /></div>}
        <input
          type="text"
          placeholder={state === "search" ? "Search" : ""}
          value={value}
          readOnly={state === "analysing"}
          onChange={e => setValue(e.target.value)}
        />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   CHECKBOX
───────────────────────────────────────────── */
const TickIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M19.3294 6.40485C19.6565 6.73202 19.8402 7.1757 19.8402 7.63832C19.8402 8.10094 19.6565 8.54462 19.3294 8.87179L10.6061 17.595C10.279 17.9221 9.83529 18.1059 9.37267 18.1059C8.91005 18.1059 8.46637 17.9221 8.1392 17.595L4.6499 14.1057C4.3321 13.7767 4.15625 13.336 4.16022 12.8786C4.1642 12.4211 4.34768 11.9835 4.67115 11.6601C4.99463 11.3366 5.43221 11.1531 5.88965 11.1491C6.34709 11.1452 6.78779 11.321 7.11684 11.6388L9.37267 13.8946L16.8625 6.40485C17.1896 6.07778 17.6333 5.89404 18.0959 5.89404C18.5585 5.89404 19.0022 6.07778 19.3294 6.40485Z"
      fill="var(--purple-500)"
    />
  </svg>
);

export const Checkbox = ({ label = "Option", defaultChecked = false }) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label className="checkbox-wrap" onClick={() => setChecked(c => !c)}>
      <div className={`checkbox-gs-wrap ${checked ? "checked" : ""}`}>
        <div className={`checkbox-box ${checked ? "checked" : ""}`}>
          {checked && <TickIcon />}
        </div>
      </div>
      <Body>{label}</Body>
    </label>
  );
};

/* ─────────────────────────────────────────────
   SHOWCASE PAGE
───────────────────────────────────────────── */
export default function ComponentLibrary() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ padding: "48px", maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 8 }}>Music Hackathon</p>
          <h1 style={{ fontSize: 28, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 }}>Component Library</h1>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>Design system · React components · v1.0</p>
        </div>

        {/* COLOR TOKENS */}
        <div className="demo-section">
          <div className="section-title">Color Tokens — Figma Variables</div>
          <div className="swatch-row">
            {[
              ["#351033","Purple 400","--purple-400"],
              ["#ae70ab","Purple 300","--purple-300"],
              ["#ffccfd","Purple 200","--purple-200"],
              ["#ffffff","White","--white"],
              ["#532550","Purple 400b","--purple-400b"],
              ["#2a0028","Purple 500","--purple-500"],
              ["#1b001a","Purple 600","--purple-600"],
            ].map(([hex, name, token]) => (
              <div key={token} style={{ textAlign:"center", minWidth:64 }}>
                <div className="swatch" style={{ background:hex, width:48, height:48 }} title={name} />
                <div style={{ fontSize:10, fontWeight:500, color:"var(--color-text-primary)", marginTop:6 }}>{name}</div>
                <div style={{ fontSize:9, color:"var(--color-text-secondary)", marginTop:2, fontFamily:"monospace" }}>{token}</div>
                <div style={{ fontSize:9, color:"var(--color-text-secondary)", marginTop:1, fontFamily:"monospace" }}>{hex}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TYPOGRAPHY */}
        <div className="demo-section">
          <div className="section-title">Typography</div>
          <div className="type-stack">
            <div><div className="demo-label">Label — Inter 14px Medium · 2% tracking</div><Label>Label text sample — ABCDEFG 0123456789</Label></div>
            <div><div className="demo-label">Small Label — Inter 12px Medium · 2% tracking · uppercase</div><SmallLabel>SMALL LABEL — ABCDEFG 0123456789</SmallLabel></div>
            <div><div className="demo-label">Body — Inter 16px Regular</div><Body>Body text sample — The quick brown fox jumps over the lazy dog.</Body></div>
            <div><div className="demo-label">Small Body — Inter 14px Regular</div><SmallBody>Small body text sample — The quick brown fox jumps over the lazy dog.</SmallBody></div>
            <div><div className="demo-label">Button — Inter 16px Medium</div><ButtonText>Button Text Sample</ButtonText></div>
          </div>
        </div>

        {/* PRIMARY BUTTONS */}
        <div className="demo-section">
          <div className="section-title">Primary Button</div>
          <div className="demo-label">Without icon · With icon</div>
          <div className="demo-row">
            <PrimaryButton>Generate</PrimaryButton>
            <PrimaryButton withIcon>Generate</PrimaryButton>
          </div>
          <div className="demo-label" style={{ marginTop:8 }}>Hover: black 10% overlay · Active: returns to initial</div>
        </div>

        {/* SECONDARY BUTTONS */}
        <div className="demo-section">
          <div className="section-title">Secondary Button</div>
          <div className="demo-label">Without icon · With icon</div>
          <div className="demo-row">
            <SecondaryButton>Randomize</SecondaryButton>
            <SecondaryButton withIcon>Randomize</SecondaryButton>
          </div>
          <div className="demo-label" style={{ marginTop:8 }}>Hover: #270022 · Active: --purple-400</div>
        </div>

        {/* TERTIARY BUTTONS */}
        <div className="demo-section">
          <div className="section-title">Tertiary Button</div>
          <div className="demo-label">Without icon · With icon</div>
          <div className="demo-row">
            <TertiaryButton>Library settings</TertiaryButton>
            <TertiaryButton withIcon>Library settings</TertiaryButton>
          </div>
        </div>

        {/* SLIDER */}
        <div className="demo-section">
          <div className="section-title">Slider</div>
          <div className="demo-label">Track: 40px radius · Fill: no radius · Thumb: 4×24px · Label: --purple-200</div>
          <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:480 }}>
            <Slider label="BUFFER"     defaultValue={80} />
            <Slider label="TRANSITION" defaultValue={45} />
            <Slider label="GAP"        defaultValue={20} />
          </div>
        </div>

        {/* PROMPT INPUT */}
        <div className="demo-section">
          <div className="section-title">Prompt Input</div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div><div className="demo-label">Search — purple-200 text + icon</div><PromptInput state="search" /></div>
            <div><div className="demo-label">Analysing — gradient text, animated pulse</div><PromptInput state="analysing" /></div>
            <div><div className="demo-label">Typing — white text</div><PromptInput state="typing" /></div>
          </div>
        </div>

        {/* CHECKBOX */}
        <div className="demo-section">
          <div className="section-title">Checkbox</div>
          <div className="demo-label">Unchecked: purple-500 fill + gradient stroke · Checked: purple-200 fill, no stroke</div>
          <div className="demo-row">
            <Checkbox label="Version A" defaultChecked={false} />
            <Checkbox label="Version B" defaultChecked={true}  />
            <Checkbox label="Version C" defaultChecked={false} />
          </div>
        </div>

        {/* LAYOUT */}
        <div className="demo-section">
          <div className="section-title">Layout Grid — 6 Columns · 20px Gutter · 48px Margin</div>
          <div className="demo-label">Regular: 4-col main + 2-col sidebar</div>
          <div className="layout-grid" style={{ marginBottom:20 }}>
            <div className="layout-main panel-box" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              <SmallLabel>Main workspace · cols 1–4</SmallLabel>
            </div>
            <div className="layout-sidebar panel-box" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              <SmallLabel>Sidebar · cols 5–6</SmallLabel>
            </div>
          </div>
          <div className="demo-label" style={{ marginTop:16 }}>Modal: 4-col centred (cols 2–5)</div>
          <div className="layout-grid">
            <div className="layout-modal panel-box" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              <SmallLabel>Modal · cols 2–5 · centred</SmallLabel>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
