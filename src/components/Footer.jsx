import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, GraduationCap, Send, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error, duplicate
  const [message, setMessage] = useState('');

  const links = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
  ];

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
    }
  };

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">JU Learning</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Empowering Jammu University students with quality education and resources.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-gray-300">info@julearning.ac.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-gray-300">+91 9103054325</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-gray-300">Jammu University, J&K</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-300 text-sm mb-4">Subscribe to our newsletter for updates.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-l-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                  required
                />
                <Button type="submit" disabled={status === 'submitting'} className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg font-semibold text-sm transition-colors">
                  {status === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              {status !== 'idle' && status !== 'submitting' && (
                <div className={`text-sm mt-2 flex items-center gap-2 ${status === 'success' || status === 'duplicate' ? 'text-green-300' : 'text-red-300'}`}>
                  {status === 'success' || status === 'duplicate' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} JU Learning Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;