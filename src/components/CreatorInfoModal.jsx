import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { School as University, User, Instagram, Linkedin, Link as LinkIcon, BookOpen, X } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const CreatorInfoModal = ({ course, isOpen, onOpenChange }) => {
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCreatorData = useCallback(async () => {
    if (!isOpen || !course?.creator_id) return;

    setLoading(true);
    
    const { data: creatorData, error: creatorError } = await supabase
      .from('admin_profiles')
      .select(`
        *,
        profiles ( name )
      `)
      .eq('id', course.creator_id)
      .single();

    if (creatorError) {
      console.error("Error fetching creator:", creatorError);
      setLoading(false);
      return;
    }
    
    setCreatorDetails(creatorData);

    const { count, error: courseCountError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', course.creator_id);

    if (courseCountError) {
      console.error("Error fetching course count:", courseCountError);
    } else {
      setCourseCount(count || 0);
    }

    setLoading(false);
  }, [isOpen, course]);

  useEffect(() => {
    if (isOpen) {
      fetchCreatorData();
    } else {
      setCreatorDetails(null);
      setCourseCount(0);
    }
  }, [isOpen, fetchCreatorData]);

  const socialLinks = creatorDetails?.social_links || {};

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95%] p-0 overflow-hidden rounded-xl border-none bg-transparent shadow-none">
        {loading ? (
          <div className="h-96 flex items-center justify-center bg-white rounded-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
          </div>
        ) : creatorDetails ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl">
            <div className="relative">
              <div className="h-32 bg-gradient-to-br from-primary to-secondary rounded-t-xl"></div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                {creatorDetails.profile_image_url ? (
                  <img src={creatorDetails.profile_image_url} alt={creatorDetails.profiles.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300"><User className="w-12 h-12 text-gray-500" /></div>
                )}
              </div>
              <button onClick={() => onOpenChange(false)} className="absolute top-3 right-3 text-white/70 hover:text-white/100 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="pt-16 pb-8 px-6 sm:px-8 text-center">
              <DialogHeader><DialogTitle className="text-2xl font-bold text-foreground">{creatorDetails.profiles.name}</DialogTitle></DialogHeader>
              {creatorDetails.college && <div className="flex items-center justify-center gap-2 text-gray-500 mt-1"><University className="w-4 h-4" /><span>{creatorDetails.college}</span></div>}
              
              <div className="flex justify-center items-center gap-6 my-5">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{courseCount}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Courses Created</p>
                </div>
              </div>

              {creatorDetails.bio && <p className="text-gray-600 mt-4 text-sm">{creatorDetails.bio}</p>}
              {creatorDetails.message_for_juniors && <p className="text-secondary bg-accent p-3 rounded-lg mt-4 text-sm italic">"{creatorDetails.message_for_juniors}"</p>}

              <div className="flex justify-center gap-5 mt-6">
                {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-500 transition-colors"><Instagram className="w-6 h-6" /></a>}
                {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors"><Linkedin className="w-6 h-6" /></a>}
                {socialLinks.other && <a href={socialLinks.other} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors"><LinkIcon className="w-6 h-6" /></a>}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-96 flex items-center justify-center text-center p-4 bg-white rounded-xl">
            <p className="text-gray-600">Could not load creator details.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatorInfoModal;