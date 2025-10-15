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
          <meta name="description" content="Educational portal for Jammu University students with courses, notes, and learning resources" />
        </Helmet>

        {/* Public Hero Section */}
        <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50"></div>

          <div className="relative z-10 text-center max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8 shadow-lg">
                <span className="text-sm font-semibold text-white">🏆 Jammu University's Premier Learning Platform</span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-6 tracking-tight leading-none">
                JU <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">LEARNING</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
                Empowering Jammu University students with world-class education, skill development, and career growth opportunities through our comprehensive learning ecosystem
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="text-4xl font-black text-blue-600 mb-3">500+</div>
                  <div className="text-lg font-semibold text-gray-800 mb-2">Courses Available</div>
                  <div className="text-gray-600">Comprehensive curriculum across all disciplines</div>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="text-4xl font-black text-purple-600 mb-3">10K+</div>
                  <div className="text-lg font-semibold text-gray-800 mb-2">Students Enrolled</div>
                  <div className="text-gray-600">Active learners building their future</div>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="text-4xl font-black text-indigo-600 mb-3">95%</div>
                  <div className="text-lg font-semibold text-gray-800 mb-2">Success Rate</div>
                  <div className="text-gray-600">Proven track record of student achievement</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => window.location.href = '/courses'}
                >
                  Explore Courses →
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-3 border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-5 text-xl font-bold rounded-full transition-all duration-300"
                  onClick={() => window.location.href = '/about'}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Public Content Sections */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Public Learning Resources */}
          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 text-center">Explore Learning Resources</h2>
            <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">Everything you need to succeed in your academic journey</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Academic Courses</h3>
                <p className="text-gray-600 mb-6">Comprehensive curriculum designed by expert faculty</p>
                <Link to="/courses" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Explore Courses →
                </Link>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Certifications</h3>
                <p className="text-gray-600 mb-6">Industry-recognized certificates to boost your resume</p>
                <Link to="/certifications" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                  Get Certified →
                </Link>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Study Groups</h3>
                <p className="text-gray-600 mb-6">Collaborate with peers and learn together</p>
                <Link to="/study-groups" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Join Groups →
                </Link>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Ready to Start Your Learning Journey?</h2>
            <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">Join thousands of Jammu University students who are already learning with us. Sign up now and get started!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold rounded-full shadow-xl"
                onClick={() => window.location.href = '/signup'}
              >
                Get Started Free →
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-bold rounded-full"
                onClick={() => window.location.href = '/courses'}
              >
                Browse Courses
              </Button>
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
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">Your personalized learning dashboard is ready. Let's make today productive!</p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, topics, or resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 text-lg border-0 rounded-2xl bg-white shadow-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all duration-300"
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
            <StatCard
              icon={BookOpen}
              value={enrolledCourses.size}
              label="Enrolled Courses"
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Award}
              value="12"
              label="Certificates Earned"
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <StatCard
              icon={Clock}
              value="24h"
              label="Learning Streak"
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              icon={BarChart2}
              value="85%"
              label="Course Completion"
              color="bg-gradient-to-br from-amber-500 to-orange-500"
            />
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
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Academic Courses</h3>
              <p className="text-gray-600 mb-6">Comprehensive curriculum designed by expert faculty</p>
              <Link to="/courses" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Explore Courses →
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Certifications</h3>
              <p className="text-gray-600 mb-6">Industry-recognized certificates to boost your resume</p>
              <Link to="/certifications" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                Get Certified →
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Study Groups</h3>
              <p className="text-gray-600 mb-6">Collaborate with peers and learn together</p>
              <Link to="/study-groups" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                Join Groups →
              </Link>
            </div>
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