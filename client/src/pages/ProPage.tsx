import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Check, Infinity, Share2, BarChart3, Palette } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';

const ProPage: React.FC = () => {
  const features = [
    {
      icon: <Infinity className="w-6 h-6" />,
      title: 'Unlimited Videos',
      description: 'Create as many video business cards as you need without limits'
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Custom Shareable Links',
      description: 'Get branded URLs like hypecard.me/yourname for professional sharing'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Advanced Analytics',
      description: 'Track views, engagement, and performance of your video cards'
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Custom Branding',
      description: 'Customize colors, fonts, and styling to match your brand'
    }
  ];

  const pricingFeatures = [
    'Unlimited video business cards',
    'Custom shareable links',
    'Advanced analytics dashboard',
    'Priority support',
    'Custom branding options',
    'HD video quality',
    'No watermarks'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium"
              >
                <Crown className="w-4 h-4 mr-1" />
                Pro Features
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                Unlock the full potential of{' '}
                <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                  HypeCard Pro
                </span>
              </h1>
              
              <p className="text-xl text-muted max-w-3xl mx-auto">
                Take your video business cards to the next level with unlimited creation, 
                custom branding, and powerful analytics.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-surface/50 border border-border hover:border-accent/30 transition-all duration-300"
              >
                <div className="text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted text-lg">
              Everything you need to create professional video business cards
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-accent/10 via-blue-500/10 to-accent/10 rounded-3xl p-8 border border-accent/20 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                  <Crown className="w-4 h-4 mr-1" />
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold mb-2">HypeCard Pro</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-muted ml-2">/month</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {pricingFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex-shrink-0 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Link to="/pro/form">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Crown className="w-5 h-5" />
                    Upgrade to Pro
                  </Button>
                </Link>
                <p className="text-muted text-sm mt-4">
                  Cancel anytime. No long-term commitments.
                </p>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-blue-500/5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-accent/20 to-transparent blur-3xl" />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProPage;