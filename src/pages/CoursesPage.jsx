import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Filter, Search, X, ChevronDown, BookOpen, Clock, User, Video, FileText } from 'lucide-react';
import CustomSearchBar from '@/components/CustomSearchBar';
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [availableCreators, setAvailableCreators] = useState([]);
  const [advancedFilters, setAdvancedFilters] = useState({
    creator: '',
    hasVideo: false,
    hasMaterials: false,
    priceRange: 'all'
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const hasActiveFilters = advancedFilters.creator || advancedFilters.hasVideo || advancedFilters.hasMaterials || advancedFilters.priceRange !== 'all';

  const fetchCoursesAndEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      // First, get all courses with basic filters
      let query = supabase.from('courses').select('*, profiles(name)');

      // Apply basic filters
      if (filter === 'free') {
        query = query.eq('is_free', true);
      } else if (filter === 'paid') {
        query = query.eq('is_free', false);
      }

      // Price range filtering
      if (advancedFilters.priceRange !== 'all') {
        if (advancedFilters.priceRange === 'under500') {
          query = query.lt('price', 500);
        } else if (advancedFilters.priceRange === '500to1000') {
          query = query.gte('price', 500).lte('price', 1000);
        } else if (advancedFilters.priceRange === 'over1000') {
          query = query.gte('price', 1000);
        }
      }

      // Search term filtering
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,code.ilike.%${searchTerm}%`);
      }

      const { data: allCourses, error: coursesError } = await query.order('created_at', { ascending: false });

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        setCourses([]);
        setLoading(false);
        return;
      }

      // Apply client-side filters
      let filteredCourses = allCourses || [];

      // Content type filters - handle OR logic when both are selected
      if (advancedFilters.hasVideo && advancedFilters.hasMaterials) {
        // If both filters are active, show courses that have EITHER video OR materials
        filteredCourses = filteredCourses.filter(course =>
          course.youtube_url || course.notes_pdf || course.pyq_pdf
        );
      } else {
        // Individual filters
        if (advancedFilters.hasVideo) {
          filteredCourses = filteredCourses.filter(course => course.youtube_url);
        }

        if (advancedFilters.hasMaterials) {
          filteredCourses = filteredCourses.filter(course =>
            course.notes_pdf || course.pyq_pdf
          );
        }
      }

      // Creator filter (client-side since profiles is joined)
      if (advancedFilters.creator) {
        filteredCourses = filteredCourses.filter(course =>
          course.profiles?.name === advancedFilters.creator
        );
      }

      setCourses(filteredCourses);

      // Extract unique creators from filtered results for dropdown
      const allCreators = [...new Set((allCourses || []).map(course => course.profiles?.name).filter(Boolean) || [])];
      setAvailableCreators(allCreators);

      // Fetch enrollments if user is logged in
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
    } catch (error) {
      console.error('Unexpected error:', error);
      setCourses([]);
    }

    setLoading(false);
  }, [filter, user, searchTerm, advancedFilters]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCoursesAndEnrollments();
    }, 300); // Debounce search
    return () => clearTimeout(debounceTimer);
  }, [fetchCoursesAndEnrollments]);

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      creator: '',
      hasVideo: false,
      hasMaterials: false,
      priceRange: 'all'
    });
  };

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

          <div className="space-y-6 mb-8">
            {/* Search and Basic Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:max-w-md">
                <CustomSearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search courses"
                />
              </div>

              {/* Basic Filter Buttons */}
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      filter === 'all'
                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('free')}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      filter === 'free'
                        ? 'bg-green-500 text-white shadow-md shadow-green-500/25'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => setFilter('paid')}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      filter === 'paid'
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    Paid
                  </button>
                </div>

                {/* Advanced Filters Toggle */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 relative ${
                    showAdvancedFilters || hasActiveFilters
                      ? 'bg-secondary text-white shadow-md shadow-secondary/25'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                  Advanced
                  {hasActiveFilters && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-lg"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Creator Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Course Creator
                    </label>
                    <select
                      value={advancedFilters.creator}
                      onChange={(e) => setAdvancedFilters(prev => ({ ...prev, creator: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    >
                      <option value="">All Creators</option>
                      {availableCreators.map(creator => (
                        <option key={creator} value={creator}>{creator}</option>
                      ))}
                    </select>
                  </div>

                  {/* Content Type Filters */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Content Type
                    </label>
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg border">
                      <label className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all touch-manipulation ${
                        advancedFilters.hasVideo ? 'bg-primary/10 border-primary border' : 'hover:bg-gray-100'
                      }`}>
                        <input
                          type="checkbox"
                          checked={advancedFilters.hasVideo}
                          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, hasVideo: e.target.checked }))}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div className="flex items-center gap-2 min-h-[24px]">
                          <Video className={`w-4 h-4 ${advancedFilters.hasVideo ? 'text-primary' : 'text-gray-500'}`} />
                          <span className={`text-sm ${advancedFilters.hasVideo ? 'text-primary font-medium' : 'text-gray-700'}`}>
                            Has Video Content
                          </span>
                        </div>
                      </label>
                      <label className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all touch-manipulation ${
                        advancedFilters.hasMaterials ? 'bg-primary/10 border-primary border' : 'hover:bg-gray-100'
                      }`}>
                        <input
                          type="checkbox"
                          checked={advancedFilters.hasMaterials}
                          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, hasMaterials: e.target.checked }))}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div className="flex items-center gap-2 min-h-[24px]">
                          <FileText className={`w-4 h-4 ${advancedFilters.hasMaterials ? 'text-primary' : 'text-gray-500'}`} />
                          <span className={`text-sm ${advancedFilters.hasMaterials ? 'text-primary font-medium' : 'text-gray-700'}`}>
                            Has PDF Materials
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Price Range
                    </label>
                    <select
                      value={advancedFilters.priceRange}
                      onChange={(e) => setAdvancedFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    >
                      <option value="all">All Prices</option>
                      <option value="under500">Under ₹500</option>
                      <option value="500to1000">₹500 - ₹1000</option>
                      <option value="over1000">Over ₹1000</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearAdvancedFilters}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors touch-manipulation"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                {courses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} onEnroll={handleEnroll} isEnrolled={enrolledCourseIds.has(course.id)} showCreatorInfoButton={false} />
                ))}
              </div>
              {courses.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No courses found. Try adjusting your filters or search terms.</p>
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