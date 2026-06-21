import React, { useState, useRef } from "react";
import { FeedPost, SocialComment } from "../types";
import { Send, Heart, Flame, Sparkles, MessageCircle, Share2, CornerDownRight, Camera, Image as ImageIcon, X } from "lucide-react";

interface GreenFeedProps {
  posts: FeedPost[];
  currentUser: {
    name: string;
    username: string;
    avatar: string;
  };
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onSharePost: (newPostText: string, carbonSaved?: number, attachedImage?: string) => void;
  latestCarbonLog?: number;
}

export default function GreenFeed({
  posts,
  currentUser,
  onLikePost,
  onAddComment,
  onSharePost,
  latestCarbonLog,
}: GreenFeedProps) {
  const [newPostText, setNewPostText] = useState("");
  const [includeLatestLog, setIncludeLatestLog] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  // Deduplicate posts by ID and content to prevent rendering duplicate messages
  const uniquePosts = posts.filter(
    (post, idx, self) =>
      self.findIndex(
        (p) =>
          p.id === post.id ||
          (p.content === post.content && p.authorUsername === post.authorUsername)
      ) === idx
  );
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SUGGESTED_PHOTOS = [
    { label: "🚲 Cycling Vibe", url: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&q=80&w=600" },
    { label: "🥗 Plant Power Meal", url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600" },
    { label: "🧥 Thrift Haul", url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=600" },
    { label: "☀️ Solar Energy", url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    onSharePost(
      newPostText,
      includeLatestLog ? latestCarbonLog : undefined,
      attachedImage || undefined
    );
    setNewPostText("");
    setIncludeLatestLog(false);
    setAttachedImage(null);
    setShowPhotoSelector(false);
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const inputVal = commentInputs[postId];
    if (!inputVal || !inputVal.trim()) return;

    onAddComment(postId, inputVal.trim());
    setCommentInputs({
      ...commentInputs,
      [postId]: "",
    });
  };

  return (
    <div className="space-y-6" id="green-feed-container">
      {/* Compose Post Box */}
      <div 
        id="compose-post-card"
        className="p-6 md:p-8 rounded-[2.5rem] bg-white border-2 border-zinc-200 shadow-sm"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black tracking-widest text-emerald-700 uppercase">
            BLAST YOUR GREEN VIBE 🌎
          </h3>
          <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">LIVE TIMELINE</span>
        </div>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="flex gap-3">
            <img
              id="compose-avatar"
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-full object-cover border border-zinc-200 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <textarea
              id="compose-textarea"
              placeholder="What green victory did you pull off today? Logged some thrift? Swapped code? Tell the squad..."
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-zinc-800 text-sm placeholder-zinc-400 focus:outline-none focus:border-emerald-500/60 resize-none h-24 transition font-semibold"
            />
          </div>

          {/* Image preview and picker helper */}
          {attachedImage && (
            <div className="relative mt-2 rounded-[2rem] overflow-hidden border-2 border-zinc-200 shadow-sm max-h-[220px] max-w-[320px] group bg-zinc-150">
              <img src={attachedImage} alt="Attached preview to share" className="w-full h-44 object-cover" />
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-900 transition cursor-pointer"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {showPhotoSelector && (
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-3xl space-y-2 mt-2">
              <span className="text-[9.5px] font-mono text-zinc-500 block font-black uppercase tracking-wider">Quick Attach Sustainable Photo Suggestion:</span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PHOTOS.map((photo) => (
                  <button
                    key={photo.label}
                    type="button"
                    onClick={() => {
                      setAttachedImage(photo.url);
                      setShowPhotoSelector(false);
                    }}
                    className="px-3 py-1.5 rounded-full bg-white border-2 border-zinc-200 text-[10.5px] text-zinc-700 font-extrabold hover:border-emerald-500 hover:text-emerald-700 transition cursor-pointer"
                  >
                    {photo.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-200">
            <div className="flex items-center gap-2">
              {latestCarbonLog && latestCarbonLog > 0 ? (
                <label 
                  id="share-metric-label"
                  className="flex items-center gap-2 cursor-pointer text-xs text-zinc-600 select-none bg-zinc-50 px-4 py-2 rounded-xl hover:bg-zinc-100 border border-zinc-200 transition"
                >
                  <input
                    type="checkbox"
                    checked={includeLatestLog}
                    onChange={(e) => setIncludeLatestLog(e.target.checked)}
                    className="rounded text-emerald-600 bg-white border-zinc-300 h-4 w-4 focus:ring-0 checked:bg-emerald-600 checked:border-emerald-600 cursor-pointer"
                  />
                  <span className="font-extrabold text-[10.5px]">Attach last carbon save (+{latestCarbonLog}kg CO₂e)</span>
                </label>
              ) : (
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider font-mono">Log activities to attach carbon scores</span>
              )}

              {/* Photo Upload Options */}
              <div className="flex items-center gap-1.5 ml-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="compose-photo-file-input"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50 text-zinc-650 hover:text-emerald-700 font-mono text-[10px] font-black uppercase transition cursor-pointer"
                  title="Upload image file"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPhotoSelector(!showPhotoSelector)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 font-mono text-[10px] font-black uppercase transition cursor-pointer ${
                    showPhotoSelector 
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300" 
                      : "border-zinc-200 text-zinc-650 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                  title="Select suggestion template"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Suggestion Templates</span>
                </button>
              </div>
            </div>

            <button
              id="send-post-btn"
              type="submit"
              disabled={!newPostText.trim() && !attachedImage}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed uppercase italic tracking-widest cursor-pointer shadow-sm hover:scale-[1.01] active:scale-95"
            >
              <span>Blast Post</span>
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>

      {/* Feed List */}
      <div className="space-y-4" id="feed-posts-list">
        {uniquePosts.map((post) => {
          const isExpanded = activeCommentsPostId === post.id;
          return (
            <div
              key={post.id}
              id={`feed-post-${post.id}`}
              className="p-6 md:p-7 rounded-[2.2rem] bg-white border-2 border-zinc-200 shadow-sm hover:border-zinc-300 transition group"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    id={`post-avatar-${post.id}`}
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-200 group-hover:border-emerald-500/40 transition"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-black text-zinc-900 flex items-center gap-1.5">
                      {post.authorName}
                      {post.streakCount && post.streakCount > 10 && (
                        <span 
                          id={`flame-badge-${post.id}`}
                          className="px-2 py-0.5 bg-orange-50 text-orange-650 text-[9px] rounded font-mono font-bold uppercase tracking-wider border border-orange-200"
                        >
                          🔥 STREAKING
                        </span>
                      )}
                    </h4>
                    <span className="text-xs text-zinc-500 font-mono">@{post.authorUsername}</span>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold tracking-wider">{post.timestamp}</span>
              </div>

              {/* Content */}
              <p className="mt-4 text-sm text-zinc-700 leading-relaxed font-semibold">
                {post.content}
              </p>

              {post.attachedImage && (
                <div className="mt-4 rounded-[1.8rem] overflow-hidden border border-zinc-200 bg-zinc-50 max-h-[380px] flex items-center justify-center">
                  <img 
                    src={post.attachedImage} 
                    alt="Shared eco capture" 
                    className="w-full h-full max-h-[380px] object-cover hover:scale-[1.01] transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Attached metrics visual badge */}
              {(post.carbonSaved || post.streakCount) && (
                <div 
                  id={`attached-metric-${post.id}`}
                  className="mt-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-650 animate-pulse" />
                    <div>
                      <div className="text-xs text-zinc-800 font-black uppercase tracking-tight">Impact Verified</div>
                      <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-bold">Decentralized Calibrations ✓</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {post.carbonSaved && (
                      <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-700 font-black">
                        -{post.carbonSaved}kg CO₂e
                      </span>
                    )}
                    {post.streakCount && (
                      <span className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-[11px] font-mono text-orange-650 font-black">
                        🔥 {post.streakCount} Day Streak
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-200">
                <button
                  id={`btn-react-${post.id}`}
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition cursor-pointer border ${
                    post.userReacted
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-zinc-500 border-transparent hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  <Flame className={`w-4 h-4 ${post.userReacted ? "fill-emerald-600 stroke-emerald-600" : ""}`} />
                  <span>{post.likes} Cheers</span>
                </button>

                <button
                  id={`btn-comments-toggle-${post.id}`}
                  onClick={() => setActiveCommentsPostId(isExpanded ? null : post.id)}
                  className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition cursor-pointer border ${
                    isExpanded
                      ? "text-purple-700 bg-purple-50 border-purple-200"
                      : "text-zinc-500 border-transparent hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments.length} Comments</span>
                </button>

                <div className="text-[10px] font-mono text-zinc-400 select-none uppercase font-bold tracking-widest hidden sm:block">
                  #KeepItGreen
                </div>
              </div>

              {/* Comments Section */}
              {isExpanded && (
                <div 
                  id={`comments-drawer-${post.id}`}
                  className="mt-4 pt-4 border-t border-zinc-200 space-y-3 bg-zinc-50 border border-zinc-200 p-4 rounded-2xl"
                >
                  <div className="space-y-4 max-h-48 overflow-y-auto no-scrollbar">
                    {post.comments.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic text-center py-2 font-medium">
                        No comments yet. Drop a supportive word for the squad! 🌱
                      </p>
                    ) : (
                      post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2.5 items-start">
                          <img
                            src={comment.authorAvatar}
                            alt={comment.authorName}
                            className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 bg-white p-3 rounded-2xl border border-zinc-200">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-zinc-900">
                                {comment.authorName} <span className="text-[10px] text-zinc-500 font-mono font-medium">@{comment.authorUsername}</span>
                              </span>
                              <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold">{comment.timestamp}</span>
                            </div>
                            <p className="text-xs text-zinc-650 mt-1 leading-relaxed font-semibold">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <form
                    onSubmit={(e) => handleCommentSubmit(post.id, e)}
                    className="flex gap-2 pt-3 border-t border-zinc-200"
                  >
                    <input
                      id={`comment-input-${post.id}`}
                      type="text"
                      placeholder="Post a cheeky green supportive comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        setCommentInputs({
                          ...commentInputs,
                          [post.id]: e.target.value,
                        })
                      }
                      className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-emerald-600 font-semibold"
                    />
                    <button
                      id={`comment-submit-${post.id}`}
                      type="submit"
                      disabled={!(commentInputs[post.id] || "").trim()}
                      className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border border-zinc-200 text-xs transition active:scale-95 disabled:opacity-40 disabled:scale-100 cursor-pointer flex items-center justify-center shrink-0"
                    >
                      <CornerDownRight className="w-4 h-4 cursor-pointer" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
