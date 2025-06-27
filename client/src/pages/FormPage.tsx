import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Building, Video } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';

const FormPage: React.FC = () => {
  const [cardType, setCardType] = useState<'personal' | 'business'>('personal');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState<'male' | 'female'>('male');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Mock video generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate a mock video ID and navigate to share page
    const videoId = Math.random().toString(36).substring(2, 15);
    navigate(`/card/${videoId}`);
  };

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
            <h1 className="text-3xl font-bold mb-4">Create Your Video Business Card</h1>
            <p className="text-muted">Fill out the form below to generate your personalized video business card</p>
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