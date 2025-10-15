import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const RequestCourseForm = () => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({ courseName: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error status when user starts typing
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseName.trim()) {
      setStatus('error');
      return;
    }

    setIsSubmitting(true);
    setStatus('loading');

    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      const to = 'gurmanthansinghtrd@gmail.com';
      const subject = `New Course Request from ${profile?.name || 'a student'}`;
      const body = `
        Student Name: ${profile?.name || 'N/A'}
        Student Email: ${user?.email || 'N/A'}

        Requested Course Name:
        ${formData.courseName}

        Optional Message:
        ${formData.message}
      `;

      const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;

      setStatus('success');
      setFormData({ courseName: '', message: '' });
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xl font-bold text-gray-900 mb-4"
      >
        Request a New Course
      </motion.h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label className="block text-sm font-medium mb-2 text-gray-700">Course Name</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 focus:ring-2 focus:ring-teal-500/50 focus:outline-none ${
              status === 'error' ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-teal-500'
            }`}
            placeholder="e.g., Advanced JavaScript"
            disabled={isSubmitting}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <label className="block text-sm font-medium mb-2 text-gray-700">Optional Message</label>
          <textarea
            name="message"
            rows="3"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-teal-500/50 focus:outline-none focus:border-teal-500 resize-none"
            placeholder="Any specific details or requirements?"
            disabled={isSubmitting}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 flex items-center justify-center gap-2 py-3 text-lg font-semibold transition-all duration-300 ${
              isSubmitting ? 'cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Request</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>

        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="text-green-700 bg-green-50 p-4 rounded-xl text-sm flex items-center gap-2 border border-green-200"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Your email client will open to send the request. Thank you for your suggestion!</span>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="text-red-700 bg-red-50 p-4 rounded-xl text-sm flex items-center gap-2 border border-red-200"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>Please enter the course name to continue.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default RequestCourseForm;