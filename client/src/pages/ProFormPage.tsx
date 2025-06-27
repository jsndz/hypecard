import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Building, Video, Crown, Copy, Download, ExternalLink } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';

const ProFormPage: React.FC = () => {
  const [cardType, setCardType] = useState<'personal' | 'business'>('personal');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState<'male' | 'female'>('male');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Mock video generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate mock video ID and shareable link
    const videoId = Math.random().toString(36).substring(2, 15);
    const customLink = `hypecard.me/${name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 8)}`;
    
    setGeneratedVideo(videoId);
    setShareableLink(customLink);
    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    if (shareableLink) {
      await navigator.clipboard.writeText(`https://${shareableLink}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadVideo = () => {
    // Mock download functionality
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'hypecard-video.mp4';
    link.click();
  };

  if (generatedVideo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
                <Crown className="w-4 h-4 mr-1" />
                Pro Video Generated
              </div>
              <h1 className="text-3xl font-bold mb-4">Your Video Business Card is Ready!</h1>
              <p className="text-muted">Your professional video business card has been generated with Pro features</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface/50 backdrop-blur-xl rounded-2xl p-8 border border-border"
            >
              {/* Video Preview */}
              <div className="aspect-video bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 text-accent mx-auto mb-4" />
                  <p className="text-white font-medium">Your Video Business Card</p>
                  <p className="text-muted text-sm">HD Quality • No Watermark</p>
                </div>
              </div>

              {/* Shareable Link */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <ExternalLink className="w-5 h-5 mr-2 text-accent" />
                  Custom Shareable Link
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 px-4 py-3 bg-surface border border-border rounded-lg text-white">
                    https://{shareableLink}
                  </div>
                  <Button
                    variant="secondary"
                    onClick={copyToClipboard}
                    className={copied ? 'bg-green-600 hover:bg-green-600' : ''}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={downloadVideo} className="flex-1">
                  <Download className="w-5 h-5" />
                  Download Video
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => window.open(`https://${shareableLink}`, '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="w-5 h-5" />
                  View Live Page
                </Button>
              </div>

              <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <h4 className="font-medium text-accent mb-2">Pro Features Included:</h4>
                <ul className="text-sm text-muted space-y-1">
                  <li>• HD video quality without watermarks</li>
                  <li>• Custom branded shareable link</li>
                  <li>• Advanced analytics tracking</li>
                  <li>• Priority processing</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
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
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium mb-4">
              <Crown className="w-4 h-4 mr-1" />
              Pro Features Enabled
            </div>
            <h1 className="text-3xl font-bold mb-4">Create Your Pro Video Business Card</h1>
            <p className="text-muted">Unlimited videos with custom branding and advanced features</p>
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
                    onClick={() => setCardType('personal')}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      cardType === 'personal'
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border hover:border-gray-600'
                    }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-2" />
                    <span className="block font-medium">Personal</span>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCardType('business')}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      cardType === 'business'
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border hover:border-gray-600'
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
                  label={cardType === 'personal' ? 'Full Name' : 'Business Name'}
                  value={name}
                  onChange={setName}
                  placeholder={cardType === 'personal' ? 'John Doe' : 'Acme Inc.'}
                  required
                />
                
                {cardType === 'personal' && (
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
                  placeholder={cardType === 'personal' ? 'Building amazing software' : 'Innovation at its finest'}
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
                    onClick={() => setAvatar('male')}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      avatar === 'male'
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border hover:border-gray-600'
                    }`}
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2"></div>
                    <span className="block font-medium">Male</span>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAvatar('female')}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      avatar === 'female'
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border hover:border-gray-600'
                    }`}
                  >
                    <div className="w-12 h-12 bg-pink-500 rounded-full mx-auto mb-2"></div>
                    <span className="block font-medium">Female</span>
                  </motion.button>
                </div>
              </div>

              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <h4 className="font-medium text-accent mb-2">Pro Features:</h4>
                <ul className="text-sm text-muted space-y-1">
                  <li>• HD video quality without watermarks</li>
                  <li>• Custom shareable link (hypecard.me/yourname)</li>
                  <li>• Advanced analytics and tracking</li>
                  <li>• Priority processing and support</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isGenerating}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Video className="w-5 h-5 animate-pulse" />
                    Generating Pro Video...
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    Generate Pro Video Business Card
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

export default ProFormPage;