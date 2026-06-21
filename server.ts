import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // Initialize Gemini API client safely and lazily
  let ai: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY is not defined in environment variables");
      }
      ai = new GoogleGenAI({
        apiKey: apiKey || "MOCK_KEY",
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return ai;
  }

  // API router
  app.post("/api/gemini/generate-caption", async (req, res) => {
    try {
      const { streak, activity, carbonSaved, points, roastMode } = req.body;
      
      const client = getGeminiClient();
      
      // Check if API key exists and is valid
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || process.env.GEMINI_API_KEY === "MOCK_KEY") {
        // Fallback mock responses if there is no real key, so the app remains functional and engaging
        const mocks = roastMode 
          ? [
              `Eco footprint carbon progress is ${carbonSaved}kg? Cute. My smart toaster saves more energy than that by dying. Keep walking though. 🌱💀`,
              `Organic consumer detected. Your ${streak}-day streak is nice, but those single-use plastic wrapper vibes are screaming. Roast level: Spicy. 🥗💀`,
              `Streak of ${streak} days? Congrats, you didn't drive for two blocks. Here is a digital badge made of virtual compost. 🏅♻️`
            ]
          : [
              `Just knocked out ${carbonSaved}kg CO2! ${streak}-day green streak is sizzling 🔥 We are curing eco-anxiety one bus ride at a time. #GreenPulse #NoCap 🌱✨`,
              `Day ${streak} of saving the planet! Logged some slick ${activity}. That's a whole vibe. Tap in and match my streak! 🚀🌎`,
              `We don't do boring sustainability here. Vaporized ${carbonSaved}kg CO2 emissions today. Real eco-royalty right here! ♻️💅`
            ];
        const randomMock = mocks[Math.floor(Math.random() * mocks.length)];
        return res.json({ caption: randomMock });
      }

      const prompt = roastMode 
        ? `Write a single-sentence hilarious and edgy Gen Z "green roast" based on this footprint data: Streak: ${streak} days, Activity logged: "${activity}", Carbon footprint reduced: ${carbonSaved}kg, total Eco Points: ${points}. Keep it funny, sarcasm-filled, short (under 120 characters), and use emojis like 💀, 🤡, or 🌱. Speak directly to 'you'. Do not write any introduction, quotes, explanations, or backticks; just return the raw text.`
        : `Write a single-sentence trendy and energetic Gen Z "green hype caption" for social media sharing based on this footprint: Streak: ${streak} days, Activity logged: "${activity}", Carbon footprint saved: ${carbonSaved}kg, total Eco Points: ${points}. Use Gen Z slang (like 'vibe', 'slay', 'no cap', 'real', 'ate', 'left no crumbs'), keep it punchy, short (under 120 characters), and use emojis like 🔥, 🌱, ⚡. Do not use quotes or explanations; just return the raw caption text.`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ caption: response.text?.trim() || "Fallback green vibes! 🌱🔥" });
    } catch (error: any) {
      console.error("Gemini caption error:", error);
      res.status(500).json({ error: "Failed to generate AI captions", details: error.message });
    }
  });

  app.post("/api/gemini/scan-footprint", async (req, res) => {
    try {
      const { image, presetId, fileName } = req.body;

      const mockDatabase: Record<string, any> = {
        "laptop": {
          item: "High-Performance Laptop",
          category: "energy",
          usageFootprint: "0.05 kg CO₂e / hour",
          lifecycleFootprint: "290 kg CO₂e manufacturing",
          equivalentAction: "Charging a smartphone 6,000 times over",
          ecoRating: "B-",
          tips: [
            "Enable Auto-Sleep / energy saver when idle (saves ~15W)",
            "Lower monitor brightness to 60-70%",
            "Unplug chargers when battery hits 100% to stop phantom load"
          ],
          alternatives: [
            "Refurbished laptops (cuts lifecycle footprint by 70%)",
            "Energy-efficient tablets for simple text documents"
          ],
          potentialSavings: 6,
          pointsReward: 60
        },
        "kettle": {
          item: "Electric Boiling Kettle",
          category: "energy",
          usageFootprint: "0.08 kg CO₂e / boil",
          lifecycleFootprint: "22 kg CO₂e production",
          equivalentAction: "Leaving a 10W LED bulb on for 12 hours straight",
          ecoRating: "C",
          tips: [
            "Only boil the exact volume of water you need today",
            "Descale element monthly to maintain raw heat transmission",
            "Store leftover boiled water in a quality thermal flask"
          ],
          alternatives: [
            "Direct gas stove-top kettle (faster, localized combustion)",
            "Eco-insulated electric kettle models"
          ],
          potentialSavings: 4,
          pointsReward: 40
        },
        "burger": {
          item: "Double Beef Hamburger",
          category: "food",
          usageFootprint: "4.8 kg CO₂e / serving",
          lifecycleFootprint: "15 kg CO₂e farming and supply lines",
          equivalentAction: "Driving a standard petrol car 12 miles",
          ecoRating: "F",
          tips: [
            "Swap for plant-based soy/pea meat alternatives (saves 90%)",
            "Source beef exclusively from local regenerative farms",
            "Forgo cheese/bacon toppings to cut dairy carbon by 30%"
          ],
          alternatives: [
            "Beyond / Impossible plant protein burger",
            "Organic roasted chicken sandwich",
            "Spiced black bean & quinoa veggie burger"
          ],
          potentialSavings: 15,
          pointsReward: 120
        },
        "bottle": {
          item: "Single-Use Plastic Water Bottle",
          category: "waste",
          usageFootprint: "0.15 kg CO₂e / bottle",
          lifecycleFootprint: "0.4 kg CO₂e manufacture & logistics",
          equivalentAction: "Leaving a phone charger plugged in idle for 20 days",
          ecoRating: "D-",
          tips: [
            "Recycle fully in designated municipal plastic streams",
            "Refill and wash to reuse 3-4 times minimum",
            "Select bulk containers to minimize packaging surface ratios"
          ],
          alternatives: [
            "Double-walled stainless steel flask",
            "Reusable borosilicate glass tumbler"
          ],
          potentialSavings: 5,
          pointsReward: 50
        },
        "car": {
          item: "Gas Commuter Sedan",
          category: "transport",
          usageFootprint: "0.35 kg CO₂e / mile",
          lifecycleFootprint: "7,500 kg CO₂e initial plant fabrication",
          equivalentAction: "Burning 0.15 kg of industrial anthracite coal",
          ecoRating: "E",
          tips: [
            "Maintain correct tire PSI ratings to improve mileage by 3%",
            "Minimize rapid accelerations and excessive idle durations",
            "Combine weekly errands to plan optimal route flows"
          ],
          alternatives: [
            "Battery electric vehicle (EV) powered by renewables",
            "Subway network / municipal bus schedules",
            "Commuter bicycle or throttle assist E-bike"
          ],
          potentialSavings: 20,
          pointsReward: 150
        }
      };

      // Mock Mode Trigger (if no key or key is default mock placeholder)
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || process.env.GEMINI_API_KEY === "MOCK_KEY") {
        let result = mockDatabase[presetId || ""];
        if (!result && fileName) {
          const lowerName = fileName.toLowerCase();
          if (lowerName.includes("burger") || lowerName.includes("beef") || lowerName.includes("food") || lowerName.includes("meat") || lowerName.includes("sandwich") || lowerName.includes("eat")) {
            result = mockDatabase["burger"];
          } else if (lowerName.includes("laptop") || lowerName.includes("macbook") || lowerName.includes("computer") || lowerName.includes("screen") || lowerName.includes("pc")) {
            result = mockDatabase["laptop"];
          } else if (lowerName.includes("kettle") || lowerName.includes("tea") || lowerName.includes("boil") || lowerName.includes("heater")) {
            result = mockDatabase["kettle"];
          } else if (lowerName.includes("bottle") || lowerName.includes("plastic") || lowerName.includes("water") || lowerName.includes("soda") || lowerName.includes("cup")) {
            result = mockDatabase["bottle"];
          } else if (lowerName.includes("car") || lowerName.includes("drive") || lowerName.includes("vehicle") || lowerName.includes("automobile") || lowerName.includes("gas")) {
            result = mockDatabase["car"];
          }
        }
        if (!result) {
          // Dynamic fallback for custom uploads
          const fallbacks = [
            {
              item: "Personal Smart Device / Phone",
              category: "energy",
              usageFootprint: "0.02 kg CO₂e / hour",
              lifecycleFootprint: "80 kg CO₂e",
              equivalentAction: "Charging a tablet 1,500 times",
              ecoRating: "B",
              tips: [
                "Turn down screen brightness or use Dark Mode",
                "Limit streaming on cellular data; use Wi-Fi which is 4x more efficient",
                "Unplug chargers when not actively recharging devices"
              ],
              alternatives: ["Refurbished smartphone", "Keep current device for 4+ years"],
              potentialSavings: 4,
              pointsReward: 45
            },
            {
              item: "Leather Shoes / Apparel",
              category: "waste",
              usageFootprint: "0.15 kg CO₂e / wear",
              lifecycleFootprint: "40 kg CO₂e livestock & processing",
              equivalentAction: "Leaving a 1500W space heater running for 3 hours",
              ecoRating: "C-",
              tips: [
                "Maintain and polish leather to double product lifespan",
                "Repair worn soles locally instead of discarding the shoes",
                "Use cold dry storage to prevent cracking and rotting"
              ],
              alternatives: ["Vegan bio-based cactus leather shoes", "Second-hand vintage boots"],
              potentialSavings: 7,
              pointsReward: 75
            },
            {
              item: "Coffee / Espresso Cup",
              category: "food",
              usageFootprint: "0.21 kg CO₂e / cup",
              lifecycleFootprint: "0.8 kg CO₂e cultivation and roasting",
              equivalentAction: "Leaving a lightbulb on for 24 hours",
              ecoRating: "C+",
              tips: [
                "Ditch cow dairy for oat or almond milk (saves 70% of cup carbon)",
                "Brew only what you drink using filtered cold water",
                "Buy Shade-Grown or Fair Trade carbon-offset beans"
              ],
              alternatives: ["Organic plant-based cold brew", "Loose leaf herbal tea"],
              potentialSavings: 5,
              pointsReward: 50
            }
          ];
          result = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }

        // Add a slight latency so the scanner animation shows beautifully
        await new Promise(r => setTimeout(r, 1500));
        return res.json({ result });
      }

      // Real Gemini API Call (Multi-modal)
      const client = getGeminiClient();
      
      let mimeType = "image/jpeg";
      let base64Data = image;

      if (image.startsWith("http://") || image.startsWith("https://")) {
        try {
          const imgRes = await fetch(image);
          const arrayBuffer = await imgRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          base64Data = buffer.toString("base64");
          
          const contentType = imgRes.headers.get("content-type");
          mimeType = contentType || "image/jpeg";
        } catch (fetchErr) {
          console.error("Failed to fetch preset image for Gemini API call:", fetchErr);
        }
      } else if (image.includes(";base64,")) {
        const parts = image.split(";base64,");
        mimeType = parts[0].split(":")[1] || "image/jpeg";
        base64Data = parts[1];
      }

      const prompt = `Analyze this image. Your primary task is to identify the main, central product, item, or activity shown in the photo. Focus on the primary object and ignore any background items or noise.
      Estimate its carbon footprint during active usage (e.g. electricity consumed by a laptop per hour, gasoline burned by a car per mile, emissions generated in producing and preparing a hamburger).
      Estimate its manufacturing, transport, and raw material lifecycle footprint.
      Provide relatable action equivalents, an ecological rating grade (A to F), 3 actionable tips to reduce its usage carbon footprint, and 2 eco-friendlier alternatives.
      Return your response in JSON format.
      Make sure to return a single flat JSON object matching this TypeScript structure:
      {
        "item": "Name of the detected product/item (be specific, e.g. MacBook Pro 16-inch or Double Beef Cheeseburger)",
        "category": "One of: 'energy', 'food', 'transport', 'waste'",
        "usageFootprint": "Estimated carbon footprint in active usage (e.g. '0.05 kg CO2e / hour of use' or '4.5 kg CO2e / serving')",
        "lifecycleFootprint": "Estimated manufacturing/logistics lifecycle footprint (e.g. '290 kg CO2e' or '15 kg CO2e')",
        "equivalentAction": "A fun and relatable daily action equivalent (e.g. 'equivalent to charging a smartphone 6,050 times')",
        "ecoRating": "An ecological grade from A (excellent / carbon-neutral) to F (highly carbon-intensive)",
        "tips": ["Tip 1 to lower footprint during active usage", "Tip 2 to lower footprint...", "Tip 3 to lower footprint..."],
        "alternatives": ["Eco-friendly alternative 1", "Eco-friendly alternative 2"],
        "potentialSavings": 5,
        "pointsReward": 50
      }
      Do not return any markdown code blocks, quotes, or introduction. Return the raw JSON string only.`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          prompt
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text?.trim() || "";
      let parsedResult;
      try {
        parsedResult = JSON.parse(responseText);
      } catch (err) {
        // Fallback cleaning if there are surrounding text/backticks
        const cleanText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        parsedResult = JSON.parse(cleanText);
      }

      res.json({ result: parsedResult });

    } catch (error: any) {
      console.error("Gemini scanner error:", error);
      // Fail gracefully with a plausible mock report so app logic continues
      res.status(200).json({
        error: "Failed to query Gemini API",
        details: error.message,
        result: {
          item: "Uploaded Smart Device",
          category: "energy",
          usageFootprint: "0.04 kg CO₂e / hour",
          lifecycleFootprint: "150 kg CO₂e",
          equivalentAction: "Running a standard household light bulb for 4 days",
          ecoRating: "B-",
          tips: [
            "Unplug when charger feels warm to the touch",
            "Recycle in specialized e-waste collections",
            "Enable dim screens to minimize energy drain"
          ],
          alternatives: [
            "Energy Star certified appliances",
            "Manual battery-free analog equivalents"
          ],
          potentialSavings: 5,
          pointsReward: 50
        }
      });
    }
  });

  // In-memory store for registered users (matches agent.py)
  const REGISTERED_USERS = new Set([
    "user-me",
    "eco_shivam",
    "user-123",
    "aria_wood",
    "zoe_sanchez",
    "kai_chen",
  ]);

  // In-memory store for logged activities: key is user_id:activity_category:date_str
  const LOGGED_ACTIVITIES = new Map<string, string>();

  // In-memory store for chat session histories
  const sessionHistories = new Map<string, any[]>();

  function register_user(userId: string): string {
    const clean = userId.trim();
    if (!clean) return "Error: User ID cannot be empty.";
    if (REGISTERED_USERS.has(clean)) {
      return `User ID '${clean}' is already registered.`;
    }
    REGISTERED_USERS.add(clean);
    return `Successfully registered user ID '${clean}'.`;
  }

  function log_daily_activity(userId: string, activityCategory: string): string {
    const cleanUser = userId.trim();
    const cleanCategory = activityCategory.trim().toUpperCase();

    if (!REGISTERED_USERS.has(cleanUser)) {
      return `Error: User ID '${cleanUser}' is not registered. Please register first using register_user.`;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const key = `${cleanUser}:${cleanCategory}:${todayStr}`;

    if (LOGGED_ACTIVITIES.has(key)) {
      return `Error: Activity category '${cleanCategory}' has already been logged for user '${cleanUser}' today (${todayStr}). Each category can only be logged once per day per person.`;
    }

    LOGGED_ACTIVITIES.set(key, new Date().toISOString());
    return `Success: Logged activity '${cleanCategory}' for user '${cleanUser}' on ${todayStr}.`;
  }

  app.post("/api/adk/run", async (req, res) => {
    try {
      const { user_id, session_id, new_message } = req.body;
      const userPrompt = new_message?.parts?.[0]?.text || "";

      // Fallback: If no API key is set, return simulated response
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || process.env.GEMINI_API_KEY === "MOCK_KEY") {
        let reply = "Hello! I am your Carbon AI Advisor (Simulated). Please set a real GEMINI_API_KEY to enable live agent routing.";
        if (userPrompt.toLowerCase().includes("register")) {
          reply = register_user(user_id);
        } else if (userPrompt.toLowerCase().includes("log")) {
          if (userPrompt.includes("COMMUTE_CAR")) {
            reply = log_daily_activity(user_id, "COMMUTE_CAR");
          } else if (userPrompt.includes("HOME_ELEC")) {
            reply = log_daily_activity(user_id, "HOME_ELEC");
          } else {
            reply = "Simulated log: Please specify category COMMUTE_CAR or HOME_ELEC.";
          }
        }
        return res.json([
          {
            role: "model",
            content: {
              parts: [{ text: reply }]
            }
          }
        ]);
      }

      const client = getGeminiClient();

      // Retrieve history
      let history = sessionHistories.get(session_id) || [];
      
      // Push new user message
      history.push({
        role: "user",
        parts: [{ text: userPrompt }]
      });

      // Call Gemini with tools
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: history,
        config: {
          systemInstruction: "You are an AI Environmental Advisor. Your job is to help users track and reduce their carbon footprint. Use the log_daily_activity tool when they tell you about daily carbon-emitting activities like COMMUTE_CAR or HOME_ELEC. If their user ID is not registered, prompt them to register using register_user first. Encourage sustainable behaviors and advise on carbon footprint reduction.",
          tools: [{
            functionDeclarations: [
              {
                name: "register_user",
                description: "Registers a new user ID so they can log activities.",
                parameters: {
                  type: "OBJECT" as any,
                  properties: {
                    user_id: {
                      type: "STRING" as any,
                      description: "The unique user ID to register."
                    }
                  },
                  required: ["user_id"]
                }
              },
              {
                name: "log_daily_activity",
                description: "Logs a carbon-emitting activity (e.g., 'COMMUTE_CAR', 'HOME_ELEC') for a registered user. Ensures that a specific activity category can only be logged once per day per person.",
                parameters: {
                  type: "OBJECT" as any,
                  properties: {
                    user_id: {
                      type: "STRING" as any,
                      description: "The registered user ID."
                    },
                    activity_category: {
                      type: "STRING" as any,
                      description: "The category of the activity (e.g. 'COMMUTE_CAR', 'HOME_ELEC')."
                    }
                  },
                  required: ["user_id", "activity_category"]
                }
              }
            ]
          }]
        }
      });

      const candidate = response.candidates?.[0];
      const functionCalls = candidate?.content?.parts?.filter((p: any) => p.functionCall);

      let finalResponseText = response.text || "";

      if (functionCalls && functionCalls.length > 0) {
        const toolResponseParts: any[] = [];
        for (const fc of functionCalls) {
          const { name, args } = fc.functionCall;
          const anyArgs = args as any;
          let resultText = "";
          if (name === "register_user") {
            resultText = register_user(anyArgs.user_id || user_id);
          } else if (name === "log_daily_activity") {
            resultText = log_daily_activity(anyArgs.user_id || user_id, anyArgs.activity_category || "");
          }

          toolResponseParts.push({
            functionResponse: {
              name,
              response: { result: resultText }
            }
          });
        }
        // Add function calls and responses to history
        history.push(candidate.content);
        history.push({
          role: "function",
          parts: toolResponseParts
        });
        // Call Gemini again to get final answer
        const secondResponse = await client.models.generateContent({
          model: "gemini-2.5-flash",
          contents: history,
          config: {
            systemInstruction: "You are an AI Environmental Advisor. Your job is to help users track and reduce their carbon footprint. Encourage sustainable behaviors and advise on carbon footprint reduction."
          }
        });

        finalResponseText = secondResponse.text || "I have processed your request.";
        history.push(secondResponse.candidates?.[0]?.content);
      } else {
        history.push(candidate.content);
      }

      // Limit history size
      if (history.length > 20) {
        history = history.slice(history.length - 20);
      }
      sessionHistories.set(session_id, history);

      res.json([
        {
          role: "model",
          content: {
            parts: [{ text: finalResponseText }]
          }
        }
      ]);
    } catch (error: any) {
      console.error("Agent chat proxy error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
