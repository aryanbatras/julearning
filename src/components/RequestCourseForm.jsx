import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const RequestCourseForm = () => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({ courseName: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, success, error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.courseName) {
      setStatus('error');
      return;
    }
    setStatus('idle');

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
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-lg border">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Request a New Course</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Course Name</label>
          <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" placeholder="e.g., Advanced JavaScript" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Optional Message</label>
          <textarea name="message" rows="3" value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" placeholder="Any specific details?"></textarea>
        </div>
        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-2">
          <Send className="w-4 h-4" />
          Submit Request
        </Button>
        {status === 'success' && <div className="text-blue-700 bg-blue-100 p-3 rounded-lg text-sm flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Your email client will open to send the request.</div>}
        {status === 'error' && <div className="text-red-700 bg-red-100 p-3 rounded-lg text-sm flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Please enter the course name.</div>}
      </form>
    </motion.div>
  );
};

export default RequestCourseForm;