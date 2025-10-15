
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, School, Link as LinkIcon, Instagram, Linkedin, BookOpen, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ProfileTab = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [adminProfile, setAdminProfile] = useState({
    profile_image_url: '',
    college: '',
    bio: '',
    message_for_juniors: '',
    social_links: { instagram: '', linkedin: '', other: '' },
  });
  const [stats, setStats] = useState({ course_count: 0 });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const loadProfileData = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase.from('admin_profiles').select('*').eq('id', user.id).maybeSingle();
    
    if (data) {
      setAdminProfile({
        ...data,
        social_links: data.social_links || { instagram: '', linkedin: '', other: '' },
      });
      setPreviewUrl(data.profile_image_url || '');
    } else if (error && error.code !== 'PGRST116') {
      console.error('Error loading admin profile:', error);
    }

    const { count: courseCount, error: courseCountError } = await supabase.from('courses').select('*', { count: 'exact', head: true }).eq('creator_id', user.id);
    if (courseCountError) console.error('Error fetching course count:', courseCountError);
    
    setStats({ course_count: courseCount || 0 });
  }, [user]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return previewUrl;
    setUploading(true);
    const fileName = `profile-${user.id}-${Date.now()}`;
    const { error: uploadError } = await supabase.storage.from('admin_profiles').upload(fileName, imageFile, { upsert: true });
    
    if (uploadError) {
      setUploading(false);
      console.error("Image upload failed", uploadError);
      return previewUrl;
    }

    const { data: { publicUrl } } = supabase.storage.from('admin_profiles').getPublicUrl(fileName);
    
    if (adminProfile.profile_image_url) {
      const oldFileName = adminProfile.profile_image_url.split('/').pop();
      if (oldFileName !== fileName) {
        await supabase.storage.from('admin_profiles').remove([oldFileName]);
      }
    }
    
    setUploading(false);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await handleImageUpload();
    const profileData = {
      ...adminProfile,
      id: user.id,
      profile_image_url: imageUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('admin_profiles').upsert(profileData, { onConflict: 'id' });

    if (error) {
      console.error("Profile update failed", error);
    } else {
      toast({ title: "Profile Updated Successfully! ✨" });
      setAdminProfile(prev => ({ ...prev, profile_image_url: imageUrl }));
      setImageFile(null);
      setPreviewUrl(imageUrl);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setAdminProfile(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [name]: value },
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Edit Your Profile</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt={profile?.name || 'Admin'} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <Button type="button" size="icon" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700" onClick={() => fileInputRef.current.click()}>
                <Upload className="w-4 h-4" />
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{profile?.name}</h3>
              <p className="text-gray-500">Admin</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">College / Department</label>
            <input type="text" name="college" value={adminProfile.college || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Short Bio</label>
            <textarea name="bio" value={adminProfile.bio || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" rows="3"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message for Your Juniors</label>
            <textarea name="message_for_juniors" value={adminProfile.message_for_juniors || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" rows="3"></textarea>
          </div>

          <h4 className="text-lg font-semibold pt-4 border-t">Social Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2"><Instagram className="w-4 h-4" /> Instagram URL</label>
              <input type="url" name="instagram" value={adminProfile.social_links.instagram || ''} onChange={handleSocialChange} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn URL</label>
              <input type="url" name="linkedin" value={adminProfile.social_links.linkedin || ''} onChange={handleSocialChange} className="w-full px-4 py-2 border rounded-xl" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Other Link (Portfolio, etc.)</label>
            <input type="url" name="other" value={adminProfile.social_links.other || ''} onChange={handleSocialChange} className="w-full px-4 py-2 border rounded-xl" />
          </div>

          <Button type="submit" disabled={uploading} className="w-full bg-teal-600 hover:bg-teal-700 gap-2">
            {uploading ? 'Uploading...' : <><Save className="w-4 h-4" /> Save Changes</>}
          </Button>
        </form>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"><BookOpen className="w-5 h-5 text-indigo-600" /></div>
                  <span className="font-medium">Courses Created</span>
                </div>
                <span className="font-bold text-lg">{stats.course_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
  