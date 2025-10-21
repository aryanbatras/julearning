
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Download, Video, FileText, ShoppingCart, Check, Clock, BookOpen, Users, Star, Award, Zap, Heart, User, Instagram, Linkedin, Link as LinkIcon, School as University } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [creator, setCreator] = useState(null);
  const [courseCount, setCourseCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError) {
        console.error('Error fetching course:', courseError);
        return;
      }
      setCourse(courseData);

      // Fetch creator information
      if (courseData.creator_id) {
        console.log('Course creator_id:', courseData.creator_id);
        const { data: creatorData, error: creatorError } = await supabase
          .from('admin_profiles')
          .select(`
            *,
            profiles ( name )
          `)
          .eq('id', courseData.creator_id)
          .single();

        if (creatorError) {
          console.error("Error fetching creator:", creatorError);
          console.error("Creator ID that failed:", courseData.creator_id);

          // If admin_profiles record doesn't exist, try to use course.profiles data
          if (courseData.profiles) {
            console.log("Using course.profiles as fallback:", courseData.profiles);
            setCreator({
              profiles: courseData.profiles,
              bio: null,
              college: null,
              message_for_juniors: null,
              social_links: {}
            });
          }
        } else {
          console.log("Creator data fetched successfully:", creatorData);
          setCreator(creatorData);
        }

        // Fetch course count for this creator
        const { count, error: courseCountError } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', courseData.creator_id);

        if (courseCountError) {
          console.error("Error fetching course count:", courseCountError);
        } else {
          setCourseCount(count || 0);
        }
      } else if (courseData.profiles) {
        // Fallback to course.profiles if no creator_id
        console.log("No creator_id, using course.profiles:", courseData.profiles);
        setCreator({
          profiles: courseData.profiles,
          bio: null,
          college: null,
          message_for_juniors: null,
          social_links: {}
        });
      }

      if (user) {
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', id)
          .single();

        if (enrollmentError && enrollmentError.code !== 'PGRST116') {
          console.error('Error checking enrollment:', enrollmentError);
        }
        if (enrollmentData) {
          setIsEnrolled(true);
        } else {
          setIsEnrolled(false);
        }
      } else {
        setIsEnrolled(false);
      }
    };

    fetchCourseAndEnrollment();
  }, [id, user]);

  const handleApplyCoupon = async () => {
    const { data, error } = await supabase
      .from('coupons')
      .select('discount, expiry')
      .eq('code', couponCode)
      .single();

    if (error || !data || new Date(data.expiry) < new Date()) {
      toast({
        title: "Invalid Coupon",
        description: "Coupon code is invalid or expired",
        variant: "destructive",
      });
    } else {
      setDiscount(data.discount);
      toast({
        title: "Coupon Applied! 🎉",
        description: `${data.discount}% discount applied`,
      });
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      // Redirect to signup page if user is not logged in
      navigate('/signup', { state: { from: `/course/${id}` } });
      return;
    }

    if (course.is_free) {
      const { error } = await supabase
        .from('enrollments')
        .insert({ user_id: user.id, course_id: course.id });

      if (error) {
        console.error("Enrollment Failed:", error);
      } else {
        setIsEnrolled(true);
        toast({
          title: "Enrolled Successfully! 🎉",
          description: "You can now access all course materials",
        });
      }
    } else {
      toast({
        title: "Payment Required",
        description: "Payment integration is not yet implemented for paid courses.",
      });
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-100 opacity-25"></div>
        </div>
      </div>
    );
  }

  const finalPrice = course.is_free ? 0 : course.price - (course.price * discount / 100);
  const thumbnailUrl = course.thumbnail_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  return (
    <>
      <Helmet>
        <title>{course.name} - JU Learning Portal</title>
        <meta name="description" content={`Learn ${course.name} at JU Learning Portal`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Hero Section with Thumbnail */}
        <div className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Thumbnail Section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative group">
                  {/* Glass morphism container */}
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 delay-100"></div>

                  <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl overflow-hidden">
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                    <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                      <img
                        src={thumbnailUrl}
                        alt={course.name}
                        className={`w-full h-full object-cover transition-all duration-700 ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                        onLoad={() => setIsImageLoaded(true)}
                      />
                      {!isImageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 animate-pulse"></div>
                      )}
                    </div>

                    {/* Floating badges - repositioned within card */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-xl border ${course.is_free ? 'bg-green-500/90 text-white border-green-400' : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300'}`}>
                        {course.is_free ? 'FREE' : `₹${course.price}`}
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <div className="px-4 py-2 bg-white/90 backdrop-blur-xl rounded-full text-sm font-bold shadow-lg border border-white/50 text-gray-700">
                        {course.code}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Content Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Animated Title */}
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                  >
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                      {course.name}
                    </span>
                  </motion.h1>

                  {/* Animated subtitle */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-4 text-lg text-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      <span>Course Materials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-purple-600" />
                      <span>Video Lectures</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-pink-600" />
                      <span>Interactive Learning</span>
                    </div>
                  </motion.div>
                </div>

                {/* Price Section */}
                {!course.is_free && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-4"
                  >
                    <div className="flex items-baseline gap-4">
                      {discount > 0 && (
                        <span className="text-3xl text-gray-400 line-through">₹{course.price}</span>
                      )}
                      <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ₹{finalPrice.toFixed(2)}
                      </span>
                      {discount > 0 && (
                        <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold animate-pulse">
                          {discount}% OFF
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Course Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="text-center p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                    <div className="text-2xl font-bold text-gray-800">24/7</div>
                    <div className="text-sm text-gray-600">Access</div>
                  </div>
                  <div className="text-center p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
                    <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-gray-800">Premium</div>
                    <div className="text-sm text-gray-600">Quality</div>
                  </div>
                  <div className="text-center p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                    <div className="text-2xl font-bold text-gray-800">Expert</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </motion.div>

                {/* Enrollment Section in Hero */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="space-y-6"
                >
                  {/* Coupon Section */}
                  {!course.is_free && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl"></div>
                      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
                        <h4 className="font-bold text-gray-800 mb-4">Have a coupon code?</h4>
                        <div className="flex gap-4">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                            className="flex-1 px-6 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          />
                          <Button
                            onClick={handleApplyCoupon}
                            variant="outline"
                            className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enroll Button */}
                  <div className="text-center">
                    {isEnrolled ? (
                      <div className="space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                          <Check className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">Already Enrolled!</h3>
                        <p className="text-gray-600">You have access to all course materials</p>
                        <Button
                          onClick={() => navigate('/my-courses')}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                          Go to My Courses
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={handleEnroll}
                          className={`w-full py-6 text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 text-white ${course.is_free ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700'}`}
                        >
                          <div className="flex items-center justify-center gap-4">
                            {course.is_free ? (
                              <>
                                <Zap className="w-6 h-6" />
                                <span>Enroll for Free</span>
                                <Check className="w-6 h-6" />
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-6 h-6" />
                                <span>Buy Now - ₹{finalPrice.toFixed(2)}</span>
                              </>
                            )}
                          </div>
                        </Button>

                        {!user && (
                          <p className="text-sm text-gray-500 mt-4">
                            Join now to access premium courses
                          </p>
                        )}
                        {user && (
                          <p className="text-sm text-gray-500 mt-4">
                            {course.is_free ? 'Start learning immediately' : 'Secure payment processing'}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Course Materials Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Course Materials
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access all the resources you need to master this course
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Video Section */}
            {course.youtube_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">Course Video</h3>
                        <p className="text-gray-600">Watch the complete lecture series</p>
                      </div>
                    </div>

                    {isEnrolled ? (
                      <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900">
                        <iframe
                          src={course.youtube_url.includes('youtube.com/watch?v=')
                            ? course.youtube_url.replace('youtube.com/watch?v=', 'youtube.com/embed/').replace('&feature=share', '').split('&')[0] + '?autoplay=0&rel=0&modestbranding=1'
                            : course.youtube_url.includes('youtu.be/')
                            ? course.youtube_url.replace('youtu.be/', 'youtube.com/embed/') + '?autoplay=0&rel=0&modestbranding=1'
                            : course.youtube_url + '?autoplay=0&rel=0&modestbranding=1'
                          }
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`${course.name} - Course Video`}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Video className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-xl font-bold text-gray-700 mb-2">Premium Content</p>
                          <p className="text-gray-600">Enroll to watch the complete video</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Materials Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              {/* Notes PDF */}
              {course.notes_pdf && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">Course Notes</h4>
                          <p className="text-sm text-gray-600">PDF Document</p>
                        </div>
                      </div>
                      {isEnrolled ? (
                        <Button
                          onClick={() => window.open(course.notes_pdf, '_blank')}
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Download className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PYQ PDF */}
              {course.pyq_pdf && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">Previous Year Questions</h4>
                          <p className="text-sm text-gray-600">PDF Document</p>
                        </div>
                      </div>
                      {isEnrolled ? (
                        <Button
                          onClick={() => window.open(course.pyq_pdf, '_blank')}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Download className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

        </div>

        {/* Creator Information Section */}
        {(creator || course.profiles) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Meet Your Course Creator
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Learn from a senior who created this course to help juniors excel in their exams
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/30 shadow-2xl">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Creator Image */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-white/50 shadow-xl">
                          {creator?.profile_image_url ? (
                            <img
                              src={creator.profile_image_url}
                              alt={creator.profiles?.name || course.profiles?.name || 'Creator'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-200">
                              <User className="w-16 h-16 text-indigo-600" />
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Creator Info */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="mb-6">
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                          {creator?.profiles?.name || course.profiles?.name || 'Course Creator'}
                        </h3>
                        {creator?.college && (
                          <div className="flex items-center justify-center md:justify-start gap-2 text-lg text-gray-600 mb-2">
                            <University className="w-5 h-5 text-indigo-600" />
                            <span>{creator.college}</span>
                          </div>
                        )}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full">
                          <Award className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {courseCount || 1} Course{(courseCount || 1) !== 1 ? 's' : ''} Created
                          </span>
                        </div>
                      </div>

                      {creator?.bio && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">About</h4>
                          <p className="text-gray-600 leading-relaxed">{creator.bio}</p>
                        </div>
                      )}

                      {creator?.message_for_juniors && (
                        <div className="mb-6">
                          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-400 p-4 rounded-r-lg">
                            <p className="text-pink-700 italic">"{creator.message_for_juniors}"</p>
                          </div>
                        </div>
                      )}

                      {/* Social Links */}
                      {(creator?.social_links?.instagram || creator?.social_links?.linkedin || creator?.social_links?.other) && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-3">Connect</h4>
                          <div className="flex justify-center md:justify-start gap-4">
                            {creator.social_links?.instagram && (
                              <a
                                href={creator.social_links.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                              >
                                <Instagram className="w-5 h-5" />
                              </a>
                            )}
                            {creator.social_links?.linkedin && (
                              <a
                                href={creator.social_links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                              >
                                <Linkedin className="w-5 h-5" />
                              </a>
                            )}
                            {creator.social_links?.other && (
                              <a
                                href={creator.social_links.other}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                              >
                                <LinkIcon className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseDetailsPage;