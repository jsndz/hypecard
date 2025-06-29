import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Video,
  Plus,
  Eye,
  Download,
  Trash2,
  Copy,
  Crown,
  Calendar,
  Clock,
  AlertCircle,
  Loader2,
  Share2,
  X,
} from "lucide-react";
import Header from "../components/Header";
import Button from "../components/Button";
import { apiClient } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import HLSPlayer from "../components/VideoPlayer";

interface VideoCard {
  id: number;
  user_id: string;
  name: string;
  role?: string;
  tagline: string;
  description: string;
  avatar: string;
  video_url: string;
  download_url: string;
  stream_url: string;
  tavus_video_id: string;
  status: "processing" | "completed" | "failed";
  created_at: string;
}

const DashboardPage: React.FC = () => {
  const [videos, setVideos] = useState<VideoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchVideos();
  }, [user, navigate]);
  const requestDelete = (id: number) => {
    setPendingDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!user?.isPro) {
      setShowDeleteModal(false);
      return;
    }

    try {
      setDeletingId(pendingDeleteId);
      await apiClient.deleteVideo(pendingDeleteId!);
      setVideos((prev) => prev.filter((video) => video.id !== pendingDeleteId));
    } catch (err: any) {
      alert(err.message || "Failed to delete video");
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
      setShowDeleteModal(false);
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getVideos();
      setVideos(response.data.videos);
    } catch (err: any) {
      setError(err.message || "Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this video? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await apiClient.deleteVideo(id);
      setVideos(videos.filter((video) => video.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete video");
    } finally {
      setDeletingId(null);
    }
  };

  const copyShareLink = async (id: number) => {
    const shareUrl = `${window.location.origin}/card/${id}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadVideo = (download_url: string) => {
    const link = document.createElement("a");
    link.href = download_url;

    link.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "processing":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "failed":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-muted bg-surface border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Video className="w-3 h-3" />;
      case "processing":
        return <Clock className="w-3 h-3 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Video className="w-3 h-3" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
              <p className="text-muted">Loading your videos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative bg-background rounded-xl p-6 max-w-sm w-full border border-border shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-muted hover:text-white transition"
              onClick={() => setShowDeleteModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-2 text-white">
              Delete Video?
            </h2>

            {!user?.isPro ? (
              <p className="text-muted mb-4">
                Only{" "}
                <span className="text-yellow-400 font-medium">Pro users</span>{" "}
                can delete video cards.
              </p>
            ) : (
              <div>
                <p className="text-muted mb-4">
                  Are you sure you want to delete this video card? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={confirmDelete}
                    disabled={deletingId !== null}
                  >
                    {deletingId !== null ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Video Cards</h1>
              <p className="text-muted">
                Manage and share your AI-powered video business cards
              </p>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              {!user?.isPro && videos.length >= 1 && (
                <div className="text-sm text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                  Free limit reached
                </div>
              )}
              <Link to={user?.isPro ? "/pro/form" : "/form"}>
                <Button>
                  <Plus className="w-5 h-5" />
                  Create New Card
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface/50 backdrop-blur-xl rounded-2xl p-6 border border-border"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Video className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{videos.length}</p>
                  <p className="text-muted text-sm">Total Videos</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface/50 backdrop-blur-xl rounded-2xl p-6 border border-border"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Eye className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {videos.filter((v) => v.status === "completed").length}
                  </p>
                  <p className="text-muted text-sm">Completed</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface/50 backdrop-blur-xl rounded-2xl p-6 border border-border"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {videos.filter((v) => v.status === "processing").length}
                  </p>
                  <p className="text-muted text-sm">Processing</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 text-sm">{error}</p>
                <button
                  onClick={fetchVideos}
                  className="text-red-300 hover:text-red-200 text-sm underline mt-1"
                >
                  Try again
                </button>
              </div>
            </motion.div>
          )}

          {/* Videos Grid */}
          {videos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Video className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No video cards yet</h3>
              <p className="text-muted mb-6 max-w-md mx-auto">
                Create your first AI-powered video business card to get started
              </p>
              <Link to={user?.isPro ? "/pro/form" : "/form"}>
                <Button>
                  <Plus className="w-5 h-5" />
                  Create Your First Card
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-surface/50 backdrop-blur-xl rounded-2xl border border-border hover:border-accent/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Video Thumbnail */}
                  <div className="aspect-video bg-gray-800 relative overflow-hidden">
                    {video.video_url ? (
                      <HLSPlayer src={video.stream_url}></HLSPlayer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          {getStatusIcon(video.status)}
                          <p className="text-sm text-muted mt-2 capitalize">
                            {video.status}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          video.status
                        )}`}
                      >
                        {getStatusIcon(video.status)}
                        <span className="ml-1 capitalize">{video.status}</span>
                      </div>
                    </div>

                    {/* Pro Badge */}
                    {user?.isPro && (
                      <div className="absolute top-3 right-3">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                          <Crown className="w-3 h-3 mr-1" />
                          Pro
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {video.name}
                      </h3>
                      {video.role && (
                        <p className="text-accent text-sm font-medium">
                          {video.role}
                        </p>
                      )}
                      <p className="text-muted text-sm italic">
                        {video.tagline}
                      </p>
                    </div>

                    <div className="flex items-center text-xs text-muted mb-4">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(video.created_at)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 items-center">
                      {
                        <>
                          <Link to={`/card/${video.id}`}>
                            <Button variant="secondary" size="sm">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyShareLink(video.id)}
                            className={
                              copiedId === video.id
                                ? "bg-green-600 hover:bg-green-600"
                                : ""
                            }
                          >
                            <Copy className="w-4 h-4" />
                            {copiedId === video.id ? "Copied!" : "Share"}
                          </Button>

                          {video.video_url && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  downloadVideo(video.download_url)
                                }
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </>
                      }

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => requestDelete(video.id)}
                        disabled={deletingId === video.id}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        {deletingId === video.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Upgrade CTA for Free Users */}
          {!user?.isPro && videos.length >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-8 rounded-2xl bg-gradient-to-r from-accent/10 via-blue-500/10 to-accent/10 border border-accent/20"
            >
              <Crown className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upgrade to Pro</h3>
              <p className="text-muted mb-6 max-w-md mx-auto">
                Create unlimited video business cards with custom branding and
                advanced features
              </p>
              <Link to="/pro">
                <Button>
                  <Crown className="w-5 h-5" />
                  Upgrade to Pro
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
