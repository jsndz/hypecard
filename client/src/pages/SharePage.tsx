import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Download, Share2, ExternalLink, Copy } from 'lucide-react';
import Button from '../components/Button';

const SharePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = React.useState(false);

  // Mock user data based on ID
  const userData = {
    name: 'John Doe',
    role: 'Senior Software Engineer',
    tagline: 'Building the future, one line of code at a time',
    description: 'Passionate full-stack developer with 8+ years of experience creating scalable web applications. I love working with React, Node.js, and cloud technologies to solve complex problems.',
    isPro: id ? id.length > 10 : false,
  };

  const shareUrl = window.location.href;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadVideo = () => {
    // Mock download functionality
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'hypecard-video.mp4';
    link.click();
  };

  const shareVideo = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userData.name} - Video Business Card`,
          text: userData.tagline,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

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
            <div className="aspect-video bg-gray-800 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
              <div className="text-center z-10">
                <Video className="w-16 h-16 text-accent mx-auto mb-4" />
                <p className="text-white font-medium">Video Business Card</p>
                <p className="text-muted text-sm">
                  {userData.isPro ? 'HD Quality • No Watermark' : 'Standard Quality'}
                </p>
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-blue-500/20" />
            </div>

            {/* User Info */}
            <div className="text-center space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{userData.name}</h1>
                {userData.role && (
                  <p className="text-lg text-accent font-medium">{userData.role}</p>
                )}
              </div>
              
              <p className="text-xl text-muted italic">{userData.tagline}</p>
              
              <p className="text-muted leading-relaxed max-w-2xl mx-auto">
                {userData.description}
              </p>

              {userData.isPro && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Pro Member
                </div>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {userData.isPro && (
              <Button onClick={downloadVideo} variant="secondary">
                <Download className="w-5 h-5" />
                Download Video
              </Button>
            )}
            
            <Button onClick={shareVideo}>
              <Share2 className="w-5 h-5" />
              Share Card
            </Button>
            
            <Button
              variant="secondary"
              onClick={copyToClipboard}
              className={copied ? 'bg-green-600 hover:bg-green-600' : ''}
            >
              <Copy className="w-5 h-5" />
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </motion.div>

          {/* Footer */}
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