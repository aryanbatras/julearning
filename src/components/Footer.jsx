import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, GraduationCap, Send, Loader2, CheckCircle, AlertTriangle, Instagram, Twitter, Linkedin, Facebook, Youtube, ArrowUp } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error, duplicate
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const links = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/julearning' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/julearning' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/company/julearning' },
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/julearning' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@julearning' },
  ];

  useEffect(() => {
    // Animate footer on scroll
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const footerElement = document.querySelector('footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => {
      if (footerElement) {
        observer.unobserve(footerElement);
      }
    };
  }, []);

  useEffect(() => {
    // Fetch subscriber count for dynamic display
    const fetchSubscriberCount = async () => {
      const { count } = await supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact', head: true });
      setSubscriberCount(count || 0);
    };
    fetchSubscriberCount();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');
    setMessage('');

    const { error } = await supabase.from('newsletter_subscriptions').insert({ email });

    if (error) {
      if (error.code === '23505') { // unique constraint violation
        setStatus('duplicate');
        setMessage('You are already subscribed!');
      } else {
        setStatus('error');
        setMessage('Subscription failed. Please try again.');
      }
    } else {
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
      setSubscriberCount(prev => prev + 1);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6 lg:col-span-1">
            <Link to="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">JU Learning</span>
                <p className="text-xs text-gray-300">Jammu University</p>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering Jammu University students with quality education, innovative learning resources, and a community-driven platform for academic excellence.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-3">
              {links.map((link, index) => (
                <li key={link.name} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in-up">
                  <Link 
                    to={link.path} 
                    className="group flex items-center gap-3 text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Contact Us</h3>
            <div className="space-y-4 text-sm">
              <div className="group flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <span className="text-gray-300">info@julearning.ac.in</span>
                </div>
              </div>
              <div className="group flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <p className="text-white font-medium">Phone</p>
                  <span className="text-gray-300">+91 9103054325</span>
                </div>
              </div>
              <div className="group flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <p className="text-white font-medium">Address</p>
                  <span className="text-gray-300">Jammu University, J&K, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Stay Connected</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Join our community of {subscriberCount.toLocaleString()} learners and stay updated with the latest courses and educational content.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm" 
                  required
                />
                <Button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              {status !== 'idle' && status !== 'submitting' && (
                <div className={`text-sm flex items-center gap-2 p-3 rounded-lg ${status === 'success' || status === 'duplicate' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                  {status === 'success' || status === 'duplicate' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} JU Learning Portal. All rights reserved. | Empowering Education, Enriching Lives.
          </p>
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
            <span className="text-sm">Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;