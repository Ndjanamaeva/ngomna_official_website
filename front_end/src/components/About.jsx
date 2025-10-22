import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Target, ArrowRight, Shield, Users, Globe, Mail, Smartphone, Bell, Lock, CheckCircle, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedSection from './AnimatedSection';

const About = () => {
  const { t } = useLanguage();
  const [remoteTexts, setRemoteTexts] = useState(null);
  const [remoteError, setRemoteError] = useState(false);
  const [remoteLoading, setRemoteLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchAboutSection = async () => {
      setRemoteLoading(true);
      setRemoteError(false);
      try {
        // Section id 3 corresponds to 'about_ngomna' created in the seed data
        const res = await fetch('http://localhost:5000/api/text/section/3');
        if (!mounted) return;
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        // The backend returns an array of text entries for the section
        // Map them by normalized title to make lookup easy
        const map = {};
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item && item.title) {
              map[item.title.toLowerCase()] = item;
            }
          });
        }
        setRemoteTexts(map);
      } catch (err) {
        console.warn('Could not fetch about section from backend', err);
        if (!mounted) return;
        setRemoteError(true);
        setRemoteTexts(null);
      } finally {
        if (mounted) setRemoteLoading(false);
      }
    };

    fetchAboutSection();
    return () => { mounted = false; };
  }, []);

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: "10M+",
      label: t('about.stats.users'),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      number: "50+",
      label: t('about.stats.services'),
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Star className="w-8 h-8" />,
      number: "4.8/5",
      label: t('about.stats.rating'),
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      number: "99.9%",
      label: t('about.stats.uptime'),
      color: "from-purple-500 to-purple-600"
    }
  ];

  const visionPoints = [
    {
      icon: <Users className="w-6 h-6" />,
      text: remoteTexts && remoteTexts['vision.point1'] && remoteTexts['vision.point1'].content ? remoteTexts['vision.point1'].content : null
    },
    {
      icon: <Globe className="w-6 h-6" />,
      text: remoteTexts && remoteTexts['vision.point2'] && remoteTexts['vision.point2'].content ? remoteTexts['vision.point2'].content : null
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: remoteTexts && remoteTexts['vision.point3'] && remoteTexts['vision.point3'].content ? remoteTexts['vision.point3'].content : null
    },
    {
      icon: <Shield className="w-6 h-6" />,
      text: remoteTexts && remoteTexts['vision.point4'] && remoteTexts['vision.point4'].content ? remoteTexts['vision.point4'].content : null
    }
  ];

  const missionPoints = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      text: remoteTexts && remoteTexts['mission.point1'] && remoteTexts['mission.point1'].content ? remoteTexts['mission.point1'].content : null
    },
    {
      icon: <Bell className="w-6 h-6" />,
      text: remoteTexts && remoteTexts['mission.point2'] && remoteTexts['mission.point2'].content ? remoteTexts['mission.point2'].content : null
    },
    {
      icon: <Lock className="w-6 h-6" />,
      text: remoteTexts && remoteTexts['mission.point3'] && remoteTexts['mission.point3'].content ? remoteTexts['mission.point3'].content : null
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: remoteTexts && remoteTexts['mission.point4'] && remoteTexts['mission.point4'].content ? remoteTexts['mission.point4'].content : null
    }
  ];

  const futureServices = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: null,
      description: null
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: null,
      description: null
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: null,
      description: null
    }
  ];

  // Helper to resolve remote text for either 'future.xxx' or 'about.future.xxx'
  const resolveFutureKey = (key) => {
    if (!remoteTexts) return null;
    const short = `future.${key}`.toLowerCase();
    const prefixed = `about.future.${key}`.toLowerCase();
    if (remoteTexts[short] && remoteTexts[short].content) return remoteTexts[short].content;
    if (remoteTexts[prefixed] && remoteTexts[prefixed].content) return remoteTexts[prefixed].content;
    return null;
  };

  // Refs and state for stacking animation
  const futureContainerRef = useRef(null);
  const placeholderRefs = useRef([]);
  const [cardRects, setCardRects] = useState(null);
  const [animateCards, setAnimateCards] = useState(false);

  // Measure positions of each card in the grid so we can animate from center -> final position
  useLayoutEffect(() => {
    if (!futureContainerRef.current) return;

    // Ensure placeholderRefs current has same length
    placeholderRefs.current = placeholderRefs.current.slice(0, futureServices.length);

    const containerRect = futureContainerRef.current.getBoundingClientRect();
    const rects = placeholderRefs.current.map((el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        top: r.top - containerRect.top,
        left: r.left - containerRect.left,
        width: r.width,
        height: r.height
      };
    });

    setCardRects({ containerWidth: containerRect.width, containerHeight: containerRect.height, items: rects });
  }, [futureServices.length]);

  // Intersection observer to trigger animation when the container is visible
  useEffect(() => {
    const el = futureContainerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimateCards(true);
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Animation variants for vision (left) and mission (right)
  const leftContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0
      }
    }
  };

  const rightContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const leftChild = {
    hidden: { x: '-100vw', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } }
  };

  const rightChild = {
    hidden: { x: '100vw', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } }
  };

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('about.title')}
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {remoteLoading || remoteError || !(remoteTexts && remoteTexts['about.description'] && remoteTexts['about.description'].content) ? (
              <div className="flex items-center justify-center py-6">
                <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              </div>
            ) : (
              <span>{remoteTexts['about.description'].content}</span>
            )}
          </motion.p>
          {/* status badge removed per user request */}
        </AnimatedSection>

        {/* Mission and Vision Section */}
        <AnimatedSection className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('about.vision.title')}</h3>
              </div>
              
              <motion.div
                className="space-y-4"
                variants={leftContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {visionPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                    variants={leftChild}
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      {point.icon}
                    </div>
                    <div className="text-gray-700 font-medium leading-relaxed">
                      {point.text ? (
                        <p>{point.text}</p>
                      ) : (
                        <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className=""
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('about.mission.title')}</h3>
              </div>
              
              <motion.div
                className="space-y-4"
                variants={rightContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {missionPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                    variants={rightChild}
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                      {point.icon}
                    </div>
                    <div className="text-gray-700 font-medium leading-relaxed">
                      {point.text ? (
                        <p>{point.text}</p>
                      ) : (
                        <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Future Perspectives */}
        <AnimatedSection className="mb-20">


          <motion.div
            className="text-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{remoteTexts && remoteTexts['future.title'] && remoteTexts['future.title'].content ? remoteTexts['future.title'].content : t('about.future.title')}</h3>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{remoteTexts && remoteTexts['future.description'] && remoteTexts['future.description'].content ? remoteTexts['future.description'].content : (
              remoteLoading || remoteError ? (
                <svg className="animate-spin inline-block h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : t('about.future.description')
            )}</p>
          </motion.div>

          <div className="relative">
            {/* Hidden grid placeholders used for measuring final positions */}
            <div ref={futureContainerRef} className="grid md:grid-cols-3 gap-8 opacity-0 pointer-events-none">
                {futureServices.map((service, index) => (
                <div
                  key={index}
                  ref={el => placeholderRefs.current[index] = el}
                  className="bg-white p-8 rounded-2xl border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6">
                    {service.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{resolveFutureKey(`service${index+1}.title`) || service.title || null}</h4>
                  <p className="text-gray-600 leading-relaxed">{resolveFutureKey(`service${index+1}.description`) || service.description || null}</p>
                </div>
              ))}
            </div>

            {/* Overlay - stacked cards that animate to measured positions */}
            <div className="absolute inset-0 pointer-events-none">
              {cardRects && cardRects.items && cardRects.items.map((rect, i) => {
                if (!rect) return null;

                const finalStyle = {
                  width: rect.width,
                  height: rect.height,
                  top: rect.top,
                  left: rect.left
                };

                // centered start position (stacked)
                const centerX = (cardRects.containerWidth - rect.width) / 2;
                const centerY = (cardRects.containerHeight - rect.height) / 2;

                return (
                  <motion.div
                    key={i}
                    className="absolute bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    initial={{ x: centerX, y: centerY, opacity: 1, scale: 0.98 }}
                    animate={animateCards ? { x: finalStyle.left, y: finalStyle.top, opacity: 1, scale: 1 } : {}}
                    transition={{ type: 'spring', stiffness: 120, damping: 18, delay: i * 0.12 }}
                    style={{ width: finalStyle.width, height: finalStyle.height }}
                  >
                    <div className="p-8 h-full box-border">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6">
                        {futureServices[i].icon}
                      </div>
                      <div className="mb-4">
                        {resolveFutureKey(`service${i+1}.title`) ? (
                          <h4 className="text-xl font-bold text-gray-900">{resolveFutureKey(`service${i+1}.title`)}</h4>
                        ) : (
                          <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                        )}
                      </div>
                      <div>
                        {resolveFutureKey(`service${i+1}.description`) ? (
                          <p className="text-gray-600 leading-relaxed">{resolveFutureKey(`service${i+1}.description`)}</p>
                        ) : (
                          <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default About;