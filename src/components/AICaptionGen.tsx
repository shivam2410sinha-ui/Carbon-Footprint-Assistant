import React, { useState } from "react";
import { Sparkles, MessageSquareShare, MessageSquareWarning, Flame, Zap, Copy, Check } from "lucide-react";

interface AICaptionGenProps {
  streak: number;
  activity: string;
  carbonSaved: number;
  points: number;
  onSelectCaption: (caption: string) => void;
}

export default function AICaptionGen({
  streak,
  activity,
  carbonSaved,
  points,
  onSelectCaption,
}: AICaptionGenProps) {
  const [roastMode, setRoastMode] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedCaption("");
    try {
      const response = await fetch("/api/gemini/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streak,
          activity: activity || "biking or recycler lifestyle",
          carbonSaved,
          points,
          roastMode,
        }),
      });
      const data = await response.json();
      if (data.caption) {
        setGeneratedCaption(data.caption);
      } else {
        setGeneratedCaption("Failed to generate caption. Keep planting trees though! 🌱");
      }
    } catch (e) {
      console.error(e);
      setGeneratedCaption("Error connecting to space. Here is some manual hype: Biking today was a whole aesthetic. Slay! 🚲🌱");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="ai-caption-card"
      className="p-6 md:p-8 rounded-[2.5rem] bg-zinc-900 border-2 border-zinc-800 shadow-xl opacity-100"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-neon animate-pulse" />
          <h3 className="text-sm font-black tracking-wider text-white uppercase italic">
            AI Eco-Hype Engine
          </h3>
        </div>
        <div 
          id="toggle-mode-pills"
          className="flex bg-zinc-950 p-1 rounded-full border border-zinc-805 w-full sm:w-auto"
        >
          <button
            id="hype-mode-btn"
            type="button"
            onClick={() => setRoastMode(false)}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition uppercase tracking-wider flex-1 sm:flex-initial cursor-pointer ${
              !roastMode
                ? "bg-brand-neon text-black shadow-md italic font-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Hype Mode
          </button>
          <button
            id="roast-mode-btn"
            type="button"
            onClick={() => setRoastMode(true)}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition uppercase tracking-wider flex-1 sm:flex-initial cursor-pointer ${
              roastMode
                ? "bg-red-500 text-white shadow-md italic font-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Spicy Roast
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-400 mb-4 leading-relaxed font-medium">
        {roastMode
          ? "Feeling brave? Let's analyze your current habits and deliver some cold hard truths. No sugarcoating whatsoever."
          : "Get a customized, highly shareable Gen Z caption optimized for Instagram, TikTok, or your GreenFeed based on your achievements."}
      </p>

      {/* Input states preview */}
      <div 
        id="hype-input-preview-box"
        className="grid grid-cols-2 gap-3 mb-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase font-bold"
      >
        <div>Streak: <span className="text-white block text-xs font-mono font-bold mt-0.5">{streak} Days</span></div>
        <div>Activity: <span className="text-white block text-xs truncate max-w-[120px] font-bold mt-0.5">{activity || "Biking Recycler"}</span></div>
        <div>CO2 Saved: <span className="text-brand-neon block text-xs font-bold mt-0.5">{carbonSaved} kg</span></div>
        <div>Eco Points: <span className="text-amber-400 block text-xs font-bold mt-0.5">{points} pts</span></div>
      </div>

      {generatedCaption ? (
        <div className="space-y-3 animate-fade-in" id="caption-result-pane">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 relative group/caption">
            <p className="text-xs text-zinc-200 italic leading-relaxed pr-6 font-medium">
              {generatedCaption}
            </p>
            <div className="absolute right-2 top-2 flex gap-1.5 opacity-60 hover:opacity-100 transition">
              <button
                id="btn-copy-caption"
                onClick={copyToClipboard}
                className="p-1.5 rounded bg-zinc-900 border border-zinc-805 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                title="Copy text"
              >
                {copied ? <Check className="w-4 h-4 text-brand-neon" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              id="btn-use-caption"
              onClick={() => onSelectCaption(generatedCaption)}
              className="flex-1 py-3 bg-brand-neon text-black text-xs font-black uppercase italic tracking-wider rounded-xl hover:scale-[1.01] active:scale-95 transition cursor-pointer"
            >
              Paste to Composer
            </button>
            <button
              id="btn-regenerate-caption"
              onClick={handleGenerate}
              className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <button
          id="btn-trigger-ai-caption"
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest italic transition flex items-center justify-center gap-2 cursor-pointer ${
            roastMode
              ? "bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-neutral-100"
              : "bg-brand-neon text-black shadow-lg shadow-brand-neon/15"
          } active:scale-95 disabled:scale-100 disabled:opacity-50`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              <span>Analyzing Atmospheric Carbon...</span>
            </div>
          ) : (
            <>
              <span>{roastMode ? "Generate Spicy Roast" : "Formulate Green Caption"}</span>
              <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
