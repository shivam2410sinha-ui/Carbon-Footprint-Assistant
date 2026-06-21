import React from "react";
import { Award, Zap, ChevronRight, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";
import { ActivityLog, UserProfile, Badge } from "../types";

// Define standard points-based badges
export const POINTS_BADGES = [
  {
    id: "badge-points-1",
    name: "1st Place Points Sovereign",
    icon: "🥇",
    color: "from-amber-400 via-yellow-500 to-emerald-500 text-yellow-950 font-black",
    rankRequirement: 1,
    description: "Honors the absolute highest weekly points accumulator. Premium Gold-gilted lightning crest celebrating apex activity levels."
  },
  {
    id: "badge-points-2",
    name: "2nd Place Points Titan: EcoPoints Paragon",
    icon: "🥈",
    color: "from-slate-200 via-zinc-300 to-[#00E5FF] text-slate-900 font-extrabold",
    rankRequirement: 2,
    description: "Honors the #2 weekly points accumulator. Polished Silver lightning crest celebrating exceptionally fast low-carbon habit logging."
  },
  {
    id: "badge-points-3",
    name: "3rd Place Points Vanguard: EcoPoints Pioneer",
    icon: "🥉",
    color: "from-orange-400 via-amber-600 to-red-400 text-orange-950 font-bold",
    rankRequirement: 3,
    description: "Honors the #3 weekly points accumulator. Burnished Bronze lightning crest commemorating stellar green efforts."
  }
];

interface PointsBreakupLedgerProps {
  userPoints: number;
  logs: ActivityLog[];
  competitors: UserProfile[];
  currentUserProfile: UserProfile;
  onRedeemPointsBadge: (badge: typeof POINTS_BADGES[0]) => void;
  userRedeemedBadges: Badge[];
}

export default function PointsBreakupLedger({
  userPoints,
  logs,
  competitors,
  currentUserProfile,
  onRedeemPointsBadge,
  userRedeemedBadges
}: PointsBreakupLedgerProps) {
  // 1. Calculate category-specific points
  const transportPoints = logs.filter(l => l.category === "transport").reduce((sum, l) => sum + l.pointsEarned, 0);
  const foodPoints = logs.filter(l => l.category === "food").reduce((sum, l) => sum + l.pointsEarned, 0);
  const energyPoints = logs.filter(l => l.category === "energy").reduce((sum, l) => sum + l.pointsEarned, 0);
  const wastePoints = logs.filter(l => l.category === "waste").reduce((sum, l) => sum + l.pointsEarned, 0);
  
  // Smashed challenges (tracked via logs containing 'Smashed Challenge' in title)
  const challengePoints = logs
    .filter(l => l.title.toLowerCase().includes("smashed challenge") || l.category as any === "challenge")
    .reduce((sum, l) => sum + l.pointsEarned, 0);

  // Initial balance representation 
  const baseStartingBalance = 300; 

  const totalCalculatedBreakup = transportPoints + foodPoints + energyPoints + wastePoints + challengePoints + baseStartingBalance;
  // Adjust starting balance so everything sums up perfectly to live userPoints
  const adjustedBaseStarting = Math.max(0, userPoints - (transportPoints + foodPoints + energyPoints + wastePoints + challengePoints));

  // Category percentage items list
  const categoryItems = [
    { name: "Transport & Commute", points: transportPoints, color: "bg-blue-500", text: "text-blue-600", emoji: "🚇" },
    { name: "Plant-Based Nutrition", points: foodPoints, color: "bg-amber-500", text: "text-amber-600", emoji: "🥗" },
    { name: "Energy Optimization", points: energyPoints, color: "bg-yellow-500", text: "text-yellow-600", emoji: "⚡" },
    { name: "Waste & Circularity", points: wastePoints, color: "bg-purple-500", text: "text-purple-600", emoji: "🧥" },
    { name: "Smashed Challenges", points: challengePoints, color: "bg-emerald-500", text: "text-emerald-650", emoji: "🏆" },
    { name: "Initial Balance Calibration", points: adjustedBaseStarting, color: "bg-zinc-400", text: "text-zinc-500", emoji: "🎁" }
  ].filter(i => i.points > 0);

  // 2. Points standing (Leaderboard sorted by Points Descending)
  const allProfilesByPoints = [
    ...competitors,
    currentUserProfile
  ].sort((a, b) => b.points - a.points);

  const rankedProfilesByPoints = allProfilesByPoints.map((p, idx) => ({
    ...p,
    pointsRank: idx + 1
  }));

  const myPointsRankObj = rankedProfilesByPoints.find(p => p.id === "user-me") || { pointsRank: 5 };
  const pointsRank = myPointsRankObj.pointsRank;

  // Determine which points badge they qualify for based on current rank
  const projectedBadge = POINTS_BADGES.find(b => b.rankRequirement === pointsRank);
  const eligibleForTopThree = pointsRank <= 3;

  // Calculate points needed to overtake the next higher competitor
  let climbingHint = "";
  if (pointsRank > 1) {
    const targetComp = rankedProfilesByPoints[pointsRank - 2]; // Competitor ahead of user
    const pointsDifference = targetComp.points - userPoints;
    climbingHint = `You are only ${pointsDifference + 1} point${pointsDifference === 0 ? "" : "s"} away from overtaking ${targetComp.name} at Rank #${pointsRank - 1}!`;
  } else {
    climbingHint = "Rank #1 Secured! Slay of the week, absolute points champion! 👑";
  }

  // Calculate target for top 3 entry if not there
  let topThreeEntryHint = "";
  if (pointsRank > 3) {
    const rank3Comp = rankedProfilesByPoints[2];
    const diff = rank3Comp.points - userPoints;
    topThreeEntryHint = `Earn ${diff + 1} more points to enter the Top 3 points table and lock your physical winner badge!`;
  }

  return (
    <div 
      id="points-breakup-ledger-wrapper"
      className="bg-white border-2 border-zinc-200 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6"
    >
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-150">
        <div className="space-y-1">
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-[9px] font-mono font-black rounded-lg uppercase tracking-wider border border-amber-200 flex items-center gap-1.5 w-fit">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" /> LIVE POINTS BREAKUP & LEDGER
          </span>
          <h3 className="text-xl md:text-2xl font-black italic text-zinc-900 uppercase">
            Weekly EcoPoints <span className="text-emerald-700">Earnings Breakdown</span>
          </h3>
          <p className="text-xs text-zinc-550 leading-normal font-semibold">
            Review exactly how you accumulated your points this week. Climb the standings to secure prestigious Badges.
          </p>
        </div>

        {/* Global userPoints badge highlight */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center uppercase shrink-0 sm:min-w-[150px]">
          <span className="text-[9px] text-zinc-500 block font-bold tracking-wider">Total Accumulated Balance</span>
          <span className="text-2xl font-black text-amber-600 block mt-0.5">{userPoints} pts</span>
          <span className="text-[9px] text-zinc-400 block font-mono font-bold tracking-wider mt-0.5">Points Table Rank #{pointsRank}</span>
        </div>
      </div>

      {/* DISSOLVED METRIC BARS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
        
        {/* LEFT COLUMN: DYNAMIC DRILLDOWN BREAKDOWN OF POINTS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-zinc-50 px-3.5 py-2 rounded-xl border border-zinc-150">
            <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider font-mono">Category Allocation</span>
            <span className="text-[10px] text-zinc-500 font-bold font-mono">Points Earned</span>
          </div>

          <div className="space-y-3">
            {categoryItems.map((item, index) => {
              const pct = userPoints > 0 ? (item.points / userPoints) * 100 : 0;
              return (
                <div key={index} className="space-y-1.5" id={`breakup-item-${index}`}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                      <span className="text-sm select-none">{item.emoji}</span>
                      <span>{item.name}</span>
                    </span>
                    <span className="font-bold text-zinc-900 font-mono">+{item.points} pts <span className="text-[10px] text-zinc-450 font-normal">({Math.round(pct)}%)</span></span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden p-[1px] border border-zinc-200/50">
                    <div 
                      className={`h-full rounded-full ${item.color} transition-all duration-700`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ledger logs breakdown statement helper */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 text-[11px] text-zinc-650 leading-relaxed font-semibold flex items-start gap-2.5 border border-zinc-200">
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-zinc-900 font-extrabold">Active Progress Insight: </span>
              {climbingHint} {topThreeEntryHint && <span className="text-purple-700 font-bold block mt-1">{topThreeEntryHint}</span>}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: points standings leaderboard and dynamic Projected winner badge prediction */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-zinc-50 px-3.5 py-2 rounded-xl border border-zinc-150">
            <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider font-mono">Points Standings Race</span>
            <span className="text-[10px] text-zinc-500 font-bold font-mono">Total score</span>
          </div>

          <div className="space-y-1.5" id="points-standings-mini-list">
            {rankedProfilesByPoints.map((p) => {
              const isMe = p.id === "user-me";
              return (
                <div 
                  key={p.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                    isMe 
                      ? "bg-amber-500/10 border-amber-500/30 font-black shadow-sm" 
                      : "bg-white border-zinc-150"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-md font-mono text-[10px] flex items-center justify-center font-extrabold ${
                      p.pointsRank === 1 ? "bg-amber-100 text-amber-800" :
                      p.pointsRank === 2 ? "bg-slate-100 text-zinc-700" :
                      p.pointsRank === 3 ? "bg-orange-100 text-orange-850" :
                      "bg-zinc-100 text-zinc-500"
                    }`}>
                      0{p.pointsRank}
                    </span>
                    <img src={p.avatar} alt={p.name} className="w-5.5 h-5.5 rounded-full object-cover" />
                    <span className={`text-xs ${isMe ? "text-amber-950 font-extrabold" : "text-zinc-800 font-bold"}`}>
                      {p.name} {isMe && <span className="text-[9px] px-1 bg-amber-500 text-amber-950 rounded uppercase font-mono font-black ml-1">YOU</span>}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-black text-zinc-900">{p.points} pts</span>
                </div>
              );
            })}
          </div>

          {/* PROJECTED WEEKLY SNAPSHOT POINTS BADGE - EXCLUSIVE BADGES WALL PORTION */}
          <div className="p-4 rounded-3xl bg-neutral-950 text-white space-y-3 mt-4 relative overflow-hidden shadow-md">
            {/* Ambient gold glow effect for top 3 points racers */}
            {eligibleForTopThree && (
              <div className="absolute right-[-20px] top-[-20px] w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
            )}

            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> PROJECTED RECIPIENT BADGE
              </span>
              <span className="text-[8px] font-mono text-zinc-500 font-bold uppercase">Points Table reset</span>
            </div>

            {eligibleForTopThree && projectedBadge ? (
              <div className="space-y-3 relative z-10" id="projected-badge-winner-box">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${projectedBadge.color} shrink-0 text-zinc-950 text-xl font-bold flex items-center justify-center w-10.5 h-10.5`}>
                    {projectedBadge.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase italic tracking-tight text-zinc-50">{projectedBadge.name}</h4>
                    <p className="text-[10px] text-emerald-400 font-mono font-bold mt-0.5">Rank #{projectedBadge.rankRequirement} Points Leaderboard Match ✓</p>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
                  {projectedBadge.description}
                </p>

                {/* Instant Claim Button for points verification */}
                <div className="pt-1.5 flex items-center justify-between gap-3">
                  <div className="text-[10px] text-zinc-500 font-semibold italic">Redeem dynamically to keep it permanently on your profile!</div>
                  <button
                    onClick={() => onRedeemPointsBadge(projectedBadge)}
                    disabled={userRedeemedBadges.some(b => b.id.startsWith(projectedBadge.id))}
                    className={`py-1.5 px-3.5 rounded-lg text-[9px] font-mono font-black uppercase transition shrink-0 cursor-pointer ${
                      userRedeemedBadges.some(b => b.id.startsWith(projectedBadge.id))
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        : "bg-amber-400 hover:bg-amber-300 text-neutral-950 border border-amber-500 active:scale-95"
                    }`}
                  >
                    {userRedeemedBadges.some(b => b.id.startsWith(projectedBadge.id)) ? "Claimed & Saved" : "Claim Badge Now"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-center py-2 bg-neutral-900 border border-neutral-800 rounded-2xl" id="projected-badge-locked-box">
                <span className="text-xl select-none">🔒</span>
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase">Season Badging Restricted</h4>
                <p className="text-[10px] text-zinc-500 leading-normal max-w-sm mx-auto px-4">
                  Currently Rank #{pointsRank}. Climb to Rank #3 or better in the Points Standing table above to unlock exclusive Weekly Points Table Badges!
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
