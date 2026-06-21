import React from "react";
import { Trees, Shield, Sparkles } from "lucide-react";

interface PhysicalBadgeProps {
  type: "gold" | "silver" | "bronze" | "star";
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  transparent?: boolean;
  key?: any;
}

export default function PhysicalBadge({ type, size = "md", showLabel = true, transparent = false }: PhysicalBadgeProps) {
  // Dimensions & scaling factor based on size prop
  let widthClass = "w-44 h-48";
  let svgSize = 180;
  if (size === "sm") {
    widthClass = "w-28 h-32";
    svgSize = 110;
  } else if (size === "lg") {
    widthClass = "w-52 h-56";
    svgSize = 210;
  } else if (size === "xl") {
    widthClass = "w-64 h-72";
    svgSize = 260;
  }

  // Set up values matching the uploaded physical medal references exactly
  const config = {
    gold: {
      title: "1st Place",
      ribbonText: "CHAMPION",
      bottomText: "CARBON MINIMIZER",
      badgeName: "1st Place Champion: Carbon Minimizer",
      themeColor: "from-amber-200 via-yellow-400 to-yellow-600",
      enamelBg: "#0f3a35", // Deep noble teal enamel
      accentColor: "#facc15", // Brilliant Gold
      metalColor: "url(#gold-metal-grad)",
      borderColor: "#ca8a04",
      textColor: "#ffffff", // Pure white for absolute text contrast
      treeColor: "#fde047",
      leafColor: "#22c55e",
      subtitle: "Absolute #1 savings champion plate with premium metallic green enamel detailing.",
      bgRefl: "via-[#fef08a]/20",
    },
    silver: {
      title: "2nd Place",
      ribbonText: "ELITE",
      bottomText: "CARBON MINIMIZER",
      badgeName: "2nd Place Elite: Carbon Minimizer",
      themeColor: "from-slate-100 via-zinc-300 to-zinc-500",
      enamelBg: "#172554", // Rich dark navy enamel
      accentColor: "#e2e8f0", // Clean Silver
      metalColor: "url(#silver-metal-grad)",
      borderColor: "#64748b",
      textColor: "#ffffff", // Pure white for perfect readability
      treeColor: "#cbd5e1",
      leafColor: "#4ade80",
      subtitle: "Premium silver plate styled with royal navy enamel inlay.",
      bgRefl: "via-white/10",
    },
    bronze: {
      title: "3rd Place",
      ribbonText: "ACHIEVER",
      bottomText: "ACHIEVER",
      badgeName: "3rd Place Achiever: Carbon Achiever",
      themeColor: "from-amber-700 via-orange-800 to-amber-950",
      enamelBg: "#3b1502", // Deep cocoa/bronze enamel
      accentColor: "#f97316", // Polished Copper
      metalColor: "url(#bronze-metal-grad)",
      borderColor: "#7c2d12",
      textColor: "#ffffff", // Pure white for clean contrast
      treeColor: "#fb923c",
      leafColor: "#86efac",
      subtitle: "Gleaming polished copper-bronze active achievement shield.",
      bgRefl: "via-[#ffedd5]/10",
    },
    star: {
      title: "Star Award",
      ribbonText: "SUNLORD",
      bottomText: "ACTIVE SAVINGS",
      badgeName: "Active Sunlord: Streak Champion",
      themeColor: "from-fuchsia-500 via-purple-600 to-amber-500",
      enamelBg: "#240038", // Hypnotic space violet enamel
      accentColor: "#e9d5ff", // Bright lavender star highlight
      metalColor: "url(#star-metal-grad)",
      borderColor: "#701a75",
      textColor: "#ffffff", // Pure white for extreme contrast
      treeColor: "#f472b6",
      leafColor: "#facc15",
      subtitle: "Luminous stellar violet active 7-day streak plaque.",
      bgRefl: "via-[#fae8ff]/20",
    }
  }[type];

  return (
    <div
      className={`flex flex-col items-center justify-center animate-fade-in ${transparent ? "w-full h-full" : ""}`}
      id={`physical-badge-card-${type}`}
    >
      {/* Outer container: velvet box when opaque, fills parent when transparent */}
      <div 
        className={`relative flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.05] ${
          transparent
            ? "w-full h-full bg-transparent p-0"
            : `${widthClass} bg-neutral-950 rounded-[2.5rem] border-[4px] border-zinc-800/60 shadow-[inset_0_4px_16px_rgba(0,0,0,0.95),0_12px_28px_rgba(0,0,0,0.7)] hover:shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),0_20px_35px_rgba(0,0,0,0.9)] p-4 overflow-hidden`
        }`}
        style={transparent ? {} : {
          backgroundImage: "radial-gradient(circle at center, #1e1e24 0%, #08080c 100%)",
        }}
      >
        {!transparent && (
          <>
            {/* Subtle velvet grain dust styling overlay */}
            <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none mix-blend-overlay" />
            {/* Ambient metal glow background */}
            <div className={`absolute -inset-10 bg-gradient-to-tr ${config.themeColor} ${config.bgRefl} to-transparent opacity-20 blur-3xl rounded-full animate-pulse`} />
          </>
        )}

        {/* HIGH-FIDELITY VECTOR SHIELD MEDAL COIN */}
        <svg 
          viewBox="0 0 100 100" 
          className={`relative z-10 select-none filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.6)] ${
            transparent ? "w-full h-full" : "w-full h-full max-w-full max-h-full object-contain animate-pulse-slow"
          }`}
        >
          <defs>
            {/* Real metal multi-stop linear gradients for beautiful 3D reflections */}
            <linearGradient id="gold-metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="15%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#ca8a04" />
              <stop offset="50%" stopColor="#fef3c7" />
              <stop offset="65%" stopColor="#a16207" />
              <stop offset="85%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#713f12" />
            </linearGradient>

            <linearGradient id="silver-metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="15%" stopColor="#f1f5f9" />
              <stop offset="35%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="65%" stopColor="#475569" />
              <stop offset="85%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="bronze-metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff7ed" />
              <stop offset="15%" stopColor="#fed7aa" />
              <stop offset="35%" stopColor="#c2410c" />
              <stop offset="50%" stopColor="#ffedd5" />
              <stop offset="65%" stopColor="#7c2d12" />
              <stop offset="85%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#431407" />
            </linearGradient>

            <linearGradient id="star-metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fae8ff" />
              <stop offset="15%" stopColor="#e9d5ff" />
              <stop offset="35%" stopColor="#9333ea" />
              <stop offset="50%" stopColor="#f3e8ff" />
              <stop offset="65%" stopColor="#581c87" />
              <stop offset="85%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#2e1065" />
            </linearGradient>

            {/* Invert lighting for bevel borders */}
            <linearGradient id="bevel-bevel" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#888888" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
            </linearGradient>

            {/* Symmetrical exact curves with generous radii to prevent letter squishing */}
            <path id="bottomTextCurve" d="M 12,65 C 12,98 88,98 88,65" fill="none" />
            <path id="topTextCurve" d="M 14,35 C 14,2 86,2 86,35" fill="none" />
          </defs>

          {/* 1. OUTERMOST METALLIC SHIELD CORNICE (SHIELD BACKPLATE WITH SHINY EDGES) */}
          <path 
            d="M 50 2.5 C 79 2.5, 98.5 10.5, 98.5 43 C 98.5 79, 50 98, 50 98 C 50 98, 1.5 79, 1.5 43 C 1.5 10.5, 21 2.5, 50 2.5 Z" 
            fill={config.metalColor}
            stroke="url(#bevel-bevel)"
            strokeWidth="0.6"
          />

          {/* Inner dark frame boundary to establish deep 3D recess */}
          <path 
            d="M 50 4.5 C 76.5 4.5, 95.5 12.5, 95.5 43.5 C 95.5 77.5, 50 95.5, 50 95.5 C 50 95.5, 4.5 77.5, 4.5 43.5 C 4.5 12.5, 23.5 4.5, 50 4.5 Z" 
            fill="#0c0a09" 
            opacity="0.95"
            stroke={config.borderColor}
            strokeWidth="0.3"
          />

          {/* 2. PREMIUM NOBLE ENAMEL CORE BACKGROUND INFILL */}
          <path 
            d="M 50 5.5 C 74.5 5.5, 93 13.5, 93 44 C 93 75.5, 50 93.5, 50 93.5 C 50 93.5, 7 75.5, 7 44 C 7 13.5, 25.5 5.5, 50 5.5 Z" 
            fill={config.enamelBg} 
            className="transition-all duration-300"
          />

          {/* Guilloché concentric dynamic textures inside the Enamel background for real luxury index */}
          <path 
            d="M 50 8.5 C 72 8.5, 89 16, 89 44 C 89 72.5, 50 89.5, 50 89.5 C 50 89.5, 11 72.5, 11 44 C 11 16, 28 8.5, 50 8.5 Z" 
            fill="none"
            stroke={config.accentColor}
            strokeWidth="0.15"
            opacity="0.25"
          />
          <path 
            d="M 50 11.5 C 69 11.5, 85 18.5, 85 44 C 85 69.5, 50 85.5, 50 85.5 C 50 85.5, 15 69.5, 15 44 C 15 18.5, 31 11.5, 50 11.5 Z" 
            fill="none"
            stroke={config.accentColor}
            strokeWidth="0.1"
            opacity="0.15"
          />

          {/* 3. CENTRAL EXTREME CONTRAST EMBOSSED LOCKET CIRCLE */}
          <circle cx="50" cy="56" r="23" fill={config.metalColor} stroke="#09090b" strokeWidth="0.3" opacity="0.9" />
          <circle cx="50" cy="56" r="21.2" fill={config.enamelBg} stroke={config.accentColor} strokeWidth="0.8" />
          
          {/* Fine Brushed concentric internal detailing rings within central medallion */}
          <circle cx="50" cy="56" r="18.5" fill="none" stroke={config.accentColor} strokeWidth="0.15" opacity="0.3" />
          <circle cx="50" cy="56" r="16" fill="none" stroke={config.accentColor} strokeWidth="0.1" opacity="0.2" />

          {/* Central organic tree and recycling footprint loop */}
          <g transform="translate(50, 56) scale(0.96)" className="opacity-95">
            {/* Tree roots & trunk structure (embossed metallic) */}
            <path 
              d="M -1.5,12 L 1.5,12 L 1,2 C 2.5,1 4,-1 5,-4 C 6.5,-8 4.5,-12 1.5,-13 L 0,-13 L -1.5,-13 C -4.5,-12 -6.5,-8 -5,-4 C -4,-1 -2.5,1 -1.5,2 Z" 
              fill={config.accentColor} 
              stroke="#000000"
              strokeWidth="0.3"
            />
            
            {/* Spreading lush leaves clusters */}
            <circle cx="0" cy="-12" r="5" fill={config.leafColor} stroke="#090807" strokeWidth="0.3" opacity="0.95" />
            <circle cx="-5.5" cy="-8" r="4" fill={config.leafColor} stroke="#090807" strokeWidth="0.3" opacity="0.9" />
            <circle cx="5.5" cy="-8" r="4" fill={config.leafColor} stroke="#090807" strokeWidth="0.3" opacity="0.9" />
            <circle cx="-3" cy="-3.5" r="3" fill={config.leafColor} stroke="#090807" strokeWidth="0.3" opacity="0.9" />
            <circle cx="3" cy="-3.5" r="3" fill={config.leafColor} stroke="#090807" strokeWidth="0.3" opacity="0.9" />
            
            {/* Fine branches decoration */}
            <path d="M 0,1 L -3,-4" stroke={config.accentColor} strokeWidth="0.9" fill="none" />
            <path d="M 0,3 L 3,-2" stroke={config.accentColor} strokeWidth="0.9" fill="none" />
            <path d="M 0,-4 L -4,-10" stroke={config.accentColor} strokeWidth="0.9" fill="none" />
            <path d="M 1,-4 L 4,-9" stroke={config.accentColor} strokeWidth="0.9" fill="none" />

            {/* Twin curved leaves creating the circular footprint recycling pattern */}
            <path 
              d="M -14,6 C -12,12 -4,15 4,14 C 12,13 15,6 14,-1" 
              stroke={config.leafColor} 
              strokeWidth="2.2" 
              fill="none" 
              strokeLinecap="round" 
              strokeDasharray="2, 2.5" 
            />
            {/* Left footprint plant shoot */}
            <path d="M -14,6 Q -15,8 -17,7" stroke={config.leafColor} strokeWidth="1.4" fill="none" />
            <circle cx="-17" cy="7" r="1" fill={config.leafColor} />
            <circle cx="-12" cy="11" r="0.8" fill={config.accentColor} />
            <circle cx="12" cy="11" r="0.8" fill={config.accentColor} />
            
            {/* Right footprint plant shoot */}
            <path d="M 14,-1 Q 16,-3 15,-4" stroke={config.leafColor} strokeWidth="1.4" fill="none" />
            <circle cx="15" cy="-4" r="1" fill={config.leafColor} />
          </g>

          {/* 4. UPPER RIBBON/HORIZONTAL BAR DECORATING CATEGORY */}
          <g transform="translate(0, 28)">
            {/* Deep crisp shadow beneath ribbon */}
            <rect x="17" y="2.5" width="66" height="9" rx="2" fill="#000000" opacity="0.65" />
            {/* Main ribbon metallic bar bounds */}
            <rect 
              x="19" 
              y="0" 
              width="62" 
              height="9" 
              rx="2" 
              fill={config.metalColor} 
              stroke="#09090b" 
              strokeWidth="0.8" 
            />
            {/* Curved ribbon tips on left and right */}
            <path d="M 19,0 L 14,4.5 L 19,9 Z" fill={config.metalColor} stroke="#09090b" strokeWidth="0.8" />
            <path d="M 81,0 L 86,4.5 L 81,9 Z" fill={config.metalColor} stroke="#09090b" strokeWidth="0.8" />
            
            {/* Inner extreme contrast fill ribbon */}
            <rect x="21" y="1.2" width="58" height="6.6" fill="#0c0a09" stroke="#1c1917" strokeWidth="0.4" />
            
            {/* Text labels: CHAMPION, ELITE, ACHIEVER styles */}
            <text 
              x="50" 
              y="6.2" 
              fill={config.textColor} 
              fontSize="5.2" 
              fontWeight="bold" 
              fontFamily="system-ui, -apple-system, sans-serif" 
              textAnchor="middle" 
              letterSpacing="0.8"
              className="font-extrabold select-none tracking-widest uppercase"
              stroke="#000000"
              strokeWidth="0.25"
              paintOrder="stroke fill"
            >
              {config.ribbonText}
            </text>
          </g>

          {/* 5. TOP AND BOTTOM TEXT PATH ENGRAVING (CRYSTAL CLEAR CURVED TEXT ENGRAVING WITH DARK OUTLINES!) */}
          
          {/* Top category label: e.g. "1st Place", "2nd Place" (outlined by pitch black backdrop stroke for clarity) */}
          <text 
            fontSize="5.8" 
            fontWeight="bold" 
            fill={config.textColor} 
            fontFamily="system-ui, -apple-system, sans-serif" 
            letterSpacing="0.6" 
            className="font-extrabold uppercase"
            stroke="#000000"
            strokeWidth="0.35"
            strokeLinejoin="round"
            paintOrder="stroke fill"
          >
            <textPath href="#topTextCurve" startOffset="50%" textAnchor="middle">
              {config.title}
            </textPath>
          </text>

          {/* Bottom curved text: e.g. "CARBON MINIMIZER" curving along the lower shield */}
          <text 
            fontSize="4.8" 
            fontWeight="bold" 
            fill={config.textColor} 
            fontFamily="system-ui, -apple-system, sans-serif" 
            letterSpacing="0.5" 
            className="font-extrabold uppercase"
            stroke="#000000"
            strokeWidth="0.35"
            strokeLinejoin="round"
            paintOrder="stroke fill"
          >
            <textPath href="#bottomTextCurve" startOffset="50%" textAnchor="middle">
              {config.bottomText}
            </textPath>
          </text>

          {/* Sizing achievement stars to represent absolute ranks */}
          {type === "gold" && (
            <g transform="translate(50, 48)">
              {/* Central Gold Star with tiny clear outlines */}
              <polygon points="0,-4 1.2,-1.2 4,-1.2 1.8,0.4 2.6,3.2 0,1.5 -2.6,3.2 -1.8,0.4 -4,-1.2 -1.2,-1.2" fill="#fbbf24" stroke="#000" strokeWidth="0.3" />
              <polygon points="-12,-2 -11,-0.5 -9.5,-0.5 -10.5,0.3 -10.1,1.7 -11.2,0.8 -12.3,1.7 -11.9,0.3 -12.9,-0.5 -11.4,-0.5" fill="#fbbf24" stroke="#000" strokeWidth="0.2" opacity="0.85" />
              <polygon points="12,-2 13,-0.5 14.5,-0.5 13.5,0.3 13.9,1.7 12.8,0.8 11.7,1.7 12.1,0.3 11.1,-0.5 12.6,-0.5" fill="#fbbf24" stroke="#000" strokeWidth="0.2" opacity="0.85" />
            </g>
          )}

          {/* Bevel reflection line inside */}
          <path d="M 50,6 L 50,91" stroke="#ffffff" strokeWidth="0.3" opacity="0.25" pointerEvents="none" />
        </svg>

        {/* Glossy Reflection overlay sweep — only shown when dark box is visible */}
        {!transparent && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full h-[300%] w-[300%] rotate-45 transform hover:translate-x-full duration-[1.5s] ease-out pointer-events-none mix-blend-overlay" />
        )}
      </div>

      {/* Under Label Plate showing standard readable values */}
      {showLabel && (
        <div className="text-center mt-2 space-y-0.5 max-w-[170px]" id={`badge-desc-${type}`}>
          <h4 className={`text-xs font-black uppercase tracking-tight italic flex items-center justify-center gap-1 ${
            transparent ? "text-zinc-800" : "text-zinc-100"
          }`}>
            {type === "star" && <Sparkles className="w-3 h-3 text-fuchsia-500" />}
            {config.badgeName}
          </h4>
          <p className={`text-[10px] font-medium leading-relaxed ${
            transparent ? "text-zinc-500" : "text-zinc-400"
          }`}>
            {config.subtitle}
          </p>
        </div>
      )}
    </div>
  );
}

export const getPhysicalBadgeType = (badge: { rankRequirement: number; name: string; id: string }): "gold" | "silver" | "bronze" | "star" => {
  const nameLower = badge.name.toLowerCase();
  const idLower = badge.id.toLowerCase();
  if (nameLower.includes("gold") || idLower.includes("rank-1") || idLower.includes("points-1")) return "gold";
  if (nameLower.includes("silver") || idLower.includes("rank-2") || idLower.includes("points-2")) return "silver";
  if (nameLower.includes("bronze") || idLower.includes("rank-3") || idLower.includes("points-3")) return "bronze";
  
  if (badge.rankRequirement === 1) return "gold";
  if (badge.rankRequirement === 2) return "silver";
  if (badge.rankRequirement === 3) return "bronze";
  return "star";
};

export const getPhysicalBadgeSvgString = (type: "gold" | "silver" | "bronze" | "star"): string => {
  const configs: Record<string, {
    title: string; ribbonText: string; bottomText: string;
    enamelBg: string; accentColor: string; metalColor: string;
    borderColor: string; textColor: string; leafColor: string;
    metalGradId: string;
    metalGradStops: string;
    stars: string;
  }> = {
    gold: {
      title: "1st Place", ribbonText: "CHAMPION", bottomText: "CARBON MINIMIZER",
      enamelBg: "#0f3a35", accentColor: "#facc15", metalColor: "url(#sv-metal-grad)",
      borderColor: "#ca8a04", textColor: "#ffffff", leafColor: "#22c55e",
      metalGradId: "sv-metal-grad",
      metalGradStops: `<stop offset="0%" stop-color="#fffbeb"/><stop offset="15%" stop-color="#fef08a"/><stop offset="35%" stop-color="#ca8a04"/><stop offset="50%" stop-color="#fef3c7"/><stop offset="65%" stop-color="#a16207"/><stop offset="85%" stop-color="#fde047"/><stop offset="100%" stop-color="#713f12"/>`,
      stars: `<g transform="translate(50,48)"><polygon points="0,-4 1.2,-1.2 4,-1.2 1.8,0.4 2.6,3.2 0,1.5 -2.6,3.2 -1.8,0.4 -4,-1.2 -1.2,-1.2" fill="#fbbf24" stroke="#000" stroke-width="0.3"/><polygon points="-12,-2 -11,-0.5 -9.5,-0.5 -10.5,0.3 -10.1,1.7 -11.2,0.8 -12.3,1.7 -11.9,0.3 -12.9,-0.5 -11.4,-0.5" fill="#fbbf24" stroke="#000" stroke-width="0.2" opacity="0.85"/><polygon points="12,-2 13,-0.5 14.5,-0.5 13.5,0.3 13.9,1.7 12.8,0.8 11.7,1.7 12.1,0.3 11.1,-0.5 12.6,-0.5" fill="#fbbf24" stroke="#000" stroke-width="0.2" opacity="0.85"/></g>`
    },
    silver: {
      title: "2nd Place", ribbonText: "ELITE", bottomText: "CARBON MINIMIZER",
      enamelBg: "#172554", accentColor: "#e2e8f0", metalColor: "url(#sv-metal-grad)",
      borderColor: "#64748b", textColor: "#ffffff", leafColor: "#4ade80",
      metalGradId: "sv-metal-grad",
      metalGradStops: `<stop offset="0%" stop-color="#ffffff"/><stop offset="15%" stop-color="#f1f5f9"/><stop offset="35%" stop-color="#94a3b8"/><stop offset="50%" stop-color="#f8fafc"/><stop offset="65%" stop-color="#475569"/><stop offset="85%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#1e293b"/>`,
      stars: ""
    },
    bronze: {
      title: "3rd Place", ribbonText: "ACHIEVER", bottomText: "ACHIEVER",
      enamelBg: "#3b1502", accentColor: "#f97316", metalColor: "url(#sv-metal-grad)",
      borderColor: "#7c2d12", textColor: "#ffffff", leafColor: "#86efac",
      metalGradId: "sv-metal-grad",
      metalGradStops: `<stop offset="0%" stop-color="#fff7ed"/><stop offset="15%" stop-color="#fed7aa"/><stop offset="35%" stop-color="#c2410c"/><stop offset="50%" stop-color="#ffedd5"/><stop offset="65%" stop-color="#7c2d12"/><stop offset="85%" stop-color="#f97316"/><stop offset="100%" stop-color="#431407"/>`,
      stars: ""
    },
    star: {
      title: "Star Award", ribbonText: "SUNLORD", bottomText: "ACTIVE SAVINGS",
      enamelBg: "#240038", accentColor: "#e9d5ff", metalColor: "url(#sv-metal-grad)",
      borderColor: "#701a75", textColor: "#ffffff", leafColor: "#facc15",
      metalGradId: "sv-metal-grad",
      metalGradStops: `<stop offset="0%" stop-color="#fae8ff"/><stop offset="15%" stop-color="#e9d5ff"/><stop offset="35%" stop-color="#9333ea"/><stop offset="50%" stop-color="#f3e8ff"/><stop offset="65%" stop-color="#581c87"/><stop offset="85%" stop-color="#c084fc"/><stop offset="100%" stop-color="#2e1065"/>`,
      stars: ""
    }
  };

  const c = configs[type];
  const m = c.metalColor;
  const eb = c.enamelBg;
  const ac = c.accentColor;
  const bc = c.borderColor;
  const tc = c.textColor;
  const lc = c.leafColor;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="160" height="160">
  <defs>
    <linearGradient id="${c.metalGradId}" x1="0%" y1="0%" x2="100%" y2="100%">${c.metalGradStops}</linearGradient>
    <linearGradient id="bv" x1="100%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#888" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.9"/>
    </linearGradient>
    <path id="btc" d="M 12,65 C 12,98 88,98 88,65" fill="none"/>
    <path id="ttc" d="M 14,35 C 14,2 86,2 86,35" fill="none"/>
  </defs>
  <path d="M 50 2.5 C 79 2.5, 98.5 10.5, 98.5 43 C 98.5 79, 50 98, 50 98 C 50 98, 1.5 79, 1.5 43 C 1.5 10.5, 21 2.5, 50 2.5 Z" fill="${m}" stroke="url(#bv)" stroke-width="0.6"/>
  <path d="M 50 4.5 C 76.5 4.5, 95.5 12.5, 95.5 43.5 C 95.5 77.5, 50 95.5, 50 95.5 C 50 95.5, 4.5 77.5, 4.5 43.5 C 4.5 12.5, 23.5 4.5, 50 4.5 Z" fill="#0c0a09" opacity="0.95" stroke="${bc}" stroke-width="0.3"/>
  <path d="M 50 5.5 C 74.5 5.5, 93 13.5, 93 44 C 93 75.5, 50 93.5, 50 93.5 C 50 93.5, 7 75.5, 7 44 C 7 13.5, 25.5 5.5, 50 5.5 Z" fill="${eb}"/>
  <path d="M 50 8.5 C 72 8.5, 89 16, 89 44 C 89 72.5, 50 89.5, 50 89.5 C 50 89.5, 11 72.5, 11 44 C 11 16, 28 8.5, 50 8.5 Z" fill="none" stroke="${ac}" stroke-width="0.15" opacity="0.25"/>
  <path d="M 50 11.5 C 69 11.5, 85 18.5, 85 44 C 85 69.5, 50 85.5, 50 85.5 C 50 85.5, 15 69.5, 15 44 C 15 18.5, 31 11.5, 50 11.5 Z" fill="none" stroke="${ac}" stroke-width="0.1" opacity="0.15"/>
  <circle cx="50" cy="56" r="23" fill="${m}" stroke="#09090b" stroke-width="0.3" opacity="0.9"/>
  <circle cx="50" cy="56" r="21.2" fill="${eb}" stroke="${ac}" stroke-width="0.8"/>
  <circle cx="50" cy="56" r="18.5" fill="none" stroke="${ac}" stroke-width="0.3" opacity="0.3"/>
  <circle cx="50" cy="56" r="16" fill="none" stroke="${ac}" stroke-width="0.15" opacity="0.2"/>
  <g transform="translate(50,56) scale(0.96)" opacity="0.95">
    <path d="M -1.5,12 L 1.5,12 L 1,2 C 2.5,1 4,-1 5,-4 C 6.5,-8 4.5,-12 1.5,-13 L 0,-13 L -1.5,-13 C -4.5,-12 -6.5,-8 -5,-4 C -4,-1 -2.5,1 -1.5,2 Z" fill="${ac}" stroke="#000" stroke-width="0.3"/>
    <circle cx="0" cy="-12" r="5" fill="${lc}" stroke="#090807" stroke-width="0.3"/>
    <circle cx="-5.5" cy="-8" r="4" fill="${lc}" stroke="#090807" stroke-width="0.3"/>
    <circle cx="5.5" cy="-8" r="4" fill="${lc}" stroke="#090807" stroke-width="0.3"/>
    <circle cx="-3" cy="-3.5" r="3" fill="${lc}" stroke="#090807" stroke-width="0.3"/>
    <circle cx="3" cy="-3.5" r="3" fill="${lc}" stroke="#090807" stroke-width="0.3"/>
    <path d="M 0,1 L -3,-4" stroke="${ac}" stroke-width="0.9" fill="none"/>
    <path d="M 0,3 L 3,-2" stroke="${ac}" stroke-width="0.9" fill="none"/>
    <path d="M 0,-4 L -4,-10" stroke="${ac}" stroke-width="0.9" fill="none"/>
    <path d="M 1,-4 L 4,-9" stroke="${ac}" stroke-width="0.9" fill="none"/>
    <path d="M -14,6 C -12,12 -4,15 4,14 C 12,13 15,6 14,-1" stroke="${lc}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-dasharray="2,2.5"/>
    <path d="M -14,6 Q -15,8 -17,7" stroke="${lc}" stroke-width="1.4" fill="none"/>
    <circle cx="-17" cy="7" r="1" fill="${lc}"/>
    <circle cx="-12" cy="11" r="0.8" fill="${ac}"/>
    <circle cx="12" cy="11" r="0.8" fill="${ac}"/>
    <path d="M 14,-1 Q 16,-3 15,-4" stroke="${lc}" stroke-width="1.4" fill="none"/>
    <circle cx="15" cy="-4" r="1" fill="${lc}"/>
  </g>
  <g transform="translate(0,28)">
    <rect x="17" y="2.5" width="66" height="9" rx="2" fill="#000" opacity="0.65"/>
    <rect x="19" y="0" width="62" height="9" rx="2" fill="${m}" stroke="#09090b" stroke-width="0.8"/>
    <path d="M 19,0 L 14,4.5 L 19,9 Z" fill="${m}" stroke="#09090b" stroke-width="0.8"/>
    <path d="M 81,0 L 86,4.5 L 81,9 Z" fill="${m}" stroke="#09090b" stroke-width="0.8"/>
    <rect x="21" y="1.2" width="58" height="6.6" fill="#0c0a09" stroke="#1c1917" stroke-width="0.4"/>
    <text x="50" y="6.2" fill="${tc}" font-size="5.2" font-weight="bold" font-family="system-ui,sans-serif" text-anchor="middle" letter-spacing="0.8" stroke="#000" stroke-width="0.25" paint-order="stroke fill">${c.ribbonText}</text>
  </g>
  <text font-size="5.8" font-weight="bold" fill="${tc}" font-family="system-ui,sans-serif" letter-spacing="0.6" stroke="#000" stroke-width="0.35" stroke-linejoin="round" paint-order="stroke fill">
    <textPath href="#ttc" startOffset="50%" text-anchor="middle">${c.title}</textPath>
  </text>
  <text font-size="4.8" font-weight="bold" fill="${tc}" font-family="system-ui,sans-serif" letter-spacing="0.5" stroke="#000" stroke-width="0.35" stroke-linejoin="round" paint-order="stroke fill">
    <textPath href="#btc" startOffset="50%" text-anchor="middle">${c.bottomText}</textPath>
  </text>
  ${c.stars}
  <path d="M 50,6 L 50,91" stroke="#fff" stroke-width="0.3" opacity="0.25"/>
</svg>`;
};
