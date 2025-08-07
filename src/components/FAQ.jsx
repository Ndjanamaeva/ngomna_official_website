import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedSection from './AnimatedSection';

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());
  const { t } = useLanguage();

  const faqs = [
    {
      id: 1,
      question: t('faq.q1'),
      answer: t('faq.a1')
    },
    {
      id: 2,
      question: t('faq.q2'),
      answer: t('faq.a2')
    },
    {
      id: 3,
      question: t('faq.q3'),
      answer: t('faq.a3')
    },
    {
      id: 4,
      question: t('faq.q4'),
      answer: t('faq.a4')
    },
    {
      id: 5,
      question: t('faq.q5'),
      answer: t('faq.a5')
    }
  ];

  const toggleItem = (id) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-20 bg-indigo-50">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('faq.title')}
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('faq.subtitle')}
          </motion.p>
        </AnimatedSection>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-16">
          {faqs.map((faq, index) => (
            <AnimatedSection
              key={faq.id}
              delay={index * 0.1}
              direction="up"
            >
              <motion.div
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg mb-3 sm:mb-4 overflow-hidden border border-gray-100 hover:border-green-200 transition-colors duration-300"
                whileHover={{ 
                  scale: 1.01,
                  boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-3 sm:p-4 md:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1">
                    <motion.div 
                      className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-green-400 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </motion.div>
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 pr-1 sm:pr-2 md:pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openItems.has(faq.id) ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-500" />
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {openItems.has(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <motion.div 
                        className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 pl-10 sm:pl-16 md:pl-20"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;