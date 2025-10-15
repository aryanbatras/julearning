
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Download, Video, FileText, ShoppingCart, Check } from 'lucide-react';
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
        }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  const finalPrice = course.is_free ? 0 : course.price - (course.price * discount / 100);

  return (
    <>
      <Helmet>
        <title>{course.name} - JU Learning Portal</title>
        <meta name="description" content={`Learn ${course.name} at JU Learning Portal`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {course.code}
                </span>
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${course.is_free ? 'bg-green-500' : 'bg-yellow-500'}`}>
                  {course.is_free ? 'FREE' : 'PAID'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.name}</h1>
              {!course.is_free && (
                <div className="flex items-baseline gap-3">
                  {discount > 0 && (
                    <span className="text-2xl line-through opacity-60">₹{course.price}</span>
                  )}
                  <span className="text-4xl font-bold">₹{finalPrice.toFixed(2)}</span>
                  {discount > 0 && (
                    <span className="px-3 py-1 bg-green-500 rounded-full text-sm">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {course.youtube_url && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4"><Video className="w-6 h-6 text-indigo-600" /><h2 className="text-2xl font-bold text-gray-900">Course Video</h2></div>
                    {isEnrolled ? (
                      <div className="aspect-video rounded-xl overflow-hidden"><iframe src={course.youtube_url} className="w-full h-full" allowFullScreen></iframe></div>
                    ) : (
                      <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center"><p className="text-gray-500">Enroll to watch the video</p></div>
                    )}
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4"><FileText className="w-6 h-6 text-indigo-600" /><h2 className="text-2xl font-bold text-gray-900">Course Materials</h2></div>
                  <div className="space-y-4">
                    {course.notes_pdf && (
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                        <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-blue-600" /><span className="font-medium text-gray-900">Course Notes</span></div>
                        {isEnrolled ? (<Button onClick={() => window.open(course.notes_pdf, '_blank')} className="bg-blue-600 hover:bg-blue-700"><Download className="w-4 h-4 mr-2" />Download</Button>) : (<span className="text-gray-500 text-sm">Enroll to download</span>)}
                      </div>
                    )}
                    {course.pyq_pdf && (
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                        <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-purple-600" /><span className="font-medium text-gray-900">Previous Year Questions</span></div>
                        {isEnrolled ? (<Button onClick={() => window.open(course.pyq_pdf, '_blank')} className="bg-purple-600 hover:bg-purple-700"><Download className="w-4 h-4 mr-2" />Download</Button>) : (<span className="text-gray-500 text-sm">Enroll to download</span>)}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
                  {isEnrolled ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-green-600" /></div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">You're Enrolled!</h3>
                      <p className="text-gray-600 mb-6">Access all course materials</p>
                      <Button onClick={() => navigate('/my-courses')} className="w-full bg-indigo-600 hover:bg-indigo-700">Go to My Courses</Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Enroll Now</h3>
                      {!course.is_free && (
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Have a coupon code?</label>
                          <div className="flex gap-2">
                            <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter code" className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                            <Button onClick={handleApplyCoupon} variant="outline">Apply</Button>
                          </div>
                        </div>
                      )}
                      <Button onClick={handleEnroll} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 text-lg">
                        {course.is_free ? (<><Check className="w-5 h-5 mr-2" />Enroll for Free</>) : (<><ShoppingCart className="w-5 h-5 mr-2" />Buy Now - ₹{finalPrice.toFixed(2)}</>)}
                      </Button>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CourseDetailsPage;
  