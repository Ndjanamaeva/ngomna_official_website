import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Zap, Shield, Users, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedSection from './AnimatedSection';

const News = () => {
  const { t } = useLanguage();
  
  const newsItems = [
    {
      id: 1,
      title: t('news.article1.title'),
      excerpt: t('news.article1.excerpt'),
      date: "2025-01-15",
      category: t('news.article1.category'),
      icon: <Zap className="w-5 h-5" />,
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
      featured: true
    },
    {
      id: 2,
      title: t('news.article2.title'),
      excerpt: t('news.article2.excerpt'),
      date: "2025-01-10",
      category: t('news.article2.category'),
      icon: <Shield className="w-5 h-5" />,
      image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 3,
      title: t('news.article3.title'),
      excerpt: t('news.article3.excerpt'),
      date: "2025-01-05",
      category: t('news.article3.category'),
      icon: <Users className="w-5 h-5" />,
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 4,
      title: t('news.article4.title'),
      excerpt: t('news.article4.excerpt'),
      date: "2025-01-01",
      category: t('news.article4.category'),
      icon: <Star className="w-5 h-5" />,
      image: "https://images.pexels.com/photos/1068523/pexels-photo-1068523.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case t('news.article1.category'):
        return 'from-green-500 to-emerald-600';
      case t('news.article2.category'):
        return 'from-emerald-500 to-teal-600';
      case t('news.article3.category'):
        return 'from-yellow-500 to-orange-500';
      case t('news.article4.category'):
        return 'from-yellow-400 to-yellow-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section id="news" className="py-12 sm:py-16 lg:py-20 bg-yellow-50">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('news.title')}
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('news.subtitle')}
          </motion.p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
          {/* Featured Article */}
          <AnimatedSection className="lg:col-span-2" direction="up">
            <motion.article
              className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="lg:flex">
                <div className="lg:w-1/2 relative overflow-hidden">
                  <motion.img
                    src={newsItems[0].image}
                    alt={newsItems[0].title}
                    className="w-full h-48 sm:h-64 lg:h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  <motion.div 
                    className="absolute top-4 left-4"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </motion.div>
                </div>
                
                <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                  <motion.div 
                    className="flex items-center space-x-2 mb-4"
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getCategoryColor(newsItems[0].category)} flex items-center justify-center text-white`}>
                      {newsItems[0].icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      {newsItems[0].category}
                    </span>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    {newsItems[0].title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {newsItems[0].excerpt}
                  </motion.p>
                  
                  <motion.div 
                    className="flex items-center justify-between"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Calendar size={16} />
                      <span className="text-sm">{formatDate(newsItems[0].date)}</span>
                    </div>
                    
                    <motion.button 
                      className="group/btn bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                     <span>{t('news.readmore')}</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight size={16} />
                      </motion.div>
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.article>
          </AnimatedSection>
        </div>

        {/* Other News Items */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {newsItems.slice(1).map((item, index) => (
            <AnimatedSection
              key={item.id}
              delay={index * 0.1}
              direction="up"
            >
              <motion.article
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 h-full"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 sm:h-48 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                
                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <motion.div 
                    className="flex items-center space-x-2 mb-3"
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className={`w-6 h-6 rounded-md bg-gradient-to-r ${getCategoryColor(item.category)} flex items-center justify-center text-white`}>
                      {item.icon}
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {item.category}
                    </span>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-base sm:text-lg font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2 flex-grow"
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    {item.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3 flex-grow"
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    {item.excerpt}
                  </motion.p>
                  
                  <motion.div 
                    className="flex items-center justify-between mt-auto"
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Calendar size={14} />
                      <span className="text-xs sm:text-sm">{formatDate(item.date)}</span>
                    </div>
                    
                    <motion.button 
                      className="text-green-600 hover:text-green-700 font-semibold text-xs sm:text-sm flex items-center space-x-1 group-hover:translate-x-1 transition-transform"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                     <span>{t('news.readmore')}</span>
                      <ArrowRight size={14} />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.article>
            </AnimatedSection>
          ))}
        </div>

        {/* View All News Button */}
        <AnimatedSection className="text-center mt-12" delay={0.6}>
          <motion.button 
            className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span>{t('news.viewall')}</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={20} />
            </motion.div>
          </motion.button>
        </AnimatedSection>
      </div>
      
      <style jsx>{`
        @media (max-width: 639px) {
          .carousel-container {
            padding: 20px 16px;
            gap: 24px;
          }
          
          .description {
            font-size: 1.25rem;
            margin-bottom: 16px;
          }
          
          .smaller-text {
            font-size: 0.9rem;
            margin-bottom: 20px;
          }
          
          .phone-mockup {
            width: 220px;
            height: 440px;
          }
          
          .phone-notch {
            width: 120px;
            height: 24px;
          }
          
          .learn-more-btn {
            padding: 8px 16px;
            font-size: 13px;
          }
          
          .play-pause-btn {
            width: 36px;
            height: 36px;
          }
        }

        /* Responsive fixes for small screens */
        @media (max-width: 768px) {
          .grid.sm\\:grid-cols-2.lg\\:grid-cols-3.gap-6.lg\\:gap-8 {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .grid.lg\\:grid-cols-2.gap-6.lg\\:gap-8.mb-8.lg\\:mb-12 {
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default News;