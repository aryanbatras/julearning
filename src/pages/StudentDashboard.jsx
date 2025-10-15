import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, Search, Award, Clock, BarChart2, Rocket, Star, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import RequestCourseForm from '@/components/RequestCourseForm';
import { Link } from 'react-router-dom';
import CourseCard from '@/components/CourseCard';

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
  
  // Redirect to login if not authenticated
  if (!user) {
    window.location.href = '/login';
    return null;
  }

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
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/5 to-secondary/5 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Welcome back, <span className="text-primary">{user?.user_metadata?.name?.split(' ')[0] || 'Student'}</span>! 👋
            </h1>
            <p className="text-xl text-gray-600 mb-8">Your personalized learning dashboard is ready. Let's make today productive!</p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, topics, or resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border-0 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all duration-300"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-12 relative z-10">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            icon={BookOpen} 
            value={enrolledCourses.size} 
            label="Enrolled Courses" 
            color="bg-blue-500"
          />
          <StatCard 
            icon={Award} 
            value="12" 
            label="Certificates Earned" 
            color="bg-green-500"
          />
          <StatCard 
            icon={Clock} 
            value="24h" 
            label="Learning Streak" 
            color="bg-purple-500"
          />
          <StatCard 
            icon={BarChart2} 
            value="85%" 
            label="Course Completion" 
            color="bg-amber-500"
          />
        </div>

        {/* Featured Courses Section */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                Continue Learning
              </h2>
              <p className="text-gray-500 mt-1">Pick up where you left off</p>
            </div>
            <Link to="/courses" className="group flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
              <span className="font-medium">Browse all courses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No courses found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or explore our catalog</p>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">Why Choose Our Platform</h2>
          <p className="text-gray-500 mb-8 max-w-2xl">Experience learning like never before with our innovative features</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Rocket}
              title="Fast Learning"
              description="Accelerate your learning with our optimized content and smart study tools."
              color="bg-blue-100 text-blue-600"
            />
            <FeatureCard
              icon={Star}
              title="Expert Instructors"
              description="Learn from industry experts with years of practical experience."
              color="bg-amber-100 text-amber-600"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Career Growth"
              description="Gain skills that employers are looking for in today's job market."
              color="bg-green-100 text-green-600"
            />
          </div>
        </section>

        {/* Request Course Section */}
        <section className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Can't find what you're looking for?</h2>
            <p className="text-gray-600 mb-8">Request a new course and we'll add it to our collection. Your learning journey is our priority!</p>
            <RequestCourseForm />
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;