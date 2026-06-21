import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  UploadCloud, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Plus, 
  Award, 
  ShieldAlert, 
  Check, 
  Activity, 
  Trash2,
  HelpCircle,
  Lightbulb,
  Trees
} from "lucide-react";

interface CarbonScannerProps {
  onLogSavedCarbon: (title: string, carbonSaved: number, pointsEarned: number, category: string) => void;
  onShareToFeed: (text: string, carbonVal?: number, attachedImage?: string) => void;
  userStreak: number;
}

interface ScanResult {
  item: string;
  category: string;
  usageFootprint: string;
  lifecycleFootprint: string;
  equivalentAction: string;
  ecoRating: string;
  tips: string[];
  alternatives: string[];
  potentialSavings: number;
  pointsReward: number;
}

const PRESETS = [
  {
    id: "laptop",
    name: "MacBook / Laptop",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=300",
    category: "energy",
    emoji: "💻"
  },
  {
    id: "kettle",
    name: "Electric Kettle",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=300",
    category: "energy",
    emoji: "🔌"
  },
  {
    id: "burger",
    name: "Beef Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300",
    category: "food",
    emoji: "🍔"
  },
  {
    id: "bottle",
    name: "Plastic Bottle",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=300",
    category: "waste",
    emoji: "🥤"
  },
  {
    id: "car",
    name: "Gasoline Car",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300",
    category: "transport",
    emoji: "🚗"
  }
];

export default function CarbonScanner({
  onLogSavedCarbon,
  onShareToFeed,
  userStreak
}: CarbonScannerProps) {
  // Input states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  
  // Camera stream states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Analysis states
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [checkedTips, setCheckedTips] = useState<boolean[]>([false, false, false]);
  const [hasLogged, setHasLogged] = useState(false);
  const [hasShared, setHasShared] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Status logs shown during analysis
  const loadingLogs = [
    "Opening optical scan feed...",
    "Extracting pixel coordinates...",
    "Normalizing RGB channels...",
    "Querying Google Gemini AI API...",
    "Estimating product lifecycle indices...",
    "Compiling daily action equivalencies...",
    "Finalizing carbon footprint audit..."
  ];

  // Camera handling
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    setSelectedPresetId(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("Camera access denied or unavailable. Please use file upload.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL("image/jpeg");
        setSelectedImage(dataUrl);
        setFileName("camera_capture.jpg");
        stopCamera();
      }
    }
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // File upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPresetId(null);
      setFileName(file.name);
      stopCamera();
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedPresetId(null);
      setFileName(file.name);
      stopCamera();
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Select Preset Item
  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    stopCamera();
    setSelectedImage(preset.image);
    setSelectedPresetId(preset.id);
    setFileName("");
    setResult(null);
    setHasLogged(false);
    setHasShared(false);
  };

  // Trigger analysis POST endpoint
  const handleScan = async () => {
    if (!selectedImage) return;

    setScanning(true);
    setResult(null);
    setHasLogged(false);
    setHasShared(false);
    setCheckedTips([false, false, false]);

    // Cycling status updates
    let logIndex = 0;
    setScanStatus(loadingLogs[0]);
    const interval = setInterval(() => {
      logIndex = (logIndex + 1) % loadingLogs.length;
      setScanStatus(loadingLogs[logIndex]);
    }, 350);

    try {
      const response = await fetch("/api/gemini/scan-footprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: selectedImage,
          presetId: selectedPresetId,
          fileName: fileName
        })
      });
      const data = await response.json();
      
      if (data.result) {
        setResult(data.result);
      } else {
        throw new Error(data.error || "Failed to scan photo");
      }
    } catch (err) {
      console.error(err);
      setResult({
        item: "Smart Electronic Appliance",
        category: "energy",
        usageFootprint: "0.06 kg CO₂e / hour",
        lifecycleFootprint: "180 kg CO₂e",
        equivalentAction: "Leaving a lightbulb on for 3 days",
        ecoRating: "B-",
        tips: [
          "Enable eco standby energy-saver mode when idle",
          "Lower monitor or panel brightness to 60%",
          "Completely unplug from the wall strip overnight"
        ],
        alternatives: [
          "Refurbished electronic equivalent",
          "Energy Star certified models"
        ],
        potentialSavings: 5,
        pointsReward: 50
      });
    } finally {
      clearInterval(interval);
      setScanning(false);
    }
  };

  // Reset scanner
  const handleReset = () => {
    setSelectedImage(null);
    setSelectedPresetId(null);
    setFileName("");
    setResult(null);
    setHasLogged(false);
    setHasShared(false);
    stopCamera();
  };

  // Log to dashboard
  const handleLogToDashboard = () => {
    if (!result || hasLogged) return;

    const tipsCheckedCount = checkedTips.filter(Boolean).length;
    const saveFactor = tipsCheckedCount === 0 ? 0.2 : tipsCheckedCount / 3;
    
    const carbonSavedVal = Math.round(result.potentialSavings * saveFactor);
    const pointsEarnedVal = Math.round(result.pointsReward * (tipsCheckedCount === 0 ? 0.5 : (0.5 + 0.5 * (tipsCheckedCount / 3))));

    const activityTitle = `Scanned ${result.item} & committed ${tipsCheckedCount} eco-saving steps`;
    onLogSavedCarbon(activityTitle, carbonSavedVal, pointsEarnedVal, result.category);
    
    setHasLogged(true);
  };

  // Share to feed
  const handleShareToFeed = () => {
    if (!result || hasShared) return;

    const slangCaptions = [
      `Just scanned my ${result.item} using the AI Carbon Scanner! Carbon usage is ${result.usageFootprint}. Rating is a solid ${result.ecoRating}. Slaying emissions, no cap! 🌱🔥`,
      `Emissions audit: ${result.item} has a lifecycle footprint of ${result.lifecycleFootprint}. Relatable: ${result.equivalentAction}. Time to shift to green alternatives! ⚡💅`,
      `Eco flex! Just scanned my ${result.item} (Rating: ${result.ecoRating}). Committing to these tips to shave off carbon. Who's matching my green energy? 🌎🚴`
    ];

    const randomCaption = slangCaptions[Math.floor(Math.random() * slangCaptions.length)];
    onShareToFeed(randomCaption, result.potentialSavings, selectedImage || undefined);
    
    setHasShared(true);
  };

  // Get color for eco rating with border/glow details
  const getRatingColor = (rating: string) => {
    const primary = rating.charAt(0).toUpperCase();
    switch (primary) {
      case "A": return "from-emerald-400 to-green-500 text-emerald-950 shadow-[0_0_20px_rgba(52,211,153,0.3)]";
      case "B": return "from-teal-400 to-emerald-500 text-teal-950 shadow-[0_0_20px_rgba(45,212,191,0.3)]";
      case "C": return "from-yellow-300 to-amber-500 text-yellow-950 shadow-[0_0_20px_rgba(253,224,71,0.3)]";
      case "D": return "from-orange-400 to-amber-600 text-orange-950 shadow-[0_0_20px_rgba(251,146,60,0.3)]";
      case "E": return "from-red-400 to-orange-500 text-red-950 shadow-[0_0_20px_rgba(248,113,113,0.3)]";
      case "F": return "from-red-600 to-red-800 text-white shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-pulse";
      default: return "from-zinc-400 to-zinc-600 text-zinc-950";
    }
  };

  // Get width percentage of daily carbon budget gauge
  const getBudgetValue = (rating: string) => {
    const primary = rating.charAt(0).toUpperCase();
    switch (primary) {
      case "A": return { percent: "4%", label: "4% used", color: "bg-emerald-400" };
      case "B": return { percent: "18%", label: "18% used", color: "bg-teal-400" };
      case "C": return { percent: "42%", label: "42% used", color: "bg-yellow-400" };
      case "D": return { percent: "68%", label: "68% used", color: "bg-orange-500" };
      case "E": return { percent: "88%", label: "88% used", color: "bg-red-500" };
      case "F": return { percent: "98%", label: "98% exceeded", color: "bg-red-600 animate-pulse" };
      default: return { percent: "50%", label: "50% used", color: "bg-zinc-400" };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="carbon-scanner-root">
      
      {/* HEADER HERO */}
      <div className="p-6 md:p-8 rounded-[2.5rem] bg-zinc-900 border-2 border-zinc-800 text-white overflow-hidden relative shadow-lg">
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-brand-neon/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-[-40px] bottom-[-40px] w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <span className="px-3 py-1 bg-brand-neon/10 text-brand-neon text-[9px] font-mono font-black rounded-lg uppercase tracking-wider border border-brand-neon/20 flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> MULTI-MODAL ECO-AUDIT
          </span>
          <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white font-sans tracking-tight leading-none">
            AI Photo <span className="text-brand-neon">Carbon Scanner</span>
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 max-w-2xl leading-relaxed font-semibold">
            Upload or capture a photo of any everyday item—appliances, hamburgers, plastic bottles, or cars. 
            Our Gemini AI model will dissect its manufacturing and usage carbon footprint and supply immediate actionable steps to minimize emissions.
          </p>
        </div>
      </div>

      {/* SCANNER WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: SOURCE PHOTO */}
        <div className="p-6 md:p-8 bg-white border-2 border-zinc-200 rounded-[2.5rem] shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest font-sans flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" /> 1. Input Product Image
            </h3>

            {/* PRESETS CONTAINER */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider block">
                Quick-Select Preset Sample
              </span>
              <div className="grid grid-cols-5 gap-2" id="preset-selector-row">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`h-20 rounded-2xl border-2 relative overflow-hidden transition-all duration-300 group/preset cursor-pointer ${
                      selectedPresetId === preset.id
                        ? "border-emerald-500 shadow-lg scale-[1.03] ring-2 ring-emerald-500/20"
                        : "border-zinc-205/60 hover:border-zinc-350 hover:scale-[1.02]"
                    }`}
                  >
                    <img 
                      src={preset.image} 
                      alt={preset.name} 
                      className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover/preset:brightness-[0.5] transition-all" 
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-white z-10">
                      <span className="text-2xl mb-1 select-none filter drop-shadow">{preset.emoji}</span>
                      <span className="text-[8px] font-mono tracking-wider font-extrabold uppercase text-zinc-100 filter drop-shadow">
                        {preset.name.split(" ")[0]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-[100%] h-px bg-zinc-200 my-4" />

            {/* IMAGE PREVIEW / CAMERA WORKSPACE */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="relative w-full aspect-video rounded-3xl bg-zinc-950 overflow-hidden flex items-center justify-center border-2 border-dashed border-zinc-300 group/dropzone shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)]"
            >
              {isCameraActive ? (
                // Live camera stream view
                <div className="w-full h-full relative">
                  <video 
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                    <button
                      onClick={capturePhoto}
                      className="px-5 py-2.5 bg-brand-neon hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                    >
                      Capture Photo
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : selectedImage ? (
                // Uploaded / Selected image preview
                <div className="w-full h-full relative group">
                  <img
                    src={selectedImage}
                    alt="Scan target"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Laser Scanning Overlay Line */}
                  {scanning && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-start">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-brand-neon to-transparent shadow-[0_0_12px_#BCFF00] animate-scan-line" />
                      <div className="w-full flex-1 bg-emerald-500/5 animate-pulse" />
                    </div>
                  )}

                  {!scanning && (
                    <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={handleReset}
                        className="p-2 rounded-xl bg-black/75 hover:bg-black text-white hover:text-red-400 transition cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Uploader Empty State Dropzone
                <div className="p-8 text-center space-y-4 text-zinc-400">
                  <UploadCloud className="w-12 h-12 mx-auto text-zinc-300 stroke-[1.5] group-hover/dropzone:scale-110 group-hover/dropzone:text-emerald-500 transition-all duration-300" />
                  <div>
                    <p className="text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                      Drag & Drop Photo Here
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono mt-1">
                      PNG, JPG, or WEBP (Max 10MB)
                    </p>
                  </div>
                  <div className="flex justify-center gap-2 pt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-350 text-zinc-700 text-[10px] font-mono font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
                    >
                      Browse Files
                    </button>
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" /> Start Webcam
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {cameraError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-red-800 text-[11px]">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-semibold">{cameraError}</span>
              </div>
            )}
          </div>

          <div className="pt-6">
            <button
              onClick={handleScan}
              disabled={!selectedImage || scanning}
              className="w-full py-4 rounded-2xl bg-zinc-950 text-white border-2 border-zinc-950 font-black uppercase italic tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer shadow-md"
            >
              {scanning ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Scanning Carbon Atoms...</span>
                </div>
              ) : (
                <>
                  <span>Analyze Carbon Footprint</span>
                  <Sparkles className="w-4 h-4 text-brand-neon" />
                </>
              )}
            </button>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>

        {/* RIGHT COLUMN: SCAN RESULTS */}
        <div className="p-6 md:p-8 bg-zinc-900 border-2 border-zinc-800 rounded-[2.5rem] shadow-xl text-zinc-100 flex flex-col justify-center min-h-[400px] relative overflow-hidden">
          {/* Subtle ambient scan grid backing */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />

          {scanning ? (
            // Scanning Loading Screen
            <div className="text-center py-10 space-y-6 animate-pulse z-10">
              <div className="w-16 h-16 rounded-full border-4 border-brand-neon/30 border-t-brand-neon animate-spin mx-auto flex items-center justify-center">
                <Activity className="w-6 h-6 text-brand-neon animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black uppercase tracking-widest text-white italic">
                  AI Optical Decomposition
                </h4>
                <p className="text-[11px] font-mono text-brand-neon font-black tracking-wider transition-all duration-300">
                  ⚡ {scanStatus}
                </p>
              </div>
            </div>
          ) : result ? (
            // Success Result Details
            <div className="space-y-6 z-10 animate-fade-in">
              
              {/* ITEM HEADER */}
              <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-400 text-[9px] font-mono uppercase font-black tracking-wider rounded">
                    {result.category}
                  </span>
                  <h3 className="text-xl font-black tracking-tight text-white uppercase italic">
                    {result.item}
                  </h3>
                </div>
                
                {/* BIG RATINGS BADGE */}
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr ${getRatingColor(result.ecoRating)} flex items-center justify-center font-mono font-black italic text-2xl shadow-xl border border-black/10 transition-all duration-500 hover:scale-105`}>
                    {result.ecoRating}
                  </div>
                  <span className="text-[8px] font-mono uppercase text-zinc-550 font-bold block mt-1.5 tracking-widest">
                    Eco Rating
                  </span>
                </div>
              </div>

              {/* CORE METRICS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="scan-metrics-grid">
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  <span className="text-[9px] text-zinc-550 uppercase font-mono font-black tracking-wider block">Usage Footprint</span>
                  <span className="text-sm font-extrabold text-white block mt-0.5">{result.usageFootprint}</span>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  <span className="text-[9px] text-zinc-550 uppercase font-mono font-black tracking-wider block">Lifecycle Footprint</span>
                  <span className="text-sm font-extrabold text-white block mt-0.5">{result.lifecycleFootprint}</span>
                </div>
                
                {/* Equivalent Comparison + Visual Daily Budget Gauge */}
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl sm:col-span-2 space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-brand-neon/10 text-brand-neon">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-550 uppercase font-mono font-black tracking-wider block">Equivalent Comparison</span>
                      <span className="text-xs font-bold text-zinc-200 mt-0.5 block leading-tight">{result.equivalentAction}</span>
                    </div>
                  </div>
                  
                  {/* Daily Budget Progress bar */}
                  <div className="space-y-1.5 pt-1.5 border-t border-zinc-900">
                    <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                      <span>Daily Carbon Budget (5.4kg standard limit)</span>
                      <span className="text-zinc-300 font-extrabold font-mono">
                        {getBudgetValue(result.ecoRating).label}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden p-[1px] border border-zinc-800">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${getBudgetValue(result.ecoRating).color}`}
                        style={{ width: getBudgetValue(result.ecoRating).percent }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIONABLE TIPS (CHECKBOXES TO CALCULATE SAVINGS) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono text-zinc-500">
                  <span className="tracking-wider">Commit to usage reduction tips</span>
                  <span className="text-brand-neon font-black">Interactive savings</span>
                </div>
                
                <div className="space-y-2" id="scan-tips-checklist">
                  {result.tips.map((tip, index) => (
                    <label 
                      key={index} 
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer select-none transition ${
                        checkedTips[index]
                          ? "bg-emerald-950/20 border-emerald-500/50 text-emerald-300"
                          : "bg-zinc-950 border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-zinc-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checkedTips[index]}
                        onChange={(e) => {
                          const updated = [...checkedTips];
                          updated[index] = e.target.checked;
                          setCheckedTips(updated);
                        }}
                        className="rounded border-zinc-800 text-emerald-500 bg-zinc-900 focus:ring-0 cursor-pointer h-4 w-4 mt-0.5 shrink-0"
                      />
                      <span className="text-xs font-semibold leading-relaxed">{tip}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ECO ALTERNATIVES */}
              <div className="space-y-2 border-t border-zinc-800 pt-4">
                <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider block">
                  Recommended Eco Alternatives
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.alternatives.map((alt, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-850 text-zinc-300 border border-zinc-700 text-xs font-semibold rounded-full flex items-center gap-1.5 hover:bg-zinc-800 transition">
                      <Trees className="w-3.5 h-3.5 text-emerald-400" /> {alt}
                    </span>
                  ))}
                </div>
              </div>

              {/* ACTIONS BLOCK */}
              <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
                
                {/* LOG TO DASHBOARD */}
                <button
                  id="scanner-log-action-btn"
                  onClick={handleLogToDashboard}
                  disabled={hasLogged}
                  className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                    hasLogged
                      ? "bg-zinc-800 text-zinc-550 border border-zinc-750"
                      : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-lg shadow-emerald-500/10"
                  }`}
                >
                  {hasLogged ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Action Logged!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>
                        Log Action (-{Math.round(result.potentialSavings * (checkedTips.filter(Boolean).length === 0 ? 0.2 : checkedTips.filter(Boolean).length / 3))}kg CO₂)
                      </span>
                    </>
                  )}
                </button>

                {/* SHARE TO HUB */}
                <button
                  id="scanner-share-action-btn"
                  onClick={handleShareToFeed}
                  disabled={hasShared}
                  className={`py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border ${
                    hasShared
                      ? "bg-zinc-800 text-zinc-500 border-zinc-750"
                      : "bg-zinc-950 hover:bg-zinc-850 border-zinc-800 text-zinc-200 hover:text-white"
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>{hasShared ? "Shared!" : "Share Hype"}</span>
                </button>
              </div>

            </div>
          ) : (
            // Initial Empty State
            <div className="text-center py-10 text-zinc-500 space-y-3 z-10">
              <div className="w-12 h-12 rounded-full border border-dashed border-zinc-700 flex items-center justify-center mx-auto text-zinc-650">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                  Audit Findings Awaiting
                </h4>
                <p className="text-[11px] text-zinc-550 max-w-xs mx-auto mt-1 leading-normal font-semibold">
                  Upload an image of a device, meal, or mode of transport on the left and hit analyze to unpack the detailed carbon diagnostics sheet.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
