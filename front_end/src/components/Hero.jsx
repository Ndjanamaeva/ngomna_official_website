import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Play, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';

const Hero = () => {
  const { t } = useLanguage();
  // null = not loaded, string = value from backend (possibly empty),
  // this lets us distinguish "not loaded" from "loaded but empty".
  const [dbTitle, setDbTitle] = useState(null);
  const [dbContent, setDbContent] = useState(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [phoneImageUrl, setPhoneImageUrl] = useState(null);
  const [phoneLoading, setPhoneLoading] = useState(true);
  const [phoneError, setPhoneError] = useState(false);

  useEffect(() => {
    const fetchHeroText = async () => {
      setDbLoading(true);
      try {
        setDbError(false);
        const res = await axios.get('http://localhost:5000/api/text/page/1/section/2');
        if (res && res.data) {
          // allow empty strings from backend to be used as "loaded but empty"
          setDbTitle(res.data.title ?? '');
          setDbContent(res.data.content ?? '');
        } else {
          // mark as loaded but no data returned
          setDbTitle('');
          setDbContent('');
        }
      } catch (err) {
        console.warn('Could not fetch hero text from backend', err);
        setDbError(true);
      } finally {
        setDbLoading(false);
      }
    };

    fetchHeroText();
  }, []);

  // Fetch phone image record from backend and use its url
  useEffect(() => {
    let mounted = true;
    const fetchPhoneImage = async () => {
      setPhoneLoading(true);
      setPhoneError(false);
      try {
        const res = await axios.get('http://localhost:5000/api/images/name/phone_image');
        if (!mounted) return;
        const img = res && res.data ? res.data : null;
        // Only load the image directly from the backend. If backend is not reachable or
        // the image URL does not resolve, leave the phone empty (null) per user's request.
        if (img && img.url) {
          let rawUrl = img.url;
          if (!/^https?:\/\//.test(rawUrl) && !rawUrl.startsWith('/')) rawUrl = '/' + rawUrl;

          // Prefer backend absolute URL. If the DB contains a relative path, prefix with backend origin.
          const candidate = /^https?:\/\//.test(rawUrl) ? rawUrl : 'http://localhost:5000' + rawUrl;
          try {
            // Verify the backend serves the image and it's accessible.
            const head = await axios.get(candidate, { responseType: 'blob' });
            if (!mounted) return;
            if (head && head.status >= 200 && head.status < 300) {
              setPhoneImageUrl(candidate);
            } else {
              // leave null (phone remains empty)
              setPhoneImageUrl(null);
            }
          } catch (err) {
            // backend not reachable or image not found / CORS issue -> keep phone empty
            // eslint-disable-next-line no-console
            console.warn('phone image fetch failed for', candidate, err && err.message ? err.message : err);
            if (!mounted) return;
            setPhoneImageUrl(null);
            setPhoneError(true);
          }
        } else {
          // no image record -> keep phone empty
          setPhoneImageUrl(null);
        }
      } catch (err) {
        console.warn('Could not fetch phone image from backend', err);
        if (!mounted) return;
        setPhoneError(true);
        setPhoneImageUrl(null);
      } finally {
        if (mounted) setPhoneLoading(false);
      }
    };

    fetchPhoneImage();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50"></div>

      {/* Animated Phone */}
      <motion.div
        className="absolute right-4 sm:right-6 md:right-8 lg:right-10 xl:right-16 2xl:right-20 
                   top-10 sm:top-12 md:top-14 lg:top-16 xl:top-14 2xl:top-12
                   w-[180px] h-[360px] 
                   sm:w-[200px] sm:h-[400px] 
                   md:w-[220px] md:h-[440px] 
                   lg:w-[250px] lg:h-[500px] 
                   xl:w-[270px] xl:h-[540px] 
                   2xl:w-[300px] 2xl:h-[600px] 
                   opacity-90"
        animate={{
          rotateY: [-15, 15, -15],
          rotateX: [-10, 10, -10],
          rotateZ: [-5, 5, -5],
          translateY: [-20, 20, -20],
          translateX: [-15, 15, -15],
          translateZ: [-30, 30, -30],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          perspective: "1500px",
          transformStyle: "preserve-3d"
        }}
      >
        <div className="relative w-full h-full">
          {/* Phone frame */}
          <div className="absolute inset-0 rounded-[40px] sm:rounded-[45px] md:rounded-[50px] lg:rounded-[55px] bg-[#1C1C1E] shadow-2xl">
            {/* Side buttons */}
            <div className="absolute -left-[2px] w-[3px] sm:w-[4px] h-[30px] sm:h-[40px] bg-[#2A2A2C] rounded-r-lg" style={{ top: '25%' }}></div>
            <div className="absolute -left-[2px] w-[3px] sm:w-[4px] h-[40px] sm:h-[60px] bg-[#2A2A2C] rounded-r-lg" style={{ top: '40%' }}></div>
            <div className="absolute -right-[2px] w-[3px] sm:w-[4px] h-[40px] sm:h-[60px] bg-[#2A2A2C] rounded-l-lg" style={{ top: '25%' }}></div>
          </div>

          {/* Screen bezel */}
          <div className="absolute inset-1 sm:inset-2 rounded-[35px] sm:rounded-[40px] md:rounded-[45px] lg:rounded-[50px] bg-black">
            {/* Dynamic Island */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] sm:w-[100px] md:w-[120px] h-[18px] sm:h-[22px] md:h-[25px] bg-black rounded-b-[20px] sm:rounded-b-[24px] z-20">
              <div className="absolute top-[4px] sm:top-[6px] left-1/2 -translate-x-1/2 w-[60px] sm:w-[75px] md:w-[85px] h-[3px] sm:h-[4px] bg-[#1C1C1E] rounded-full"></div>
            </div>

            {/* Screen content */}
            <div className="absolute inset-0 rounded-[33px] sm:rounded-[38px] md:rounded-[43px] lg:rounded-[48px] overflow-hidden bg-white">
              <div className="absolute inset-0 pt-[4px] sm:pt-[6px]">
                <img
                  src={phoneImageUrl || '/Capture.PNG'}
                  alt="nGomna App Interface"
                  className="w-full h-full object-cover"
                  loading="eager"
                  style={{
                    imageRendering: "crisp-edges",
                    backgroundColor: "white"
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-10 -right-10 w-72 h-72 bg-green-200 rounded-full opacity-20"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-10 -left-10 w-96 h-96 bg-emerald-200 rounded-full opacity-20"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-200 rounded-full opacity-10"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl ml-0 sm:ml-4 md:ml-8">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight text-left font-sans"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center">
              {/* Render priority:
                  1. While loading -> show spinner (don't show translation fallback)
                  2. If error -> show explicit error message (no translation fallback)
                  3. If backend returned a value (including empty string) -> use it
                  4. Otherwise (loaded but no backend value) -> fall back to translation
              */}
              {(dbLoading || dbError) ? (
                <svg className="animate-spin ml-3 h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : (dbTitle !== null && dbTitle !== undefined ? dbTitle || t('hero.title') : t('hero.title'))}
            </span>
          </motion.h1>
          
          <motion.p
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-400 mb-8 sm:mb-12 text-left font-sans"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <span className="inline-flex items-center">
              {(dbLoading || dbError) ? (
                <svg className="animate-spin ml-3 h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : (dbContent !== null && dbContent !== undefined ? dbContent || t('hero.subtitle') : t('hero.subtitle'))}
            </span>
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start mb-8 sm:mb-12"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          >
            <motion.button 
              onClick={() => {
                const downloadSection = document.getElementById('download');
                if (downloadSection) {
                  downloadSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 w-full sm:w-auto justify-center"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('hero.download')}</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;