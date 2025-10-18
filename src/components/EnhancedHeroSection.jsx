import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, Award } from 'lucide-react';

const EnhancedHeroSection = ({ userName, searchTerm, onSearchChange }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.1,
          color: `hsl(${200 + Math.random() * 60}, 70%, ${60 + Math.random() * 20}%)`
        });
      }
    };

    const updateParticles = () => {
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        particle.opacity += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.005;
        particle.opacity = Math.max(0.1, Math.min(0.4, particle.opacity));
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('hsl', 'hsla').replace('%)', `%, ${particle.opacity})`);
        ctx.fill();

        // Add connections between nearby particles
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(147, 197, 253, ${0.1 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        });
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrame = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 overflow-hidden">
      {/* Animated background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
        style={{ zIndex: 1 }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${i % 2 === 0 ? 'w-32 h-32' : 'w-24 h-24'} ${
              i % 3 === 0 ? 'bg-gradient-to-br from-blue-400/20 to-purple-400/20' :
              i % 3 === 1 ? 'bg-gradient-to-br from-purple-400/20 to-pink-400/20' :
              'bg-gradient-to-br from-indigo-400/20 to-blue-400/20'
            } ${i % 2 === 0 ? 'rotate-45' : 'rounded-full'}`}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: i % 2 === 0 ? [45, 225, 45] : [0, 360, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-full mb-8 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Personalized Learning Hub
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="block text-gray-900">Welcome back,</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 ">
              {userName}! 👋
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto font-medium"
          >
            Your personalized learning dashboard awaits. Let's make today{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold">
              extraordinary!
            </span>
          </motion.p>

          {/* Enhanced search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative max-w-2xl mx-auto mb-16 "
          >
            <div className="relative group">
              {/* Animated outer glow ring */}
              <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-500 ease-out">
                <div className="w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl animate-pulse-glow"></div>
              </div>

              {/* Main search container with animated border */}
              <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-3 border-2 border-transparent shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:border-purple-300/50">
                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-20 transition-all duration-500 ease-out animate-gradient-border"></div>

                <div className="relative flex items-center gap-4">
                  {/* Search icon with enhanced animations */}
                  <motion.div
                    className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden"
                    whileHover={{
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1.05, 1],
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className="w-7 h-7 text-white" />
                    </motion.div>
                  </motion.div>

                  {/* Search input */}
                  <motion.input
                    type="text"
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder="Search courses, topics, or skills..."
                    className="flex-1 bg-transparent border-0 outline-none text-lg text-gray-700 placeholder-gray-400 px-4 py-3 focus:ring-0 font-medium"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Enhanced search button with advanced animations */}
                  <motion.button
                    className="relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold rounded-xl overflow-hidden group/btn shadow-lg"
                    whileHover={{
                      scale: 1.05,
                      rotate: [0, -2, 2, 0],
                      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Multiple animated background layers */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300"></div>

                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Button content */}
                    <span className="relative flex items-center gap-3 text-base font-bold">
                      <motion.span
                        animate={{
                          textShadow: [
                            "0 0 0px rgba(255,255,255,0)",
                            "0 0 10px rgba(255,255,255,0.5)",
                            "0 0 0px rgba(255,255,255,0)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        Search
                      </motion.span>
                      <motion.div
                        animate={{
                          x: [0, 4, 0],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick stats preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: TrendingUp, label: "Learning Streak", value: "24 days", color: "from-green-500 to-emerald-500" },
              { icon: Award, label: "Certificates", value: "12 earned", color: "from-yellow-500 to-orange-500" },
              { icon: Users, label: "Study Groups", value: "3 active", color: "from-blue-500 to-indigo-500" },
              { icon: Sparkles, label: "Achievements", value: "8 unlocked", color: "from-purple-500 to-pink-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }

        @keyframes gradient-border {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background: linear-gradient(45deg, #8b5cf6, #3b82f6, #06b6d4, #8b5cf6);
          background-size: 200% 200%;
        }

        .animate-gradient-border {
          animation: gradient-border 3s ease infinite;
          background: linear-gradient(45deg, #8b5cf6, #3b82f6, #06b6d4, #8b5cf6);
          background-size: 200% 200%;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.05)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
};

export default EnhancedHeroSection;
