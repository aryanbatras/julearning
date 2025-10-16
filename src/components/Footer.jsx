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

      {/* Shimmer gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/5 via-transparent to-pink-500/5 animate-pulse"></div>

      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-8 lg:gap-12 xl:gap-16">
          <div className="space-y-6 lg:col-span-1">
            <Link to="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">JU Learning</span>
                <p className="text-xs text-gray-400">Jammu University</p>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Quality education and innovative learning resources for students.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="group flex items-center gap-3 text-gray-200 hover:text-white transition-all duration-300 text-base py-3 px-4 rounded-xl hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10 hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125"></div>
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-4">Contact</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-4 text-gray-200 hover:text-white transition-all duration-300 py-4 px-4 rounded-xl hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10 group hover:-translate-y-1" style={{background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))', backdropFilter: 'blur(20px)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}}>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-base mb-1">Email Us</p>
                  <span className="font-medium">info@julearning.ac.in</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-200 hover:text-white transition-all duration-300 py-4 px-4 rounded-xl hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10 group hover:-translate-y-1" style={{background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))', backdropFilter: 'blur(20px)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}}>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-base mb-1">Call Us</p>
                  <span className="font-medium">+91 9103054325</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-200 hover:text-white transition-all duration-300 py-4 px-4 rounded-xl hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10 group hover:-translate-y-1" style={{background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))', backdropFilter: 'blur(20px)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}}>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-base mb-1">Visit Us</p>
                  <span className="font-medium">Jammu University, J&K</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-200 text-base font-medium mb-4">
              Join <span className="text-blue-400 font-semibold">{subscriberCount.toLocaleString()}</span> learners in our community.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 hover:bg-white/15"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 text-sm font-medium text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {status === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              {status !== 'idle' && status !== 'submitting' && (
                <div className={`text-sm flex items-center gap-2 ${status === 'success' || status === 'duplicate' ? 'text-green-300' : 'text-red-300'}`}>
                  {status === 'success' || status === 'duplicate' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span className="font-medium">{message}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        </div>

      {/* Enhanced Title Section */}
      <div className="relative py-16 text-center min-h-[35vh] flex flex-col items-center justify-center">
        <div className="max-w-screen-2xl mx-auto px-4 w-full space-y-8">
          <h1
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[10vw] xl:text-[11vw] 2xl:text-[12vw] font-bold text-white tracking-wider leading-none mx-auto"
            style={{
              textShadow: '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(147, 51, 234, 0.6), 0 0 90px rgba(236, 72, 153, 0.4)',
              animation: 'glow 2s ease-in-out infinite alternate',
              maxWidth: '100%',
              textAlign: 'center'
            }}
          >
            JU LEARNING
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white/90 tracking-wide leading-relaxed max-w-5xl mx-auto">
            Empowering Jammu University Students with Quality Education
          </p>
        </div>
      </div>
      </div>

      {/* Back to Top Button */}
      <div className="absolute bottom-6 right-6 z-50">
        <button
          onClick={scrollToTop}
          className="back-to-top-btn"
          style={{
            width: '140px',
            height: '56px',
            overflow: 'hidden',
            border: 'none',
            background: 'none',
            position: 'relative',
            paddingBottom: '2em',
            cursor: 'pointer'
          }}
        >
          <div className="text">
            <span>Back</span>
            <span>to</span>
            <span>top</span>
          </div>
          <div className="clone">
            <span>Back</span>
            <span>to</span>
            <span>top</span>
          </div>
          <svg
            strokeWidth="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
            fill="none"
            className="svg"
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
          >
            <path
              d="M14 5l7 7m0 0l-7 7m7-7H3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      </footer>
    );
  };
export default Footer;