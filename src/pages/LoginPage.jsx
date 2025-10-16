import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Lock, GraduationCap, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { signIn, user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const getLabelClass = (value, isFocused) => {
    const hasContent = value && value.trim().length > 0;
    if (hasContent || isFocused) {
      return 'top-[-25px] left-0 text-blue-600 text-base font-semibold';
    }
    return 'top-4 left-4 text-gray-500 text-xl';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { profile: newProfile, error } = await signIn(email, password);
    if (error) {
      return;
    }
    if (newProfile) {
      navigate(newProfile.role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  useEffect(() => {
    if (user && profile) {
      navigate(profile.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, profile, navigate]);

  return (
    <>
      <Helmet>
        <title>Login - JU Learning Portal</title>
        <meta name="description" content="Login to access your JU Learning Portal account" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          {/* Additional shining elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-white/10 to-purple-300/20 rounded-full blur-xl animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-white/10 rounded-full blur-xl animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="login-box bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-2xl rounded-3xl p-12 max-w-md lg:max-w-lg xl:max-w-xl w-full">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <motion.h1
                className="text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 tracking-tight"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
              >
                JU LEARNING PORTAL
              </motion.h1>
              <motion.p
                className="text-gray-700 text-xl font-medium uppercase tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                WELCOME BACK! PLEASE SIGN IN TO CONTINUE
              </motion.p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="user-box relative"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                  className="w-full px-4 py-4 bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 text-xl outline-none focus:border-blue-500 transition-all duration-300"
                  placeholder=" "
                />
                <label className={`absolute left-4 top-4 text-gray-500 text-xl pointer-events-none transition-all duration-300 ${getLabelClass(email, emailFocused)}`}>
                  <Mail className="inline w-5 h-5 mr-3" />
                  EMAIL ADDRESS
                </label>
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: email ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="user-box relative"
              >
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                  className="w-full px-4 py-4 bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 text-xl outline-none focus:border-blue-500 transition-all duration-300"
                  placeholder=" "
                />
                <label className={`absolute left-4 top-4 text-gray-500 text-xl pointer-events-none transition-all duration-300 ${getLabelClass(password, passwordFocused)}`}>
                  <Lock className="inline w-5 h-5 mr-3" />
                  PASSWORD
                </label>
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: password ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-10"
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative inline-block px-10 py-4 text-white font-bold text-xl uppercase tracking-wider overflow-hidden transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? 'SIGNING IN...' : <><LogIn className="w-6 h-6" /> SIGN IN</>}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300"
                    whileHover={{ opacity: 1 }}
                  />
                </motion.button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600 text-base">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-purple-600 transition-colors font-semibold">
                  CREATE ACCOUNT
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;