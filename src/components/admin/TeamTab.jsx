
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';

const TeamTab = () => {
  const [members, setMembers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', image_url: '', description: '', team_category: 'Tech' });
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const loadMembers = useCallback(async () => {
    const { data, error } = await supabase.from('team_members').select('*').order('display_order', { ascending: true });
    if (error) console.error('Error loading team members:', error);
    else setMembers(data);
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    const fileName = `${Date.now()}_${imageFile.name}`;
    const { data, error } = await supabase.storage.from('team_images').upload(fileName, imageFile);
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from('team_images').getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = formData.image_url;
    if (imageFile) {
      imageUrl = await handleImageUpload();
    }

    const memberData = { ...formData, image_url: imageUrl };
    let error;
    if (editingMember) {
      const { error: updateError } = await supabase.from('team_members').update(memberData).eq('id', editingMember.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('team_members').insert([memberData]);
      error = insertError;
    }

    if (error) {
      console.error('Error saving member:', error);
    } else {
      await loadMembers();
      setIsOpen(false);
      resetForm();
    }
  };

  const handleDelete = async (id, imageUrl) => {
    const { error: dbError } = await supabase.from('team_members').delete().eq('id', id);
    if (dbError) {
      console.error('Error deleting member from db:', dbError);
      return;
    }

    if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        const { error: storageError } = await supabase.storage.from('team_images').remove([fileName]);
        if (storageError) console.error('Error deleting image from storage:', storageError);
    }

    await loadMembers();
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({ 
      name: member.name, 
      role: member.role || '', 
      image_url: member.image_url || '',
      description: member.description || '',
      team_category: member.team_category || 'Tech'
    });
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', image_url: '', description: '', team_category: 'Tech' });
    setEditingMember(null);
    setImageFile(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Team</h2>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Member'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-xl" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Position (e.g. Developer)</label>
                <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Team Category</label>
                <select value={formData.team_category} onChange={(e) => setFormData({ ...formData, team_category: e.target.value })} className="w-full px-4 py-2 border rounded-xl bg-white">
                  <option value="Tech">Tech</option>
                  <option value="Non-Tech">Non-Tech</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-xl" rows="3"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <input type="file" ref={fileInputRef} onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" className="w-full text-sm" />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">{editingMember ? 'Update Member' : 'Add Member'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, index) => (
          <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-2xl p-4 shadow-lg border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {member.image_url ? <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-gray-400" />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${member.team_category === 'Tech' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{member.team_category}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={() => handleEdit(member)} variant="outline" size="icon" className="hover:bg-blue-50"><Edit className="w-4 h-4" /></Button>
                <Button onClick={() => handleDelete(member.id, member.image_url)} variant="outline" size="icon" className="hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeamTab;
