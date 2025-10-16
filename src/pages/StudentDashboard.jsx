import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, Search, Award, Clock, BarChart2, Rocket, Star, TrendingUp, Users } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import RequestCourseForm from '@/components/RequestCourseForm';
import { Link } from 'react-router-dom';
import CourseCard from '@/components/CourseCard';
import CustomSearchBar from '@/components/CustomSearchBar';

// Stats component for the dashboard
const StatCard = ({ icon: Icon, value, label, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
  >
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${color} text-white`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
    <p className="text-gray-500">{label}</p>
  </motion.div>
);

// Feature card component
const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
  >
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${color} text-white mb-4`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For non-authenticated users, show public home page
  if (!user) {
      return (
          <div className="min-h-screen bg-gray-50">
              <Helmet>
                  <title>JU Learning Portal - Jammu University</title>
                  <meta name="description"
                        content="Educational portal for Jammu University students with courses, notes, and learning resources"/>
                  <style type="text/css">{`
                .button {
              --white: #ffe7ff;
              --purple-100: #f4b1fd;
              --purple-200: #d190ff;
              --purple-300: #c389f2;
              --purple-400: #8e26e2;
              --purple-500: #5e2b83;
              --radius: 18px;

              border-radius: var(--radius);
              outline: none;
              cursor: pointer;
              font-size: 23px;
              font-family: Arial;
              background: transparent;
              letter-spacing: -1px;
              border: 0;
              position: relative;
              width: 220px;
              height: 80px;
              transform: rotate(353deg) skewX(4deg);
            }

            .bg {
              position: absolute;
              inset: 0;
              border-radius: inherit;
              filter: blur(1px);
            }
            .bg::before,
            .bg::after {
              content: "";
              position: absolute;
              inset: 0;
              border-radius: calc(var(--radius) * 1.1);
              background: var(--purple-500);
            }
            .bg::before {
              filter: blur(5px);
              transition: all 0.3s ease;
              box-shadow:
                -7px 6px 0 0 rgb(115 75 155 / 40%),
                -14px 12px 0 0 rgb(115 75 155 / 30%),
                -21px 18px 4px 0 rgb(115 75 155 / 25%),
                -28px 24px 8px 0 rgb(115 75 155 / 15%),
                -35px 30px 12px 0 rgb(115 75 155 / 12%),
                -42px 36px 16px 0 rgb(115 75 155 / 8%),
                -56px 42px 20px 0 rgb(115 75 155 / 5%);
            }

            .wrap {
              border-radius: inherit;
              overflow: hidden;
              height: 100%;
              transform: translate(6px, -6px);
              padding: 3px;
              background: linear-gradient(
                to bottom,
                var(--purple-100) 0%,
                var(--purple-400) 100%
              );
              position: relative;
              transition: all 0.3s ease;
            }

            .outline {
              position: absolute;
              overflow: hidden;
              inset: 0;
              opacity: 0;
              outline: none;
              border-radius: inherit;
              transition: all 0.4s ease;
            }
            .outline::before {
              content: "";
              position: absolute;
              inset: 2px;
              width: 120px;
              height: 300px;
              margin: auto;
              background: linear-gradient(
                to left,
                transparent 0%,
                #f8bbd9 50%,
                transparent 100%
              );
              animation: spin 2s linear infinite;
              animation-play-state: paused;
            }

            .content {
              pointer-events: none;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1;
              position: relative;
              height: 100%;
              gap: 16px;
              border-radius: calc(var(--radius) * 0.85);
              font-weight: 600;
              transition: all 0.3s ease;
              background: linear-gradient(
                var(--purple-300) 50%,
                var(--purple-400) 100%
              );
              box-shadow:
                inset -2px 12px 11px -5px var(--purple-200),
                inset 1px -3px 11px 0px rgb(0 0 0 / 35%);
            }
            .content::before {
              content: "";
              inset: 0;
              position: absolute;
              z-index: 10;
              width: 80%;
              top: 45%;
              bottom: 35%;
              opacity: 0.7;
              margin: auto;
              background: linear-gradient(to bottom, transparent, var(--purple-400));
              filter: brightness(1.3) blur(5px);
            }

            .char {
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .char span {
              display: block;
              color: transparent;
              position: relative;
            }
            .char span:nth-child(5) {
              margin-left: 5px;
            }
            .char.state-1 span:nth-child(5) {
              margin-right: -3px;
            }
            .char.state-1 span {
              animation: charAppear 1.2s ease backwards calc(var(--i) * 0.03s);
            }
            .char.state-1 span::before,
            .char span::after {
              content: attr(data-label);
              position: absolute;
              color: var(--white);
              text-shadow: -1px 1px 2px var(--purple-500);
              left: 0;
            }
            .char span::before {
              opacity: 0;
              transform: translateY(-100%);
            }
            .char.state-2 {
              position: absolute;
              left: 80px;
            }
            .char.state-2 span::after {
              opacity: 1;
            }

            .icon {
              animation: resetArrow 0.8s cubic-bezier(0.7, -0.5, 0.3, 1.2) forwards;
              z-index: 10;
            }
            .icon div,
            .icon div::before,
            .icon div::after {
              height: 3px;
              border-radius: 1px;
              background-color: #fce4ec;
            }
            .icon div::before,
            .icon div::after {
              content: "";
              position: absolute;
              right: 0;
              transform-origin: center right;
              width: 14px;
              border-radius: 15px;
              transition: all 0.3s ease;
            }
            .icon div {
              position: relative;
              width: 24px;
              box-shadow: -2px 2px 5px var(--purple-400);
              transform: scale(0.9);
              background: linear-gradient(to bottom, #fce4ec, var(--purple-100));
              animation: swingArrow 1s ease-in-out infinite;
              animation-play-state: paused;
            }
            .icon div::before {
              transform: rotate(44deg);
              top: 1px;
              box-shadow: 1px -2px 3px -1px var(--purple-400);
              animation: rotateArrowLine 1s linear infinite;
              animation-play-state: paused;
            }
            .icon div::after {
              bottom: 1px;
              transform: rotate(316deg);
              box-shadow: -2px 2px 3px 0 var(--purple-400);
              background: linear-gradient(200deg, #fce4ec, var(--purple-100));
              animation: rotateArrowLine2 1s linear infinite;
              animation-play-state: paused;
            }

            .path {
              position: absolute;
              z-index: 12;
              bottom: 0;
              left: 0;
              right: 0;
              stroke-dasharray: 150 480;
              stroke-dashoffset: 150;
              pointer-events: none;
            }

            .splash {
              position: absolute;
              top: 0;
              left: 0;
              pointer-events: none;
              stroke-dasharray: 60 60;
              stroke-dashoffset: 60;
              transform: translate(-17%, -31%);
              stroke: blue;
            }

            /** STATES */

            .button:hover .words {
              opacity: 1;
            }
            .button:hover .words span {
              animation-play-state: running;
            }

            .button:hover .char.state-1 span::before {
              animation: charAppear 0.7s ease calc(var(--i) * 0.03s);
            }

            .button:hover .char.state-1 span::after {
              opacity: 1;
              animation: charDisappear 0.7s ease calc(var(--i) * 0.03s);
            }

            .button:hover .wrap {
              transform: translate(8px, -8px);
            }

            .button:hover .outline {
              opacity: 1;
            }

            .button:hover .outline::before,
            .button:hover .icon div::before,
            .button:hover .icon div::after,
            .button:hover .icon div {
              animation-play-state: running;
            }

            .button:active .bg::before {
              filter: blur(5px);
              opacity: 0.7;
              box-shadow:
                -7px 6px 0 0 rgb(115 75 155 / 40%),
                -14px 12px 0 0 rgb(115 75 155 / 25%),
                -21px 18px 4px 0 rgb(115 75 155 / 15%);
            }
            .button:active .content {
              box-shadow:
                inset -1px 12px 8px -5px rgba(71, 0, 137, 0.4),
                inset 0px -3px 8px 0px var(--purple-200);
            }

            .button:active .words,
            .button:active .outline {
              opacity: 0;
            }

            .button:active .wrap {
              transform: translate(3px, -3px);
            }

            .button:active .splash {
              animation: splash 0.8s cubic-bezier(0.3, 0, 0, 1) forwards 0.05s;
            }

            .button:focus .path {
              animation: path 1.6s ease forwards 0.2s;
            }

            .button:focus .icon {
              animation: arrow 1s cubic-bezier(0.7, -0.5, 0.3, 1.5) forwards;
            }

            .char.state-2 span::after,
            .button:focus .char.state-1 span {
              animation: charDisappear 0.5s ease forwards calc(var(--i) * 0.03s);
            }

            .button:focus .char.state-2 span::after {
              animation: charAppear 1s ease backwards calc(var(--i) * 0.03s);
            }

            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }

            @keyframes charAppear {
              0% {
                transform: translateY(50%);
                opacity: 0;
                filter: blur(20px);
              }
              20% {
                transform: translateY(70%);
                opacity: 1;
              }
              50% {
                transform: translateY(-15%);
                opacity: 1;
                filter: blur(0);
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }

            @keyframes charDisappear {
              0% {
                transform: translateY(0);
                opacity: 1;
              }
              100% {
                transform: translateY(-70%);
                opacity: 0;
                filter: blur(3px);
              }
            }

            @keyframes arrow {
              0% {
                opacity: 1;
              }
              50% {
                transform: translateX(60px);
                opacity: 0;
              }
              51% {
                transform: translateX(-200px);
                opacity: 0;
              }
              100% {
                transform: translateX(-128px);
                opacity: 1;
              }
            }

            @keyframes swingArrow {
              50% {
                transform: translateX(5px) scale(0.9);
              }
            }

            @keyframes rotateArrowLine {
              50% {
                transform: rotate(30deg);
              }
              80% {
                transform: rotate(55deg);
              }
            }
    
            @keyframes rotateArrowLine2 {
              50% {
                transform: rotate(330deg);
              }
              80% {
                transform: rotate(300deg);
              }
            }

            @keyframes resetArrow {
              0% {
                transform: translateX(-128px);
              }
              100% {
                transform: translateX(0);
              }
            }

            @keyframes path {
              from {
                stroke: #f8bbd9;
              }
              to {
                stroke-dashoffset: -480;
                stroke: #f9c6fe;
              }
            }

            .btn-shine {
              position: relative;
              background: linear-gradient(90deg, transparent 0%, rgba(147, 51, 234, 0.9) 40%, rgba(147, 51, 234, 0.9) 60%, transparent 100%);
              background-size: 200% 100%;
              background-position: 200% 0;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: shine 6s infinite ease-in-out;
              animation-fill-mode: forwards;
            }

            @keyframes shine {
              0% {
                background-position: 0% 0;
              }
              50% {
                background-position: 100% 0;
              }
              100% {
                background-position: 200% 0;
              }
          }

            @keyframes splash {
              from {
                stroke-dasharray: 60 60;
                stroke-dashoffset: 60;
              }
              to {
                stroke-dasharray: 2 60;
                stroke-dashoffset: -60;
              }
            }  
                        
          `}</style>
              </Helmet>

              {/* Public Hero Section */}
              <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
                  {/* Background Pattern */}
                  <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50"></div>

                  <div className="relative z-10 text-center max-w-7xl mx-auto px-4">
                      <motion.div
                          initial={{opacity: 0, y: 30}}
                          animate={{opacity: 1, y: 0}}
                          transition={{duration: 0.8, ease: "easeOut"}}
                          className="mb-8"
                      >
                          <div
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8 shadow-lg">
                              <span className="text-sm font-semibold text-white">🏆 Jammu University's Premier Learning Platform</span>
                          </div>
                          <br></br>

                          <div className="relative inline-block">
                              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-6 tracking-tight leading-none btn-shine">
                                  JU <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 btn-shine">LEARNING</span>
                              </h1>
                          </div>

                          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
                              Empowering Jammu University students with world-class education, skill development, and
                              career growth opportunities through our comprehensive learning ecosystem
                          </p>
                      </motion.div>

                      <motion.div
                          initial={{opacity: 0, y: 20}}
                          animate={{opacity: 1, y: 0}}
                          transition={{duration: 0.8, delay: 0.3}}
                          className="mb-16"
                      >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
                              <div
                                  className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                                  <div className="text-4xl font-black text-blue-600 mb-3">500+</div>
                                  <div className="text-lg font-semibold text-gray-800 mb-2">Courses Available</div>
                                  <div className="text-gray-600">Comprehensive curriculum across all disciplines</div>
                              </div>
                              <div
                                  className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                                  <div className="text-4xl font-black text-purple-600 mb-3">10K+</div>
                                  <div className="text-lg font-semibold text-gray-800 mb-2">Students Enrolled</div>
                                  <div className="text-gray-600">Active learners building their future</div>
                              </div>
                              <div
                                  className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                                  <div className="text-4xl font-black text-indigo-600 mb-3">95%</div>
                                  <div className="text-lg font-semibold text-gray-800 mb-2">Success Rate</div>
                                  <div className="text-gray-600">Proven track record of student achievement</div>
                              </div>
                          </div>
                      </motion.div>

                      <motion.div
                          initial={{opacity: 0, y: 20}}
                          animate={{opacity: 1, y: 0}}
                          transition={{duration: 0.8, delay: 0.6}}
                      >
                          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                              <button
                                  className="button"
                                  data-text="Awesome"
                                  style={{
                                      margin: '0',
                                      height: 'auto',
                                      background: 'transparent',
                                      padding: '0',
                                      border: 'none',
                                      cursor: 'pointer',
                                      '--border-right': '6px',
                                      '--text-stroke-color': '#8957f7',
                                      '--animation-color': '#8957f7',
                                      '--fs-size': '1.9em',
                                      letterSpacing: '7px',
                                      textDecoration: 'none',
                                      fontSize: 'var(--fs-size)',
                                      fontFamily: 'Arial',
                                      position: 'relative',
                                      textTransform: 'uppercase',
                                      color: 'transparent',
                                      WebkitTextStroke: '12.5px var(--text-stroke-color)',
                                      whiteSpace: 'nowrap',
                                      minWidth: 'fit-content'
                                  }}
                                  onClick={() => window.location.href = '/courses'}
                              >
                  <span className="actual-text" style={{
                      color: 'black',
                      opacity: 0.1,
                      WebkitTextStroke: '1px var(--text-stroke-color)',
                      whiteSpace: 'nowrap'
                  }}>&nbsp;Explore Courses&nbsp;</span>
                                  <span aria-hidden="true" className="hover-text" style={{
                                      position: 'absolute',
                                      top: '0',
                                      left: '0',
                                      width: '0%',
                                      height: '100%',
                                      color: 'var(--animation-color)',
                                      borderRight: 'var(--border-right) solid var(--animation-color)',
                                      overflow: 'hidden',
                                      transition: '0.5s',
                                      WebkitTextStroke: '2px var(--animation-color)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      whiteSpace: 'nowrap'
                                  }}>&nbsp;Explore Courses&nbsp;</span>
                              </button>
                              <button
                                  className="learn-more"
                                  style={{
                                      position: 'relative',
                                      display: 'inline-block',
                                      cursor: 'pointer',
                                      outline: 'none',
                                      border: '0',
                                      verticalAlign: 'middle',
                                      textDecoration: 'none',
                                      background: 'transparent',
                                      padding: '0',
                                      fontSize: 'inherit',
                                      fontFamily: 'inherit',
                                      width: '12rem',
                                      height: 'auto'
                                  }}
                                  onClick={() => window.location.href = '/about'}
                              >
                  <span
                      className="circle"
                      aria-hidden="true"
                      style={{
                          transition: 'all 0.45s cubic-bezier(0.65, 0, 0.076, 1)',
                          position: 'relative',
                          display: 'block',
                          margin: '0',
                          width: '3rem',
                          height: '3rem',
                          background: '#282936',
                          borderRadius: '1.625rem'
                      }}
                  >
                    <span
                        className="icon arrow"
                        style={{
                            transition: 'all 0.45s cubic-bezier(0.65, 0, 0.076, 1)',
                            position: 'absolute',
                            top: '0',
                            bottom: '0',
                            margin: 'auto',
                            background: '#fff',
                            left: '0.625rem',
                            width: '1.125rem',
                            height: '0.125rem'
                        }}
                    ></span>
                  </span>
                                  <span
                                      className="button-text"
                                      style={{
                                          transition: 'all 0.45s cubic-bezier(0.65, 0, 0.076, 1)',
                                          position: 'absolute',
                                          top: '0',
                                          left: '0',
                                          right: '0',
                                          bottom: '0',
                                          padding: '0.75rem 0',
                                          margin: '0 0 0 1.85rem',
                                          color: '#282936',
                                          fontWeight: '700',
                                          lineHeight: '1.6',
                                          textAlign: 'center',
                                          textTransform: 'uppercase'
                                      }}
                                  >
                    Learn More
                  </span>
                              </button>
                          </div>
                      </motion.div>
                  </div>
              </div>

              {/* Public Content Sections */}
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  {/* Public Learning Resources */}
                  <section className="mb-20">
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 text-center">Explore Learning
                          Resources</h2>
                      <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">Everything you need to
                          succeed in your academic journey</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          <div
                              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                              <div
                                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                  <BookOpen className="w-8 h-8 text-white"/>
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-3">Academic Courses</h3>
                              <p className="text-gray-600 mb-6">Comprehensive curriculum designed by expert faculty</p>
                              <Link to="/courses"
                                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                  Explore Courses →
                              </Link>
                          </div>

                          <div
                              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                              <div
                                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                  <Award className="w-8 h-8 text-white"/>
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-3">Certifications</h3>
                              <p className="text-gray-600 mb-6">Industry-recognized certificates to boost your
                                  resume</p>
                              <Link to="/certifications"
                                    className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                                  Get Certified →
                              </Link>
                          </div>

                          <div
                              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                              <div
                                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                  <Users className="w-8 h-8 text-white"/>
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-3">Study Groups</h3>
                              <p className="text-gray-600 mb-6">Collaborate with peers and learn together</p>
                              <Link to="/study-groups"
                                    className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                                  Join Groups →
                              </Link>
                          </div>
                      </div>
                  </section>

                  {/* Call to Action */}
                  <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 md:p-16 text-center">
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Ready to Start Your Learning
                          Journey?</h2>
                      <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">Join thousands of
                          Jammu University students who are already learning with us. Sign up now and get started!</p>
                      <div className="flex justify-center mx-auto w-full">
                          {/* From Uiverse.io by marcelodolza */}
                          <button className="button" onClick={() => window.location.href = '/signup'}>
                              <div className="bg"></div>
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 342 208"
                                  height="208"
                                  width="342"
                                  className="splash"
                              >
                                  <path
                                      strokeLinecap="round"
                                      strokeWidth="3"
                                      d="M54.1054 99.7837C54.1054 99.7837 40.0984 90.7874 26.6893 97.6362C13.2802 104.485 1.5 97.6362 1.5 97.6362"
                                  ></path>
                                  <path
                                      strokeLinecap="round"
                                      strokeWidth="3"
                                      d="M285.273 99.7841C285.273 99.7841 299.28 90.7879 312.689 97.6367C326.098 104.486 340.105 95.4893 340.105 95.4893"
                                  ></path>
                                  <path
                                      strokeLinecap="round"
                                      strokeWidth="3"
                                      strokeOpacity="0.3"
                                      d="M281.133 64.9917C281.133 64.9917 287.96 49.8089 302.934 48.2295C317.908 46.6501 319.712 36.5272 319.712 36.5272"
                                  ></path>
                                  <path
                                      strokeLinecap="round"
                                      strokeWidth="3"
                                      strokeOpacity="0.3"
                                      d="M281.133 138.984C281.133 138.984 287.96 154.167 302.934 155.746C317.908 157.326 319.712 167.449 319.712 167.449"
                                  ></path>
                                  <path
                                      strokeLinecap="round"
                                      strokeWidth="3"
                                      d="M230.578 57.4476C230.578 57.4476 225.785 41.5051 236.061 30.4998C246.337 19.4945 244.686 12.9998 244.686 12.9998"
                                  ></path>
                                  <path
                                      strokeLinecap="round"
                                      strokeWidth="3"
                                      d="M230.578 150.528C230.578 150.528 225.785 166.471 236.061 177.476C246.337 188.481 244.686 194.976 244.686 194.976"
                                  ></path>
                                  <path
                                      strokeLinecap="round"
                                      strokeWidth="3"
                                      strokeOpacity="0.3"
                                      d="M170.392 57.0278C170.392 57.0278 173.89 42.1322 169.571 29.54C165.252 16.9478 168.751 2.05227 168.751 2.05227"
                                  ></path>
                                  <path
                                      strokeLinecap="round"
                                      strokeWidth="3"
                                      strokeOpacity="0.3"
                                      d="M170.392 150.948C170.392 150.948 173.89 165.844 169.571 178.436C165.252 191.028 168.751 205.924 168.751 205.924"
                                  ></path>
                                  <path
                                      strokeLinecap="round"
                                      strokeWidth="3"
                                      d="M112.609 57.4476C112.609 57.4476 117.401 41.5051 107.125 30.4998C96.8492 19.4945 98.5 12.9998 98.5 12.9998"
                                  ></path>
                                  <path
                                      strokeLinecap="round"
                                      strokeWidth="3"
                                      d="M112.609 150.528C112.609 150.528 117.401 166.471 107.125 177.476C96.8492 188.481 98.5 194.976 98.5 194.976"
                                  ></path>
                                  <path
                                      strokeLinecap="round"
                                      strokeWidth="3"
                                      strokeOpacity="0.3"
                                      d="M62.2941 64.9917C62.2941 64.9917 55.4671 49.8089 40.4932 48.2295C25.5194 46.6501 23.7159 36.5272 23.7159 36.5272"
                                  ></path>
                                  <path
                                      strokeLinecap="round"
                                      strokeWidth="3"
                                      strokeOpacity="0.3"
                                      d="M62.2941 145.984C62.2941 145.984 55.4671 161.167 40.4932 162.746C25.5194 164.326 23.7159 174.449 23.7159 174.449"
                                  ></path>
                              </svg>

                              <div className="wrap">
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 221 42"
                                      height="42"
                                      width="221"
                                      className="path"
                                  >
                                      <path
                                          strokeLinecap="round"
                                          strokeWidth="3"
                                          d="M182.674 2H203C211.837 2 219 9.16344 219 18V24C219 32.8366 211.837 40 203 40H18C9.16345 40 2 32.8366 2 24V18C2 9.16344 9.16344 2 18 2H47.8855"
                                      ></path>
                                  </svg>

                                  <div className="outline"></div>
                                  <div className="content">
                    <span className="char state-1">
                      <span data-label="J" style={{'--i': 1}}>J</span>
                      <span data-label="o" style={{'--i': 2}}>o</span>
                      <span data-label="i" style={{'--i': 3}}>i</span>
                      <span data-label="n" style={{'--i': 4}}>n</span>
                      <span data-label="T" style={{'--i': 5}}>T</span>
                      <span data-label="o" style={{'--i': 6}}>o</span>
                      <span data-label="d" style={{'--i': 7}}>d</span>
                      <span data-label="a" style={{'--i': 8}}>a</span>
                      <span data-label="y" style={{'--i': 9}}>y</span>
                    </span>

                                      <div className="icon">
                                          <div></div>
                                      </div>

                                      <span className="char state-2">
                      <span data-label="J" style={{'--i': 1}}>J</span>
                      <span data-label="o" style={{'--i': 2}}>o</span>
                      <span data-label="i" style={{'--i': 3}}>i</span>
                      <span data-label="n" style={{'--i': 4}}>n</span>
                      <span data-label="N" style={{'--i': 5}}>N</span>
                      <span data-label="o" style={{'--i': 6}}>o</span>
                      <span data-label="w" style={{'--i': 7}}>w</span>
                    </span>
                                  </div>
                              </div>
                          </button>
                      </div>
                  </section>
              </main>
          </div>
      );
  }

  // Authenticated user dashboard continues here...

  const fetchCoursesAndEnrollments = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from('courses')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false });

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,code.ilike.%${searchTerm}%`);
    }

    const { data: coursesData, error: coursesError } = await query;

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
    } else {
      setCourses(coursesData || []);
    }

    if (user) {
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id);

      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError);
      } else {
        setEnrolledCourses(new Set(enrollmentsData.map(e => e.course_id)));
      }
    }

    setLoading(false);
  }, [user, searchTerm]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCoursesAndEnrollments();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [fetchCoursesAndEnrollments]);

  const handleEnroll = async (course) => {
    if (!user) {
      toast({ title: 'Not logged in', description: 'You must be logged in to enroll.', variant: 'destructive' });
      return;
    }
    
    if (enrolledCourses.has(course.id)) {
      toast({ title: "Already Enrolled", description: "You are already enrolled in this course." });
      return;
    }

    if (!course.is_free) {
      toast({ title: "Payment Required", description: "Please proceed to the course page to complete the payment." });
      return;
    }

    const { error } = await supabase.from('enrollments').insert({ user_id: user.id, course_id: course.id });

    if (error) {
      console.error('Enrollment error:', error);
    } else {
      toast({ title: 'Success!', description: 'You have been enrolled in the course.' });
      setEnrolledCourses(prev => new Set(prev).add(course.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Student Dashboard - JU Learning Portal</title>
        <meta name="description" content="Your personal dashboard for courses and learning materials." />
      </Helmet>

      {/* Personalized Welcome Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,transparent)] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user?.user_metadata?.name?.split(' ')[0] || 'Student'}</span>! 👋
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed animate-fade-in-up">Your personalized learning dashboard is ready. Let's make today productive!</p>

            <div className="relative max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CustomSearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Continue Your Learning Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Access your enrolled courses, explore new topics, and track your progress</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: BookOpen, value: enrolledCourses.size, label: "Enrolled Courses", color: "bg-gradient-to-br from-blue-500 to-blue-600" },
              { icon: Award, value: "12", label: "Certificates Earned", color: "bg-gradient-to-br from-green-500 to-green-600" },
              { icon: Clock, value: "24h", label: "Learning Streak", color: "bg-gradient-to-br from-purple-500 to-purple-600" },
              { icon: BarChart2, value: "85%", label: "Course Completion", color: "bg-gradient-to-br from-amber-500 to-orange-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="transform-gpu"
              >
                <StatCard
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  color={stat.color}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Learning Resources */}
        <section className="mb-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 flex items-center gap-3 mb-2">
                <span className="w-2 h-10 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                Featured Courses
              </h2>
              <p className="text-lg text-gray-600">Handpicked courses to accelerate your learning</p>
            </div>
            <Link to="/courses" className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold text-lg">
              <span>Browse all courses</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <AnimatePresence>
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-pulse flex space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-80 h-64 bg-gray-100 rounded-xl"></div>
                  ))}
                </div>
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.slice(0, 3).map((course, index) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    index={index}
                    onEnroll={handleEnroll}
                    isEnrolled={enrolledCourses.has(course.id)}
                    showCreatorInfoButton={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-3xl">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No courses found</h3>
                <p className="text-gray-500">Try adjusting your search or explore our catalog</p>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Learning Resources Grid */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 text-center">Explore Learning Resources</h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">Everything you need to succeed in your academic journey</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Academic Courses",
                desc: "Comprehensive curriculum designed by expert faculty",
                href: "/courses",
                color: "from-blue-500 to-blue-600",
                linkText: "Explore Courses →"
              },
              {
                icon: Award,
                title: "Certifications",
                desc: "Industry-recognized certificates to boost your resume",
                href: "/certifications",
                color: "from-purple-500 to-purple-600",
                linkText: "Get Certified →"
              },
              {
                icon: Users,
                title: "Study Groups",
                desc: "Collaborate with peers and learn together",
                href: "/study-groups",
                color: "from-green-500 to-green-600",
                linkText: "Join Groups →"
              }
            ].map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group transform-gpu"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${resource.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <resource.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {resource.desc}
                  </p>
                  <Link
                    to={resource.href}
                    className={`font-semibold hover:opacity-80 transition-all duration-300 inline-flex items-center gap-2 ${
                      resource.color.includes('blue') ? 'text-blue-600 hover:text-blue-700' :
                      resource.color.includes('purple') ? 'text-purple-600 hover:text-purple-700' :
                      'text-green-600 hover:text-green-700'
                    }`}
                  >
                    <span>{resource.linkText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Request Course Section */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 md:p-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Can't find what you're looking for?</h2>
            <p className="text-xl text-gray-700 mb-10 leading-relaxed">Request a new course and we'll add it to our collection. Your learning journey is our priority!</p>
            <RequestCourseForm />
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;