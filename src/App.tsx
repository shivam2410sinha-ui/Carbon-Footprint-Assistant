import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Users, 
  Award, 
  Trees, 
  Plus, 
  Activity, 
  Compass, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase, 
  TrendingDown, 
  Calendar,
  Share2,
  Trash2,
  User as UserIcon,
  Crown,
  Heart,
  Check,
  Zap,
  Info,
  ChevronRight,
  BookOpen,
  Lightbulb,
  GraduationCap,
  Edit2,
  X,
  Camera
} from "lucide-react";
import { UserProfile, Challenge, FeedPost, Badge, ActivityLog, SocialComment } from "./types";
import { AVAILABLE_BADGES, INITIAL_COMPETITORS, INITIAL_CHALLENGES, INITIAL_FEED_POSTS } from "./mockData";
import GreenFeed from "./components/GreenFeed";
import AICaptionGen from "./components/AICaptionGen";
import ShareCardCreator from "./components/ShareCardCreator";
import PointsBreakupLedger, { POINTS_BADGES } from "./components/PointsBreakupLedger";
import PhysicalBadge, { getPhysicalBadgeType } from "./components/PhysicalBadges";
import FootprintAwareness from "./components/FootprintAwareness";
import CarbonScanner from "./components/CarbonScanner";
import CarbonAssistant from "./components/CarbonAssistant";


// Define logging options for different categories
const LOG_OPTIONS = [
  {
    id: "transit-subway",
    category: "transport",
    title: "Subway Commute (Ditched Car)",
    carbonSaved: 8,
    points: 50,
    emoji: "🚇"
  },
  {
    id: "transit-bicycle",
    category: "transport",
    title: "Commuted on Bicycle",
    carbonSaved: 15,
    points: 120,
    emoji: "🚲"
  },
  {
    id: "diet-plant",
    category: "food",
    title: "100% Plant-Based Day",
    carbonSaved: 12,
    points: 100,
    emoji: "🥗"
  },
  {
    id: "diet-dairy",
    category: "food",
    title: "Chose Almond/Oat over Cow's Milk",
    carbonSaved: 4,
    points: 30,
    emoji: "🥛"
  },
  {
    id: "energy-unplug",
    category: "energy",
    title: "Unplugged Smart Appliances (10h)",
    carbonSaved: 7,
    points: 60,
    emoji: "🔌"
  },
  {
    id: "energy-solar",
    category: "energy",
    title: "Charged Devices on Solar Booster",
    carbonSaved: 5,
    points: 40,
    emoji: "🔋"
  },
  {
    id: "waste-thrift",
    category: "waste",
    title: "Thrifted Outfit (Saved Logistics Carbon)",
    carbonSaved: 18,
    points: 150,
    emoji: "🧥"
  },
  {
    id: "waste-compost",
    category: "waste",
    title: "Composted All Organic Leftovers",
    carbonSaved: 6,
    points: 50,
    emoji: "🍎"
  }
];

export default function App() {
  // Current user base states
  const [userFootprint, setUserFootprint] = useState(210); // in kg CO2e per month. Lower is better
  const [userPoints, setUserPoints] = useState(450);
  const [userStreak, setUserStreak] = useState(5);
  const [latestActivityStr, setLatestActivityStr] = useState("Thrifted vintage outfit 🧥");
  const [latestCarbonSaved, setLatestCarbonSaved] = useState(18);
  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: "log-initial-1",
      category: "waste",
      title: "Thrifted vintage outfit",
      timestamp: "Today, 8:40 AM",
      carbonSaved: 18,
      pointsEarned: 150
    }
  ]);

  // Redundant/redeemed badges list
  const [userRedeemedBadges, setUserRedeemedBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem("gp_user_badges");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Simulator choices states
  const [plannedTransport, setPlannedTransport] = useState(false);
  const [plannedDiet, setPlannedDiet] = useState(false);
  const [plannedEnergy, setPlannedEnergy] = useState(false);
  const [plannedChallenge, setPlannedChallenge] = useState(false);

  // Selected Tab state: 'dashboard' | 'leaderboard' | 'social' | 'reduce' | 'share' | 'scan' | 'assistant'
  const [activeTab, setActiveTab] = useState<"dashboard" | "leaderboard" | "social" | "reduce" | "share" | "scan" | "assistant">("dashboard");

  // Competitors state
  const [competitors, setCompetitors] = useState<UserProfile[]>(INITIAL_COMPETITORS);
  
  // Custom challenges state
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);

  // Social feed posts state
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);

  // Feedback notifications
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" | "badge" } | null>(null);

  // Selected competitor for profile detail popup overview
  const [selectedCompetitor, setSelectedCompetitor] = useState<UserProfile | null>(null);

  // Modal states
  const [showLoggingModal, setShowLoggingModal] = useState(false);
  const [redeemSuccessBadge, setRedeemSuccessBadge] = useState<Badge | null>(null);

  // Track which log options the user has already selected today (resets each calendar day)
  const todayDateKey = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const [loggedToday, setLoggedToday] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("gp_logged_today");
      if (!raw) return new Set();
      const { date, ids } = JSON.parse(raw);
      // If stored date differs from today, ignore (fresh day)
      if (date !== new Date().toISOString().slice(0, 10)) return new Set();
      return new Set<string>(ids);
    } catch {
      return new Set<string>();
    }
  });

  // Sync redeemed badges to localStorage for durability
  React.useEffect(() => {
    localStorage.setItem("gp_user_badges", JSON.stringify(userRedeemedBadges));
  }, [userRedeemedBadges]);

  const [profileName, setProfileName] = useState(() => localStorage.getItem("gp_profile_name") || "Shivam Sinha");
  const [profileUsername, setProfileUsername] = useState(() => localStorage.getItem("gp_profile_username") || "eco_shivam");
  const [profileAvatar, setProfileAvatar] = useState(() => localStorage.getItem("gp_profile_avatar") || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150");
  const [profileBio, setProfileBio] = useState(() => localStorage.getItem("gp_profile_bio") || "Ridding Gen Z of climate anxiety by actively crushing my footprint. 🌱 Biking > Driving. Unlocked top badges are displaying here!");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Sync profile fields to localStorage for durability
  React.useEffect(() => {
    localStorage.setItem("gp_profile_name", profileName);
    localStorage.setItem("gp_profile_username", profileUsername);
    localStorage.setItem("gp_profile_avatar", profileAvatar);
    localStorage.setItem("gp_profile_bio", profileBio);
  }, [profileName, profileUsername, profileAvatar, profileBio]);

  // User Profile configuration
  const currentUserProfile: UserProfile = {
    id: "user-me",
    name: profileName,
    username: profileUsername,
    avatar: profileAvatar,
    monthlyFootprint: userFootprint,
    baseEmissions: 340,
    streak: userStreak,
    points: userPoints,
    rank: 5, // determined dynamically
    isCurrentUser: true,
    bio: profileBio,
    badges: userRedeemedBadges
  };

  // Dynamically compile rankings based on carbon footprints (lower footprint = better rank)
  const fullProfilesList: UserProfile[] = [
    ...competitors,
    currentUserProfile
  ].sort((a, b) => a.monthlyFootprint - b.monthlyFootprint);

  // Set ranks dynamically
  const rankedProfiles = fullProfilesList.map((p, index) => {
    return {
      ...p,
      rank: index + 1
    };
  });

  const currentUserRanked = rankedProfiles.find(p => p.id === "user-me") || {
    ...currentUserProfile,
    rank: 5
  };

  const userRank = currentUserRanked.rank;

  // Dynamically compile rankings based on Points (higher points = better rank)
  const fullProfilesListByPoints: UserProfile[] = [
    ...competitors,
    currentUserProfile
  ].sort((a, b) => b.points - a.points);

  const rankedProfilesByPoints = fullProfilesListByPoints.map((p, index) => {
    return {
      ...p,
      pointsRank: index + 1
    };
  });

  const currentUserRankedByPoints = rankedProfilesByPoints.find(p => p.id === "user-me") || {
    ...currentUserProfile,
    pointsRank: 5
  };

  const userPointsRank = currentUserRankedByPoints.pointsRank;

  // Utility to push alert messages
  const showToast = (message: string, type: "success" | "info" | "badge" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Handler to log a daily activity
  const handleLogActivity = (option: typeof LOG_OPTIONS[0]) => {
    // Guard: prevent re-logging the same option on the same calendar day
    if (loggedToday.has(option.id)) return;

    const newLog: ActivityLog = {
      id: "log-" + Date.now(),
      category: option.category as any,
      title: option.title,
      timestamp: "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      carbonSaved: option.carbonSaved,
      pointsEarned: option.points
    };

    setLogs([newLog, ...logs]);
    
    // Carbon footprint decreases (minimum footprint floor is 10kg)
    const nextFootprint = Math.max(10, userFootprint - option.carbonSaved);
    setUserFootprint(nextFootprint);

    // Points increase
    const nextPoints = userPoints + option.points;
    setUserPoints(nextPoints);

    // Increase latest statistics
    setLatestActivityStr(option.title + " " + option.emoji);
    setLatestCarbonSaved(option.carbonSaved);

    // Mark this option as used today and persist to localStorage
    const updatedLogged = new Set(loggedToday);
    updatedLogged.add(option.id);
    setLoggedToday(updatedLogged);
    localStorage.setItem(
      "gp_logged_today",
      JSON.stringify({ date: todayDateKey, ids: Array.from(updatedLogged) })
    );

    // Show custom toast and optionally trigger streak helper
    showToast(`Logged: "${option.title}" (-${option.carbonSaved}kg CO₂e, +${option.points} pts!)`, "success");
    setShowLoggingModal(false);

    // Generate a default feed post so it streams on the GreenFeed immediately!
    const autoPost: FeedPost = {
      id: "post-auto-" + Date.now(),
      userId: "user-me",
      authorName: currentUserProfile.name,
      authorUsername: currentUserProfile.username,
      authorAvatar: currentUserProfile.avatar,
      content: `Just registered a green milestone: ${option.title}! Vaporizing emissions by -${option.carbonSaved}kg CO₂e. Match my energy! 🌱🚴`,
      mediaType: "log",
      carbonSaved: option.carbonSaved,
      streakCount: userStreak,
      timestamp: "Just now",
      likes: 1,
      comments: [],
      userReacted: false
    };

    setFeedPosts(prev => [autoPost, ...prev]);
  };

  // Handler to complete a specific ecosystem challenge
  const handleCompleteChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId && !ch.completed) {
        // Reduct carbon footprint and award points
        const nextFootprint = Math.max(10, userFootprint - ch.carbonTarget);
        setUserFootprint(nextFootprint);
        setUserPoints(u => u + ch.pointsReward);
        
        // Add log entry for challenge completion
        const challengeLog: ActivityLog = {
          id: "log-challenge-" + Date.now(),
          category: ch.category,
          title: `Smashed Challenge: ${ch.title}`,
          timestamp: "Today, Completed",
          carbonSaved: ch.carbonTarget,
          pointsEarned: ch.pointsReward
        };
        setLogs(prevLogs => [challengeLog, ...prevLogs]);

        // Boost streak
        setUserStreak(prevStreak => prevStreak + 1);
        setLatestCarbonSaved(ch.carbonTarget);
        setLatestActivityStr(ch.title);

        showToast(`Challenge Met! "${ch.title}" (-${ch.carbonTarget}kg CO₂e, Rewards: ${ch.impactReward})`, "success");

        // Broadcast post to active feed
        const challengePost: FeedPost = {
          id: "post-challenge-" + Date.now(),
          userId: "user-me",
          authorName: currentUserProfile.name,
          authorUsername: currentUserProfile.username,
          authorAvatar: currentUserProfile.avatar,
          content: `Boom! Completely smashed the "${ch.title}" challenge. Verified real-world reward unlocked: ${ch.impactReward}! Who is next? 🏆🔥`,
          mediaType: "challenge",
          carbonSaved: ch.carbonTarget,
          streakCount: userStreak + 1,
          timestamp: "Just now",
          likes: 2,
          comments: [],
          userReacted: false
        };
        setTimeout(() => {
          setFeedPosts(posts => [challengePost, ...posts]);
        }, 100);

        return { ...ch, completed: true };
      }
      return ch;
    }));
  };

  // Triggered when user selects a premium caption generated by AI
  const handleSelectAICaption = (caption: string) => {
    const dynamicPost: FeedPost = {
      id: "post-ai-" + Date.now(),
      userId: "user-me",
      authorName: currentUserProfile.name,
      authorUsername: currentUserProfile.username,
      authorAvatar: currentUserProfile.avatar,
      content: caption,
      mediaType: "log",
      carbonSaved: latestCarbonSaved,
      streakCount: userStreak,
      timestamp: "Just now",
      likes: 0,
      comments: [],
      userReacted: false
    };
    setFeedPosts(prev => [dynamicPost, ...prev]);
    showToast("AI Hype Caption published to feed! 🚀🌱", "success");
    setActiveTab("social");
  };

  // Active social reactions for feed items
  const handleLikePost = (postId: string) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const alreadyLiked = post.userReacted;
        return {
          ...post,
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
          userReacted: !alreadyLiked
        };
      }
      return post;
    }));
  };

  // Dynamic user comments
  const handleAddComment = (postId: string, commentContent: string) => {
    const newComment: SocialComment = {
      id: "comm-" + Date.now(),
      authorName: currentUserProfile.name,
      authorUsername: currentUserProfile.username,
      authorAvatar: currentUserProfile.avatar,
      content: commentContent,
      timestamp: "Just now"
    };

    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    showToast("Cheeky comment added! 💬⭐", "info");
  };

  // Post composer share option
  const handleSharePost = (newPostText: string, carbonVal?: number, attachedImage?: string) => {
    const customPost: FeedPost = {
      id: "post-custom-" + Date.now(),
      userId: "user-me",
      authorName: currentUserProfile.name,
      authorUsername: currentUserProfile.username,
      authorAvatar: currentUserProfile.avatar,
      content: newPostText,
      mediaType: carbonVal ? "log" : undefined,
      carbonSaved: carbonVal,
      streakCount: userStreak,
      attachedImage: attachedImage,
      timestamp: "Just now",
      likes: 0,
      comments: [],
      userReacted: false
    };

    setFeedPosts(prev => [customPost, ...prev]);
    showToast("Vibe blasted to the community feed!", "success");
  };

  const handleLogScannerSavings = (title: string, carbonSaved: number, pointsEarned: number, category: string) => {
    const newLog: ActivityLog = {
      id: "log-scan-" + Date.now(),
      category: category as any,
      title: title,
      timestamp: "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      carbonSaved: carbonSaved,
      pointsEarned: pointsEarned
    };

    setLogs(prev => [newLog, ...prev]);

    const nextFootprint = Math.max(10, userFootprint - carbonSaved);
    setUserFootprint(nextFootprint);

    const nextPoints = userPoints + pointsEarned;
    setUserPoints(nextPoints);

    setUserStreak(s => s + 1);
    setLatestActivityStr(title);
    setLatestCarbonSaved(carbonSaved);

    showToast(`Logged scanner actions: -${carbonSaved}kg CO₂e, +${pointsEarned} EcoPoints!`, "success");

    const autoPost: FeedPost = {
      id: "post-scan-" + Date.now(),
      userId: "user-me",
      authorName: currentUserProfile.name,
      authorUsername: currentUserProfile.username,
      authorAvatar: currentUserProfile.avatar,
      content: `Slashed carbon emissions: Scanned "${title.replace("Scanned ", "")}" & committed eco reductions! Saved -${carbonSaved}kg CO₂e. 🌿⚡`,
      mediaType: "log",
      carbonSaved: carbonSaved,
      streakCount: userStreak + 1,
      timestamp: "Just now",
      likes: 1,
      comments: [],
      userReacted: false
    };
    setFeedPosts(prev => [autoPost, ...prev]);
  };

  const handleShareScannerPost = (text: string, carbonVal?: number, attachedImage?: string) => {
    handleSharePost(text, carbonVal, attachedImage);
    setActiveTab("social");
  };

  // Rank-based badge redemption logic
  // Let's check who's allowed to redeem badges and matching rank
  // Rank 1, 2, or 3 are the only people who can redeem badges.
  const handleRedeemRankBadge = (badge: Badge) => {
    // Is the user rank matching the requirement?
    if (userRank !== badge.rankRequirement) {
      showToast(`Unauthorized. Your current Rank is #${userRank}. Only Rank #${badge.rankRequirement} can redeem this badge!`, "info");
      return;
    }

    // Is the user already in possession of this badge?
    if (userRedeemedBadges.some(b => b.id === badge.id || b.rankRequirement === badge.rankRequirement)) {
      showToast(`You have already redeemed your Rank #${badge.rankRequirement} badge! Displayed on your profile page.`, "info");
      return;
    }

    const timestampStr = new Date().toLocaleDateString([], { month: "short", day: "numeric" }) + " checkin";
    const redeemedBadge: Badge = {
      ...badge,
      redeemedAt: "Redeemed " + timestampStr
    };

    setUserRedeemedBadges([...userRedeemedBadges, redeemedBadge]);
    setRedeemSuccessBadge(redeemedBadge);
    showToast(`SUCCESS! Redeemed the "${badge.name}" Rank Achievement Badge!`, "badge");
  };

  const handleRedeemPointsBadge = (badge: typeof POINTS_BADGES[0]) => {
    if (userPointsRank !== badge.rankRequirement) {
      showToast(`Unauthorized! Your current Points Rank is #${userPointsRank}. Only Rank #${badge.rankRequirement} in the points table can claim this badge!`, "info");
      return;
    }

    if (userRedeemedBadges.some(b => b.id.startsWith(badge.id))) {
      showToast(`You have already redeemed your Points Rank #${badge.rankRequirement} badge! Displayed on your profile page.`, "info");
      return;
    }

    const timestampStr = new Date().toLocaleDateString([], { month: "short", day: "numeric" }) + " pts race";
    const redeemedBadge: Badge = {
      id: badge.id + "-" + Date.now(),
      name: badge.name,
      icon: "Award",
      color: badge.color,
      rankRequirement: badge.rankRequirement,
      description: badge.description,
      redeemedAt: "Claimed " + timestampStr
    };

    setUserRedeemedBadges([...userRedeemedBadges, redeemedBadge]);
    setRedeemSuccessBadge(redeemedBadge);
    showToast(`SUCCESS! Claimed the "${badge.name}" Points Table Badge!`, "badge");
  };

  // Reset metrics function to let players try again
  const handleResetMetrics = () => {
    setUserFootprint(210);
    setUserPoints(450);
    setUserStreak(5);
    setUserRedeemedBadges([]);
    setLogs([
      {
        id: "log-initial-1",
        category: "waste",
        title: "Clean starting point recalibration",
        timestamp: "Just now",
        carbonSaved: 0,
        pointsEarned: 0
      }
    ]);
    showToast("Metrics restabilized. Climb the leaderboards to reach the top 3!", "info");
  };

  // Weekly reset snapshot / automated badge distribution simulator
  const handleTriggerWeeklyReset = () => {
    // Determine the current top 3 profiles
    const topThree = rankedProfiles.filter(p => p.rank <= 3);
    const userMeRanked = rankedProfiles.find(p => p.id === "user-me");
    if (!userMeRanked) return;

    const userMeInTopThree = userMeRanked.rank <= 3;
    let awardedBadgeMsg = "";
    let awardedBadge: Badge | null = null;

    // Distribute badges to top 3 competitors
    const updatedCompetitors = competitors.map(comp => {
      const compRanked = rankedProfiles.find(p => p.id === comp.id);
      if (compRanked && compRanked.rank <= 3) {
        const matchingBadgePlaceholder = AVAILABLE_BADGES.find(b => b.rankRequirement === compRanked.rank);
        if (matchingBadgePlaceholder) {
          const alreadyHasBadge = comp.badges.some(b => b.rankRequirement === compRanked.rank);
          if (!alreadyHasBadge) {
            return {
              ...comp,
              badges: [
                ...comp.badges,
                {
                  ...matchingBadgePlaceholder,
                  id: `badge-${comp.id}-${compRanked.rank}-${Date.now()}`,
                  redeemedAt: "Weekly Reset Award"
                }
              ]
            };
          }
        }
      }
      return comp;
    });

    setCompetitors(updatedCompetitors);

    if (userMeInTopThree) {
      const userBadgeToAward = AVAILABLE_BADGES.find(b => b.rankRequirement === userMeRanked.rank);
      if (userBadgeToAward) {
        const alreadyHasUserBadge = userRedeemedBadges.some(b => b.rankRequirement === userMeRanked.rank);
        if (!alreadyHasUserBadge) {
          const newUserBadge = {
            ...userBadgeToAward,
            id: `badge-user-awarded-${userMeRanked.rank}-${Date.now()}`,
            redeemedAt: "Weekly Reset Auto-Added"
          };
          const updatedBadges = [...userRedeemedBadges, newUserBadge];
          setUserRedeemedBadges(updatedBadges);
          awardedBadge = newUserBadge;
          awardedBadgeMsg = `CONGRATULATIONS SHIVAM SINHA! 🏆\n\nWeekly Reset Complete: You finished in Rank #${userMeRanked.rank} on the footprint leaderboard & received the "${newUserBadge.name}" Badge automatically added to your profile drawer!`;
        } else {
          awardedBadgeMsg = `Weekly Reset Complete: You finished in Rank #${userMeRanked.rank} on the footprint leaderboard! You already hold this weekly milestone badge on your profile.`;
        }
      }
    } else {
      awardedBadgeMsg = `Weekly Reset Snapshot Taken: You finished at Rank #${userMeRanked.rank} on the footprint leaderboard.\n\nOnly the Top Three receive automatic footprint weekly badges. Reduce your carbon footprint inside the Eco Dashboard to climb the ranks!`;
    }

    // Distribute points-based badges to top 3 points competitors
    const userPointsMeRanked = rankedProfilesByPoints.find(p => p.id === "user-me");
    if (userPointsMeRanked && userPointsMeRanked.pointsRank <= 3) {
      const pointsBadgeToAward = POINTS_BADGES.find(b => b.rankRequirement === userPointsMeRanked.pointsRank);
      if (pointsBadgeToAward) {
        const alreadyHasPointsBadge = userRedeemedBadges.some(b => b.id.startsWith(pointsBadgeToAward.id));
        if (!alreadyHasPointsBadge) {
          const newPointsBadge = {
            id: `${pointsBadgeToAward.id}-awarded-${Date.now()}`,
            name: pointsBadgeToAward.name,
            icon: "Award",
            color: pointsBadgeToAward.color,
            rankRequirement: pointsBadgeToAward.rankRequirement,
            description: pointsBadgeToAward.description,
            redeemedAt: "Weekly Reset Auto-Added"
          };
          setUserRedeemedBadges(prev => [...prev, newPointsBadge]);
          awardedBadge = newPointsBadge; // Trigger celebrate overlay!
          awardedBadgeMsg += `\n\n🎯 POINTS STANDINGS PRIZE: You finished in Rank #${userPointsMeRanked.pointsRank} of the Points Table and unlocked the "${newPointsBadge.name}" Badge automatically!`;
        } else {
          awardedBadgeMsg += `\n\n🎯 POINTS STANDINGS: You finished in Rank #${userPointsMeRanked.pointsRank} of the Points Table! You already hold this weekly points milestone badge on your profile.`;
        }
      }
    } else if (userPointsMeRanked) {
      awardedBadgeMsg += `\n\n🎯 POINTS STANDINGS: You finished at Rank #${userPointsMeRanked.pointsRank} in the points table. Unlocks a Points Table badge once you climb into the Top 3!`;
    }

    if (awardedBadge) {
      setRedeemSuccessBadge(awardedBadge);
      showToast("Weekly badges distributed automatically! 🎖️", "success");
    } else {
      showToast(userMeInTopThree || (userPointsMeRanked && userPointsMeRanked.pointsRank <= 3) ? "Weekly Snapshot reset completed!" : "Snapshot complete! Climb to Top 3 to earn badges.", "info");
      alert(`⏱️ SEASON WEEKLY RESET SNAPSHOT\n\n${awardedBadgeMsg}`);
    }

    // Post to green social feed
    const resetFeedPost: FeedPost = {
      id: "weekly-reset-" + Date.now(),
      userId: "system",
      authorName: "GreenPulse Reset Engine ⏱️",
      authorUsername: "gp_snapshot_bot",
      authorAvatar: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=150",
      content: `🚨 WEEKLY APEX SEASON COMPLETED! The Sunday midnight snapshot has been archived. Congrats to our weekly Champions: 
🥇 Aria Wood (Gold Champion) 
🥈 ${userMeRanked.rank === 2 ? "Shivam Sinha (YOU - Silver Elite)" : "Kai Chen (Silver Elite)"}
🥉 ${userMeRanked.rank === 3 ? "Shivam Sinha (YOU - Bronze Achiever)" : "Zoe Sanchez (Bronze Achiever)"}! 

Top physical badges have been distributed automatically to winners' drawers! Resetting counters for next cycle! Let's get logging! 🌲🚴🏽`,
      mediaType: "challenge",
      carbonSaved: 150,
      streakCount: 1,
      timestamp: "Just now",
      likes: 12,
      comments: [
        {
          id: "sysc-1",
          authorName: "Aria Wood",
          authorUsername: "ecoqueen_aria",
          authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
          content: "Wow what an intense week! Stoked to defend my crown next season! 👑🌱",
          timestamp: "Just now"
        }
      ],
      userReacted: false
    };
    setFeedPosts(prev => [resetFeedPost, ...prev]);
  };

  // Process and commit simulator planner items
  const handleExecutePlannedActions = () => {
    let savedCarbon = 0;
    let earnedPoints = 0;
    let actionsLogged: { title: string; carbon: number; points: number; category: string }[] = [];

    if (plannedTransport && !loggedToday.has("planner-transport")) {
      savedCarbon += 15;
      earnedPoints += 100;
      actionsLogged.push({ title: "Bicycle Commute", carbon: 15, points: 100, category: "transport" });
    }
    if (plannedDiet && !loggedToday.has("planner-diet")) {
      savedCarbon += 12;
      earnedPoints += 80;
      actionsLogged.push({ title: "Organic Meal Prep", carbon: 12, points: 80, category: "food" });
    }
    if (plannedEnergy && !loggedToday.has("planner-energy")) {
      savedCarbon += 20;
      earnedPoints += 120;
      actionsLogged.push({ title: "Home Power Optimization", carbon: 20, points: 120, category: "energy" });
    }
    if (plannedChallenge && !loggedToday.has("planner-challenge")) {
      savedCarbon += 25;
      earnedPoints += 200;
      actionsLogged.push({ title: "Neighborhood Tree Planting", carbon: 25, points: 200, category: "waste" });
    }

    if (actionsLogged.length === 0) {
      showToast("Please choose at least one simulated action in the planner!", "info");
      return;
    }

    const nextFootprint = Math.max(10, userFootprint - savedCarbon);
    setUserFootprint(nextFootprint);
    setUserPoints(prev => prev + earnedPoints);
    setUserStreak(s => s + 1);

    const newLogs: ActivityLog[] = actionsLogged.map((action, i) => ({
      id: `log-planned-${Date.now()}-${i}`,
      category: action.category as any,
      title: action.title,
      timestamp: "Today, Plan Committed",
      carbonSaved: action.carbon,
      pointsEarned: action.points
    }));

    setLogs(prev => [...newLogs, ...prev]);

    // Mark planned options as logged today and persist
    const updatedLogged = new Set(loggedToday);
    if (plannedTransport) updatedLogged.add("planner-transport");
    if (plannedDiet) updatedLogged.add("planner-diet");
    if (plannedEnergy) updatedLogged.add("planner-energy");
    if (plannedChallenge) updatedLogged.add("planner-challenge");
    setLoggedToday(updatedLogged);
    localStorage.setItem(
      "gp_logged_today",
      JSON.stringify({ date: todayDateKey, ids: Array.from(updatedLogged) })
    );

    showToast(`Committed Plan of ${actionsLogged.length} behaviors: -${savedCarbon}kg CO₂e, +${earnedPoints} pts!`, "success");

    setPlannedTransport(false);
    setPlannedDiet(false);
    setPlannedEnergy(false);
    setPlannedChallenge(false);

    // Blast custom visual card to social feed
    const bragPost: FeedPost = {
      id: "post-brag-" + Date.now(),
      userId: "user-me",
      authorName: currentUserProfile.name,
      authorUsername: currentUserProfile.username,
      authorAvatar: currentUserProfile.avatar,
      content: `Just committed my weekly carbon-slaying plan: ${actionsLogged.map(a => a.title).join(", ")}. Saved -${savedCarbon}kg and unlocked +${earnedPoints} EcoPoints! Climb standard leaderboards with me! 🚴🌾✊`,
      mediaType: "challenge",
      carbonSaved: savedCarbon,
      streakCount: userStreak + 1,
      timestamp: "Just now",
      likes: 6,
      comments: [],
      userReacted: false
    };
    setFeedPosts(prev => [bragPost, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-zinc-900 font-sans antialiased text-sm flex flex-col selection:bg-emerald-600 selection:text-white">
      
      {/* Decorative dynamic light eco sparkles */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(to_right,#d1d5db_1px,transparent_1px),linear-gradient(to_bottom,#d1d5db_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation / App Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-zinc-200 px-4 md:px-6 py-4 flex items-center justify-between shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-black tracking-tighter text-base leading-none italic">
            GP
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-zinc-850 flex items-center gap-1.5 leading-none uppercase italic">
              GREEN.PULSE
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full tracking-widest uppercase border border-emerald-200/50">
                Season 04
              </span>
            </h1>
            <span className="text-[10px] text-zinc-550 font-mono tracking-wider uppercase font-extrabold">Carbon Reduction • Gamified</span>
          </div>
        </div>

        {/* Dynamic score summary header pills */}
        <div className="flex items-center gap-2 md:gap-3 bg-zinc-100 border border-zinc-200 rounded-full py-1.5 px-3">
          <div className="flex items-center gap-1 text-orange-600">
            <Flame className="w-4 h-4 fill-orange-500 stroke-orange-600 animate-pulse" />
            <span className="text-xs font-black font-mono uppercase tracking-wider">{userStreak}D STREAK</span>
          </div>
          <div className="w-[1px] h-4 bg-zinc-300" />
          <div className="flex items-center gap-1 text-amber-700">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-black font-mono uppercase tracking-wider">{userPoints} PTS</span>
          </div>
          <div className="w-[1px] h-4 bg-zinc-300" />
          <div className="flex items-center gap-1.5 bg-zinc-900 text-white rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider italic shadow-sm">
            <span>{userFootprint} KG CO₂e</span>
          </div>
        </div>
      </header>

      {/* Floating System-Wide Micro-Toasts */}
      {notification && (
        <div 
          id="system-instant-toast"
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm border flex items-start gap-3 animate-slide-in ${
            notification.type === "badge"
              ? "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300 text-purple-900"
              : notification.type === "info"
              ? "bg-white/95 border-blue-200 text-blue-900 shadow-xl"
              : "bg-white/95 border-emerald-200 text-emerald-900 shadow-xl"
          }`}
        >
          {notification.type === "badge" ? (
            <Crown className="w-5 h-5 text-purple-600 shrink-0 animate-bounce" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <div>
            <h5 className="text-xs font-bold font-mono tracking-wider uppercase mb-0.5">
              {notification.type === "badge" ? "🏆 Badging Unlocked" : "System Status Update"}
            </h5>
            <p className="text-xs opacity-90 leading-relaxed font-sans">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SIDE BAR / QUICK USER PROFILE BOX */}
        <aside id="sidebar-user-snapshot" className="lg:col-span-1 space-y-5">
          {/* Main User Card */}
          <div className="p-6 md:p-8 rounded-[2.5rem] bg-white border-2 border-zinc-200/90 shadow-md space-y-5">
            {!isEditingProfile ? (
              <>
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Green Champion
                  </span>
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="text-[10px] font-mono uppercase tracking-widest font-black text-zinc-500 hover:text-emerald-600 flex items-center gap-1 transition cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Profile
                  </button>
                </div>
                
                <div className="flex items-center gap-3.5">
                  <div className="relative group">
                    <img
                      id="aside-profile-pic"
                      src={currentUserProfile.avatar}
                      alt={currentUserProfile.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 bg-emerald-600 text-white rounded-full font-extrabold text-[11px] border-2 border-white">
                      #{userRank}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight text-zinc-900 flex items-center gap-1">
                      {currentUserProfile.name}
                    </h2>
                    <span className="text-xs text-zinc-500 font-mono font-bold">@{currentUserProfile.username}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-650 leading-relaxed bg-zinc-50 p-3.5 rounded-2xl border border-zinc-250 font-semibold">
                  {currentUserProfile.bio}
                </p>
              </>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setIsEditingProfile(false); }} className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono font-black text-emerald-600 tracking-widest uppercase">
                  <span>Customize Profile</span>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingProfile(false)}
                    className="p-1 hover:bg-zinc-100 rounded-full transition text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Avatar presets */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-wider block">1. Avatar Image</label>
                  <div className="flex flex-wrap gap-2 py-1">
                    {[
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
                      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150"
                    ].map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setProfileAvatar(url)}
                        className={`relative w-10 h-10 rounded-full overflow-hidden transition border-2 cursor-pointer ${
                          profileAvatar === url ? "border-emerald-600 scale-105 shadow-md" : "border-zinc-200 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={url} alt="preset avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                      placeholder="Or paste custom image URL..."
                      className="w-full text-[10px] font-mono border-2 border-zinc-200 p-2 px-3 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-wider block mb-1">2. Display Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Display Name"
                    maxLength={28}
                    required
                    className="w-full text-xs font-semibold bg-zinc-50 border-2 border-zinc-200 p-2.5 rounded-xl focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-wider block mb-1">3. Username</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-400">@</span>
                    <input
                      type="text"
                      value={profileUsername}
                      onChange={(e) => setProfileUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase())}
                      placeholder="username"
                      maxLength={18}
                      required
                      className="w-full pl-7 text-xs font-mono font-bold bg-zinc-50 border-2 border-zinc-200 p-2.5 rounded-xl focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                {/* Bio text */}
                <div>
                  <label className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-wider block mb-1">4. Bio / Proclamation</label>
                  <textarea
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    placeholder="Tell the squad why you love carbon actions..."
                    maxLength={160}
                    className="w-full text-xs font-semibold bg-zinc-50 border-2 border-zinc-200 p-2.5 rounded-xl h-20 resize-none focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 rounded-xl transition uppercase italic tracking-widest active:scale-95 shadow-sm cursor-pointer"
                >
                  Save Profile
                </button>
              </form>
            )}

            {/* Badges Display Drawer on profile */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-extrabold text-zinc-500 tracking-wider uppercase flex items-center gap-1.5 font-mono">
                <Award className="w-3.5 h-3.5 text-purple-600" /> ACHIEVEMENT BADGES ({userRedeemedBadges.length})
              </span>
              
              {userRedeemedBadges.length === 0 ? (
                <div className="py-4 px-3 rounded-2xl bg-zinc-50 border border-dashed border-zinc-300 text-center">
                  <p className="text-[11px] text-zinc-500 italic font-medium">No badges redeemed yet.</p>
                  <button 
                    onClick={() => setActiveTab("leaderboard")}
                    className="text-[10px] text-emerald-600 hover:underline font-extrabold mt-1 inline-block uppercase tracking-wider"
                  >
                    Climb to Top 3 to Unlock!
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3" id="profile-unlocked-badges">
                  {userRedeemedBadges.map((b) => (
                    <div
                      key={b.id}
                      className="flex flex-col items-center justify-start"
                      style={{ width: "100%" }}
                    >
                      {/* Fixed-size shield container — same for every badge */}
                      <div style={{ width: 96, height: 96 }} className="flex-shrink-0">
                        <PhysicalBadge 
                          type={getPhysicalBadgeType(b)} 
                          size="sm"
                          showLabel={false}
                          transparent={true}
                        />
                      </div>
                      {/* Name label below, always same width */}
                      <div className="text-center mt-1 px-1">
                        <p className="text-[10px] font-black text-zinc-800 uppercase tracking-tight italic leading-tight">
                          {
                            { gold: "1st Place Champion", silver: "2nd Place Elite", bronze: "3rd Place Achiever", star: "Sunlord Streak" }[getPhysicalBadgeType(b)]
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Carbon Comparison Progress card */}
            <div className="space-y-2.5 pt-3.5 border-t border-zinc-200">
              <div className="flex justify-between items-center text-[10px] text-zinc-600 uppercase font-bold font-mono">
                <span className="tracking-wider">Emissions Level</span>
                <span className="text-emerald-700 font-black">{Math.round((userFootprint/340)*100)}% of baseline</span>
              </div>
              <div className="w-full bg-zinc-100 h-3.5 rounded-full overflow-hidden border border-zinc-200 p-[2px]">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500 relative"
                  style={{ width: `${Math.min(100, (userFootprint / 340) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono font-bold uppercase tracking-wider">
                <span>Shivam: {userFootprint}kg</span>
                <span>Baseline: 340kg</span>
              </div>
            </div>
            
            <button 
              id="btn-recalibrate-metrics"
              onClick={handleResetMetrics}
              className="text-center block w-full text-[10px] text-zinc-500 hover:text-emerald-600 underline pt-1 font-mono hover:no-underline transition uppercase font-bold tracking-wider cursor-pointer"
            >
              Recalibrate Footprint Baseline
            </button>

            <button
              onClick={() => setShowLoggingModal(true)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase italic rounded-2xl text-[11px] tracking-widest transition active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Plus className="w-4 h-4" />
              Log Green Saving
            </button>
          </div>

          {/* Gamified carbon stats meter */}
          <div className="p-6 rounded-[2.5rem] bg-white border-2 border-zinc-200 shadow-md space-y-4">
            <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest font-sans flex items-center gap-1.5 flex-nowrap">
              <Activity className="w-4 h-4 text-emerald-600 shrink-0" /> Climate Vibe Score
            </h4>
            
            <div className="text-center text-xs">
              <div className="p-4 bg-zinc-50 rounded-[1.5rem] border border-zinc-200 w-full">
                <div className="font-mono text-xl font-black text-emerald-600">-{210 - userFootprint}kg</div>
                <div className="text-[10px] text-zinc-500 font-mono uppercase font-black tracking-widest mt-1">Total CO₂ Saved</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MIDDLE PORTION: TABS CONTROLLER AND MAIN VIEW SCREENS */}
        <section className="lg:col-span-3 space-y-6">

          {/* Tab buttons Pill layout */}
          <nav className="flex overflow-x-auto no-scrollbar bg-white border-2 border-zinc-200/90 p-2 rounded-[2rem] shadow-sm">
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[11px] font-black uppercase tracking-wider transition whitespace-nowrap shrink-0 flex-1 cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-emerald-600 text-white italic shadow-[0_4px_12px_rgba(16,185,129,0.2)] font-black"
                  : "text-zinc-600 hover:text-emerald-700 font-semibold"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              id="tab-leaderboard"
              onClick={() => setActiveTab("leaderboard")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[11px] font-black uppercase tracking-wider transition whitespace-nowrap shrink-0 flex-1 cursor-pointer ${
                activeTab === "leaderboard"
                  ? "bg-emerald-600 text-white italic shadow-[0_4px_12px_rgba(16,185,129,0.2)] font-black"
                  : "text-zinc-600 hover:text-emerald-700 font-semibold"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Leaderboard</span>
            </button>

            <button
              id="tab-social"
              onClick={() => setActiveTab("social")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[11px] font-black uppercase tracking-wider transition whitespace-nowrap shrink-0 flex-1 cursor-pointer ${
                activeTab === "social"
                  ? "bg-emerald-600 text-white italic shadow-[0_4px_12px_rgba(16,185,129,0.2)] font-black"
                  : "text-zinc-600 hover:text-emerald-700 font-semibold"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>The Hub</span>
            </button>

            <button
              id="tab-share"
              onClick={() => setActiveTab("share")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[11px] font-black uppercase tracking-wider transition whitespace-nowrap shrink-0 flex-1 cursor-pointer ${
                activeTab === "share"
                  ? "bg-emerald-600 text-white italic shadow-[0_4px_12px_rgba(16,185,129,0.2)] font-black"
                  : "text-zinc-600 hover:text-emerald-700 font-semibold"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Story Studio</span>
            </button>

            <button
              id="tab-reduce"
              onClick={() => setActiveTab("reduce")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[11px] font-black uppercase tracking-wider transition whitespace-nowrap shrink-0 flex-1 cursor-pointer ${
                activeTab === "reduce"
                  ? "bg-emerald-600 text-white italic shadow-[0_4px_12px_rgba(16,185,129,0.2)] font-black"
                  : "text-zinc-600 hover:text-emerald-700 font-semibold"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Reduce Footprint</span>
            </button>

            <button
              id="tab-scanner"
              onClick={() => setActiveTab("scan")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[11px] font-black uppercase tracking-wider transition whitespace-nowrap shrink-0 flex-1 cursor-pointer ${
                activeTab === "scan"
                  ? "bg-emerald-600 text-white italic shadow-[0_4px_12px_rgba(16,185,129,0.2)] font-black"
                  : "text-zinc-600 hover:text-emerald-700 font-semibold"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Carbon Scanner</span>
            </button>

            <button
              id="tab-assistant"
              onClick={() => setActiveTab("assistant")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[11px] font-black uppercase tracking-wider transition whitespace-nowrap shrink-0 flex-1 cursor-pointer ${
                activeTab === "assistant"
                  ? "bg-emerald-600 text-white italic shadow-[0_4px_12px_rgba(16,185,129,0.2)] font-black"
                  : "text-zinc-600 hover:text-emerald-700 font-semibold"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Carbon AI Assistant</span>
            </button>

          </nav>

          {/* VIEW CONTROLS */}

          {/* SCREEN 1: ECO DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in" id="dashboard-screen">

              {/* NEW ADDITION: ONBOARDING QUICK WALKTHROUGH FOR UNDERSTANDABILITY */}
              <div className="bg-white border-2 border-zinc-200/90 rounded-[2.2rem] p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-black text-zinc-900 tracking-tight uppercase flex items-center gap-1.5 leading-none">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0" /> HOW TO COMPETE: QUICK 3-STEP GUIDE
                  </h3>
                  <p className="text-xs text-zinc-550 mt-1">Get certified, save carbon, claim status. Here is how the loop works:</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-1.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center font-mono">01</span>
                    <h4 className="font-bold text-zinc-900">Log Daily Saving Tasks</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">Log eco subway rides, diets or shut off energy outlets. See your <span className="text-emerald-700 font-bold">Impact Level</span> drop immediately (LOWER is better!).</p>
                  </div>
                  <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-1.5">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-850 text-xs font-black flex items-center justify-center font-mono">02</span>
                    <h4 className="font-bold text-zinc-900">Claim Real Badges Weekly</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">The Snapshot is calculated weekly. Users holding <span className="text-purple-700 font-bold">Rank #1, #2, or #3</span> at reset automate award updates to their Profile.</p>
                  </div>
                  <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-1.5">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center font-mono">03</span>
                    <h4 className="font-bold text-zinc-900">Use Simulator & Blueprint</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">Use the planners at the bottom to project carbon saves before finalizing so you can safely bypass competing squads.</p>
                  </div>
                </div>
              </div>

              {/* NEW ADDITION: SAMPLE BADGES WALL FOR EXTRA MOTIVATION & ATTRACTION */}
              <div className="bg-white border-2 border-zinc-200/90 rounded-[2.2rem] p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 tracking-tight uppercase flex items-center gap-1.5 leading-none">
                      <Award className="w-4 h-4 text-purple-600 shrink-0" /> BADGES WALL: PREVIEW WHAT YOU CAN ACQUIRE
                    </h3>
                    <p className="text-xs text-zinc-550 mt-1">Strive for these metallic emblems! Display them on your profile page to prove your green climate rank.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-50 border border-purple-200 rounded font-mono text-[9px] font-bold text-purple-700 uppercase tracking-wider">Snapshots snapshot</span>
                </div>
                
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-zinc-900 border-2 border-zinc-950 rounded-[2.5rem] shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)]" 
                  id="sample-badges-grid"
                >
                  <PhysicalBadge type="gold" showLabel={true} />
                  <PhysicalBadge type="silver" showLabel={true} />
                  <PhysicalBadge type="bronze" showLabel={true} />
                  <PhysicalBadge type="star" showLabel={true} />
                </div>
              </div>

              {/* Dynamic EcoPoints Weekly Earnings Breakup & Points Standing Race */}
              <PointsBreakupLedger
                userPoints={userPoints}
                logs={logs}
                competitors={competitors}
                currentUserProfile={currentUserProfile}
                onRedeemPointsBadge={handleRedeemPointsBadge}
                userRedeemedBadges={userRedeemedBadges}
              />

              {/* Grid split: AI Hype Caption generator + Challenges List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="dashboard-split-grid">
                
                {/* Left Column: Challenges */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                       Active Eco Challenges
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-zinc-500">
                      Real-World Impact Rewards
                    </span>
                  </div>

                  <div className="space-y-3" id="active-challenges-list">
                    {challenges.map((ch) => (
                      <div
                        key={ch.id}
                        id={`challenge-card-${ch.id}`}
                        className={`p-4 rounded-2xl border transition ${
                          ch.completed
                            ? "bg-zinc-50 border-zinc-200 opacity-60"
                            : "bg-white border-2 border-zinc-200/80 shadow-sm hover:border-emerald-250"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                            ch.category === "transport" ? "bg-blue-105/15 text-blue-700" :
                            ch.category === "food" ? "bg-amber-105/15 text-amber-700" :
                            ch.category === "energy" ? "bg-yellow-105/15 text-yellow-700" :
                            "bg-purple-105/15 text-purple-700"
                          }`}>
                            {ch.category} • {ch.difficulty}
                          </span>
                          
                          <span className="text-[11px] font-mono font-extrabold text-zinc-600">
                            -{ch.carbonTarget}kg CO₂e
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-zinc-900 mt-2 flex items-center gap-1.5">
                          {ch.title}
                        </h4>
                        
                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-semibold">
                          {ch.description}
                        </p>

                        <div className="mt-3 pt-3 border-t border-zinc-200 flex justify-between items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Trees className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[11px] text-emerald-600 font-bold max-w-[130px] truncate" title={ch.impactReward}>
                              {ch.impactReward}
                            </span>
                          </div>

                          {ch.completed ? (
                            <span 
                              id={`challenge-checkmark-${ch.id}`}
                              className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-200/50"
                            >
                              ✓ Completed
                            </span>
                          ) : (
                            <button
                              id={`challenge-btn-${ch.id}`}
                              onClick={() => handleCompleteChallenge(ch.id)}
                              className="px-3 py-1 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-[11px] font-bold border border-zinc-950 transition active:scale-95 cursor-pointer"
                            >
                              Log Progress
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Recent Activity Logs */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                     Recent Activity Tracker
                  </h3>

                  {/* Active logs history block */}
                  <div className="p-4 rounded-3xl bg-white border-2 border-zinc-200 shadow-md space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider font-mono">
                        Recent Activity Log ({logs.length})
                      </span>
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar scroll-smooth" id="user-recent-logs">
                      {logs.map((lg) => (
                        <div key={lg.id} className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex justify-between items-center">
                          <div>
                            <div className="text-xs font-bold text-zinc-900">{lg.title}</div>
                            <div className="text-[9px] text-zinc-500 font-mono mt-0.5">{lg.timestamp}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-emerald-600">-{lg.carbonSaved}kg</span>
                            <div className="text-[9px] text-amber-600 font-mono font-bold">+{lg.pointsEarned} pts</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* SCREEN 2: LEADERBOARD & BADGES REDEMPTION */}
          {activeTab === "leaderboard" && (
            <div className="space-y-6 animate-fade-in" id="leaderboard-screen">
              
              {/* Leaderboard Table listing ranking order */}
              <div className="p-8 rounded-[2.5rem] bg-white border-2 border-zinc-200 space-y-6 shadow-sm">
                <div className="flex justify-between items-end pb-4 border-b border-zinc-200">
                  <div>
                    <h2 className="text-3xl font-black italic uppercase leading-none text-zinc-900">The Global<br/><span className="text-emerald-700">Apex Squad</span></h2>
                    <span className="text-xs font-bold text-zinc-500 uppercase">Season 04</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-zinc-500 uppercase">LES IMPACTS • CALIBRATED LIVE</span>
                </div>

                <div className="space-y-4" id="leaderboard-profiles-dock">
                  {rankedProfiles.map((p) => {
                    const isSelf = p.id === "user-me";
                    const isTopThree = p.rank <= 3;

                    return (
                      <div
                        key={p.id}
                        id={`leaderboard-row-${p.id}`}
                        onClick={() => setSelectedCompetitor(p)}
                        className="relative group block cursor-pointer"
                      >
                        {isSelf && (
                          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-emerald-600 rounded-full" />
                        )}
                        <div className={`p-5 rounded-[1.8rem] flex items-center justify-between border-2 transition ${
                          isSelf
                            ? "bg-emerald-50 border-emerald-400 shadow-sm text-zinc-950"
                            : isTopThree
                            ? "bg-zinc-50 border-zinc-200 text-zinc-900 hover:border-zinc-300"
                            : "bg-white border-zinc-200 text-zinc-800 hover:border-zinc-250"
                        }`}>
                          {/* Left Side elements */}
                          <div className="flex items-center gap-4">
                            {/* Rank indicator badge */}
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black italic text-sm shrink-0 ${
                              p.rank === 1 ? "bg-gradient-to-tr from-amber-400 to-yellow-500 text-zinc-950 shadow-sm" :
                              p.rank === 2 ? "bg-slate-300 text-zinc-950 shadow-sm" :
                              p.rank === 3 ? "bg-orange-400 text-zinc-950 shadow-sm" :
                              "bg-zinc-100 text-zinc-500 border border-zinc-200"
                            }`}>
                              0{p.rank}
                            </div>

                            <img
                              src={p.avatar}
                              alt={p.name}
                              className="w-10 h-10 rounded-full object-cover border border-zinc-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />

                            <div>
                              <div className="text-sm font-bold flex items-center gap-1.5">
                                <span className="text-zinc-900">{p.name}</span>
                                {isSelf && (
                                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                                    YOU
                                  </span>
                                )}
                                {isTopThree && (
                                  <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-300" />
                                )}
                              </div>
                              <span className="text-xs text-zinc-550 font-mono">@{p.username}</span>
                            </div>
                          </div>

                          {/* Right side elements (statistics overview) */}
                          <div className="flex items-center gap-4 text-right">
                            <div className="hidden sm:block">
                              <div className="text-[9px] text-zinc-500 font-mono uppercase font-bold">STREAK</div>
                              <div className="text-xs font-black text-orange-600 flex items-center gap-0.5 justify-end italic">
                                <Flame className="w-3 h-3 fill-orange-500 text-orange-600 inline" />
                                <span>{p.streak}d</span>
                              </div>
                            </div>

                            <div>
                              <div className="text-[9px] text-zinc-500 font-mono uppercase font-bold">FOOTPRINT</div>
                              <div className="text-sm font-extrabold text-zinc-900 font-mono">
                                {p.monthlyFootprint} <span className="text-[10px] text-zinc-500 font-normal">kg</span>
                              </div>
                            </div>
                            
                            {/* Expanded view button hint */}
                            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TWO COLUMN GRID: WEEKLY SNAPSHOT SIMULATOR + ECOPOINTS BUDGET PLANNER */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="reset-planner-grid">
                
                {/* CARD 1: Automated Snapshot & Badge Distribution Simulator */}
                <div className="p-6 md:p-8 rounded-[2.5rem] bg-white border-2 border-zinc-200 space-y-4 relative overflow-hidden flex flex-col justify-between shadow-sm">
                  <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-[9px] font-mono font-black rounded-lg uppercase tracking-wider border border-purple-200 flex items-center gap-1.5 w-max">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
                      Weekly Season 04 Snapshot
                    </span>
                    <h3 className="text-lg font-black italic text-zinc-900 uppercase tracking-tight">
                      Weekly Auto-Distribution Simulator
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed font-semibold">
                      Rank achievements are awarded on weekly schedules on Sunday 11:59 UTC to users holding Top 3 positions. Below is the scheduled recipient projection based on current footprint data:
                    </p>
                  </div>

                  {/* Projected Winners List */}
                  <div className="space-y-2 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 my-2">
                    <h4 className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-550 mb-1">
                      Projected Recipients this week
                    </h4>
                    
                    {/* Rank 1 */}
                    <div className="flex justify-between items-center text-xs py-1.5 border-b border-zinc-200">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-black py-0.5 px-2 rounded bg-amber-400 text-zinc-950">1st</span>
                        <span className="font-extrabold text-zinc-800">{rankedProfiles[0]?.name}</span>
                        {rankedProfiles[0]?.id === "user-me" && <span className="text-[8px] font-mono px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">YOU</span>}
                      </div>
                      <span className="text-[10px] font-bold text-amber-750 uppercase font-mono">🥇 Gold Champion Shield</span>
                    </div>

                    {/* Rank 2 */}
                    <div className="flex justify-between items-center text-xs py-1.5 border-b border-zinc-200">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-black py-0.5 px-2 rounded bg-slate-200 text-zinc-950">2nd</span>
                        <span className="font-extrabold text-zinc-800">{rankedProfiles[1]?.name || "Zoe"}</span>
                        {rankedProfiles[1]?.id === "user-me" && <span className="text-[8px] font-mono px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">YOU</span>}
                      </div>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase font-mono">🥈 Silver Elite Shield</span>
                    </div>

                    {/* Rank 3 */}
                    <div className="flex justify-between items-center text-xs py-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-black py-0.5 px-1.5 rounded bg-orange-600 text-white">3rd</span>
                        <span className="font-extrabold text-zinc-800">{rankedProfiles[2]?.name || "Kai"}</span>
                        {rankedProfiles[2]?.id === "user-me" && <span className="text-[8px] font-mono px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">YOU</span>}
                      </div>
                      <span className="text-[10px] font-bold text-orange-600 uppercase font-mono">🥉 Bronze Achiever Shield</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] text-zinc-550 font-mono leading-normal">
                      💡 Click below to fast-forward weekly simulation time and trigger Sunday's automatic distribution script. Unlocked physical badges will automatically transfer standard accomplishments to your social profile drawers!
                    </p>
                    
                    <button
                      id="trigger-reset-snapshot-btn"
                      onClick={handleTriggerWeeklyReset}
                      className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-900 border-2 border-purple-500 hover:border-purple-400 text-purple-600 font-extrabold uppercase text-xs tracking-widest rounded-2xl active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 animate-pulse text-purple-600 fill-current" />
                      <span>Trigger Auto-Distribution Snapshot</span>
                    </button>
                  </div>
                </div>

                {/* CARD 2: Interactive Points & Standings Climber Planner */}
                <div className="p-6 md:p-8 rounded-[2.5rem] bg-white border-2 border-zinc-200 space-y-4 relative overflow-hidden flex flex-col justify-between shadow-sm">
                  <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[9px] font-mono font-black rounded-lg uppercase tracking-wider border border-emerald-200 flex items-center gap-1.5 w-max">
                      Interactive Estimator
                    </span>
                    <h3 className="text-lg font-black italic text-zinc-900 uppercase tracking-tight">
                      EcoPoints Blueprint Planner
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed font-semibold">
                      Draft sustainable behaviors down below to calculate exactly how your ecological score will climb and how to increase points to dominate the Global Apex!
                    </p>
                  </div>

                  {/* Checklist Options to play with */}
                  <div className="space-y-2.5 my-1" id="planner-simulator-checkboxes">
                    
                    <label className={`flex items-center justify-between p-2 rounded-xl border transition ${
                      loggedToday.has("planner-transport")
                        ? "bg-zinc-100/55 border-zinc-200/50 opacity-60 cursor-not-allowed"
                        : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 cursor-pointer"
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={plannedTransport || loggedToday.has("planner-transport")}
                          disabled={loggedToday.has("planner-transport")}
                          onChange={(e) => setPlannedTransport(e.target.checked)}
                          className="rounded text-emerald-600 bg-white border-zinc-300 focus:ring-0 cursor-pointer h-4 w-4 disabled:opacity-50"
                        />
                        <span className={`text-[11px] font-bold ${loggedToday.has("planner-transport") ? "text-zinc-400 line-through" : "text-zinc-800"}`}>
                          Transit: Commuter Scooter (-15kg)
                        </span>
                      </div>
                      {loggedToday.has("planner-transport") ? (
                        <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-100/60 border border-emerald-250 px-1.5 py-0.2 rounded">✓ Done Today</span>
                      ) : (
                        <span className="text-[10px] font-mono font-extrabold text-emerald-700">+100 pts</span>
                      )}
                    </label>

                    <label className={`flex items-center justify-between p-2 rounded-xl border transition ${
                      loggedToday.has("planner-diet")
                        ? "bg-zinc-100/55 border-zinc-200/50 opacity-60 cursor-not-allowed"
                        : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 cursor-pointer"
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={plannedDiet || loggedToday.has("planner-diet")}
                          disabled={loggedToday.has("planner-diet")}
                          onChange={(e) => setPlannedDiet(e.target.checked)}
                          className="rounded text-emerald-600 bg-white border-zinc-300 focus:ring-0 cursor-pointer h-4 w-4 disabled:opacity-50"
                        />
                        <span className={`text-[11px] font-bold ${loggedToday.has("planner-diet") ? "text-zinc-400 line-through" : "text-zinc-800"}`}>
                          Food: Plant-based Vegan Prep (-12kg)
                        </span>
                      </div>
                      {loggedToday.has("planner-diet") ? (
                        <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-100/60 border border-emerald-250 px-1.5 py-0.2 rounded">✓ Done Today</span>
                      ) : (
                        <span className="text-[10px] font-mono font-extrabold text-emerald-700">+80 pts</span>
                      )}
                    </label>

                    <label className={`flex items-center justify-between p-2 rounded-xl border transition ${
                      loggedToday.has("planner-energy")
                        ? "bg-zinc-100/55 border-zinc-200/50 opacity-60 cursor-not-allowed"
                        : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 cursor-pointer"
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={plannedEnergy || loggedToday.has("planner-energy")}
                          disabled={loggedToday.has("planner-energy")}
                          onChange={(e) => setPlannedEnergy(e.target.checked)}
                          className="rounded text-emerald-600 bg-white border-zinc-300 focus:ring-0 cursor-pointer h-4 w-4 disabled:opacity-50"
                        />
                        <span className={`text-[11px] font-bold ${loggedToday.has("planner-energy") ? "text-zinc-400 line-through" : "text-zinc-800"}`}>
                          Home: Smart Thermostat Power (-20kg)
                        </span>
                      </div>
                      {loggedToday.has("planner-energy") ? (
                        <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-100/60 border border-emerald-250 px-1.5 py-0.2 rounded">✓ Done Today</span>
                      ) : (
                        <span className="text-[10px] font-mono font-extrabold text-emerald-700">+120 pts</span>
                      )}
                    </label>

                    <label className={`flex items-center justify-between p-2 rounded-xl border transition ${
                      loggedToday.has("planner-challenge")
                        ? "bg-zinc-100/55 border-zinc-200/50 opacity-60 cursor-not-allowed"
                        : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 cursor-pointer"
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={plannedChallenge || loggedToday.has("planner-challenge")}
                          disabled={loggedToday.has("planner-challenge")}
                          onChange={(e) => setPlannedChallenge(e.target.checked)}
                          className="rounded text-emerald-600 bg-white border-zinc-350 focus:ring-0 cursor-pointer h-4 w-4 disabled:opacity-50"
                        />
                        <span className={`text-[11px] font-bold ${loggedToday.has("planner-challenge") ? "text-zinc-400 line-through" : "text-zinc-800"}`}>
                          Team: Plant Local Native Trees (-25kg)
                        </span>
                      </div>
                      {loggedToday.has("planner-challenge") ? (
                        <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-100/60 border border-emerald-250 px-1.5 py-0.2 rounded">✓ Done Today</span>
                      ) : (
                        <span className="text-[10px] font-mono font-extrabold text-emerald-700">+200 pts</span>
                      )}
                    </label>

                  </div>

                  {/* Simulator Calculations feedback card */}
                  <div className="p-3 bg-zinc-100 rounded-2xl border border-zinc-200 text-center space-y-1">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">
                      Simulated Forecast Standing
                    </div>
                    {(plannedTransport || plannedDiet || plannedEnergy || plannedChallenge) ? (
                      <p className="text-xs text-emerald-700 font-bold leading-normal">
                        Slashes <span className="font-mono">-{((plannedTransport ? 15 : 0) + (plannedDiet ? 12 : 0) + (plannedEnergy ? 20 : 0) + (plannedChallenge ? 25 : 0))}kg</span> CO₂e & grants <span className="font-mono text-emerald-800 font-extrabold">+{((plannedTransport ? 100 : 0) + (plannedDiet ? 80 : 0) + (plannedEnergy ? 120 : 0) + (plannedChallenge ? 200 : 0))} pts</span>. Shivam's Rank would advance to <span className="underline italic text-zinc-900 font-black font-mono shrink-0">Rank #{
                          [...competitors, { ...currentUserProfile, monthlyFootprint: Math.max(10, userFootprint - ((plannedTransport ? 15 : 0) + (plannedDiet ? 12 : 0) + (plannedEnergy ? 20 : 0) + (plannedChallenge ? 25 : 0))) }]
                            .sort((a, b) => a.monthlyFootprint - b.monthlyFootprint)
                            .findIndex(p => p.id === "user-me") + 1
                        }</span>!
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-550 font-semibold italic">Toggle activities above to run standing forecasts.</p>
                    )}
                  </div>

                  <button
                    id="commit-simulated-plan-btn"
                    disabled={!plannedTransport && !plannedDiet && !plannedEnergy && !plannedChallenge}
                    onClick={handleExecutePlannedActions}
                    className={`w-full py-3.5 font-extrabold uppercase text-xs tracking-widest rounded-2xl transition duration-250 cursor-pointer flex items-center justify-center gap-1.5 ${
                      (!plannedTransport && !plannedDiet && !plannedEnergy && !plannedChallenge)
                        ? "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed" 
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Commit Action Plan Live</span>
                  </button>
                </div>

              </div>

              {/* Details of Top 3 Badges Explanation Footer */}
              <div className="p-6 rounded-[2.5rem] bg-zinc-50 border-2 border-zinc-250 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-600">
                <div className="space-y-2">
                  <div className="font-black text-zinc-900 uppercase tracking-widest text-[10px] text-emerald-800 font-sans">How to climb the Leaderboards?</div>
                  <p className="leading-relaxed font-semibold">
                    By default, your carbon calculator profile starts with baseline average emissions. Choose green transport options or diets from the "Eco Dashboard" daily log tool to reduce this footprint score. The lower your impact points footprint, the higher you scale!
                  </p>
                </div>
                <div className="space-y-2 border-t md:border-t-0 md:border-l border-zinc-200 pt-4 md:pt-0 md:pl-6">
                  <div className="font-black text-zinc-900 uppercase tracking-widest text-[10px] text-emerald-800 font-sans">Top 3 Exclusive badge rules:</div>
                  <p className="leading-relaxed font-semibold">
                    Badge redemptions are locked programmatically. Once you climb to Rank #3 or better, activate your matching badge. If competitors push you out of the Top 3 later, your redeemed badges will remain on your profile page safely!
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* SCREEN 3: GREENFEED HUB */}
          {activeTab === "social" && (
            <div className="space-y-6 animate-fade-in" id="greenfeed-screen">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-extrabold text-neutral-50 leading-none">GreenFeed Hotspot 🌍</h2>
                  <span className="text-xs text-neutral-500">Live social experience uniting global Gen Z carbon-slayers</span>
                </div>
                <div className="p-2 bg-neutral-900 rounded-full border border-neutral-800 text-[10px] font-mono text-neutral-400">
                  🟢 Live Active Community
                </div>
              </div>

              <GreenFeed
                posts={feedPosts}
                currentUser={currentUserProfile}
                onLikePost={handleLikePost}
                onAddComment={handleAddComment}
                onSharePost={handleSharePost}
                latestCarbonLog={latestCarbonSaved}
              />
            </div>
          )}

          {/* SCREEN 4: STORY STUDIO POSTERS */}
          {activeTab === "share" && (
            <div className="space-y-6 animate-fade-in" id="share-screen">
              <ShareCardCreator
                userName={currentUserProfile.name}
                userUsername={currentUserProfile.username}
                avatar={currentUserProfile.avatar}
                streak={userStreak}
                monthlyFootprint={userFootprint}
                lastCarbonSaved={latestCarbonSaved}
                points={userPoints}
                redeemedBadgesCount={userRedeemedBadges.length}
                badges={userRedeemedBadges}
              />
            </div>
          )}

          {/* SCREEN 5: EMISSIONS ACADEMY AND HABIT REDUCTION PLAYBOOK */}
          {activeTab === "reduce" && (
            <div className="animate-fade-in" id="footprint-awareness-screen">
              <FootprintAwareness />
            </div>
          )}

          {/* SCREEN 6: CARBON SCANNER SCREEN */}
          {activeTab === "scan" && (
            <div className="animate-fade-in" id="carbon-scanner-screen">
              <CarbonScanner 
                onLogSavedCarbon={handleLogScannerSavings}
                onShareToFeed={handleShareScannerPost}
                userStreak={userStreak}
              />
            </div>
          )}

          {/* SCREEN 7: CARBON AI ASSISTANT SCREEN */}
          {activeTab === "assistant" && (
            <div className="animate-fade-in" id="carbon-assistant-screen">
              <CarbonAssistant />
            </div>
          )}



        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-neutral-900 py-6 text-center text-xs text-neutral-500 bg-black/60 backdrop-blur-sm px-4">
        <p className="leading-relaxed">
          GreenPulse Social platform designed specifically for Gen Z. Vaporizing climate anxiety, one low-carbon action at a time. Live responsibly, flex proudly.
        </p>
        <p className="text-[10px] font-mono mt-1 text-neutral-600">
          GreenPulse • AI Studio Build Proof of Concept • Local Time: 2026
        </p>
      </footer>

      {/* MODAL 1: ADD QUICK ACTIVITY LOGGER OVERLAY */}
      {showLoggingModal && (
        <div 
          id="log-activity-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowLoggingModal(false)}
        >
          <div 
            id="log-activity-modal-content"
            className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-3xl p-6 space-y-4 text-neutral-200 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-2 border-b border-neutral-900">
              <div>
                <h3 className="text-base font-bold text-neutral-100 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" /> Log Green Accomplishment
                </h3>
                <p className="text-xs text-neutral-500">Pick any climate conscious choice you've made today:</p>
              </div>
              <button 
                id="btn-close-log-modal"
                onClick={() => setShowLoggingModal(false)}
                className="text-neutral-500 hover:text-neutral-300 text-xl font-bold font-mono"
              >
                ×
              </button>
            </div>

            <div className="space-y-2.5" id="log-categories-grid">
              {/* Day-reset hint */}
              <p className="text-[10px] text-neutral-600 font-mono text-center pb-1">
                🔒 Each option can only be logged once per day. Resets at midnight.
              </p>
              {LOG_OPTIONS.map((opt) => {
                const alreadyLogged = loggedToday.has(opt.id);
                return (
                  <button
                    key={opt.id}
                    id={`log-option-btn-${opt.id}`}
                    onClick={() => !alreadyLogged && handleLogActivity(opt)}
                    disabled={alreadyLogged}
                    className={`w-full text-left p-3 rounded-2xl border flex items-center justify-between transition relative ${
                      alreadyLogged
                        ? "bg-neutral-900/40 border-neutral-800/40 opacity-50 cursor-not-allowed"
                        : "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 hover:border-emerald-500/25 group active:scale-[0.99] cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl shrink-0 select-none ${alreadyLogged ? "grayscale" : ""}`}>
                        {opt.emoji}
                      </span>
                      <div>
                        <h5 className={`text-xs font-bold transition ${
                          alreadyLogged ? "text-neutral-500 line-through" : "text-neutral-100 group-hover:text-emerald-400"
                        }`}>
                          {opt.title}
                        </h5>
                        <span className="text-[10px] text-neutral-600 uppercase font-mono">{opt.category}</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-0.5">
                      {alreadyLogged ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          ✓ Done Today
                        </span>
                      ) : (
                        <>
                          <div className="text-xs font-mono font-bold text-emerald-400">-{opt.carbonSaved}kg CO₂e</div>
                          <div className="text-[9px] text-amber-400 font-mono">+{opt.points} pts</div>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: COMPETITOR INTERACTIVE PROFILE CARD */}
      {selectedCompetitor && (
        <div 
          id="competitor-profile-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedCompetitor(null)}
        >
          <div 
            id="competitor-profile-modal-content"
            className="w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-3xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-2 border-b border-neutral-900">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00E5FF]">
                Gen Z profile details
              </span>
              <button 
                id="btn-close-competitor-modal"
                onClick={() => setSelectedCompetitor(null)}
                className="text-neutral-500 hover:text-neutral-300 font-mono text-xl"
              >
                ×
              </button>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src={selectedCompetitor.avatar}
                alt={selectedCompetitor.name}
                className="w-12 h-12 rounded-full object-cover border border-neutral-800"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5 leading-none">
                  {selectedCompetitor.name}
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-900 text-neutral-400 rounded">
                    Rank #{selectedCompetitor.rank}
                  </span>
                </h4>
                <span className="text-xs text-neutral-500 mt-1 block">@{selectedCompetitor.username}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed bg-neutral-900 p-2.5 rounded-xl border border-neutral-800/80">
              "{selectedCompetitor.bio}"
            </p>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 bg-neutral-900/60 rounded-xl border border-neutral-800">
                <span className="text-[9px] text-neutral-500 uppercase block">Emissions Level</span>
                <span className="text-sm font-extrabold text-neutral-200 mt-0.5 block">{selectedCompetitor.monthlyFootprint}kg CO₂e</span>
              </div>
              <div className="p-2.5 bg-neutral-900/60 rounded-xl border border-neutral-800">
                <span className="text-[9px] text-neutral-400 uppercase block">Streak Active</span>
                <span className="text-sm font-extrabold text-orange-400 mt-0.5 block">🔥 {selectedCompetitor.streak} Days</span>
              </div>
            </div>

            {/* Badges won details */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase flex items-center gap-1.2 font-mono">
                <Award className="w-3.5 h-3.5 text-purple-400" /> Redeemed Rank-Achievements ({selectedCompetitor.badges.length})
              </span>
              
              {selectedCompetitor.badges.length === 0 ? (
                <p className="text-xs text-neutral-500 italic text-center py-2">
                  No rank badges redeemed in this calendar cycle.
                </p>
              ) : (
                <div className="space-y-2" id="pop-competitor-badge-drawer">
                  {selectedCompetitor.badges.map((b) => (
                    <div 
                      key={b.id} 
                      className={`p-2.5 rounded-xl bg-gradient-to-r ${b.color} text-black font-extrabold text-[11px] flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5" />
                        <span>{b.name}</span>
                      </div>
                      <span className="text-[9px] font-mono opacity-85 uppercase font-bold">{b.redeemedAt || "Redeemed ✔"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                id="btn-close-competitor-profile"
                onClick={() => setSelectedCompetitor(null)}
                className="w-full py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-bold transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EXQUISITE BADGE REDEEM SUCCESS CONGRATS OVERLAY */}
      {redeemSuccessBadge && (
        <div 
          id="badge-celebration-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setRedeemSuccessBadge(null)}
        >
          <div 
            id="badge-celebration-content"
            className="w-full max-w-sm bg-gradient-to-tr from-neutral-950 via-neutral-900 to-indigo-950 border-2 border-purple-500/40 rounded-3xl p-6 text-center space-y-4 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient burst */}
            <div className="absolute inset-0 bg-radial-gradient from-purple-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-400 to-indigo-500 text-black flex items-center justify-center mx-auto shadow-2xl animate-bounce">
              <Crown className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00E5FF]">
                EcoElite Rank Awarded
              </span>
              <h4 className="text-lg font-black tracking-tight text-neutral-100">
                {redeemSuccessBadge.name}
              </h4>
              <span className="text-xs text-neutral-400 block font-mono">Rank Exclusive Achievement</span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed px-2">
              Outstanding results, Shivam! You are now occupying the absolute top tier on the leaderboard with the minimum emission footprint. You have saved tons of clean air!
            </p>

            <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-[11px] font-mono text-emerald-400">
              Badge synced & displayed on user profile page! ✨
            </div>

            <div className="flex gap-2">
              <button
                id="celebration-btn-okay"
                onClick={() => setRedeemSuccessBadge(null)}
                className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition active:scale-95"
              >
                Amazing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
