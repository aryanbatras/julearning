import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCoursesAndEnrollments = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('courses').select('*, profiles(name)');

    if (filter === 'free') {
      query = query.eq('is_free', true);
    } else if (filter === 'paid') {
      query = query.eq('is_free', false);
    }

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,code.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
    } else {
      setCourses(data || []);
    }

    if (user) {
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id);
      
      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError);
      } else {
        setEnrolledCourseIds(new Set(enrollmentsData.map(e => e.course_id)));
      }
    }

    setLoading(false);
  }, [filter, user, searchTerm]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCoursesAndEnrollments();
    }, 300); // Debounce search
    return () => clearTimeout(debounceTimer);
  }, [fetchCoursesAndEnrollments]);

  const handleEnroll = async (course) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to enroll.", variant: "destructive" });
      return;
    }

    if (enrolledCourseIds.has(course.id)) {
      toast({ title: "Already Enrolled", description: "You are already enrolled in this course." });
      return;
    }

    if (!course.is_free) {
      toast({ title: "Payment Required", description: "Please proceed to the course page to complete the payment." });
      return;
    }

    const { error } = await supabase
      .from('enrollments')
      .insert({ user_id: user.id, course_id: course.id });

    if (error) {
      console.error("Enrollment Failed:", error);
    } else {
      toast({ title: "Enrollment Successful!", description: `You have enrolled in ${course.name}.` });
      setEnrolledCourseIds(prev => new Set(prev).add(course.id));
    }
  };

  return (
    <>
      <Helmet>
        <title>All Courses - JU Learning Portal</title>
        <meta name="description" content="Browse all available courses at JU Learning Portal" />
      </Helmet>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">All Courses</h1>
            <p className="text-gray-600 text-lg">Explore our complete course catalog</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('free')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'free'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setFilter('paid')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'paid'
                    ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Paid
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div></div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} onEnroll={handleEnroll} isEnrolled={enrolledCourseIds.has(course.id)} showCreatorInfoButton={false} />
                ))}
              </div>
              {courses.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No courses found. Try a different search or filter.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CoursesPage;