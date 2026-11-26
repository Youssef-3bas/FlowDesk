import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "src", "assets", "source");
const SOURCE_IMAGE = path.join(SOURCE_DIR, "hero-app.png");
const OUTPUT_DIR = path.join(ROOT, "public", "images");
const WIDTHS = [640, 1024, 1440];

function buildWorkspaceSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="bg-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#eef2ff" />
    </linearGradient>
    <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="112%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Outer subtle backdrop -->
  <rect width="1600" height="1000" fill="url(#bg-grad)" />

  <!-- App Window -->
  <g filter="url(#card-shadow)">
    <rect x="44" y="40" width="1512" height="920" rx="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
  </g>

  <!-- Window Top Bar -->
  <path d="M44 62 C44 49.8 53.8 40 66 40 H1534 C1546.2 40 1556 49.8 1556 62 V102 H44 Z" fill="#f8fafc" />
  <line x1="44" y1="102" x2="1556" y2="102" stroke="#e2e8f0" stroke-width="1.5" />
  <circle cx="80" cy="71" r="7" fill="#fca5a5" />
  <circle cx="104" cy="71" r="7" fill="#fcd34d" />
  <circle cx="128" cy="71" r="7" fill="#86efac" />
  <rect x="590" y="55" width="420" height="32" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
  <text x="800" y="76" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="14" fill="#64748b">app.flowdesk.io/workspace/today</text>

  <!-- Left Sidebar -->
  <rect x="45" y="103" width="290" height="856" fill="#f8fafc" />
  <line x1="335" y1="102" x2="335" y2="960" stroke="#e2e8f0" stroke-width="1.5" />

  <!-- Sidebar Brand -->
  <rect x="76" y="132" width="34" height="34" rx="9" fill="#4f46e5" />
  <rect x="84" y="140" width="18" height="4.5" rx="2.25" fill="#ffffff" />
  <rect x="84" y="147.5" width="13" height="4.5" rx="2.25" fill="#c7d2fe" />
  <rect x="84" y="155" width="8" height="4" rx="2" fill="#e0e7ff" />
  <text x="124" y="156" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" font-weight="700" fill="#0f172a">Flowdesk</text>

  <!-- Sidebar Search -->
  <rect x="76" y="190" width="228" height="40" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
  <text x="96" y="215" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="15" fill="#94a3b8">Quick search...  Ctrl K</text>

  <!-- Sidebar Nav Items -->
  <rect x="72" y="254" width="236" height="44" rx="10" fill="#eef2ff" />
  <circle cx="98" cy="276" r="5" fill="#4f46e5" />
  <text x="116" y="282" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="16" font-weight="600" fill="#4338ca">Today</text>
  <rect x="268" y="264" width="26" height="24" rx="12" fill="#4f46e5" />
  <text x="281" y="281" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" fill="#ffffff">5</text>

  <circle cx="98" cy="328" r="5" fill="#94a3b8" />
  <text x="116" y="334" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="16" fill="#475569">Inbox</text>

  <circle cx="98" cy="378" r="5" fill="#94a3b8" />
  <text x="116" y="384" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="16" fill="#475569">Weekly Plan</text>

  <circle cx="98" cy="428" r="5" fill="#94a3b8" />
  <text x="116" y="434" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="16" fill="#475569">Project Notes</text>

  <circle cx="98" cy="478" r="5" fill="#94a3b8" />
  <text x="116" y="484" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="16" fill="#475569">Shipped Log</text>

  <!-- Sidebar Projects -->
  <text x="76" y="556" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="700" letter-spacing="1.2" fill="#64748b">WORKSPACES</text>
  <rect x="76" y="582" width="12" height="12" rx="4" fill="#4f46e5" />
  <text x="102" y="593" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="15" font-weight="500" fill="#334155">Q4 Product Launch</text>

  <rect x="76" y="624" width="12" height="12" rx="4" fill="#0ea5e9" />
  <text x="102" y="635" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="15" font-weight="500" fill="#334155">Design System</text>

  <rect x="76" y="666" width="12" height="12" rx="4" fill="#10b981" />
  <text x="102" y="677" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="15" font-weight="500" fill="#334155">Customer Docs</text>

  <!-- Sidebar Focus Summary Card -->
  <rect x="72" y="796" width="236" height="124" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
  <text x="92" y="828" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="14" font-weight="600" fill="#0f172a">Weekly focus goal</text>
  <text x="92" y="854" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" fill="#64748b">14 of 18 tasks shipped</text>
  <rect x="92" y="874" width="196" height="10" rx="5" fill="#e2e8f0" />
  <rect x="92" y="874" width="152" height="10" rx="5" fill="#4f46e5" />
  <text x="92" y="906" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="12" font-weight="600" fill="#4f46e5">78% on track</text>

  <!-- Main Workspace Header -->
  <text x="384" y="164" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="32" font-weight="700" fill="#0f172a">Today — Q4 Product Launch</text>
  <text x="384" y="196" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="16" fill="#64748b">Thursday, Nov 26  ·  5 priorities  ·  3 linked notes</text>

  <rect x="1352" y="136" width="156" height="46" rx="12" fill="#4f46e5" />
  <text x="1430" y="165" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="15" font-weight="600" fill="#ffffff">+ New task</text>

  <!-- KPI Row -->
  <rect x="384" y="232" width="356" height="106" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
  <text x="410" y="266" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="14" font-weight="600" fill="#64748b">FOCUS TIME TODAY</text>
  <text x="410" y="310" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="34" font-weight="700" fill="#0f172a">3h 40m</text>
  <rect x="574" y="284" width="140" height="28" rx="14" fill="#dcfce7" />
  <text x="644" y="303" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" fill="#15803d">+25% vs avg</text>

  <rect x="764" y="232" width="356" height="106" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
  <text x="790" y="266" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="14" font-weight="600" fill="#64748b">COMPLETED THIS WEEK</text>
  <text x="790" y="310" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="34" font-weight="700" fill="#0f172a">14 / 18</text>
  <rect x="976" y="284" width="118" height="28" rx="14" fill="#eef2ff" />
  <text x="1035" y="303" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" fill="#4338ca">On schedule</text>

  <rect x="1144" y="232" width="364" height="106" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
  <text x="1170" y="266" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="14" font-weight="600" fill="#64748b">TEAM NOTES UPDATED</text>
  <text x="1170" y="310" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="34" font-weight="700" fill="#0f172a">9 docs</text>
  <text x="1320" y="303" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="14" fill="#64748b">Synced 2m ago</text>

  <!-- Task List Card (Left Column) -->
  <rect x="384" y="366" width="668" height="552" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
  <text x="414" y="410" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="20" font-weight="700" fill="#0f172a">Priority Tasks</text>
  <text x="954" y="410" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="14" font-weight="600" fill="#4f46e5">Sort: Impact</text>
  <line x1="414" y1="430" x2="1022" y2="430" stroke="#f1f5f9" stroke-width="1.5" />

  <!-- Task 1 (Checked) -->
  <rect x="414" y="452" width="24" height="24" rx="7" fill="#4f46e5" />
  <path d="M420 464 L424.5 468.5 L432 459.5" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <text x="454" y="469" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="17" fill="#94a3b8" text-decoration="line-through">Finalize hero messaging &amp; onboarding flow</text>
  <rect x="936" y="450" width="86" height="28" rx="14" fill="#f1f5f9" />
  <text x="979" y="469" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" fill="#64748b">Done</text>
  <line x1="414" y1="502" x2="1022" y2="502" stroke="#f1f5f9" stroke-width="1.5" />

  <!-- Task 2 (Active Highlight) -->
  <rect x="400" y="514" width="636" height="76" rx="12" fill="#eef2ff" />
  <rect x="414" y="540" width="24" height="24" rx="7" fill="#ffffff" stroke="#4f46e5" stroke-width="2.5" />
  <text x="454" y="551" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="17" font-weight="600" fill="#0f172a">Review mobile-first layout across breakpoints</text>
  <text x="454" y="575" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="14" fill="#4338ca">Linked note: Release Checklist  ·  Due 2:00 PM</text>
  <rect x="926" y="538" width="96" height="28" rx="14" fill="#4f46e5" />
  <text x="974" y="557" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" fill="#ffffff">In Focus</text>

  <!-- Task 3 -->
  <rect x="414" y="616" width="24" height="24" rx="7" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
  <text x="454" y="633" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="17" font-weight="500" fill="#1e293b">Publish v2.4 release notes to workspace</text>
  <rect x="924" y="614" width="98" height="28" rx="14" fill="#fef3c7" />
  <text x="973" y="633" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" fill="#b45309">High</text>
  <line x1="414" y1="666" x2="1022" y2="666" stroke="#f1f5f9" stroke-width="1.5" />

  <!-- Task 4 -->
  <rect x="414" y="692" width="24" height="24" rx="7" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
  <text x="454" y="709" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="17" font-weight="500" fill="#1e293b">Verify keyboard focus &amp; contrast ratios</text>
  <rect x="924" y="690" width="98" height="28" rx="14" fill="#e0f2fe" />
  <text x="973" y="709" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" fill="#0369a1">QA</text>
  <line x1="414" y1="742" x2="1022" y2="742" stroke="#f1f5f9" stroke-width="1.5" />

  <!-- Task 5 -->
  <rect x="414" y="768" width="24" height="24" rx="7" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
  <text x="454" y="785" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="17" font-weight="500" fill="#1e293b">Share launch retro doc with design team</text>
  <rect x="924" y="766" width="98" height="28" rx="14" fill="#f1f5f9" />
  <text x="973" y="785" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" fill="#475569">4:30 PM</text>
  <line x1="414" y1="818" x2="1022" y2="818" stroke="#f1f5f9" stroke-width="1.5" />

  <!-- Task 6 -->
  <rect x="414" y="844" width="24" height="24" rx="7" fill="#4f46e5" />
  <path d="M420 856 L424.5 860.5 L432 851.5" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <text x="454" y="861" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="17" fill="#94a3b8" text-decoration="line-through">Compress launch images to AVIF &amp; WebP</text>
  <rect x="936" y="842" width="86" height="28" rx="14" fill="#f1f5f9" />
  <text x="979" y="861" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" fill="#64748b">Done</text>

  <!-- Right Column: Linked Note + Velocity Card -->
  <rect x="1080" y="366" width="428" height="316" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
  <text x="1108" y="408" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="19" font-weight="700" fill="#0f172a">Release Checklist Note</text>
  <text x="1108" y="434" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="14" fill="#64748b">Updated by Maya Lin · Shared with team</text>
  <line x1="1108" y1="452" x2="1480" y2="452" stroke="#f1f5f9" stroke-width="1.5" />

  <circle cx="1116" cy="484" r="4" fill="#4f46e5" />
  <text x="1132" y="490" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="15" fill="#334155">Keep copy concise and scannable</text>

  <circle cx="1116" cy="524" r="4" fill="#4f46e5" />
  <text x="1132" y="530" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="15" fill="#334155">Zero layout shift on mobile 4G</text>

  <circle cx="1116" cy="564" r="4" fill="#4f46e5" />
  <text x="1132" y="570" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="15" fill="#334155">All interactive elements 44x44 px+</text>

  <rect x="1108" y="604" width="372" height="52" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
  <text x="1126" y="635" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="14" font-weight="500" fill="#475569">"Ship calm software teams love opening."</text>

  <!-- Velocity Mini Chart Card -->
  <rect x="1080" y="706" width="428" height="212" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
  <text x="1108" y="746" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="18" font-weight="700" fill="#0f172a">Weekly Shipped Velocity</text>
  <rect x="1120" y="828" width="38" height="56" rx="8" fill="#e0e7ff" />
  <rect x="1178" y="802" width="38" height="82" rx="8" fill="#c7d2fe" />
  <rect x="1236" y="814" width="38" height="70" rx="8" fill="#c7d2fe" />
  <rect x="1294" y="778" width="38" height="106" rx="8" fill="#818cf8" />
  <rect x="1352" y="762" width="38" height="122" rx="8" fill="#4f46e5" />
  <rect x="1410" y="794" width="38" height="90" rx="8" fill="#e0e7ff" />
  <text x="1139" y="904" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">M</text>
  <text x="1197" y="904" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">T</text>
  <text x="1255" y="904" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">W</text>
  <text x="1313" y="904" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">T</text>
  <text x="1371" y="904" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#4f46e5">F</text>
  <text x="1429" y="904" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">S</text>
</svg>`;
}

function buildOgSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="og-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#eef2ff" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#og-bg)" />
  <rect x="88" y="110" width="56" height="56" rx="14" fill="#4f46e5" />
  <rect x="102" y="124" width="28" height="7" rx="3.5" fill="#ffffff" />
  <rect x="102" y="135" width="20" height="7" rx="3.5" fill="#c7d2fe" />
  <rect x="102" y="146" width="12" height="6" rx="3" fill="#e0e7ff" />
  <text x="164" y="150" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="36" font-weight="700" fill="#0f172a">Flowdesk</text>
  <text x="88" y="270" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="58" font-weight="800" fill="#0f172a">Plan, write, and ship —</text>
  <text x="88" y="344" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="58" font-weight="800" fill="#4f46e5">all in one calm workspace.</text>
  <text x="88" y="424" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="26" fill="#475569">Tasks, linked project notes, and weekly focus without the clutter.</text>
  <rect x="88" y="484" width="248" height="58" rx="14" fill="#4f46e5" />
  <text x="212" y="522" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" font-weight="600" fill="#ffffff">Get started free</text>
</svg>`;
}

async function run() {
  await mkdir(SOURCE_DIR, { recursive: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  const forceRegenerate = process.argv.includes("--regenerate-source");
  if (!existsSync(SOURCE_IMAGE) || forceRegenerate) {
    const svgBuffer = Buffer.from(buildWorkspaceSvg());
    await sharp(svgBuffer, { density: 144 })
      .resize(1600, 1000)
      .png({ compressionLevel: 9 })
      .toFile(SOURCE_IMAGE);
    console.log("Generated source screenshot:", SOURCE_IMAGE);
  }

  for (const width of WIDTHS) {
    const base = sharp(SOURCE_IMAGE).resize({ width });
    await base
      .clone()
      .avif({ quality: 58, effort: 6 })
      .toFile(path.join(OUTPUT_DIR, `hero-app-${width}.avif`));
    await base
      .clone()
      .webp({ quality: 82, effort: 6 })
      .toFile(path.join(OUTPUT_DIR, `hero-app-${width}.webp`));
  }

  await sharp(Buffer.from(buildOgSvg()))
    .resize(1200, 630)
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(OUTPUT_DIR, "og-image.jpg"));

  console.log("Optimized images written to:", OUTPUT_DIR);
}

run().catch((error) => {
  console.error("Image optimization failed:", error);
  process.exit(1);
});
