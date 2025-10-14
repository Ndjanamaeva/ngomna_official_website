import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Smartphone, ChevronDown, FileText, Info, Bell, Users, MessageCircle, Baby, Shield, Key, Building, Bot } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [allLinks, setAllLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [linksValid, setLinksValid] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/ngomna_logo.png');

  // Static icon map for known feature slugs/labels
  const iconMap = {
    payslips: <FileText size={16} />,
    information: <Info size={16} />,
    notifications: <Bell size={16} />,
    census: <Users size={16} />,
    messaging: <MessageCircle size={16} />,
    children: <Baby size={16} />,
    security: <Shield size={16} />,
    otp: <Key size={16} />,
    dgi: <Building size={16} />,
    'gov-ai': <Bot size={16} />,
  };

  const [features, setFeatures] = useState([]); // will hold fetched feature menu items
  const [featuresLinks, setFeaturesLinks] = useState([]);
  const [aboutLinks, setAboutLinks] = useState([]);
  const [contactLinks, setContactLinks] = useState([]);

  // Helper to fetch a single link by id from backend
  const fetchLinkById = useCallback(async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/links/id/${id}`);
      console.log(`link id ${id}:`, res.data);
      return res.data;
    } catch (err) {
      console.error(`Failed to fetch link id ${id}:`, err);
      return null;
    }
  }, []);

  // Demo: fetch link id=1 on mount so you can verify the endpoint works
  useEffect(() => {
    fetchLinkById(1);
  }, [fetchLinkById]);

  // Fetch logo image url from backend by name 'ngomna_logo'
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/images/name/ngomna_logo');
        if (res && res.data && res.data.url) {
          setLogoUrl(res.data.url);
        }
      } catch (err) {
        console.warn('Could not fetch logo from backend, using local fallback', err);
      }
    };

    fetchLogo();
  }, []);

  // Fetch menu items for a given menuId
  const fetchMenuItems = useCallback(async (menuId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/menuitems/${menuId}`);
      // Set menu items with the correct label and link
      setFeatures(response.data.map(item => ({
        id: item.id,
        label: item.label,
        link: item.url,  // Make sure this matches the URL field from the database
        icon: iconMap[item.url.replace(/^\//, '').toLowerCase()] || iconMap[item.label.toLowerCase()] || <FileText size={16} />
      })));
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  }, []);

  // Fetch menus and select the 'features' menu to load its menu items
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/menus');
        const menus = res.data;
        // Find the features menu by title (created as 'features' in backend seed)
        const featuresMenu = menus.find(m => m.title && m.title.toLowerCase() === 'features');
        if (featuresMenu) {
          fetchMenuItems(featuresMenu.id);
        } else if (menus.length > 0) {
          // fallback to first menu
          fetchMenuItems(menus[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch menus:', err);
      }
    };

    fetchMenus();
  }, [fetchMenuItems]);

  // Navigation helper used by header buttons (fallback to scrolling to sections)
  const handleSectionNavigation = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Slight delay to ensure navigation completes
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Fetch links for each menu (features=1, about=2, contact=3) using Promise.all
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const [featuresResponse, aboutResponse, contactResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/links/1'),
          axios.get('http://localhost:5000/api/links/2'),
          axios.get('http://localhost:5000/api/links/3')
        ]);

        setFeaturesLinks(featuresResponse.data || []);
        setAboutLinks(aboutResponse.data || []);
        setContactLinks(contactResponse.data || []);

        console.log('featuresLinks:', featuresResponse.data);
        console.log('aboutLinks:', aboutResponse.data);
        console.log('contactLinks:', contactResponse.data);

        // Also fetch all links and store them for mapping nav items dynamically
        try {
          const allRes = await axios.get('http://localhost:5000/api/links');
          setAllLinks(allRes.data || []);
          console.log('allLinks:', allRes.data);
          // simple verification: require that the endpoint returned a non-empty array
          const ok = Array.isArray(allRes.data) && allRes.data.length > 0;
          setLinksValid(ok);
        } catch (e) {
          console.warn('Could not fetch all links:', e);
          setLinksValid(false);
        } finally {
          setLoadingLinks(false);
        }
      } catch (error) {
        console.error('Error fetching links:', error);
      }
    };

    fetchLinks();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 h-16 sm:h-20 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-2">
            <img 
              src={logoUrl} 
              alt="nGomna Logo" 
              className="w-[80px] h-[80px] sm:w-[95px] sm:h-[95px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px] object-contain"
            />
          </div>
          
          {loadingLinks ? (
            <div className="flex-1 flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            </div>
          ) : linksValid ? (
            <>
            <nav className="hidden lg:flex space-x-6 xl:space-x-8">
              {/* Home: prefer a link from allLinks if present */}
              {(() => {
                const homeLink = allLinks.find(l => l.label && l.label.toLowerCase() === 'home');
                if (homeLink && homeLink.url) return <Link to={homeLink.url} className="text-gray-700 hover:text-green-600 transition-colors">Home</Link>;
                return <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">Home</Link>;
              })()}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <span>{t('nav.features')}</span>
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">{t('nav.features.title')}</h3>
                      <p className="text-xs text-gray-500">{t('nav.features.subtitle')}</p>
                    </div>
                    <div className="py-2">
                      {features.map((feature, index) => (
                        <Link
                          key={feature.id || index}
                          to={feature.link}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-gray-600 group-hover:text-green-600 transition-colors">
                            {feature.icon}
                          </div>
                          <span className="font-medium">{feature.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* About, News, Reviews, FAQ, Contact - prefer to render Link if URL present in allLinks, otherwise fallback to scroll */}
              {['about','news','comments','faq','contact'].map((key) => {
                const labelMap = { about: 'about', news: 'news', comments: 'reviews', faq: 'faq', contact: 'contact' };
                // try to find link by label (many DB labels are lowercase)
                const linkObj = allLinks.find(l => l.label && l.label.toLowerCase() === key || l.label && l.label.toLowerCase() === labelMap[key]);
                if (linkObj && linkObj.url) return <Link key={key} to={linkObj.url} className="text-gray-700 hover:text-green-600 transition-colors">{t(`nav.${key === 'comments' ? 'reviews' : key}`)}</Link>;
                // fallback: button that scrolls to the section id
                const sectionId = key === 'comments' ? 'comments' : key;
                return <button key={key} onClick={() => handleSectionNavigation(sectionId)} className="text-gray-700 hover:text-green-600 transition-colors">{t(`nav.${key === 'comments' ? 'reviews' : key}`)}</button>;
              })}
            </nav>

            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
              <LanguageToggle />
              <button 
                onClick={() => handleSectionNavigation('download')}
                className="group bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 xl:px-6 py-2 xl:py-3 rounded-full font-semibold text-xs xl:text-sm hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 hover:from-green-600 hover:to-emerald-600"
              >
                <span>{t('nav.download')}</span>
                <svg 
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            </>
          ) : null}
        </div>

        {linksValid && (
        <div className={`lg:hidden transition-all duration-300 overflow-hidden bg-white/95 backdrop-blur-md ${
          isMenuOpen ? 'max-h-96 opacity-100 border-t border-gray-200' : 'max-h-0 opacity-0'
        }`}>
          <nav className="py-4 px-4 space-y-2 flex flex-col max-h-80 overflow-y-auto">
            <Link to="/" className="block py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
            
            <div className="relative">
              <button
                onMouseEnter={() => setIsMobileDropdownOpen(true)}
                onMouseLeave={() => setIsMobileDropdownOpen(false)}
                className="w-full flex items-center justify-between py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors text-left"
              >
                <span>{t('nav.features')}</span>
                <motion.div
                  animate={{ rotate: isMobileDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {isMobileDropdownOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden bg-gray-50 rounded-lg ml-4 mt-2"
                    onMouseEnter={() => setIsMobileDropdownOpen(true)}
                    onMouseLeave={() => setIsMobileDropdownOpen(false)}
                  >
                    {features.map((feature, index) => (
                      <Link
                        key={feature.id || index}
                        to={feature.link}
                        className="flex items-center space-x-3 py-2 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMobileDropdownOpen(false);
                        }}
                      >
                        <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-gray-600">
                          {feature.icon}
                        </div>
                        <span className="text-sm">{feature.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className={`space-y-1 transition-all duration-300 ${isMobileDropdownOpen ? 'mt-4' : ''}`}>
              {['about','news','comments','faq','contact'].map((key) => {
                const labelMap = { about: 'about', news: 'news', comments: 'reviews', faq: 'faq', contact: 'contact' };
                const linkObj = allLinks.find(l => l.label && l.label.toLowerCase() === key || l.label && l.label.toLowerCase() === labelMap[key]);
                if (linkObj && linkObj.url) return <Link key={key} to={linkObj.url} className="block py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors text-left w-full" onClick={() => setIsMenuOpen(false)}>{t(`nav.${key === 'comments' ? 'reviews' : key}`)}</Link>;
                const sectionId = key === 'comments' ? 'comments' : key;
                return <button key={key} onClick={() => { setIsMenuOpen(false); handleSectionNavigation(sectionId); }} className="block py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors text-left w-full">{t(`nav.${key === 'comments' ? 'reviews' : key}`)}</button>;
              })}
            </div>
            
            <div className="py-3 flex justify-center border-t border-gray-200 mt-4 pt-4">
              <LanguageToggle />
            </div>
            
            <button 
              onClick={() => handleSectionNavigation('download')}
              className="block py-3 mt-2 mx-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 rounded-full font-semibold text-sm text-center hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
            >
              {t('nav.download')}
            </button>
          </nav>
  </div>
  )}
      </div>
    </header>
  );
};

export default Header;