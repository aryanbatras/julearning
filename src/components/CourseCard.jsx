import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, IndianRupee, CheckCircle, Download, Video, ArrowRight, Sparkles, Heart, Clock, BarChart2, Users, Star } from 'lucide-react';
import GlassMorphismCard from '@/components/GlassMorphismCard';

const CourseCard = ({ course, index, onEnroll, isEnrolled, showCreatorInfoButton = false }) => {
  const thumbnailUrl = course.thumbnail_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  const cardContent = (
    <Link to={`/course/${course.id}`} className="course-card-link">
      <div className="course-content">
        {/* Title Section */}
        <div className="course-title-section">
          <div className="title-container">
            <h3 className="modern-title">{course.name}</h3>
          </div>
        </div>

        {/* Bottom Section with Tags */}
        <div className="course-bottom-section">
          <div className="course-tags">
            <span className="course-code-tag">{course.code}</span>
            {course.duration && (
              <span className="course-duration-tag">
                <Clock className="w-3 h-3" />
                {course.duration}
              </span>
            )}
          </div>

          {/* Status Badge */}
          <div className="course-status-wrapper">
            {isEnrolled ? (
              <div className="course-status-badge enrolled">
                <CheckCircle className="w-3 h-3" />
                <span>Enrolled</span>
              </div>
            ) : (
              <div className={`course-status-badge ${course.is_free ? 'free' : 'paid'}`}>
                {course.is_free ? 'FREE' : `₹${course.price || 'PAID'}`}
              </div>
            )}
          </div>

          {/* Made with Love Section */}
          <div className="made-with-love-section">
            <div className="made-with-love-line">
              <Heart className="w-2.5 h-2.5 love-heart-icon" />
              <span className="made-with-love-text">Made with love by</span>
            </div>
            <div className="admin-name-line">
              <span className="admin-name-text">{course.profiles?.name || 'Course Creator'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <>
      <div className="course-card-wrapper">
        <GlassMorphismCard
          width="260px"
          height="330px"
          primaryColor="#3b82f6"
          secondaryColor="#56bdf6"
          className="course-glass-card"
        >
          {/* Animated coin-flip thumbnail - top left */}
          <motion.div
            animate={{
              rotateY: [0, 180, 360],
            }}
            transition={{
              rotateY: {
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="coin-flip-thumbnail"
          >
            <motion.div
              whileHover={{
                scale: 1.1,
                y: -2,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="thumbnail-coin-container"
            >
              <div className="thumbnail-coin">
                <img
                  src={thumbnailUrl}
                  alt={`${course.name} preview`}
                  className="thumbnail-coin-image"
                  loading="lazy"
                />
              </div>
              <div className="thumbnail-coin-glow"></div>
            </motion.div>
          </motion.div>

          {cardContent}
        </GlassMorphismCard>

        <style jsx>{`
          .course-card-wrapper {
            width: 100%;
            max-width: 280px;
            height: 320px;
            margin: 0 auto;
            position: relative;
            box-sizing: border-box;
          }

          @media (max-width: 640px) {
            .course-card-wrapper {
              max-width: 100%;
              height: auto;
              min-height: 280px;
            }
          }

          .course-content {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: space-between;
            padding: 16px;
            position: relative;
            z-index: 2;
            gap: 16px;
            box-sizing: border-box;
            width: 100%;
          }

          @media (max-width: 640px) {
            .course-content {
              padding: 18px;
              gap: 14px;
            }
          }

          .course-title-section {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 120px;
          }

          .course-card-link {
            text-decoration: none;
            color: inherit;
            display: block;
            height: 100%;
          }

          .course-card-link:hover {
            transform: none !important;
          }

          .title-container {
            position: relative;
            width: 100%;
            background: #ffffff;
            border-radius: 16px;
            padding: 32px 20px;
            overflow: hidden;
            opacity: 0.7;
            box-shadow:
              0 8px 24px rgba(0, 0, 0, 0.06),
              0 4px 12px rgba(0, 0, 0, 0.04),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(229, 231, 235, 0.8);
            box-sizing: border-box;
          }

          @media (max-width: 640px) {
            .title-container {
              padding: 20px 10px;
              border-radius: 10px;
              opacity: 0.82;
            }
          }

          .title-container::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
              linear-gradient(45deg, transparent 45%, rgba(255, 255, 255, 0.4) 50%, transparent 55%),
              linear-gradient(-45deg, transparent 45%, rgba(248, 250, 252, 0.3) 50%, transparent 55%);
            background-size: 60px 60px, 40px 40px;
            animation: simpleShine 6s ease-in-out infinite;
            z-index: 1;
          }

          .title-container::after {
            content: '';
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle at 50% 50%, rgba(241, 245, 249, 0.2) 0%, transparent 70%);
            z-index: 2;
          }

          .modern-title {
            font-size: 1.1rem;
            font-weight: 700;
            font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;
            color: #1f2937;
            text-align: center;
            line-height: 1.3;
            margin: 0;
            letter-spacing: 0.01em;
            text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
            position: relative;
            z-index: 3;
            text-transform: uppercase;
            word-break: keep-all;
            white-space: pre-wrap;
            max-width: 100%;
            hyphens: auto;
          }

          @media (max-width: 640px) {
            .modern-title {
              font-size: 1rem;
              line-height: 1.2;
            }
          }

          @keyframes simpleShine {
            0%, 100% {
              opacity: 0.6;
            }
            50% {
              opacity: 0.9;
            }
          }


          .course-bottom-section {
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
            width: 100%;
            box-sizing: border-box;
          }

          @media (max-width: 640px) {
            .course-bottom-section {
              gap: 8px;
            }
          }

          .course-tags {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            flex-wrap: wrap;
            width: 100%;
            box-sizing: border-box;
          }

          .course-code-tag {
            background: linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6);
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            white-space: nowrap;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            flex-shrink: 0;
          }

          .course-duration-tag {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.75rem;
            color: #1e293b;
            background: rgba(59, 130, 246, 0.1);
            padding: 4px 8px;
            border-radius: 10px;
            backdrop-filter: blur(8px);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
            font-weight: 500;
            border: 1px solid rgba(59, 130, 246, 0.2);
          }

          .course-status-badge {
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 0.75rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            align-self: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(8px);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            white-space: nowrap;
            min-width: fit-content;
            flex-shrink: 0;
          }

          @media (max-width: 640px) {
            .course-status-badge {
              padding: 5px 10px;
              font-size: 0.7rem;
            }
          }

          .course-status-badge.enrolled {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
          }

          .course-status-badge.free {
            background: #10b981;
            color: white;
          }

          .made-with-love-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
            margin-top: 8px;
            padding: 4px 10px;
            background: rgba(59, 130, 246, 0.08);
            border-radius: 12px;
            border: 1px solid rgba(59, 130, 246, 0.15);
            backdrop-filter: blur(8px);
            width: fit-content;
            align-self: center;
            box-sizing: border-box;
          }

          .made-with-love-section:hover {
            background: rgba(59, 130, 246, 0.12);
            border-color: rgba(59, 130, 246, 0.2);
          }

          @media (max-width: 640px) {
            .made-with-love-section {
              margin-top: 6px;
              padding: 3px 8px;
            }
          }

          .made-with-love-line {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .love-heart-icon {
            color: #3b82f6;
            animation: gentle-pulse 3s ease-in-out infinite;
          }

          @keyframes gentle-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }

          .made-with-love-text {
            font-size: 0.65rem;
            font-weight: 400;
            color: #3b82f6;
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.01em;
          }

          .admin-name-line {
            text-align: center;
          }

          .admin-name-text {
            font-size: 0.6rem;
            font-weight: 800;
            color: #1e40af;
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.025em;
            white-space: nowrap;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
          }

          /* Coin-flip thumbnail animation */
          .coin-flip-thumbnail {
            position: absolute;
            top: 6px;
            left: 6px;
            z-index: 3;
            pointer-events: none;
          }

          .thumbnail-coin-container {
            position: relative;
          }

          .thumbnail-coin {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            box-shadow:
              0 4px 16px rgba(0, 0, 0, 0.12),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }

          .thumbnail-coin-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }

          .thumbnail-coin-glow {
            position: absolute;
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
            border-radius: 50%;
            background: linear-gradient(135deg,
              rgba(59, 130, 246, 0.4),
              rgba(99, 102, 241, 0.4),
              rgba(139, 92, 246, 0.3),
              rgba(168, 85, 247, 0.4)
            );
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .thumbnail-coin-container:hover .thumbnail-coin-glow {
            opacity: 1;
          }

          /* Enhanced hover effects */
          .thumbnail-coin-container:hover .thumbnail-coin {
            transform: scale(1.05);
            box-shadow:
              0 6px 20px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </div>
    </>
  );
};

export default CourseCard;