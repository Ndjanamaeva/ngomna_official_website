import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedSection from './AnimatedSection';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// Import required modules
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

const Comments = () => {
  const { t } = useLanguage();
  
  const comments = [
    {
      id: 1,
      name: t('comments.user1.name'),
      username: "@sarahc_tech",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      comment: t('comments.user1.comment'),
      timeAgo: "2 hours ago",
      verified: true
    },
    {
      id: 2,
      name: t('comments.user2.name'),
      username: "@marcus_dev",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      comment: t('comments.user2.comment'),
      timeAgo: "5 hours ago",
      verified: true
    },
    {
      id: 3,
      name: t('comments.user3.name'),
      username: "@emily_creates",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      comment: t('comments.user3.comment'),
      timeAgo: "1 day ago",
      verified: false
    },
    {
      id: 4,
      name: t('comments.user4.name'),
      username: "@davidk_mobile",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      comment: t('comments.user4.comment'),
      timeAgo: "1 day ago",
      verified: true
    },
    {
      id: 5,
      name: t('comments.user5.name'),
      username: "@lisa_reviews",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      comment: t('comments.user5.comment'),
      timeAgo: "2 days ago",
      verified: false
    },
    {
      id: 6,
      name: t('comments.user6.name'),
      username: "@alexj_tech",
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      comment: t('comments.user6.comment'),
      timeAgo: "3 days ago",
      verified: false
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section id="comments" className="py-12 sm:py-16 lg:py-20 bg-pink-50">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('comments.title')}
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('comments.subtitle')}
          </motion.p>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="max-w-6xl mx-auto">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active'
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              modules={[EffectCoverflow, Autoplay]}
              className="comments-swiper"
            >
              {comments.map((comment) => (
                <SwiperSlide key={comment.id} style={{ width: '350px', height: 'auto' }}>
                  <motion.div
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 h-full relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Quote decoration */}
                    <div className="absolute top-4 right-4 opacity-10">
                      <Quote className="w-12 h-12 text-green-600" />
                    </div>
                    
                    {/* User info */}
                    <div className="flex items-center space-x-4 mb-6 relative z-10">
                      <img
                        src={comment.avatar}
                        alt={comment.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-green-100"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base sm:text-lg font-bold text-gray-900">{comment.name}</h4>
                          {comment.verified && (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs sm:text-sm">{comment.username}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(comment.rating)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Comment text */}
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6 relative z-10">
                      "{comment.comment}"
                    </p>
                    
                    {/* Time */}
                    <div className="text-xs sm:text-sm text-gray-500 relative z-10">
                      {comment.timeAgo}
                    </div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-emerald-50/10 pointer-events-none"></div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </AnimatedSection>
      </div>

      <style jsx>{`
        .comments-swiper {
          width: 100%;
          padding-top: 50px;
          padding-bottom: 50px;
        }

        .comments-swiper .swiper-slide {
          background-position: center;
          background-size: cover;
          width: 350px;
          height: auto;
        }

        .comments-swiper .swiper-pagination-bullet {
          background: rgba(16, 185, 129, 0.3) !important;
          opacity: 1 !important;
          width: 12px !important;
          height: 12px !important;
          margin: 0 6px !important;
          transition: all 0.3s ease !important;
        }

        .comments-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #10b981, #059669) !important;
          transform: scale(1.3) !important;
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4) !important;
        }

        .comments-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        
        @media (max-width: 768px) {
          .comments-swiper .swiper-slide {
            width: 300px !important;
          }
        }
        
        @media (max-width: 480px) {
          .comments-swiper .swiper-slide {
            width: 280px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Comments;