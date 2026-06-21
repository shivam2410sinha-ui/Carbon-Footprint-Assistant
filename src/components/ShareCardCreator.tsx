import React, { useState } from "react";
import { Download, Sparkles, Sliders, Palette, Share2, Flame, RefreshCw } from "lucide-react";
import { Badge } from "../types";
import PhysicalBadge, { getPhysicalBadgeType, getPhysicalBadgeSvgString } from "./PhysicalBadges";

interface ShareCardCreatorProps {
  userName: string;
  userUsername: string;
  avatar: string;
  streak: number;
  monthlyFootprint: number;
  lastCarbonSaved: number;
  points: number;
  redeemedBadgesCount: number;
  badges?: Badge[];
}

type CardTheme = "cyber-emerald" | "aurora-dream" | "y2k-retro" | "pastel-green";

const getBadgeEmoji = (iconName: string) => {
  if (iconName === "Crown") return "👑";
  if (iconName === "Trees") return "🌲";
  if (iconName === "Sparkles") return "✨";
  return iconName;
};

const getBadgeSolidColor = (b: Badge) => {
  const colorStr = b.color.toLowerCase();
  const idStr = b.id.toLowerCase();
  if (colorStr.includes("amber") || colorStr.includes("yellow") || idStr.includes("rank-1") || idStr.includes("points-1")) {
    return "#F59E0B"; // Gold
  }
  if (colorStr.includes("slate") || colorStr.includes("zinc") || idStr.includes("rank-2") || idStr.includes("points-2")) {
    return "#94A3B8"; // Silver
  }
  if (colorStr.includes("orange") || colorStr.includes("amber-600") || idStr.includes("rank-3") || idStr.includes("points-3")) {
    return "#B45309"; // Bronze
  }
  return "#A855F7"; // Purple
};

export default function ShareCardCreator({
  userName,
  userUsername,
  avatar,
  streak,
  monthlyFootprint,
  lastCarbonSaved,
  points,
  redeemedBadgesCount,
  badges = [],
}: ShareCardCreatorProps) {
  const [theme, setTheme] = useState<CardTheme>("cyber-emerald");
  const [showAvatar, setShowAvatar] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [showStreak, setShowStreak] = useState(true);
  const [customQuote, setCustomQuote] = useState("Vaporizing carbon footprint, one choice at a time.");
  const [toastMessage, setToastMessage] = useState("");

  const handleDownload = () => {
    setToastMessage("Generating premium ultra-HD story assets... ⚡");

    const canvas = document.createElement("canvas");
    canvas.width = 540;
    canvas.height = 960; // 9:16 high-def story format
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Draw theme background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (theme === "cyber-emerald") {
      gradient.addColorStop(0, "#022c22"); // emerald-950
      gradient.addColorStop(0.5, "#09090b"); // zinc-950
      gradient.addColorStop(1, "#18181b"); // zinc-900
    } else if (theme === "aurora-dream") {
      gradient.addColorStop(0, "#1e1b4b"); // indigo-950
      gradient.addColorStop(0.5, "#3b0764"); // purple-950
      gradient.addColorStop(1, "#500724"); // pink-950
    } else if (theme === "y2k-retro") {
      gradient.addColorStop(0, "#fef9c3"); // yellow-100
      gradient.addColorStop(0.5, "#fed7aa"); // orange-200
      gradient.addColorStop(1, "#fcd34d"); // amber-200
    } else if (theme === "pastel-green") {
      gradient.addColorStop(0, "#1c1917"); // stone-900
      gradient.addColorStop(0.5, "#171717"); // neutral-900
      gradient.addColorStop(1, "#042f2e"); // teal-950
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative backgrounds layout
    ctx.strokeStyle = theme === "y2k-retro" ? "rgba(249, 115, 22, 0.15)" : "rgba(188, 255, 0, 0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width, 0, 250, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = theme === "aurora-dream" ? "rgba(236, 72, 153, 0.1)" : "rgba(20, 184, 166, 0.1)";
    ctx.beginPath();
    ctx.arc(0, canvas.height, 350, 0, 2 * Math.PI);
    ctx.stroke();

    const primaryColor = theme === "y2k-retro" ? "#0a0a0a" : "#ffffff";
    const secondaryColor = theme === "y2k-retro" ? "#4a4a4a" : "#a1a1aa";
    const brandAccent = theme === "y2k-retro" ? "#ea580c" : "#BCFF00";

    const drawAvatarAndHeader = () => {
      const avatarX = 65;
      const avatarY = 85;
      const avatarRadius = 25;

      if (showAvatar) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = avatar;
        img.onload = () => {
          ctx.drawImage(img, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
          ctx.restore();
          drawTextAndRemaining();
        };
        img.onerror = () => {
          ctx.restore();
          ctx.fillStyle = "#27272a"; // zinc-800
          ctx.beginPath();
          ctx.arc(avatarX, avatarY, avatarRadius, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 20px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const initials = userName ? userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "GP";
          ctx.fillText(initials, avatarX, avatarY);
          drawTextAndRemaining();
        };
      } else {
        ctx.fillStyle = brandAccent;
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, 15, 0, 2 * Math.PI);
        ctx.fill();
        drawTextAndRemaining();
      }
    };

    const drawTextAndRemaining = () => {
      const textStartX = showAvatar ? 110 : 65;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // Name
      ctx.fillStyle = primaryColor;
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(userName || "Shivam Sinha", textStartX, 63);

      // Username
      ctx.fillStyle = secondaryColor;
      ctx.font = "400 16px monospace";
      ctx.fillText(`@${userUsername || "eco_shivam"}`, textStartX, 90);

      // Main stats card
      ctx.fillStyle = theme === "y2k-retro" ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.03)";
      ctx.fillRect(50, 160, canvas.width - 100, 310);
      ctx.strokeStyle = theme === "y2k-retro" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.strokeRect(50, 160, canvas.width - 100, 310);

      // Label
      ctx.fillStyle = secondaryColor;
      ctx.font = "bold 13px monospace";
      ctx.fillText("WEEKLY CARBON SAVED", 75, 195);

      // Saved footprint metric
      ctx.fillStyle = brandAccent;
      ctx.font = "900 64px sans-serif";
      ctx.fillText(`-${lastCarbonSaved || 18} kg CO₂e`, 75, 225);

      ctx.fillStyle = primaryColor;
      ctx.font = "600 16px sans-serif";
      ctx.fillText("Active footprint reductions logged", 75, 305);

      // Divider line
      ctx.strokeStyle = theme === "y2k-retro" ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(75, 350);
      ctx.lineTo(canvas.width - 75, 350);
      ctx.stroke();

      // Multi-stats
      let statY = 370;

      if (showStreak) {
        ctx.fillStyle = theme === "y2k-retro" ? "#c2410c" : "#f97316";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(`🔥 STREAK: ${streak} Days Active`, 75, statY);
        statY += 32;
      }

      if (showPoints) {
        ctx.fillStyle = primaryColor;
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(`✨ SCORE: ${points} ECO-POINTS`, 75, statY);
        statY += 32;
      }

      // Quote
      if (customQuote) {
        ctx.textAlign = "center";
        ctx.fillStyle = primaryColor;
        ctx.font = "italic 18px sans-serif";
        
        // Wrap text algorithm
        const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
          const words = text.split(" ");
          let line = "";
          let currentY = y;
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
              ctx.fillText(line, x, currentY);
              line = words[n] + " ";
              currentY += lineHeight;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, x, currentY);
        };
        wrapText(`"${customQuote}"`, canvas.width / 2, 530, canvas.width - 120, 26);
      }

      // Load all badge images asynchronously
      const achievedBadges = badges || [];
      const badgePromises = achievedBadges.map((b) => {
        return new Promise<{ img: HTMLImageElement; badgeType: string } | null>((resolve) => {
          try {
            const type = getPhysicalBadgeType(b);
            const svgString = getPhysicalBadgeSvgString(type);
            const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);
            const img = new Image();
            img.src = url;
            img.onload = () => {
              URL.revokeObjectURL(url);
              resolve({ img, badgeType: type });
            };
            img.onerror = () => {
              URL.revokeObjectURL(url);
              resolve(null);
            };
          } catch (e) {
            resolve(null);
          }
        });
      });

      Promise.all(badgePromises).then((loadedImages) => {
        const validPairs = loadedImages.filter(
          (item): item is { img: HTMLImageElement; badgeType: string } => item !== null
        );

        // Badges banner
        if (validPairs.length > 0) {
          ctx.fillStyle = theme === "y2k-retro" ? "rgba(0,0,0,0.04)" : "rgba(188, 255, 0, 0.08)";
          ctx.fillRect(50, 655, canvas.width - 100, 175);
          ctx.strokeStyle = theme === "y2k-retro" ? "rgba(0,0,0,0.1)" : "rgba(188, 255, 0, 0.15)";
          ctx.lineWidth = 1;
          ctx.strokeRect(50, 655, canvas.width - 100, 175);

          // Header label
          ctx.fillStyle = brandAccent;
          ctx.font = "900 11px monospace";
          ctx.textAlign = "center";
          ctx.fillText("ACHIEVED MILESTONE BADGES", canvas.width / 2, 675);

          // Draw each medallion + name below
          const badgeSize = 85;
          const gap = 14;
          const totalWidth = (validPairs.length * badgeSize) + ((validPairs.length - 1) * gap);
          let startX = (canvas.width - totalWidth) / 2;
          const badgeY = 688;

          const badgeNameMap: Record<string, string> = {
            gold: "1st Place Champion",
            silver: "2nd Place Elite",
            bronze: "3rd Place Achiever",
            star: "Sunlord Streak",
          };

          validPairs.forEach(({ img, badgeType }) => {
            // Draw badge image
            ctx.drawImage(img, startX, badgeY, badgeSize, badgeSize);
            // Draw badge name below
            ctx.fillStyle = theme === "y2k-retro" ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.85)";
            ctx.font = "bold 9px system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(
              badgeNameMap[badgeType] || badgeType,
              startX + badgeSize / 2,
              badgeY + badgeSize + 12
            );
            startX += badgeSize + gap;
          });

          // Live flex subtext at the bottom
          ctx.fillStyle = brandAccent;
          ctx.font = "900 10px monospace";
          ctx.textAlign = "center";
          ctx.fillText("COMPETING LIVE ON @GREEN.PULSE", canvas.width / 2, 820);
        } else {
          // Fallback: Default status levels
          ctx.fillStyle = theme === "y2k-retro" ? "rgba(0,0,0,0.04)" : "rgba(188, 255, 0, 0.08)";
          ctx.fillRect(50, 670, canvas.width - 100, 110);
          
          ctx.fillStyle = primaryColor;
          ctx.font = "bold 18px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`LEVEL ${Math.ceil(points / 500)} ECOELITE STATUS`, canvas.width / 2, 695);

          ctx.fillStyle = secondaryColor;
          ctx.font = "bold 12px monospace";
          ctx.fillText(`UNLOCKED A TOTAL OF ${redeemedBadgesCount} TOP BADGES`, canvas.width / 2, 725);

          ctx.fillStyle = brandAccent;
          ctx.font = "900 11px monospace";
          ctx.fillText("COMPETING LIVE ON @GREEN.PULSE", canvas.width / 2, 755);
        }

        // Footer branding
        ctx.strokeStyle = theme === "y2k-retro" ? "rgba(0,0,0,0.1)" : "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.moveTo(50, 840);
        ctx.lineTo(canvas.width - 50, 840);
        ctx.stroke();

        ctx.fillStyle = secondaryColor;
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "left";
        ctx.fillText("⚡ GREENPULSE.SOC", 50, 865);

        ctx.textAlign = "right";
        ctx.fillText("SEASON 04 CHAMPION", canvas.width - 50, 865);

        try {
          const dataUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = `${userUsername || "user"}_greenpulse_poster.png`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setToastMessage("SUCCESS! Poster saved to device. Flex it proudly on Instagram! 📥🍀");
        } catch (err) {
          setToastMessage("Poster generated! Right click & Save Image standard action 💾");
        }

        setTimeout(() => {
          setToastMessage("");
        }, 5000);
      });
    };

    drawAvatarAndHeader();
  };

  const getThemeClasses = (): string => {
    switch (theme) {
      case "cyber-emerald":
        return "bg-gradient-to-br from-zinc-950 via-emerald-950 to-neutral-900 border-emerald-500/30 text-emerald-300";
      case "aurora-dream":
        return "bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 border-pink-500/30 text-pink-200";
      case "y2k-retro":
        return "bg-gradient-to-br from-yellow-100 via-orange-200 to-amber-200 border-orange-500/20 text-neutral-900";
      case "pastel-green":
        return "bg-gradient-to-br from-stone-900 via-neutral-900 to-teal-950 border-teal-500/20 text-teal-200";
    }
  };

  const getTextColor = (): string => {
    return theme === "y2k-retro" ? "text-neutral-950" : "text-neutral-200";
  };

  const getSubColor = () => {
    return theme === "y2k-retro" ? "text-neutral-600" : "text-neutral-400";
  };

  const getAccentBg = () => {
    switch (theme) {
      case "cyber-emerald": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "aurora-dream": return "bg-purple-500/10 border-purple-500/20 text-purple-300";
      case "y2k-retro": return "bg-orange-500/10 border-orange-500/25 text-orange-700";
      case "pastel-green": return "bg-teal-500/10 border-teal-500/20 text-teal-400";
    }
  };

  return (
    <div 
      id="share-card-creator-box"
      className="p-6 md:p-8 rounded-[2.5rem] bg-zinc-900 border-2 border-zinc-800 backdrop-blur-md shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-black tracking-widest text-[#BCFF00] uppercase italic">
            Story Poster Studio
          </h3>
          <p className="text-xs text-zinc-400 font-medium">Export high-vibe sustainability flex stats</p>
        </div>
        <Share2 className="w-5 h-5 text-zinc-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Poster Simulator Preview */}
        <div className="lg:col-span-3 flex flex-col items-center">
          <div 
            id="simulated-story-card"
            className={`w-full max-w-[280px] aspect-[9/16] rounded-2xl p-5 border flex flex-col gap-3 shadow-2xl relative overflow-hidden transition-all duration-300 ${getThemeClasses()}`}
          >
            {/* Ambient glows for specific themes */}
            {theme === "cyber-emerald" && <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />}
            {theme === "aurora-dream" && <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-purple-500/20 rounded-full blur-2xl" />}

            {/* Poster Header */}
            <div className="z-10 flex items-center gap-2">
              {showAvatar && (
                <img
                  src={avatar}
                  alt={userName}
                  className="w-8 h-8 rounded-full border border-neutral-800 object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
              <div>
                <div className={`text-[11px] font-bold ${getTextColor()}`}>{userName}</div>
                <div className="text-[9px] font-mono opacity-60">@{userUsername}</div>
              </div>
            </div>

            {/* Poster Middle Stats Block */}
            <div className="z-10 space-y-2">
              <div className="space-y-0.5">
                <span className="text-[10px] tracking-widest font-mono uppercase opacity-75">FOOTPRINT REDUCED</span>
                <div className="text-3xl font-extrabold tracking-tight font-sans flex items-baseline gap-1">
                  <span>-{lastCarbonSaved || 12}kg</span>
                  <span className="text-xs font-normal opacity-70">CO₂e</span>
                </div>
              </div>

              {showStreak && (
                <div className={`p-2 rounded-xl border flex items-center justify-between ${getAccentBg()}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Eco active Streak</span>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 animate-bounce fill-current" />
                    <span className="text-xs font-mono font-bold">{streak} Days</span>
                  </div>
                </div>
              )}

              {showPoints && (
                <div className="space-y-0.5">
                  <div className="text-[9px] font-mono opacity-50 uppercase">Total Ecological points</div>
                  <div className="text-sm font-bold tracking-wider">{points} PTS</div>
                </div>
              )}
            </div>

            {/* Badges section — always renders at full size */}
            {badges && badges.length > 0 && (
              <div className="z-10 flex flex-col gap-1.5" id="simulated-card-badges-wrapper">
                <span className={`text-[8px] font-black tracking-wider uppercase text-center ${
                  theme === "y2k-retro" ? "text-neutral-500" : "text-neutral-400"
                }`}>
                  Achieved Milestone Badges
                </span>
                {/* Single row — badges never wrap or overlap */}
                <div
                  className="flex flex-row items-start justify-center gap-3"
                  id="simulated-card-badges-list"
                  style={{ overflowX: "auto" }}
                >
                  {badges.map((b) => {
                    const badgeType = getPhysicalBadgeType(b);
                    const badgeNames: Record<string, string> = {
                      gold: "1st Place Champion",
                      silver: "2nd Place Elite",
                      bronze: "3rd Place Achiever",
                      star: "Sunlord Streak",
                    };
                    return (
                      <div key={b.id} className="flex flex-col items-center flex-shrink-0" style={{ gap: 2 }}>
                        {/* Fixed same size for every badge */}
                        <div style={{ width: 68, height: 68, flexShrink: 0 }}>
                          <PhysicalBadge type={badgeType} size="sm" showLabel={false} transparent={true} />
                        </div>
                        <span className={`text-[7px] font-bold text-center leading-tight ${
                          theme === "y2k-retro" ? "text-neutral-700" : "text-neutral-200"
                        }`} style={{ width: 68 }}>
                          {badgeNames[badgeType]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quote and Brand footprint — pushed to bottom */}
            <div className="z-10 text-center space-y-2 mt-auto">
              {customQuote && (
                <p className={`text-[10px] italic leading-relaxed px-1 ${getTextColor()}`}>
                  "{customQuote}"
                </p>
              )}
              
              <div className="py-1 border-t border-current/10 flex items-center justify-center text-[8px] font-mono tracking-widest uppercase opacity-70 gap-1.5">
                <span>⚡ GREENPULSE.SOC</span>
                <span>•</span>
                <span>LVL {Math.ceil(points / 500)} EcoElite</span>
              </div>
            </div>
          </div>
        </div>

        {/* Poster controls */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-brand-neon" /> Select Graphic Skin
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="skin-cyber-btn"
                type="button"
                onClick={() => setTheme("cyber-emerald")}
                className={`py-2 text-center text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
                  theme === "cyber-emerald"
                    ? "bg-zinc-805 text-brand-neon border border-brand-neon/30 hover:text-brand-neon"
                    : "bg-zinc-950 text-zinc-400 hover:text-white border border-transparent"
                }`}
              >
                Cyber Neon
              </button>
              <button
                id="skin-aurora-btn"
                type="button"
                onClick={() => setTheme("aurora-dream")}
                className={`py-2 text-center text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
                  theme === "aurora-dream"
                    ? "bg-zinc-805 text-pink-400 border border-pink-500/40 hover:text-pink-400"
                    : "bg-zinc-950 text-zinc-400 hover:text-white border border-transparent"
                }`}
              >
                Midnight Purple
              </button>
              <button
                id="skin-y2k-btn"
                type="button"
                onClick={() => setTheme("y2k-retro")}
                className={`py-2 text-center text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
                  theme === "y2k-retro"
                    ? "bg-stone-300 text-orange-700 border border-stone-400 hover:text-orange-700"
                    : "bg-zinc-950 text-zinc-400 hover:text-white border border-transparent"
                }`}
              >
                Y2K Orange
              </button>
              <button
                id="skin-pastel-btn"
                type="button"
                onClick={() => setTheme("pastel-green")}
                className={`py-2 text-center text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
                  theme === "pastel-green"
                    ? "bg-zinc-805 text-teal-400 border border-teal-500/20 hover:text-teal-400"
                    : "bg-zinc-950 text-zinc-400 hover:text-white border border-transparent"
                }`}
              >
                Pastel Teal
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 block flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-brand-neon" /> Layout Toggles
            </label>
            <div className="space-y-2 bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 select-none">
                <input
                  type="checkbox"
                  checked={showAvatar}
                  onChange={(e) => setShowAvatar(e.target.checked)}
                  className="rounded text-brand-neon bg-zinc-950 border-zinc-800 focus:ring-0 checked:bg-brand-neon checked:border-brand-neon h-4 w-4 cursor-pointer"
                />
                <span className="font-semibold text-xs text-zinc-350">Include Profile Info</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 select-none">
                <input
                  type="checkbox"
                  checked={showStreak}
                  onChange={(e) => setShowStreak(e.target.checked)}
                  className="rounded text-brand-neon bg-zinc-950 border-zinc-800 focus:ring-0 checked:bg-brand-neon checked:border-brand-neon h-4 w-4 cursor-pointer"
                />
                <span className="font-semibold text-xs text-zinc-350">Show Streak Flame 🔥</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 select-none">
                <input
                  type="checkbox"
                  checked={showPoints}
                  onChange={(e) => setShowPoints(e.target.checked)}
                  className="rounded text-brand-neon bg-zinc-950 border-zinc-800 focus:ring-0 checked:bg-brand-neon checked:border-brand-neon h-4 w-4 cursor-pointer"
                />
                <span className="font-semibold text-xs text-zinc-350">Show Ecosystem Score</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2 font-mono tracking-widest">
              Hype Subtext / Slogan
            </label>
            <input
              id="poster-quote-input"
              type="text"
              placeholder="e.g. Living green is a whole vibe."
              value={customQuote}
              onChange={(e) => setCustomQuote(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-brand-neon font-semibold text-[11px]"
            />
          </div>

          <button
            id="download-poster-btn"
            onClick={handleDownload}
            className="w-full py-3.5 bg-[#BCFF00] hover:scale-[1.01] active:scale-95 text-black font-black uppercase tracking-widest italic rounded-2xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_0_15px_rgba(188,255,0,0.15)]"
          >
            <Download className="w-4 h-4 cursor-pointer stroke-[2.5]" />
            <span>Download Story Poster</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div 
          id="toast-notification"
          className="mt-3 p-3 rounded-2xl bg-zinc-950 border border-brand-neon/20 text-xs font-mono font-bold text-brand-neon text-center animate-bounce duration-500 uppercase tracking-widest font-black"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
