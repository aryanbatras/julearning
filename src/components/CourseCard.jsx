import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, IndianRupee, CheckCircle, Download, Video, ArrowRight, Sparkles, Heart, Clock, BarChart2, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreatorInfoModal from '@/components/CreatorInfoModal';

const CourseCard = ({ course, index, onEnroll, isEnrolled, showCreatorInfoButton = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stopPropagation = (e) => e.stopPropagation();

  const handleCreatorClick = (e) => {
    stopPropagation(e);
    setIsModalOpen(true);
  };

  return (
    <>
      <CreatorInfoModal course={course} isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full"
      >
        <Link to={`/course/${course.id}`} className="block relative group">
          <div className="relative h-48 overflow-hidden">
            {course.thumbnail_url ? (
              <img 
                src={course.thumbnail_url} 
                alt={course.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary/80 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white/80" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <Button 
                variant="outline" 
                className="translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  onEnroll(course);
                }}
              >
                {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
              </Button>
            </div>
            
            {isEnrolled ? (
              <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Enrolled</span>
              </div>
            ) : (
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-white shadow-md ${course.is_free ? 'bg-green-500' : 'bg-amber-500'}`}>
                {course.is_free ? 'FREE' : `₹${course.price || 'PAID'}`}
              </div>
            )}
          </div>
        </Link>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {course.code}
              </span>
              {course.duration && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" /> {course.duration}
                </span>
              )}
            </div>
            
            {showCreatorInfoButton && course.creator_id && (
              <button 
                onClick={handleCreatorClick} 
                className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" /> 
                <span className="hidden sm:inline">Creator</span>
              </button>
            )}
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            <Link to={`/course/${course.id}`} className="hover:underline">{course.name}</Link>
          </h3>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
            {course.description || 'Explore this comprehensive course to enhance your knowledge and skills.'}
          </p>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{Math.floor(Math.random() * 100) + 20} students</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart2 className="w-4 h-4 text-amber-500" />
                <span>{(Math.random() * 2 + 3).toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {course.notes_pdf && (
                <a 
                  href={course.notes_pdf} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={stopPropagation} 
                  className="flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-50 border border-gray-100"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-xs">Notes</span>
                </a>
              )}
              {course.youtube_url && (
                <a 
                  href={course.youtube_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={stopPropagation} 
                  className="flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-50 border border-gray-100"
                >
                  <Video className="w-4 h-4" />
                  <span className="text-xs">Videos</span>
                </a>
              )}
            </div>
          </div>

          <div className="mt-4" onClick={stopPropagation}>
            <Button
              onClick={() => onEnroll(course)}
              disabled={isEnrolled}
              className="w-full"
              variant={isEnrolled ? "secondary" : "default"}
            >
              {isEnrolled ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Enrolled
                </>
              ) : (
                'Enroll Now'
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CourseCard;