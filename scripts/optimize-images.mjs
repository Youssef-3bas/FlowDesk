import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "src", "assets", "source");
const OUTPUT_DIR = path.join(ROOT, "public", "images");
const PHONE_SOURCE = path.join(SOURCE_DIR, "hero-phone.png");
const PHONE_WIDTHS = [420, 840];

function buildDarkPhoneAppSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="1740" viewBox="0 0 840 1740">
  <defs>
    <linearGradient id="screen-bg" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#0b0b14" />
      <stop offset="45%" stop-color="#08080f" />
      <stop offset="100%" stop-color="#05050a" />
    </linearGradient>
    <radialGradient id="top-aura" cx="50%" cy="12%" r="55%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.34" />
      <stop offset="55%" stop-color="#7c3aed" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#05050a" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="accent-card" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.32" />
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.14" />
    </linearGradient>
    <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>
  </defs>

  <!-- Screen background -->
  <rect width="840" height="1740" fill="url(#screen-bg)" />
  <rect width="840" height="820" fill="url(#top-aura)" />

  <!-- Status bar -->
  <text x="64" y="88" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="28" font-weight="600" fill="#f8fafc">9:41</text>
  <!-- Dynamic Island -->
  <rect x="300" y="52" width="240" height="54" rx="27" fill="#000000" />
  <circle cx="496" cy="79" r="10" fill="#181826" />
  <circle cx="496" cy="79" r="4" fill="#312e81" />
  <!-- Signal + Battery -->
  <rect x="720" y="68" width="54" height="24" rx="7" fill="none" stroke="#cbd5e1" stroke-width="3" />
  <rect x="725" y="73" width="38" height="14" rx="3" fill="#f8fafc" />
  <rect x="778" y="75" width="5" height="10" rx="2" fill="#cbd5e1" />

  <!-- App Header -->
  <rect x="52" y="156" width="56" height="56" rx="16" fill="#4f46e5" />
  <rect x="66" y="170" width="28" height="7" rx="3.5" fill="#ffffff" />
  <rect x="66" y="182" width="20" height="7" rx="3.5" fill="#c7d2fe" />
  <rect x="66" y="194" width="12" height="6" rx="3" fill="#e0e7ff" />
  <text x="128" y="182" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" font-weight="600" fill="#a5b4fc" letter-spacing="1.5">TODAY FOCUS</text>
  <text x="128" y="216" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="36" font-weight="700" fill="#ffffff">Q4 Launch Sprint</text>

  <!-- Focus Score Hero Card -->
  <rect x="52" y="264" width="736" height="232" rx="32" fill="url(#accent-card)" stroke="#818cf8" stroke-opacity="0.35" stroke-width="2" />
  <text x="92" y="320" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" font-weight="600" fill="#c7d2fe">DEEP WORK SESSION</text>
  <text x="92" y="388" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="60" font-weight="700" fill="#ffffff">3h 40m</text>
  <rect x="348" y="346" width="184" height="44" rx="22" fill="#10b981" fill-opacity="0.2" stroke="#34d399" stroke-opacity="0.45" stroke-width="1.5" />
  <text x="440" y="375" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" font-weight="600" fill="#6ee7b7">+28% focus</text>
  <text x="92" y="438" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="23" fill="#cbd5e1">14 of 18 weekly tasks shipped</text>
  <rect x="92" y="458" width="656" height="14" rx="7" fill="#ffffff" fill-opacity="0.12" />
  <rect x="92" y="458" width="510" height="14" rx="7" fill="url(#bar-grad)" />

  <!-- Section label -->
  <text x="56" y="564" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" font-weight="700" letter-spacing="1.6" fill="#94a3b8">TOP THREE PRIORITIES</text>

  <!-- Priority Card 1 (Active) -->
  <rect x="52" y="592" width="736" height="156" rx="28" fill="#141422" stroke="#6366f1" stroke-opacity="0.55" stroke-width="2" />
  <rect x="86" y="644" width="44" height="44" rx="14" fill="#4f46e5" fill-opacity="0.25" stroke="#818cf8" stroke-width="3" />
  <circle cx="108" cy="666" r="8" fill="#a5b4fc" />
  <text x="154" y="656" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="28" font-weight="600" fill="#ffffff">Ship launch landing page</text>
  <text x="154" y="698" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" fill="#a5b4fc">Linked note: Release Checklist</text>
  <rect x="614" y="644" width="142" height="44" rx="22" fill="#4f46e5" />
  <text x="685" y="673" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="21" font-weight="600" fill="#ffffff">In Focus</text>

  <!-- Priority Card 2 -->
  <rect x="52" y="772" width="736" height="136" rx="28" fill="#10101b" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2" />
  <rect x="86" y="818" width="44" height="44" rx="14" fill="#1e1b4b" stroke="#4f46e5" stroke-width="2.5" />
  <path d="M97 840 L105 848 L119 832" stroke="#a5b4fc" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <text x="154" y="834" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="27" font-weight="500" fill="#94a3b8" text-decoration="line-through">Finalize onboarding notes</text>
  <text x="154" y="872" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="21" fill="#64748b">Completed 11:15 AM</text>

  <!-- Priority Card 3 -->
  <rect x="52" y="932" width="736" height="136" rx="28" fill="#10101b" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2" />
  <rect x="86" y="978" width="44" height="44" rx="14" fill="none" stroke="#475569" stroke-width="3" />
  <text x="154" y="994" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="27" font-weight="500" fill="#f1f5f9">Publish Friday team digest</text>
  <text x="154" y="1032" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="21" fill="#94a3b8">Auto drafts at 4:00 PM</text>

  <!-- Linked Note Card -->
  <rect x="52" y="1104" width="736" height="252" rx="30" fill="#10101b" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2" />
  <text x="88" y="1160" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="25" font-weight="700" fill="#ffffff">Release Checklist Note</text>
  <text x="88" y="1196" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="20" fill="#94a3b8">Synced with Maya Lin · 2m ago</text>
  <circle cx="96" cy="1244" r="6" fill="#818cf8" />
  <text x="118" y="1252" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" fill="#e2e8f0">Keep weekly sync under 35 minutes</text>
  <circle cx="96" cy="1296" r="6" fill="#818cf8" />
  <text x="118" y="1304" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" fill="#e2e8f0">Export sprint summary to workspace</text>

  <!-- Velocity Card -->
  <rect x="52" y="1384" width="736" height="224" rx="30" fill="#10101b" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2" />
  <text x="88" y="1438" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="24" font-weight="700" fill="#ffffff">Weekly Shipped Velocity</text>
  <text x="656" y="1438" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" font-weight="600" fill="#818cf8">99.4% on time</text>
  <rect x="96" y="1518" width="66" height="62" rx="14" fill="#312e81" />
  <rect x="196" y="1494" width="66" height="86" rx="14" fill="#3730a3" />
  <rect x="296" y="1506" width="66" height="74" rx="14" fill="#4338ca" />
  <rect x="396" y="1474" width="66" height="106" rx="14" fill="#4f46e5" />
  <rect x="496" y="1456" width="66" height="124" rx="14" fill="url(#bar-grad)" />
  <rect x="596" y="1484" width="66" height="96" rx="14" fill="#4338ca" />
  <rect x="696" y="1510" width="52" height="70" rx="14" fill="#312e81" />

  <!-- Home Indicator -->
  <rect x="290" y="1696" width="260" height="10" rx="5" fill="#ffffff" fill-opacity="0.35" />
</svg>`;
}

function buildDarkOgSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="og-orb" cx="72%" cy="48%" r="48%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.55" />
      <stop offset="45%" stop-color="#7c3aed" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#050508" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#050508" />
  <rect width="1200" height="630" fill="url(#og-orb)" />
  <rect x="88" y="106" width="56" height="56" rx="14" fill="#4f46e5" />
  <rect x="102" y="120" width="28" height="7" rx="3.5" fill="#ffffff" />
  <rect x="102" y="131" width="20" height="7" rx="3.5" fill="#c7d2fe" />
  <rect x="102" y="142" width="12" height="6" rx="3" fill="#e0e7ff" />
  <text x="164" y="146" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="36" font-weight="700" fill="#ffffff">Flowdesk</text>
  <text x="88" y="268" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="58" font-weight="700" fill="#ffffff">Plan your week and ship</text>
  <text x="88" y="340" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="58" font-weight="700" fill="#a5b4fc">without tab chaos.</text>
  <text x="88" y="418" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="25" fill="#cbd5e1">Daily priorities and linked project notes in one calm workspace.</text>
  <rect x="88" y="480" width="290" height="58" rx="14" fill="#ffffff" />
  <text x="233" y="518" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" font-weight="600" fill="#09090b">Start free workspace</text>
</svg>`;
}

async function run() {
  await mkdir(SOURCE_DIR, { recursive: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  await sharp(Buffer.from(buildDarkPhoneAppSvg()), { density: 144 })
    .resize(840, 1740)
    .png({ compressionLevel: 9 })
    .toFile(PHONE_SOURCE);

  for (const width of PHONE_WIDTHS) {
    const base = sharp(PHONE_SOURCE).resize({ width });
    await base
      .clone()
      .avif({ quality: 60, effort: 6 })
      .toFile(path.join(OUTPUT_DIR, `hero-phone-${width}.avif`));
    await base
      .clone()
      .webp({ quality: 84, effort: 6 })
      .toFile(path.join(OUTPUT_DIR, `hero-phone-${width}.webp`));
  }

  await sharp(Buffer.from(buildDarkOgSvg()))
    .resize(1200, 630)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(OUTPUT_DIR, "og-image.jpg"));

  console.log("Generated dark cosmic phone & OG images in:", OUTPUT_DIR);
}

run().catch((error) => {
  console.error("Image optimization failed:", error);
  process.exit(1);
});
