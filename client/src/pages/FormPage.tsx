import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Building, Video, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import { apiClient } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const FormPage: React.FC = () => {
  const [cardType, setCardType] = useState<"personal" | "business">("personal");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState<"male" | "female">("male");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError("");

    try {
      const formData = {
        formType: cardType,
        name,
        role: cardType === "personal" ? role : undefined,
        tagline,
        description,
        avatar: avatar,
      };

      const response = await apiClient.createVideo(formData);

      window.open(response.data.video_url, "_blank");
    } catch (err: any) {
      setError(err.message || "Failed to generate video. Please try again.");

      // If it's a Pro limit error, refresh user data and suggest upgrade
      if (
        err.message.includes("upgrade to Pro") ||
        err.message.includes("limited to 1 video")
      ) {
        await refreshUser();
      }
    } finally {
      setIsGenerating(false);
    }
  };
  if (isGenerating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Header />
        <div className="text-center py-20">
          <Video className="w-8 h-8 animate-pulse text-accent mx-auto mb-4" />
          <p className="text-muted text-lg">Generating your video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              Create Your Video Business Card
            </h1>
            <p className="text-muted">
              Fill out the form below to generate your personalized video
              business card
            </p>
            {!user?.isPro && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  Free users are limited to 1 video.{" "}
                  <a href="/pro" className="underline hover:text-yellow-300">
                    Upgrade to Pro
                  </a>{" "}
                  for unlimited videos.
                </p>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface/50 backdrop-blur-xl rounded-2xl p-8 border border-border"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Type Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Card Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCardType("personal")}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      cardType === "personal"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border hover:border-gray-600"
                    }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-2" />
                    <span className="block font-medium">Personal</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCardType("business")}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      cardType === "business"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border hover:border-gray-600"
                    }`}
                  >
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <span className="block font-medium">Business</span>
                  </motion.button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <Input
                  label={
                    cardType === "personal" ? "Full Name" : "Business Name"
                  }
                  value={name}
                  onChange={setName}
                  placeholder={
                    cardType === "personal" ? "John Doe" : "Acme Inc."
                  }
                  required
                />

                {cardType === "personal" && (
                  <Input
                    label="Role/Title"
                    value={role}
                    onChange={setRole}
                    placeholder="Software Engineer"
                    required
                  />
                )}

                <Input
                  label="Tagline"
                  value={tagline}
                  onChange={setTagline}
                  placeholder={
                    cardType === "personal"
                      ? "Building amazing software"
                      : "Innovation at its finest"
                  }
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Description <span className="text-red-400 ml-1">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us more about yourself or your business..."
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              {/* Avatar Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Avatar Style</h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAvatar("male")}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      avatar === "male"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border hover:border-gray-600"
                    }`}
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2"></div>
                    <span className="block font-medium">Male</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAvatar("female")}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      avatar === "female"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border hover:border-gray-600"
                    }`}
                  >
                    <div className="w-12 h-12 bg-pink-500 rounded-full mx-auto mb-2"></div>
                    <span className="block font-medium">Female</span>
                  </motion.button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 text-sm">{error}</p>
                    {error.includes("upgrade to Pro") && (
                      <a
                        href="/pro"
                        className="text-red-300 hover:text-red-200 text-sm underline mt-1 inline-block"
                      >
                        View Pro Plans →
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={isGenerating}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Video className="w-5 h-5 animate-pulse" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5" />
                    Generate Video Business Card
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FormPage;
