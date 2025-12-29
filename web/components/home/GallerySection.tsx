'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Loader2, ZoomIn, X } from 'lucide-react';

interface GalleryItem {
    id: string;
    title_en: string;
    title_fr: string;
    title_ar: string;
    category: string;
    image_url: string;
}

export default function GallerySection() {
    const { language, t } = useLanguage();
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchImages();
    }, []);

    async function fetchImages() {
        try {
            const { data, error } = await supabase
                .from('gallery_items')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setLoading(false);
        }
    }

    const categories = ['all', ...Array.from(new Set(images.map(img => img.category)))];

    const filteredImages = filter === 'all'
        ? images
        : images.filter(img => img.category === filter);

    // Fallback texts since we might not have updated LanguageContext yet fully or passed it down
    const texts = {
        title: t.galleryView?.title || (language === 'ar' ? 'معرضنا' : language === 'fr' ? 'Notre Galerie' : 'Our Gallery'),
        subtitle: t.galleryView?.subtitle || (language === 'ar' ? 'لمحة عن نجاحاتنا ومناسباتنا' : language === 'fr' ? 'Un aperçu de nos succès et événements' : 'A glimpse of our successes and events'),
        all: language === 'ar' ? 'الكل' : language === 'fr' ? 'Tout' : 'All'
    };

    if (loading) {
        return (
            <section className="py-20 bg-gray-50 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#001F3F]" />
            </section>
        );
    }

    if (images.length === 0) return null;

    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden" id="gallery">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="text-4xl font-bold text-[#001F3F] mb-4 font-playfair">{texts.title}</h2>
                    <div className="h-1 w-20 bg-[#D4AF37] mx-auto mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        {texts.subtitle}
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up" data-aos-delay="100">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat
                                    ? 'bg-[#001F3F] text-white shadow-lg shadow-[#001F3F]/20 scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                } capitalize`}
                        >
                            {cat === 'all' ? texts.all : cat}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {filteredImages.map((img) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                key={img.id}
                                className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer bg-gray-100 shadow-md hover:shadow-xl transition-all border border-gray-100"
                                onClick={() => setSelectedImage(img)}
                            >
                                <Image
                                    src={img.image_url}
                                    alt={img[`title_${language}` as keyof GalleryItem] as string || 'Gallery Image'}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <h3 className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {img[`title_${language}` as keyof GalleryItem] as string}
                                    </h3>
                                    <span className="text-[#D4AF37] text-sm uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                        {img.category}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                                    <ZoomIn className="h-5 w-5 text-white" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                        >
                            <X className="h-8 w-8" />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl w-full max-h-[90vh] rounded-xl overflow-hidden shadow-2xl"
                        >
                            <div className="relative aspect-video w-full h-full bg-black">
                                <Image
                                    src={selectedImage.image_url}
                                    alt={selectedImage[`title_${language}` as keyof GalleryItem] as string || 'Gallery'}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white">
                                <h3 className="text-2xl font-bold font-playfair">
                                    {selectedImage[`title_${language}` as keyof GalleryItem] as string}
                                </h3>
                                <p className="text-[#D4AF37] mt-1">{selectedImage.category}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
