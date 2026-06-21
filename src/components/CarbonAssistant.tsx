import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, HelpCircle, ShieldAlert, CheckCircle } from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export default function CarbonAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I am your Carbon AI Advisor. I can help you track and reduce your carbon footprint. You can talk to me or use the tools to log activities like 'COMMUTE_CAR' or 'HOME_ELEC'. Make sure your User ID is registered!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(() => localStorage.getItem("gp_profile_username") || "eco_shivam");
  const [sessionId] = useState(() => "sess-" + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { text: "Log my car commute today", prompt: "Please log activity category 'COMMUTE_CAR' for my user ID." },
    { text: "Log my home electricity saving", prompt: "Please log activity category 'HOME_ELEC' for my user ID." },
    { text: "Register my custom user ID", prompt: "Register user ID 'eco_shivam'" },
    { text: "How can I reduce emissions?", prompt: "Give me 3 quick tips to reduce my daily carbon emissions." }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Clean target prompt text: replace placeholder with actual current username
      const resolvedPrompt = textToSend.replace("my user ID", `'${userId}'`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/adk/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          session_id: sessionId,
          new_message: {
            role: "user",
            parts: [{ text: resolvedPrompt }]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to contact agent: status ${response.status}`);
      }

      const events = await response.json();
      
      // Parse output text parts from the returned events list
      let advisorResponseText = "";
      if (Array.isArray(events)) {
        events.forEach((ev: any) => {
          if (ev.content && ev.content.parts) {
            ev.content.parts.forEach((part: any) => {
              if (part.text) {
                advisorResponseText += part.text;
              }
            });
          }
        });
      }

      if (!advisorResponseText) {
        advisorResponseText = "The environmental advisor did not return a textual response, but executed your command.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: advisorResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `⚠️ Connection Error: ${err.message}. Please verify the ADK python backend is running.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border-2 border-zinc-200 rounded-[2.5rem] p-6 shadow-xl space-y-6 flex flex-col h-[75vh]" id="carbon-assistant-container">
      {/* Header section */}
      <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-500/20 text-emerald-700 rounded-2xl flex items-center justify-center shadow-inner">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black tracking-tight text-zinc-900 uppercase flex items-center gap-1.5 italic leading-none">
              CARBON ADVISOR
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md uppercase tracking-wider border border-emerald-200/50">
                ADK 2.0 Agent
              </span>
            </h3>
            <p className="text-[11px] text-zinc-500 font-mono mt-0.5 uppercase tracking-widest font-extrabold">AI Environmental Consultant</p>
          </div>
        </div>

        {/* User identification credentials */}
        <div className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 rounded-full px-3 py-1.5">
          <span className="text-[9px] font-mono text-zinc-550 uppercase font-black tracking-wider">Active ID:</span>
          <input
            type="text"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              localStorage.setItem("gp_profile_username", e.target.value);
            }}
            placeholder="Username"
            className="text-xs font-mono font-extrabold text-emerald-700 bg-transparent border-none outline-none focus:ring-0 w-24 text-right"
          />
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
              msg.role === "user" 
                ? "bg-zinc-800 text-white border-zinc-950" 
                : "bg-emerald-600 text-white border-emerald-700"
            }`}>
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={`max-w-[75%] p-4 rounded-3xl text-xs leading-relaxed font-semibold shadow-sm border ${
              msg.role === "user"
                ? "bg-zinc-900 border-zinc-950 text-neutral-100 rounded-tr-none"
                : "bg-white border-zinc-250 text-zinc-850 rounded-tl-none"
            }`}>
              <p className="whitespace-pre-line">{msg.text}</p>
              <span className={`text-[8px] font-mono block mt-1.5 opacity-60 ${msg.role === "user" ? "text-right" : ""}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 text-white border border-emerald-700 shrink-0 animate-bounce">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-zinc-250 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts list */}
      {messages.length === 1 && !loading && (
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Suggested Queries
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug.prompt)}
                className="px-3.5 py-2 bg-zinc-50 hover:bg-emerald-50 hover:text-emerald-800 border-2 border-zinc-200 hover:border-emerald-300 rounded-full text-xs font-bold text-zinc-700 transition active:scale-95 cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{sug.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input controls form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="relative flex items-center bg-zinc-50 border-2 border-zinc-200 rounded-[1.8rem] focus-within:border-emerald-500/80 transition p-1.5 pr-2 gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask environmental tips, or log carbon activities..."
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 pl-4 py-2 text-xs font-semibold text-zinc-800"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition active:scale-95 cursor-pointer shadow ${
            input.trim() && !loading
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
          }`}
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
}
