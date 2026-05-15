export default function IronManPage() {
  return (
    <main className="ironman-page">
      <div className="scanline" />
      <div className="stars" />

      {/* HUD corner brackets */}
      <div className="hud-corner tl" />
      <div className="hud-corner tr" />
      <div className="hud-corner bl" />
      <div className="hud-corner br" />

      {/* HUD data strips */}
      <div className="hud-data hud-data-left">
        <span>SYS.ONLINE</span>
        <span>POWER ████ 98%</span>
        <span>ALTITUDE — 0m</span>
        <span>JARVIS v9.1</span>
      </div>
      <div className="hud-data hud-data-right">
        <span>STARK INDUSTRIES</span>
        <span>MARK L · NANO</span>
        <span>THREAT LVL ░░░░ 0</span>
        <span>LOCATION CLASSIFIED</span>
      </div>

      {/* MASK */}
      <div className="mask-wrap">
        <svg
          className="mask-svg"
          viewBox="0 0 400 460"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gold gradient */}
            <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="40%" stopColor="#FFA500" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
            {/* Red gradient */}
            <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CC0000" />
              <stop offset="50%" stopColor="#FF1111" />
              <stop offset="100%" stopColor="#880000" />
            </linearGradient>
            {/* Eye glow */}
            <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="40%" stopColor="#AAEEFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00BFFF" stopOpacity="0" />
            </radialGradient>
            {/* Arc reactor glow */}
            <radialGradient id="arcGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#00EEFF" />
              <stop offset="70%" stopColor="#0066FF" />
              <stop offset="100%" stopColor="#003399" stopOpacity="0.2" />
            </radialGradient>
            {/* Filter: outer glow */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="eyeFilter" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="arcFilter" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="maskClip">
              <path d="M200,10 L360,70 L390,160 L390,270 L340,380 L280,440 L200,455 L120,440 L60,380 L10,270 L10,160 L40,70 Z" />
            </clipPath>
          </defs>

          {/* ── BASE PLATE ── */}
          <path
            d="M200,10 L360,70 L390,160 L390,270 L340,380 L280,440 L200,455 L120,440 L60,380 L10,270 L10,160 L40,70 Z"
            fill="url(#redGrad)"
            stroke="#8B0000"
            strokeWidth="2"
          />

          {/* ── FOREHEAD GOLD PLATE ── */}
          <path
            d="M140,10 L200,10 L260,10 L300,55 L200,62 L100,55 Z"
            fill="url(#gold)"
            stroke="#8B6914"
            strokeWidth="1.5"
          />

          {/* ── CHEEK PLATES (gold) ── */}
          <path d="M10,160 L60,140 L80,200 L60,260 L10,270 Z" fill="url(#gold)" stroke="#8B6914" strokeWidth="1" />
          <path d="M390,160 L340,140 L320,200 L340,260 L390,270 Z" fill="url(#gold)" stroke="#8B6914" strokeWidth="1" />

          {/* ── JAW GOLD BANDS ── */}
          <path d="M60,380 L120,360 L200,370 L280,360 L340,380 L280,440 L200,455 L120,440 Z"
            fill="url(#gold)" stroke="#8B6914" strokeWidth="1.5" />

          {/* ── NOSE RIDGE ── */}
          <path d="M190,140 L200,130 L210,140 L215,240 L200,260 L185,240 Z"
            fill="#AA0000" stroke="#660000" strokeWidth="1" />

          {/* ── CENTER CREASE lines ── */}
          <line x1="200" y1="62" x2="200" y2="370" stroke="#880000" strokeWidth="1.5" strokeDasharray="4,6" opacity="0.5" />

          {/* ── PANEL LINES ── */}
          <path d="M80,200 L120,180 L160,190 L185,240" fill="none" stroke="#880000" strokeWidth="1.2" opacity="0.7" />
          <path d="M320,200 L280,180 L240,190 L215,240" fill="none" stroke="#880000" strokeWidth="1.2" opacity="0.7" />
          <path d="M60,140 L100,120 L140,128 L160,190" fill="none" stroke="#8B6914" strokeWidth="1" opacity="0.6" />
          <path d="M340,140 L300,120 L260,128 L240,190" fill="none" stroke="#8B6914" strokeWidth="1" opacity="0.6" />

          {/* ── EYE SOCKETS (dark) ── */}
          <path d="M80,175 L140,158 L178,168 L180,220 L155,238 L90,230 L72,210 Z"
            fill="#111111" stroke="#333" strokeWidth="1" />
          <path d="M320,175 L260,158 L222,168 L220,220 L245,238 L310,230 L328,210 Z"
            fill="#111111" stroke="#333" strokeWidth="1" />

          {/* ── EYES glow ── */}
          <path
            className="eye-glow"
            d="M84,178 L138,162 L175,171 L177,217 L154,234 L93,226 L76,208 Z"
            fill="url(#eyeGlow)"
            filter="url(#eyeFilter)"
          />
          <path
            className="eye-glow"
            d="M316,178 L262,162 L225,171 L223,217 L246,234 L307,226 L324,208 Z"
            fill="url(#eyeGlow)"
            filter="url(#eyeFilter)"
          />

          {/* ── EYE inner white ── */}
          <path d="M90,182 L135,168 L170,176 L172,213 L152,228 L96,221 L82,206 Z"
            fill="white" opacity="0.95" />
          <path d="M310,182 L265,168 L230,176 L228,213 L248,228 L304,221 L318,206 Z"
            fill="white" opacity="0.95" />

          {/* ── ARC REACTOR (chest center — positioned low on mask as emblem) ── */}
          <circle cx="200" cy="310" r="28" fill="#001133" stroke="#0044AA" strokeWidth="2" filter="url(#arcFilter)" />
          <circle cx="200" cy="310" r="22" fill="url(#arcGlow)" filter="url(#arcFilter)" className="arc-pulse" />
          {/* Arc spokes */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line
              key={angle}
              x1={200 + 10 * Math.cos((angle * Math.PI) / 180)}
              y1={310 + 10 * Math.sin((angle * Math.PI) / 180)}
              x2={200 + 20 * Math.cos((angle * Math.PI) / 180)}
              y2={310 + 20 * Math.sin((angle * Math.PI) / 180)}
              stroke="#00EEFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
          <circle cx="200" cy="310" r="8" fill="white" className="arc-core" />

          {/* ── EDGE HIGHLIGHT ── */}
          <path
            d="M200,10 L360,70 L390,160 L390,270 L340,380 L280,440 L200,455 L120,440 L60,380 L10,270 L10,160 L40,70 Z"
            fill="none"
            stroke="url(#gold)"
            strokeWidth="3"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* TEXT */}
      <div className="text-wrap">
        <p className="subtitle">TONY STARK · MARK L</p>
        <h1 className="headline">
          <span className="i-am">I AM</span>
          <span className="iron-man">IRON MAN</span>
        </h1>
        <div className="arc-bar">
          <span className="arc-dot" />
          <span className="arc-line" />
          <span className="arc-dot" />
        </div>
        <p className="quote">"I told you I don't want to join your super-secret boy band."</p>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ironman-page {
          min-height: 100vh;
          background: radial-gradient(ellipse at 50% 30%, #1a0a00 0%, #0a0000 50%, #000000 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Courier New', monospace;
          overflow: hidden;
          position: relative;
          gap: 2rem;
          padding: 2rem;
        }

        /* Scanline overlay */
        .scanline {
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.08) 2px,
            rgba(0,0,0,0.08) 4px
          );
          pointer-events: none;
          z-index: 10;
        }

        /* Stars */
        .stars {
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(1px 1px at 10% 15%, rgba(255,200,0,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 25% 40%, rgba(255,200,0,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 20%, rgba(255,100,0,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 85% 60%, rgba(200,50,0,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 45% 80%, rgba(255,200,0,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 10%, rgba(255,200,0,0.5) 0%, transparent 100%);
          pointer-events: none;
        }

        /* HUD corners */
        .hud-corner {
          position: fixed;
          width: 40px;
          height: 40px;
          border-color: rgba(255, 165, 0, 0.5);
          border-style: solid;
          pointer-events: none;
          z-index: 5;
        }
        .hud-corner.tl { top: 16px; left: 16px; border-width: 2px 0 0 2px; }
        .hud-corner.tr { top: 16px; right: 16px; border-width: 2px 2px 0 0; }
        .hud-corner.bl { bottom: 16px; left: 16px; border-width: 0 0 2px 2px; }
        .hud-corner.br { bottom: 16px; right: 16px; border-width: 0 2px 2px 0; }

        /* HUD data text */
        .hud-data {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          color: rgba(255, 165, 0, 0.45);
          text-transform: uppercase;
          pointer-events: none;
          z-index: 5;
        }
        .hud-data-left { left: 16px; align-items: flex-start; }
        .hud-data-right { right: 16px; align-items: flex-end; }

        /* MASK */
        .mask-wrap {
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 0 40px rgba(255, 50, 0, 0.6)) drop-shadow(0 0 80px rgba(200, 0, 0, 0.4));
          animation: mask-float 4s ease-in-out infinite;
        }
        .mask-svg {
          width: 260px;
          height: auto;
        }

        @keyframes mask-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }

        /* Eye animation */
        .eye-glow {
          animation: eye-blink 3s ease-in-out infinite;
        }
        @keyframes eye-blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0.1; }
        }

        /* Arc reactor pulse */
        .arc-pulse {
          animation: arc-spin 2s linear infinite, arc-glow 1.5s ease-in-out infinite alternate;
          transform-origin: 200px 310px;
        }
        @keyframes arc-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes arc-glow {
          from { opacity: 0.8; }
          to { opacity: 1; filter: brightness(1.4); }
        }

        .arc-core {
          animation: core-pulse 1.5s ease-in-out infinite alternate;
        }
        @keyframes core-pulse {
          from { opacity: 0.7; r: 8; }
          to { opacity: 1; r: 10; filter: brightness(2); }
        }

        /* TEXT */
        .text-wrap {
          position: relative;
          z-index: 2;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
        }

        .subtitle {
          font-size: 0.65rem;
          letter-spacing: 0.35em;
          color: rgba(255, 165, 0, 0.6);
          text-transform: uppercase;
        }

        .headline {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.1rem;
          line-height: 1;
        }

        .i-am {
          font-size: clamp(1.4rem, 4vw, 2.2rem);
          font-weight: 300;
          letter-spacing: 0.6em;
          color: rgba(255, 200, 80, 0.85);
          text-transform: uppercase;
        }

        .iron-man {
          font-size: clamp(3rem, 10vw, 6rem);
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #FFD700 0%, #FF6600 40%, #CC0000 70%, #FFD700 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gold-shimmer 3s linear infinite;
          text-shadow: none;
          filter: drop-shadow(0 0 20px rgba(255, 100, 0, 0.8));
        }

        @keyframes gold-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .arc-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.4rem 0;
        }
        .arc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00EEFF;
          box-shadow: 0 0 8px #00EEFF;
          animation: dot-pulse 1.5s ease-in-out infinite alternate;
        }
        .arc-line {
          width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #FF6600, rgba(255,165,0,0.8), #FF6600, transparent);
          animation: line-glow 2s ease-in-out infinite alternate;
        }
        @keyframes dot-pulse {
          from { opacity: 0.5; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1.2); box-shadow: 0 0 14px #00EEFF; }
        }
        @keyframes line-glow {
          from { opacity: 0.5; }
          to { opacity: 1; box-shadow: 0 0 6px rgba(255,165,0,0.6); }
        }

        .quote {
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          color: rgba(255, 165, 0, 0.4);
          font-style: italic;
          max-width: 360px;
        }

        @media (max-width: 480px) {
          .hud-data { display: none; }
          .mask-svg { width: 200px; }
        }
      `}</style>
    </main>
  );
}
