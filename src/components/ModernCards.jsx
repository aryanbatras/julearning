import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, Award, Clock, Users, BookOpen, ArrowRight } from 'lucide-react';
import GlassMorphismCard from './GlassMorphismCard';

const ModernProgressCard = ({ icon: Icon, title, current, total, percentage, color, delay = 0 }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group"
    >
      <GlassMorphismCard
        width="280px"
        height="220px"
        primaryColor="#3b82f6"
        secondaryColor="#8b5cf6"
        className="progress-card"
      >
        <div className="progress-content">
          {/* Header */}
          <div className="progress-header">
            <div className={`progress-icon ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="progress-title">{title}</h3>
          </div>

          {/* Stats */}
          <div className="progress-stats">
            <div className="progress-numbers">
              <span className="current-number">{current}</span>
              <span className="total-number">/ {total}</span>
            </div>
            <div className="progress-percentage">{Math.round(animatedPercentage)}%</div>
          </div>

          {/* Animated Progress Bar */}
          <div className="progress-bar-container">
            <div className="progress-bar-bg">
              <motion.div
                className={`progress-bar-fill ${color}`}
                initial={{ width: 0 }}
                animate={{ width: `${animatedPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="progress-particles">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="particle"
                  animate={{
                    x: [`${i * 12.5}%`, `${i * 12.5}%`],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Achievement Badge */}
          {percentage >= 80 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="achievement-badge"
            >
              <Award className="w-4 h-4" />
            </motion.div>
          )}
        </div>
      </GlassMorphismCard>

      <style jsx>{`
        .progress-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 24px;
          position: relative;
        }

        .progress-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .progress-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--color), var(--color)dd);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .progress-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .progress-stats {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 16px;
        }

        .progress-numbers {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .current-number {
          font-size: 2rem;
          font-weight: 900;
          color: #1f2937;
        }

        .total-number {
          font-size: 1rem;
          color: #6b7280;
          font-weight: 500;
        }

        .progress-percentage {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .progress-bar-container {
          position: relative;
          margin-top: auto;
        }

        .progress-bar-bg {
          height: 8px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }

        .progress-bar-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 8px;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #3b82f6;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(59, 130, 246, 0.5);
        }

        .achievement-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .bg-gradient-to-br.from-blue-500.to-blue-600 { --color: #3b82f6; }
        .bg-gradient-to-br.from-green-500.to-green-600 { --color: #10b981; }
        .bg-gradient-to-br.from-purple-500.to-purple-600 { --color: #8b5cf6; }
        .bg-gradient-to-br.from-amber-500.to-orange-500 { --color: #f59e0b; }
      `}</style>
    </motion.div>
  );
};

const ModernFeatureCard = ({ icon: Icon, title, description, color, href, linkText, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative h-full"
    >
      <GlassMorphismCard
        width="320px"
        height="280px"
        primaryColor="#10b981"
        secondaryColor="#8b5cf6"
        className="feature-card-enhanced"
      >
        <div className="feature-content-enhanced">
          {/* Animated Icon */}
          <div className="feature-icon-container">
            <motion.div
              className={`feature-icon-enhanced ${color}`}
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon className="w-8 h-8" />
            </motion.div>
            <div className="icon-glow"></div>
          </div>

          {/* Content */}
          <div className="feature-text">
            <h3 className="feature-title-enhanced">{title}</h3>
            <p className="feature-description-enhanced">{description}</p>
          </div>

          {/* Animated Link */}
          <motion.div
            className="feature-link"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <a href={href} className="link-text">
              {linkText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </motion.div>

          {/* Floating Elements */}
          <div className="floating-elements">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`floating-dot dot-${i}`}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        </div>
      </GlassMorphismCard>

      <style jsx>{`
        .feature-content-enhanced {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 28px;
          position: relative;
          overflow: hidden;
        }

        .feature-icon-container {
          position: relative;
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .feature-icon-enhanced {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--color), var(--color)dd);
          color: white;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          position: relative;
          z-index: 2;
        }

        .icon-glow {
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, var(--color), var(--color)dd);
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
          filter: blur(8px);
        }

        .group:hover .icon-glow {
          opacity: 0.6;
        }

        .feature-text {
          flex: 1;
          margin-bottom: 24px;
        }

        .feature-title-enhanced {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1f2937;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }

        .feature-description-enhanced {
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        .feature-link {
          margin-top: auto;
        }

        .link-text {
          display: inline-flex;
          align-items: center;
          color: var(--color);
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .link-text:hover {
          color: var(--color-hover);
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .floating-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          background: var(--color);
          border-radius: 50%;
          opacity: 0.3;
        }

        .dot-0 { top: 20%; left: 15%; }
        .dot-1 { top: 60%; right: 20%; }
        .dot-2 { bottom: 25%; left: 25%; }

        .bg-gradient-to-br.from-blue-500.to-blue-600 {
          --color: #3b82f6;
          --color-hover: #2563eb;
        }
        .bg-gradient-to-br.from-purple-500.to-purple-600 {
          --color: #8b5cf6;
          --color-hover: #7c3aed;
        }
        .bg-gradient-to-br.from-green-500.to-green-600 {
          --color: #10b981;
          --color-hover: #059669;
        }
      `}</style>
    </motion.div>
  );
};

const ModernAchievementCard = ({ achievement, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, type: "spring" }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlassMorphismCard
        width="200px"
        height="200px"
        primaryColor="#fbbf24"
        secondaryColor="#f59e0b"
        className="achievement-card"
      >
        <div className="achievement-content">
          <motion.div
            className="achievement-icon-container"
            animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="achievement-icon">
              <achievement.icon className="w-8 h-8" />
            </div>
          </motion.div>

          <h3 className="achievement-title">{achievement.title}</h3>
          <p className="achievement-description">{achievement.description}</p>

      

          {/* Sparkle Effects */}
          <AnimatePresence>
            {isHovered && (
              <div className="sparkles">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`sparkle sparkle-${i}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="w-3 h-3" />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </GlassMorphismCard>

      <style jsx>{`
        .achievement-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 20px;
          text-align: center;
          position: relative;
        }

        .achievement-icon-container {
          margin-bottom: 16px;
        }

        .achievement-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 6px 20px rgba(251, 191, 36, 0.3);
        }

        .achievement-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .achievement-description {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.4;
          margin: 0 0 12px 0;
        }

        .achievement-date {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 500;
        }

        .sparkles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .sparkle {
          position: absolute;
          color: #fbbf24;
          animation: sparkle-float 2s ease-in-out infinite;
        }

        .sparkle-0 { top: 20%; left: 20%; animation-delay: 0s; }
        .sparkle-1 { top: 15%; right: 25%; animation-delay: 0.2s; }
        .sparkle-2 { bottom: 30%; left: 15%; animation-delay: 0.4s; }
        .sparkle-3 { bottom: 25%; right: 20%; animation-delay: 0.6s; }
        .sparkle-4 { top: 35%; left: 35%; animation-delay: 0.8s; }
        .sparkle-5 { top: 45%; right: 35%; animation-delay: 1s; }

        @keyframes sparkle-float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0; }
          50% { transform: translateY(-10px) rotate(180deg); opacity: 1; }
        }
      `}</style>
    </motion.div>
  );
};

export { ModernProgressCard, ModernFeatureCard, ModernAchievementCard };
