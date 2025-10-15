import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, success, error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }
    setStatus('idle');

    const to = 'gurmanthansinghtrd@gmail.com';
    const subject = `Contact Form Submission from ${formData.name}`;
    const body = `
      Name: ${formData.name}
      Email: ${formData.email}
      
      Message:
      ${formData.message}
    `;

    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-lg border">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea name="message" rows="4" value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" required></textarea>
        </div>
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2">
          <Send className="w-4 h-4" />
          Send Message
        </Button>
        {status === 'success' && <div className="text-blue-700 bg-blue-100 p-3 rounded-lg text-sm flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Your email client will open with a prefilled email.</div>}
        {status === 'error' && <div className="text-red-700 bg-red-100 p-3 rounded-lg text-sm flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Please fill out all fields.</div>}
      </form>
    </motion.div>
  );
};

export default ContactForm;