import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching gallery images:", error);
    } else {
      setImages(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <>
      <Helmet>
        <title>Gallery - JU Learning Portal</title>
        <meta name="description" content="A gallery of moments and events at JU Learning Portal." />
      </Helmet>
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Gallery</h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              A glimpse into our journey, events, and community.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div></div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 relative w-full h-96 lg:h-[600px] rounded-2xl shadow-2xl overflow-hidden bg-gray-200">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={currentIndex}
                    src={images[currentIndex].image_url}
                    alt={images[currentIndex].caption || 'Gallery image'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/20"></div>
                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full transition-colors"><ChevronLeft /></button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full transition-colors"><ChevronRight /></button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 h-full">
                {images.slice(0, 6).map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-lg cursor-pointer group"
                    onClick={() => setSelectedImg(image.image_url)}
                  >
                    <img src={image.image_url} alt={image.caption || 'Thumbnail'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800">Gallery is Empty</h3>
              <p className="text-gray-600">Check back soon for photos!</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImg(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImg}
              alt="Enlarged view"
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={() => setSelectedImg(null)} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"><X /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryPage;