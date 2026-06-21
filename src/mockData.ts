import { UserProfile, Challenge, FeedPost, Badge } from "./types";

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: "badge-rank-1",
    name: "1st Place Champion: Carbon Minimizer",
    icon: "Crown",
    color: "from-amber-400 via-yellow-500 to-emerald-500 text-yellow-950 font-black",
    rankRequirement: 1,
    description: "Honors the #1 weekly carbon saver. Premium Gold-gilted Shield featuring a tall native sequoia tree rooted within circular green footprint symbols."
  },
  {
    id: "badge-rank-2",
    name: "2nd Place Elite: Carbon Minimizer",
    icon: "Trees",
    color: "from-slate-250 via-zinc-300 to-[#00E5FF] text-slate-900 font-extrabold",
    rankRequirement: 2,
    description: "Honors the #2 weekly carbon saver. Polished Silver Shield featuring an evergreen tree inside blue-ringed eco footprint arches."
  },
  {
    id: "badge-rank-3",
    name: "3rd Place Achiever: Carbon Achiever",
    icon: "Sparkles",
    color: "from-orange-400 via-amber-600 to-red-400 text-orange-950 font-bold",
    rankRequirement: 3,
    description: "Honors the #3 weekly carbon saver. Burnished Bronze-Copper Shield representing dynamic, standard-setting decarbonization."
  }
];

export const INITIAL_COMPETITORS: UserProfile[] = [
  {
    id: "comp-1",
    name: "Aria Wood",
    username: "ecoqueen_aria",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    monthlyFootprint: 110, // kg CO2e
    baseEmissions: 350,
    streak: 28,
    points: 2450,
    rank: 1,
    bio: "Living low-footprint in NYC. Thrifting only. Vintage style, modern eco-tactics. 💅🌿",
    badges: [
      {
        id: "badge-rank-1-redeemed",
        name: "1st Place Champion: Carbon Minimizer",
        icon: "Crown",
        color: "from-amber-400 via-yellow-500 to-emerald-500 text-yellow-950 font-black",
        rankRequirement: 1,
        description: "Honors the #1 weekly carbon saver. Premium Gold-gilted Shield featuring a tall native sequoia tree rooted within circular green footprint symbols.",
        redeemedAt: "2 days ago"
      }
    ]
  },
  {
    id: "comp-2",
    name: "Kai Chen",
    username: "greenvibes_kai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    monthlyFootprint: 135,
    baseEmissions: 320,
    streak: 15,
    points: 1820,
    rank: 2,
    bio: "Vegan chef & casual biker. Carbon negative since 2024. Talk plants to me. 🌱🚲",
    badges: [
      {
        id: "badge-rank-2-redeemed",
        name: "2nd Place Elite: Carbon Minimizer",
        icon: "Trees",
        color: "from-slate-250 via-zinc-300 to-[#00E5FF] text-slate-900 font-extrabold",
        rankRequirement: 2,
        description: "Honors the #2 weekly carbon saver. Polished Silver Shield featuring an evergreen tree inside blue-ringed eco footprint arches.",
        redeemedAt: "5 days ago"
      }
    ]
  },
  {
    id: "comp-3",
    name: "Zoe Sanchez",
    username: "planethero_zoe",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    monthlyFootprint: 160,
    baseEmissions: 310,
    streak: 9,
    points: 1550,
    rank: 3,
    bio: "Zero-waste warrior. DIY laundry detergent enthusiast. Sprout lover. ✨🥛",
    badges: [
      {
        id: "badge-rank-3-redeemed",
        name: "3rd Place Achiever: Carbon Achiever",
        icon: "Sparkles",
        color: "from-orange-400 via-amber-600 to-red-400 text-orange-950 font-bold",
        rankRequirement: 3,
        description: "Honors the #3 weekly carbon saver. Burnished Bronze-Copper Shield representing dynamic, standard-setting decarbonization.",
        redeemedAt: "1 day ago"
      }
    ]
  },
  {
    id: "comp-4",
    name: "Tyler Miller",
    username: "zerowaste_tyler",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    monthlyFootprint: 185,
    baseEmissions: 330,
    streak: 6,
    points: 1200,
    rank: 4,
    bio: "Upcycling expert. Turning discarded stuff into streetwear. Live minimal, thrive wild.",
    badges: []
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "chal-1",
    title: "Eco Transit Hustle",
    description: "Choose public transit, walking, or riding a scooter/bike for all travel today instead of taking an Uber.",
    category: "transport",
    difficulty: "Medium",
    carbonTarget: 18,
    pointsReward: 150,
    impactReward: "1 Tree Planted in Kenya 🌲",
    completed: false
  },
  {
    id: "chal-2",
    title: "Herbivore Energy",
    description: "Eat entirely plant-based meals today (no animal products, pure botanical goodness).",
    category: "food",
    difficulty: "Easy",
    carbonTarget: 12,
    pointsReward: 80,
    impactReward: "10kg Ocean Bound Plastic Removed 🌊",
    completed: false
  },
  {
    id: "chal-3",
    title: "Unplug Protocol",
    description: "Shut down computers, un-plug power strips, and keep lights of unused rooms off for 6 continuous hours.",
    category: "energy",
    difficulty: "Easy",
    carbonTarget: 8,
    pointsReward: 60,
    impactReward: "1 sq. meter of Seagrass Restored 🏖️",
    completed: false
  },
  {
    id: "chal-4",
    title: "Zero Waste Canvas",
    description: "Avoid acquiring ANY single-use plastic wrappers or coffee cups for a full 24 hours.",
    category: "waste",
    difficulty: "Hard",
    carbonTarget: 22,
    pointsReward: 200,
    impactReward: "1kg Fresh Veggies Donated to Community Larders 🥬",
    completed: false
  }
];

export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: "post-1",
    userId: "comp-1",
    authorName: "Aria Wood",
    authorUsername: "ecoqueen_aria",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    content: "Just thrifted the sickest organic cotton bomber jacket instead of ordering fast fashion! Vaporized some massive textile supply-chain carbon. Let's go! 💅👗",
    mediaType: "log",
    carbonSaved: 25,
    attachedImage: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=600",
    timestamp: "10 mins ago",
    likes: 42,
    comments: [
      {
        id: "comm-1",
        authorName: "Kai Chen",
        authorUsername: "greenvibes_kai",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        content: "Absolute fit check when? That's amazing Aria! 🔥",
        timestamp: "5 mins ago"
      }
    ],
    userReacted: false
  },
  {
    id: "post-2",
    userId: "comp-2",
    authorName: "Kai Chen",
    authorUsername: "greenvibes_kai",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    content: "Smashed my Transit Challenge today! Biked 15 miles in the heat to get to the food pop-up. Sweating? Yes. Satisfied? Absolutely. 🚴💚",
    mediaType: "challenge",
    carbonSaved: 18,
    streakCount: 15,
    attachedImage: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&q=80&w=600",
    timestamp: "2 hours ago",
    likes: 29,
    comments: [],
    userReacted: false
  }
];
