import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertTriangle, Loader2, Mail, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const RequestCourseForm = () => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    senderEmail: user?.email || '',
    subject: '',
    description: ''
  });
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

    // Validate required fields
    if (!formData.senderEmail.trim() || !formData.subject.trim() || !formData.description.trim()) {
      setStatus('error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.senderEmail)) {
      setStatus('error');
      return;
    }

    setIsSubmitting(true);
    setStatus('loading');

    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      const to = 'julearning.com@gmail.com';
      const subject = `Course Request: ${formData.subject}`;
      const body = `
Course Request Details:

Sender Information:
- Name: ${profile?.name || user?.user_metadata?.name || 'N/A'}
- Email: ${formData.senderEmail}

Subject: ${formData.subject}

Description:
${formData.description}

---
This request was submitted through the JU Learning Portal.
      `;

      const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;

      setStatus('success');
      setFormData({
        senderEmail: user?.email || '',
        subject: '',
        description: ''
      });
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
      className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl"
    >
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl font-bold text-gray-800 mb-6 text-center"
      >
        Request for Courses
      </motion.h3>

      <p className="text-gray-600 text-center mb-8 text-sm">
        Have a specific course in mind? Send us your request and we'll consider adding it to our platform.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            Your Email Address
          </label>
          <input
            type="email"
            name="senderEmail"
            value={formData.senderEmail}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none focus:border-indigo-500 ${status === 'error' && !formData.senderEmail.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
            placeholder="your.email@example.com"
            disabled={isSubmitting}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-600" />
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 focus:outline-none focus:border-purple-500 ${status === 'error' && !formData.subject.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
            placeholder="Brief description of the course you want"
            disabled={isSubmitting}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-pink-600" />
            Detailed Description
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-pink-500/50 focus:outline-none focus:border-pink-500 resize-none ${status === 'error' && !formData.description.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
            placeholder="Provide detailed information about the course, including topics, level, and why it would be valuable..."
            disabled={isSubmitting}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 flex items-center justify-center gap-2 py-4 text-lg font-semibold transition-all duration-300 ${isSubmitting ? 'cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02]'}`}
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
                  <span>Sending Request...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Send Request</span>
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
              className="text-green-700 bg-green-50/80 backdrop-blur-sm p-4 rounded-xl text-sm flex items-center gap-2 border border-green-200"
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
              className="text-red-700 bg-red-50/80 backdrop-blur-sm p-4 rounded-xl text-sm flex items-center gap-2 border border-red-200"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>Please fill in all required fields and ensure the email format is correct.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default RequestCourseForm;