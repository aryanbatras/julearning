import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, Award } from 'lucide-react';
import CustomSearchBar from './CustomSearchBar';

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

          {/* Modern Search Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative max-w-lg mx-auto mb-16"
          >
            {/* Floating accent elements */}
            <div className="absolute inset-0 -m-8 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full"
                  style={{
                    left: `${15 + (i * 10)}%`,
                    top: `${10 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    scale: [0, 1.2, 0],
                    opacity: [0, 0.6, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4 + (i * 0.3),
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <div className="relative group">
              {/* Subtle glow ring */}
              <motion.div
                className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-500"
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(59, 130, 246, 0)",
                    "0 0 30px rgba(139, 92, 246, 0.3)",
                    "0 0 0px rgba(59, 130, 246, 0)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Glass morphism container */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl group-hover:shadow-2xl group-hover:shadow-blue-500/10 transition-all duration-500">
                {/* Animated border gradient */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-40 transition-all duration-500"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Custom Search Bar Integration */}
                <div className="relative w-full flex justify-center">
                  {/* Animating small shapes */}
                  <motion.div
                    className="absolute -top-3 -left-3 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-3 left-2 w-4 h-2 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg rotate-45"
                    animate={{
                      rotate: [45, 90, 45],
                      x: [0, 5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-2 -right-3 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 border border-purple-300/50"
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />

                  <CustomSearchBar
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder="Search courses"
                  />
                </div>

                {/* Floating accent dots */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.4, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          
        </motion.div>
      </div>

      <style jsx>{`
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.05)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
};

export default EnhancedHeroSection;
