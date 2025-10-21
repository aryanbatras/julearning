import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MyCoursesPage = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEnrolledCourses = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('enrollments')
        .select('courses(*, profiles(name))')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching enrolled courses:', error);
      } else {
        setEnrolledCourses(data.map(e => e.courses).filter(Boolean));
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  const handleEnroll = (course) => {
    toast({ title: "Already Enrolled", description: `You are already enrolled in ${course.name}.` });
  };

  return (
    <>
      <Helmet>
        <title>My Courses - JU Learning Portal</title>
        <meta name="description" content="Access your enrolled courses" />
      </Helmet>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">My Courses</h1>
                <p className="text-gray-600">Continue your learning journey</p>
              </div>
            </div>
          </motion.div>

          {loading ? (
             <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
             </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrolledCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} isEnrolled={true} onEnroll={handleEnroll} showCreatorInfoButton={true} />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-xl shadow-sm border"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Your course list is empty</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Start your learning journey by enrolling in courses from the dashboard.</p>
              <div className="flex justify-center">
                <div className="relative">
                  {/* Animated background shapes for the button */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute ${i % 2 === 0 ? 'w-6 h-6' : 'w-8 h-8'} ${
                          i % 2 === 0 ? 'bg-gradient-to-br from-blue-400/25 to-purple-400/25' :
                          'bg-gradient-to-br from-purple-400/25 to-indigo-400/25'
                        } ${i % 2 === 0 ? 'rotate-45' : 'rounded-full'} backdrop-blur-sm`}
                        style={{
                          left: `${15 + i * 20}%`,
                          top: `${25 + (i % 2) * 30}%`,
                          zIndex: 0,
                        }}
                        animate={{
                          y: [0, -6, 0],
                          x: [0, 4, 0],
                          rotate: i % 2 === 0 ? [45, 135, 45] : [0, 180, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 6 + i * 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative z-10"
                  >
                    <Link to="/courses">
                      <Button
                        className="relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #8b5cf6 100%)',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          padding: '0.75rem 2rem',
                          boxShadow: '0 6px 24px rgba(59, 130, 246, 0.3)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Explore Courses
                        </span>
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyCoursesPage;