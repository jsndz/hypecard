import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Video,
  Download,
  Share2,
  ExternalLink,
  Copy,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Button from "../components/Button";
import { apiClient } from "../services/api";
import HLSPlayer from "../components/VideoPlayer";

interface VideoData {
  id: number;
  name: string;
  role?: string;
  tagline: string;
  description: string;
  avatar: string;
  video_url: string;
  download_url: string;
  stream_url: string;
  status: "processing" | "completed" | "failed";
  created_at: string;
}

const SharePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!id) {
        setError("Invalid video ID");
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.getCard(id);
        setVideoData(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load video card");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  const shareUrl = window.location.href;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadVideo = () => {
    if (videoData?.video_url) {
      const link = document.createElement("a");
      link.href = videoData.download_url;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted">Loading video card...</p>
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Card Not Found</h1>
          <p className="text-muted mb-6">
            {error || "This video card could not be found."}
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 text-accent hover:text-blue-400 font-medium transition-colors"
          >
            <span>Create Your Own HypeCard</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-surface/50 backdrop-blur-xl rounded-2xl p-8 border border-border"
          >
            {videoData.status === "processing" ? (
              <div className="aspect-video bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-accent mx-auto mb-4 animate-spin" />
                  <p className="text-white font-medium">Video Processing</p>
                  <p className="text-muted text-sm">
                    Your video is being generated...
                  </p>
                </div>
              </div>
            ) : videoData.status === "failed" ? (
              <div className="aspect-video bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <p className="text-white font-medium">Generation Failed</p>
                  <p className="text-muted text-sm">
                    Please try creating a new video
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gray-800 rounded-lg mb-6 relative overflow-hidden">
                {videoData.video_url ? (
                  <HLSPlayer src={videoData.stream_url}></HLSPlayer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center z-10">
                      <Video className="w-16 h-16 text-accent mx-auto mb-4" />
                      <p className="text-white font-medium">
                        Video Business Card
                      </p>
                      <p className="text-muted text-sm">HD Quality</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-blue-500/20" />
                  </div>
                )}
              </div>
            )}
            <div className="text-center space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {videoData.name}
                </h1>
                {videoData.role && (
                  <p className="text-lg text-accent font-medium">
                    {videoData.role}
                  </p>
                )}
              </div>

              <p className="text-xl text-muted italic">{videoData.tagline}</p>

              <p className="text-muted leading-relaxed max-w-2xl mx-auto">
                {videoData.description}
              </p>

              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
                <Video className="w-4 h-4 mr-1" />
                HypeCard
              </div>
            </div>
          </motion.div>
          {/* Footer */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {videoData.download_url && (
              <Button onClick={downloadVideo} variant="secondary">
                <Download className="w-5 h-5" />
                Download Video
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={copyToClipboard}
              className={copied ? "bg-green-600 hover:bg-green-600" : ""}
            >
              <Copy className="w-5 h-5" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center pt-8 border-t border-border"
          >
            <p className="text-muted mb-4">
              Create your own video business card
            </p>
            <a
              href="/"
              className="inline-flex items-center space-x-2 text-accent hover:text-blue-400 font-medium transition-colors"
            >
              <Video className="w-5 h-5" />
              <span>Get Started with HypeCard</span>
            </a>
            <div className="mt-4">
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 text-muted hover:text-white transition-colors text-sm"
              >
                <span>Built with Bolt.new</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SharePage;
