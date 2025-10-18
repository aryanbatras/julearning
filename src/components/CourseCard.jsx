import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, IndianRupee, CheckCircle, Download, Video, ArrowRight, Sparkles, Heart, Clock, BarChart2, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreatorInfoModal from '@/components/CreatorInfoModal';
import GlassMorphismCard from '@/components/GlassMorphismCard';

const CourseCard = ({ course, index, onEnroll, isEnrolled, showCreatorInfoButton = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stopPropagation = (e) => e.stopPropagation();

  const handleCreatorClick = (e) => {
    stopPropagation(e);
    setIsModalOpen(true);
  };

  const cardContent = (
    <div className="course-content">
      {/* Title Section */}
      <div className="course-title-section">
        <Link to={`/course/${course.id}`} className="block">
          <p className="modern-title">{course.name}</p>
        </Link>
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
    </div>
  );

  return (
    <>
      <CreatorInfoModal course={course} isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      <div className="course-card-wrapper">
        <GlassMorphismCard
          width="280px"
          height="320px"
          primaryColor="#f59e0b"
          secondaryColor="#ef4444"
          className="course-glass-card"
        >
          {cardContent}
        </GlassMorphismCard>

        <style jsx>{`
          .course-card-wrapper {
            width: 280px;
            height: 320px;
            margin: 0 auto;
          }

          .course-content {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: space-between;
            padding: 8px;
          }

          .course-title-section {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modern-title {
            font-size: 1.6rem;
            font-weight: 800;
            color: transparent;
            -webkit-background-clip: text;
            background-image: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
            text-align: center;
            line-height: 1.2;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-size: 200% 200%;
            animation: gradient-shift 8s ease-in-out infinite;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            filter: drop-shadow(0 1px 2px rgba(255, 255, 255, 0.3));
          }

          @keyframes gradient-shift {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          .course-bottom-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .course-tags {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          .course-code-tag {
            background: linear-gradient(135deg, #f59e0b, #ef4444);
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .course-duration-tag {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.75rem;
            color: #374151;
            background: rgba(255, 255, 255, 0.9);
            padding: 4px 8px;
            border-radius: 10px;
            backdrop-filter: blur(8px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            font-weight: 500;
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
          }

          .course-status-badge.enrolled {
            background: #10b981;
            color: white;
          }

          .course-status-badge.free {
            background: #10b981;
            color: white;
          }

          .course-status-badge.paid {
            background: #f59e0b;
            color: white;
          }
        `}</style>
      </div>
    </>
  );
};

export default CourseCard;