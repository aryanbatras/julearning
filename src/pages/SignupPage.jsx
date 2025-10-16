// SignupPage.jsx
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Lock, User, GraduationCap, Shield, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [nameFocused, setNameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [adminCodeFocused, setAdminCodeFocused] = useState(false);

    const getLabelClass = (value, isFocused) => {
        const hasContent = value && value.trim().length > 0;
        if (hasContent || isFocused) {
            return 'top-[-25px] left-0 text-purple-600 text-base font-semibold';
        }
        return 'top-4 left-4 text-gray-500 text-xl';
    };
    const [role, setRole] = useState('student');
    const [adminCode, setAdminCode] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [step, setStep] = useState(1);
    const { signUp, loading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const fileInputRef = useRef(null);

    const handleAdminDetailsChange = (e) => {
        const { name, value } = e.target;
        setAdminDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setAdminDetails(prev => ({
            ...prev,
            social_links: { ...prev.social_links, [name]: value },
        }));
    };

    const handleImageUpload = async (userId) => {
        if (!imageFile) return null;
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `profile-${userId}-${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from('admin_profiles').upload(fileName, imageFile);
        if (error) {
            console.error("Image upload failed:", error);
            return null;
        }
        const { data } = supabase.storage.from('admin_profiles').getPublicUrl(fileName);
        return data?.publicUrl ?? null;
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        if (role === 'admin' && adminCode !== 'MBSCET') {
            toast({ title: "Invalid Admin Code", variant: "destructive" });
            return;
        }
        if (role === 'admin') {
            setStep(2);
        } else {
            await handleSubmit();
        }
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const { user, error } = await signUp(email.trim(), password.trim(), name.trim(), role);

        if (error) {
            toast({ title: "Signup failed", description: error.message || 'Please try again', variant: 'destructive' });
            return;
        }

        if (user && role === 'admin') {
            const imageUrl = await handleImageUpload(user.id);
            const profileData = {
                id: user.id,
                ...adminDetails,
                profile_image_url: imageUrl,
            };
            const { error: adminProfileError } = await supabase.from('admin_profiles').insert(profileData);
            if (adminProfileError) {
                console.error("Failed to save admin details:", adminProfileError);
                // non-blocking: still navigate, but inform devs
            }
        }

        if (user) {
            navigate(role === 'admin' ? '/admin' : '/dashboard');
        }
    };

  return (
    <>
      <Helmet><title>Sign Up - JU Learning Portal</title></Helmet>
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
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative">
          <div className="login-box bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-2xl rounded-3xl p-12 max-w-md lg:max-w-lg xl:max-w-xl w-full">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-6 shadow-lg">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <motion.h1
                className="text-5xl font-black bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-4 tracking-tight"
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
                {step === 1 ? 'CREATE YOUR ACCOUNT' : 'TELL US MORE ABOUT YOURSELF'}
              </motion.p>
            </motion.div>

            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-8">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="user-box relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    className="w-full px-4 py-4 bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 text-xl outline-none focus:border-purple-500 transition-all duration-300"
                    placeholder=" "
                    required
                  />
                  <label className={`absolute left-4 top-4 text-gray-500 text-xl pointer-events-none transition-all duration-300 ${getLabelClass(name, nameFocused)}`}>
                    <User className="inline w-5 h-5 mr-3" />
                    FULL NAME
                  </label>
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: name ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>

                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="user-box relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    className="w-full px-4 py-4 bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 text-xl outline-none focus:border-purple-500 transition-all duration-300"
                    placeholder=" "
                    required
                  />
                  <label className={`absolute left-4 top-4 text-gray-500 text-xl pointer-events-none transition-all duration-300 ${getLabelClass(email, emailFocused)}`}>
                    <Mail className="inline w-5 h-5 mr-3" />
                    EMAIL ADDRESS
                  </label>
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: email ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>

                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="user-box relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="w-full px-4 py-4 bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 text-xl outline-none focus:border-purple-500 transition-all duration-300"
                    placeholder=" "
                    required
                  />
                  <label className={`absolute left-4 top-4 text-gray-500 text-xl pointer-events-none transition-all duration-300 ${getLabelClass(password, passwordFocused)}`}>
                    <Lock className="inline w-5 h-5 mr-3" />
                    PASSWORD
                  </label>
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: password ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>

                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.45 }} className="user-box relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-4 bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 text-xl outline-none focus:border-purple-500 transition-all duration-300 peer appearance-none cursor-pointer"
                    required
                  >
                    <option value="student">STUDENT</option>
                    <option value="admin">ADMIN</option>
                  </select>
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: role !== 'student' ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>

                {role === 'admin' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="user-box relative">
                    <input
                      type="password"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      onFocus={() => setAdminCodeFocused(true)}
                      onBlur={() => setAdminCodeFocused(false)}
                      className="w-full px-4 py-4 bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 text-xl outline-none focus:border-purple-500 transition-all duration-300"
                      placeholder=" "
                      required
                    />
                    <label className={`absolute left-4 top-4 text-gray-500 text-xl pointer-events-none transition-all duration-300 ${getLabelClass(adminCode, adminCodeFocused)}`}>
                      <Shield className="inline w-5 h-5 mr-3" />
                      ADMIN SECRET CODE
                    </label>
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: adminCode ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                )}

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-10">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative inline-block px-10 py-4 text-white font-bold text-xl uppercase tracking-wider overflow-hidden transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? 'PROCESSING...' : <>{role === 'admin' ? 'NEXT STEP' : 'SIGN UP'}</>}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-500 opacity-0 transition-opacity duration-300"
                      whileHover={{ opacity: 1 }}
                    />
                  </motion.button>
                </motion.div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 uppercase tracking-wide">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <input type="file" ref={fileInputRef} onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" className="hidden" />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current.click()} className="gap-3 text-gray-700 border-2 border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold">
                      <Upload className="w-5 h-5" /> UPLOAD IMAGE
                    </Button>
                    {imageFile && <span className="text-sm text-gray-600 font-medium">{imageFile.name}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 uppercase tracking-wide">College/Department</label>
                  <input
                    type="text"
                    name="college"
                    value={adminDetails.college}
                    onChange={handleAdminDetailsChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 font-medium focus:border-purple-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 uppercase tracking-wide">Short Bio</label>
                  <textarea
                    name="bio"
                    value={adminDetails.bio}
                    onChange={handleAdminDetailsChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 font-medium focus:border-purple-500 focus:bg-white transition-all"
                    rows="3"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 uppercase tracking-wide">Message for Juniors</label>
                  <textarea
                    name="message_for_juniors"
                    value={adminDetails.message_for_juniors}
                    onChange={handleAdminDetailsChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 font-medium focus:border-purple-500 focus:bg-white transition-all"
                    rows="3"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 uppercase tracking-wide">Instagram URL</label>
                  <input
                    type="url"
                    name="instagram"
                    value={adminDetails.social_links.instagram}
                    onChange={handleSocialChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 font-medium focus:border-purple-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 uppercase tracking-wide">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={adminDetails.social_links.linkedin}
                    onChange={handleSocialChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 font-medium focus:border-purple-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full py-3 text-gray-700 border-2 border-gray-300 hover:bg-gray-50 font-semibold rounded-xl"
                  >
                    BACK
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-red-500 text-white font-bold rounded-xl shadow-lg"
                  >
                    {loading ? 'CREATING...' : 'COMPLETE'}
                  </Button>
                </div>
              </form>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 text-center">
              <p className="text-gray-600 text-base">Already have an account? <Link to="/login" className="text-purple-600 hover:text-pink-600 transition-colors font-semibold">SIGN IN</Link></p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;
