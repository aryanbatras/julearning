import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Lock, User, GraduationCap, Shield, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [adminCode, setAdminCode] = useState('');
  const [adminDetails, setAdminDetails] = useState({
    college: '', bio: '', message_for_juniors: '',
    social_links: { instagram: '', linkedin: '', other: '' }
  });
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
    const fileName = `profile-${userId}-${Date.now()}`;
    const { error } = await supabase.storage.from('admin_profiles').upload(fileName, imageFile);
    if (error) {
      console.error("Image upload failed:", error);
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from('admin_profiles').getPublicUrl(fileName);
    return publicUrl;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (role === 'admin' && adminCode !== 'MBSCET') {
      toast({ title: "Invalid Admin Code", variant: "destructive" });
      return;
    }
    if (role === 'admin') {
      setStep(2);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const { user, error } = await signUp(email.trim(), password.trim(), name.trim(), role);

    if (error) {
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
      }
    }

    if (user) {
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  return (
    <>
      <Helmet><title>Sign Up - JU Learning Portal</title></Helmet>
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200/80">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-secondary">
                {step === 1 ? 'Create Your Account' : 'Admin Profile Setup'}
              </h1>
              <p className="text-gray-600 mt-2">{step === 1 ? 'Get started with JU Learning' : 'Tell us more about yourself'}</p>
            </div>

            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-xl" placeholder="John Doe" required /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-xl" placeholder="your.email@ju.ac.in" required /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-xl" placeholder="••••••••" required /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 border rounded-xl bg-white">
                    <option value="student">Student</option><option value="admin">Admin</option>
                  </select>
                </div>
                {role === 'admin' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-foreground mb-2">Admin Secret Code</label>
                      <div className="relative"><Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-xl" placeholder="Enter secret code" required /></div>
                    </div>
                  </motion.div>
                )}
                <Button type="submit" disabled={loading} className="w-full py-6 font-semibold text-lg mt-6">
                  {loading ? 'Processing...' : (role === 'admin' ? 'Next Step' : 'Sign Up')}
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <input type="file" ref={fileInputRef} onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" className="hidden" />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current.click()} className="gap-2"><Upload className="w-4 h-4" /> Upload Image</Button>
                    {imageFile && <span className="text-sm text-gray-600 truncate">{imageFile.name}</span>}
                  </div>
                </div>
                <div><label className="block text-sm font-medium mb-2">College/Department</label><input type="text" name="college" value={adminDetails.college} onChange={handleAdminDetailsChange} className="w-full px-4 py-2 border rounded-xl" /></div>
                <div><label className="block text-sm font-medium mb-2">Short Bio</label><textarea name="bio" value={adminDetails.bio} onChange={handleAdminDetailsChange} className="w-full px-4 py-2 border rounded-xl" rows="2"></textarea></div>
                <div><label className="block text-sm font-medium mb-2">Message for Juniors</label><textarea name="message_for_juniors" value={adminDetails.message_for_juniors} onChange={handleAdminDetailsChange} className="w-full px-4 py-2 border rounded-xl" rows="2"></textarea></div>
                <div><label className="block text-sm font-medium mb-2">Instagram URL</label><input type="url" name="instagram" value={adminDetails.social_links.instagram} onChange={handleSocialChange} className="w-full px-4 py-2 border rounded-xl" /></div>
                <div><label className="block text-sm font-medium mb-2">LinkedIn URL</label><input type="url" name="linkedin" value={adminDetails.social_links.linkedin} onChange={handleSocialChange} className="w-full px-4 py-2 border rounded-xl" /></div>
                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full">Back</Button>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Creating Account...' : 'Complete Signup'}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link></p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;