import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Upload, Image as ImageIcon, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const CoursesTab = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    price: '',
    is_free: true,
    notes_pdf: '',
    pyq_pdf: '',
    youtube_url: '',
    thumbnail_url: '',
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const loadCourses = useCallback(async () => {
    const { data, error } = await supabase.from('courses').select('*, creator:profiles(name, role)').order('created_at', { ascending: false });
    if (error) {
      console.error('Error loading courses:', error);
    } else {
      setCourses(data);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const uploadThumbnail = async (file) => {
    const fileName = `thumbnail-${user.id}-${Date.now()}`;
    const { data, error } = await supabase.storage.from('course_thumbnails').upload(fileName, file);
    if (error) {
      console.error('Thumbnail upload error:', error);
      toast({ title: "Thumbnail upload failed", variant: "destructive" });
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from('course_thumbnails').getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let thumbnailUrl = editingCourse?.thumbnail_url || '';
    if (thumbnailFile) {
      thumbnailUrl = await uploadThumbnail(thumbnailFile);
      if (!thumbnailUrl) return; // Stop if upload fails
    }

    const courseData = {
      ...formData,
      price: formData.is_free ? 0 : parseFloat(formData.price) || 0,
      creator_id: user.id,
      thumbnail_url: thumbnailUrl,
    };

    let error;
    if (editingCourse) {
      const { error: updateError } = await supabase.from('courses').update(courseData).eq('id', editingCourse.id);
      error = updateError;
      if (!error) toast({ title: "Course Updated! ✨" });
    } else {
      const { error: insertError } = await supabase.from('courses').insert([courseData]);
      error = insertError;
      if (!error) toast({ title: "Course Added! 🎉" });
    }

    if (error) {
      console.error("Error saving course", error);
    } else {
      await loadCourses();
      setIsOpen(false);
      resetForm();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) {
      console.error("Error deleting course", error);
    } else {
      toast({ title: "Course Deleted" });
      await loadCourses();
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code || '',
      name: course.name || '',
      price: course.price || '',
      is_free: course.is_free,
      notes_pdf: course.notes_pdf || '',
      pyq_pdf: course.pyq_pdf || '',
      youtube_url: course.youtube_url || '',
      thumbnail_url: course.thumbnail_url || '',
    });
    setThumbnailPreview(course.thumbnail_url || '');
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      code: '', name: '', price: '', is_free: true, notes_pdf: '', pyq_pdf: '', youtube_url: '', thumbnail_url: '',
    });
    setEditingCourse(null);
    setThumbnailFile(null);
    setThumbnailPreview('');
  };

  const handleBulkUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
      const header = lines[0].split(',').map(h => h.trim());
      const requiredHeaders = ['code', 'name', 'is_free', 'price'];
      
      if (!requiredHeaders.every(h => header.includes(h))) {
        toast({ title: "Invalid CSV Header", description: `Header must include: ${requiredHeaders.join(', ')}`, variant: "destructive" });
        return;
      }

      const coursesToUpload = lines.slice(1).map(line => {
        const values = line.split(',');
        const course = header.reduce((obj, nextKey, index) => {
          let value = values[index] ? values[index].trim() : '';
          if (nextKey === 'is_free') value = value.toLowerCase() === 'true';
          if (nextKey === 'price') value = parseFloat(value) || 0;
          obj[nextKey] = value;
          return obj;
        }, {});
        course.creator_id = user.id;
        return course;
      });

      const { error } = await supabase.from('courses').insert(coursesToUpload);

      if (error) {
        console.error("Bulk Upload Failed", error);
      } else {
        toast({ title: "Bulk Upload Successful!", description: `${coursesToUpload.length} courses added.` });
        await loadCourses();
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">Manage Courses</h2>
        <div className="flex gap-3">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
          <Button onClick={handleBulkUploadClick} variant="outline" className="gap-2">
            <Upload className="w-4 h-4" /> Bulk Upload
          </Button>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 p-1">
                <div>
                  <label className="block text-sm font-medium mb-2">Course Thumbnail</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                      {thumbnailPreview ? (
                        <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <input type="file" ref={thumbnailInputRef} onChange={handleThumbnailChange} accept="image/*" className="hidden" />
                    <Button type="button" variant="outline" onClick={() => thumbnailInputRef.current.click()}>Change</Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Course Code</label>
                  <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Course Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required />
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="courseType" checked={formData.is_free} onChange={() => setFormData({...formData, is_free: true, price: ''})} className="w-4 h-4 text-primary focus:ring-primary" />
                    <span className="text-sm font-medium">Free Course</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="courseType" checked={!formData.is_free} onChange={() => setFormData({...formData, is_free: false})} className="w-4 h-4 text-primary focus:ring-primary" />
                    <span className="text-sm font-medium">Paid Course</span>
                  </label>
                </div>
                {!formData.is_free && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                    <label className="block text-sm font-medium mb-2">Price (₹)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required={!formData.is_free} min="0" />
                  </motion.div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Notes PDF URL</label>
                  <input type="url" value={formData.notes_pdf || ''} onChange={(e) => setFormData({...formData, notes_pdf: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">PYQ PDF URL</label>
                  <input type="url" value={formData.pyq_pdf || ''} onChange={(e) => setFormData({...formData, pyq_pdf: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">YouTube Embed URL</label>
                  <input type="url" value={formData.youtube_url || ''} onChange={(e) => setFormData({...formData, youtube_url: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <Button type="submit" className="w-full mt-6">
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="grid gap-4 min-w-[600px]">
          {courses.map((course, index) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                    <BookOpen className="w-8 h-8 text-white/70" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-3 py-1 bg-accent text-secondary rounded-full text-xs font-medium">{course.code}</span>
                  {course.is_free ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">FREE</span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">PAID</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1 truncate">{course.name}</h3>
                {!course.is_free && <p className="text-md font-semibold text-primary">₹{course.price}</p>}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(course)} variant="outline" size="icon" className="hover:bg-blue-50"><Edit className="w-4 h-4" /></Button>
                <Button onClick={() => handleDelete(course.id)} variant="outline" size="icon" className="hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {courses.length === 0 && <div className="text-center py-12 bg-white rounded-xl"><p className="text-gray-500">No courses yet. Add your first course!</p></div>}
    </div>
  );
};

export default CoursesTab;