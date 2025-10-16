import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const DynamicPage = () => {
  const location = useLocation();
  const [page, setPage] = useState(null);
  const [heroContent, setHeroContent] = useState(null);
  const [bodyContent, setBodyContent] = useState([]);
  const [pageImages, setPageImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(false);

      try {
        // Get page by URL
        const pageUrl = location.pathname;
        const pageRes = await axios.get(`http://localhost:5000/api/pages/url/${pageUrl}`);
        const pageData = pageRes.data;
        setPage(pageData);

        // Fetch hero content (page + section 2)
        try {
          const heroRes = await axios.get(`http://localhost:5000/api/text/page/${pageData.id}/section/2`);
          setHeroContent(heroRes.data);
        } catch (err) {
          console.warn('No hero content found for this page');
          setHeroContent(null);
        }

        // Fetch body content (page only, no section)
        try {
          const bodyRes = await axios.get(`http://localhost:5000/api/text/page/${pageData.id}`);
          setBodyContent(Array.isArray(bodyRes.data) ? bodyRes.data : [bodyRes.data]);
        } catch (err) {
          console.warn('No body content found for this page');
          setBodyContent([]);
        }

        // Fetch page images
        try {
          const imagesRes = await axios.get(`http://localhost:5000/api/images/page/${pageData.id}`);
          setPageImages(Array.isArray(imagesRes.data) ? imagesRes.data : []);
        } catch (err) {
          console.warn('No images found for this page');
          setPageImages([]);
        }

      } catch (err) {
        console.error('Error fetching page data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <svg className="animate-spin h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or couldn't be loaded.</p>
          <a href="/" className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      {heroContent && (
        <section className="pt-24 pb-16 bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {heroContent.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8">
                {heroContent.content}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Body Content Section */}
      {bodyContent.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              {bodyContent.map((content, index) => (
                <motion.div
                  key={content.id || index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-8 shadow-sm"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    {content.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {content.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Images Section */}
      {pageImages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageImages.map((image, index) => (
                <motion.div
                  key={image.id || index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <img
                    src={image.url.startsWith('http') ? image.url : `http://localhost:5000${image.url}`}
                    alt={image.name}
                    className="w-full h-64 object-cover"
                  />
                  {image.name && (
                    <div className="p-4 bg-white">
                      <p className="text-sm font-medium text-gray-900">{image.name}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fallback if no content */}
      {!heroContent && bodyContent.length === 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.name}</h1>
            <p className="text-gray-600">Content for this page is being prepared.</p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default DynamicPage;
