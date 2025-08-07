import React from 'react';
import { motion } from 'framer-motion';
import { Download as DownloadIcon, Apple, Smartphone, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedSection from './AnimatedSection';

const Download = () => {
  const { t } = useLanguage();
  
  return (
    <section id="download" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-600 to-emerald-600">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('download.title')}
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-green-100 max-w-2xl mx-auto px-4"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('download.subtitle')}
          </motion.p>
        </AnimatedSection>
        
        <AnimatedSection className="max-w-2xl mx-auto" delay={0.3}>
          <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="flex items-center justify-center mb-4 sm:mb-6"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.4 + (i * 0.1),
                      type: "spring",
                      stiffness: 200
                    }}
                    viewport={{ once: true }}
                  >
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </div>
              <span className="text-white ml-2 sm:ml-3 text-sm sm:text-base md:text-lg font-semibold">4.8/5 Rating</span>
            </motion.div>
            
            <motion.p 
              className="text-center text-green-100 mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base px-2 sm:px-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {t('download.testimonial')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center px-2 sm:px-4"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.button 
                className="group bg-white text-gray-900 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Apple className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span>{t('download.appstore')}</span>
              </motion.button>
              
              <motion.button 
                className="group bg-white text-gray-900 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span>{t('download.googleplay')}</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatedSection>
          
        <AnimatedSection className="text-center" delay={0.8}>
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4 md:space-x-6 lg:space-x-8 text-green-200 text-xs sm:text-sm md:text-base"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <DownloadIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span>{t('download.downloads')}</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{t('download.free')}</span>
            </motion.div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Download;