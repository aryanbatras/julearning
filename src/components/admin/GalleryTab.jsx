import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';

const GalleryTab = () => {
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const loadImages = useCallback(async () => {
    const { data, error } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error loading images:', error);
    else setImages(data);
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleUpload = async () => {
    if (!imageFile) return;
    setUploading(true);

    const fileName = `${Date.now()}_${imageFile.name}`;
    const { error: uploadError } = await supabase.storage.from('gallery_images').upload(fileName, imageFile);
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('gallery_images').getPublicUrl(fileName);

    const { error: insertError } = await supabase.from('gallery_images').insert({ image_url: publicUrl });

    if (insertError) {
      console.error('Error saving image URL:', insertError);
    } else {
      await loadImages();
    }

    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploading(false);
  };

  const handleDelete = async (id, imageUrl) => {
    const { error: dbError } = await supabase.from('gallery_images').delete().eq('id', id);
    if (dbError) {
      console.error('Error deleting from db:', dbError);
      return;
    }

    const fileName = imageUrl.split('/').pop();
    const { error: storageError } = await supabase.storage.from('gallery_images').remove([fileName]);
    if (storageError) console.error('Error deleting from storage:', storageError);

    await loadImages();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Manage Gallery</h2>
        <div className="flex gap-3 items-center">
          <input type="file" ref={fileInputRef} onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
          <Button onClick={handleUpload} disabled={!imageFile || uploading} className="gap-2 bg-orange-600 hover:bg-orange-700">
            {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div> : <Upload className="w-4 h-4" />}
            Upload
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative group aspect-square"
          >
            <img src={image.image_url} alt={image.caption || 'Gallery image'} className="w-full h-full object-cover rounded-xl shadow-lg" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <Button onClick={() => handleDelete(image.id, image.image_url)} variant="destructive" size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      {images.length === 0 && <div className="text-center py-12 bg-white rounded-2xl"><p className="text-gray-500">No images in the gallery yet.</p></div>}
    </div>
  );
};

export default GalleryTab;