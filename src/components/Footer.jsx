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
    { name: 'Blogs', path: '/blogs' },
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
    <>
      <style jsx>{`
        .main {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .up {
          display: flex;
          flex-direction: row;
          gap: 0.5em;
        }

        .down {
          display: flex;
          flex-direction: row;
          gap: 0.5em;
        }

        .card1 {
          width: 90px;
          height: 90px;
          outline: none;
          border: none;
          background: white;
          border-radius: 90px 5px 5px 5px;
          box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
          transition: .2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .instagram {
          margin-top: 1.5em;
          margin-left: 1.2em;
          fill: #cc39a4;
        }

        .card2 {
          width: 90px;
          height: 90px;
          outline: none;
          border: none;
          background: white;
          border-radius: 5px 90px 5px 5px;
          box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
          transition: .2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .twitter {
          margin-top: 1.5em;
          margin-left: -.9em;
          fill: #03A9F4;
        }

        .card3 {
          width: 90px;
          height: 90px;
          outline: none;
          border: none;
          background: white;
          border-radius: 5px 5px 5px 90px;
          box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
          transition: .2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .github {
          margin-top: -.6em;
          margin-left: 1.2em;
        }

        .card4 {
          width: 90px;
          height: 90px;
          outline: none;
          border: none;
          background: white;
          border-radius: 5px 5px 90px 5px;
          box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
          transition: .2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .discord {
          margin-top: -.9em;
          margin-left: -1.2em;
          fill: #8c9eff;
        }

        .card1:hover {
          cursor: pointer;
          scale: 1.1;
          background-color: #cc39a4;
        }

        .card1:hover .instagram {
          fill: white;
        }

        .card2:hover {
          cursor: pointer;
          scale: 1.1;
          background-color: #03A9F4;
        }

        .card2:hover .twitter {
          fill: white;
        }

        .card3:hover {
          cursor: pointer;
          scale: 1.1;
          background-color: #3c4043;
        }

        .card3:hover .github {
          fill: white;
        }

        .card4:hover {
          cursor: pointer;
          scale: 1.1;
          background-color: #8c9eff;
        }

        .card4:hover .discord {
          fill: white;
        }
      `}</style>
      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200/80 py-16">
        {/* JU Learning Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            JU LEARNING
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empowering Jammu University Students with Quality Education
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo and Description */}
            <div className="space-y-6 lg:col-span-1">
              <Link to="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">JU Learning</span>
                  <p className="text-xs text-gray-600">Jammu University</p>
                </div>
              </Link>
              <p className="text-gray-600 text-sm leading-relaxed">
                Quality education and innovative learning resources for students at Jammu University.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <nav className="flex flex-col space-y-3">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="group nav-item"
                  >
                    <button className="nav-button" style={{
                      position: 'relative',
                      padding: '10px 20px',
                      borderRadius: '7px',
                      border: '1px solid transparent',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      letterSpacing: '2px',
                      background: 'transparent',
                      color: 'rgb(61, 106, 255)',
                      overflow: 'hidden',
                      boxShadow: '0 0 0 0 transparent',
                      transition: 'all 0.2s ease-in',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      width: '100%',
                      justifyContent: 'flex-start'
                    }}>
                      <span className="nav-text">{link.name}</span>
                    </button>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-all duration-300 py-2 px-3 rounded-lg hover:bg-blue-50 group">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email Us</p>
                    <span className="font-medium">julearning.com@gmail.com</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-all duration-300 py-2 px-3 rounded-lg hover:bg-blue-50 group">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Call Us</p>
                    <span className="font-medium">+91 9103054325</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-all duration-300 py-2 px-3 rounded-lg hover:bg-blue-50 group">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Visit Us</p>
                    <span className="font-medium">CSE Dept, MBSCET, Jammu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h3>
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      letterSpacing: '1px'
                    }}
                  >
                    {status === 'submitting' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  </button>
                </div>
                {status !== 'idle' && status !== 'submitting' && (
                  <div className={`text-xs flex items-center gap-2 ${status === 'success' || status === 'duplicate' ? 'text-green-600' : 'text-red-600'}`}>
                    {status === 'success' || status === 'duplicate' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span className="font-medium">{message}</span>
                  </div>
                )}
              </form>

              {/* Social Media Links */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-3">Follow Us</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="main">
                    <div className="up">
                      <button className="card1">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="30px" height="30px" fillRule="nonzero" className="instagram">
                          <g fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: 'normal'}}>
                            <g transform="scale(8,8)">
                              <path d="M11.46875,5c-3.55078,0 -6.46875,2.91406 -6.46875,6.46875v9.0625c0,3.55078 2.91406,6.46875 6.46875,6.46875h9.0625c3.55078,0 6.46875,-2.91406 6.46875,-6.46875v-9.0625c0,-3.55078 -2.91406,-6.46875 -6.46875,-6.46875zM11.46875,7h9.0625c2.47266,0 4.46875,1.99609 4.46875,4.46875v9.0625c0,2.47266 -1.99609,4.46875 -4.46875,4.46875h-9.0625c-2.47266,0 -4.46875,-1.99609 -4.46875,-4.46875v-9.0625c0,-2.47266 1.99609,-4.46875 4.46875,-4.46875zM21.90625,9.1875c-0.50391,0 -0.90625,0.40234 -0.90625,0.90625c0,0.50391 0.40234,0.90625 0.90625,0.90625c0.50391,0 0.90625,-0.40234 0.90625,-0.90625c0,-0.50391 -0.40234,-0.90625 -0.90625,-0.90625zM16,10c-3.30078,0 -6,2.69922 -6,6c0,3.30078 2.69922,6 6,6c3.30078,0 6,-2.69922 6,-6c0,-3.30078 -2.69922,-6 -6,-6zM16,12c2.22266,0 4,1.77734 4,4c0,2.22266 -1.77734,4 -4,4c-2.22266,0 -4,-1.77734 -4,-4c0,-2.22266 1.77734,-4 4,-4z"></path>
                            </g>
                          </g>
                        </svg>
                      </button>
                      <button className="card2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30px" height="30px" className="twitter">
                          <path d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="down">
                      <button className="card3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px" className="github">
                          <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                        </svg>
                      </button>
                      <button className="card4">
                        <svg height="30px" width="30px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="discord">
                          <path d="M40,12c0,0-4.585-3.588-10-4l-0.488,0.976C34.408,10.174,36.654,11.891,39,14c-4.045-2.065-8.039-4-15-4s-10.955,1.935-15,4c2.346-2.109,5.018-4.015,9.488-5.024L18,8c-5.681,0.537-10,4-10,4s-5.121,7.425-6,22c5.162,5.953,13,6,13,6l1.639-2.185C13.857,36.848,10.715,35.121,8,32c3.238,2.45,8.125,5,16,5s12.762-2.55,16-5c-2.715,3.121-5.857,4.848-8.639,5.815L33,40c0,0,7.838-0.047,13-6C45.121,19.425,40,12,40,12z M17.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C21,28.209,19.433,30,17.5,30z M30.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C34,28.209,32.433,30,30.5,30z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                © 2025 JU Learning. All rights reserved.
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="absolute bottom-1.5 right-1.5 z-50">
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
            <div className="text" style={{ color: '#2563eb' }}>
              <span>Back</span>
              <span>to</span>
              <span>top</span>
            </div>
            <div className="clone" style={{ color: '#2563eb' }}>
              <span>Back</span>
              <span>to</span>
              <span>top</span>
            </div>
            <svg
              strokeWidth="2"
              stroke="#2563eb"
              viewBox="0 0 24 24"
              fill="none"
              className="svg"
              xmlns="http://www.w3.org/2000/svg"
              width="10px"
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
    </>
  );
};
export default Footer;