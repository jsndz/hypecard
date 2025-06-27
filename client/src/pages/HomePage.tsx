import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Sparkles, Share2, Crown, ArrowRight, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import FloatingBadge from '../components/FloatingBadge';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Generation',
      description: 'Advanced AI creates professional video business cards tailored to your brand.'
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Instant Sharing',
      description: 'Share your video business card instantly with a custom link.'
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: 'Pro Features',
      description: 'Unlock unlimited videos, custom domains, and advanced analytics.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium"
                >
                  <Star className="w-4 h-4 mr-1" />
                  AI-Powered Video Business Cards
                </motion.div>
                
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                  Create your{' '}
                  <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                    AI-powered
                  </span>
                  <br />
                  video business card
                </h1>
                
                <p className="text-xl text-muted max-w-3xl mx-auto">
                  Stand out from the crowd with personalized video business cards powered by AI. 
                  Perfect for networking, job applications, and personal branding.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/form">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Play className="w-5 h-5" />
                  See Examples
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-blue-500/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent/10 via-transparent to-transparent blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to stand out
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Create professional video business cards with cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-3xl bg-gradient-to-r from-accent/10 via-blue-500/10 to-accent/10 border border-accent/20"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to create your video business card?
            </h2>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who are already using HypeCard to make lasting impressions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/form">
                <Button size="lg">
                  Start Creating
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/pro">
                <Button variant="secondary" size="lg">
                  <Crown className="w-5 h-5" />
                  View Pro Features
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <FloatingBadge />
    </div>
  );
};

export default HomePage;