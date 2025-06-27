import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const FloatingBadge: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 bg-surface/90 backdrop-blur-md border border-border hover:border-accent/50 text-muted hover:text-white transition-all duration-300 text-sm px-4 py-3 rounded-full shadow-lg hover:shadow-xl group"
      >
        <span className="font-medium">Built with Bolt.new</span>
        <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
      </motion.a>
    </motion.div>
  );
};

export default FloatingBadge;