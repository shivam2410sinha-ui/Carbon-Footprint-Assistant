export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  monthlyFootprint: number; // in kg CO2e. Lower is better.
  baseEmissions: number; // The user's baseline emission without saving
  streak: number;
  points: number;
  rank: number;
  isCurrentUser?: boolean;
  bio: string;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  rankRequirement: number; // 1, 2, or 3
  description: string;
  redeemedAt?: string;
}

export interface ActivityLog {
  id: string;
  category: "transport" | "food" | "energy" | "waste";
  title: string;
  timestamp: string;
  carbonSaved: number; // in kg CO2
  pointsEarned: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: "transport" | "food" | "energy" | "waste";
  difficulty: "Easy" | "Medium" | "Hard";
  carbonTarget: number; // kg saved
  pointsReward: number;
  impactReward: string; // Real-world impact like "Plant 1 tree"
  completed: boolean;
}

export interface FeedPost {
  id: string;
  userId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  mediaType?: "streak" | "challenge" | "log";
  carbonSaved?: number;
  streakCount?: number;
  attachedImage?: string;
  timestamp: string;
  likes: number; // total reactions
  comments: SocialComment[];
  userReacted?: boolean;
}

export interface SocialComment {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}
