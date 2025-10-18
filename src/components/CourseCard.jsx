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
        <p className="modern-title">{course.name}</p>
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
          width="300px"
          height="200px"
          primaryColor="#f59e0b"
          secondaryColor="#ef4444"
          className="course-glass-card"
        >
          {cardContent}
        </GlassMorphismCard>

        <style jsx>{`
          .course-card-wrapper {
            width: 300px;
            height: 200px;
            margin: 0 auto;
          }

          .course-content {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: space-between;
            padding: 20px;
          }

          .course-title-section {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modern-title {
            font-size: 1.4rem;
            font-weight: 800;
            color: transparent;
            -webkit-background-clip: text;
            background-image: linear-gradient(135deg, #1f2937, #6b7280);
            text-align: center;
            line-height: 1.3;
            margin: 0;
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
          }

          .course-duration-tag {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.75rem;
            color: #6b7280;
            background: rgba(255, 255, 255, 0.8);
            padding: 4px 8px;
            border-radius: 10px;
            backdrop-filter: blur(4px);
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