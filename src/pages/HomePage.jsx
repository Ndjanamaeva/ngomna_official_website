import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Features from '../components/Features';
import Screenshots from '../components/Screenshots';
import News from '../components/News';
import Comments from '../components/Comments';
import FAQ from '../components/FAQ';
import Download from '../components/Download';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <div id="home">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="screenshots">
        <Screenshots />
      </div>
      <div id="news">
        <News />
      </div>
      <div id="comments">
        <Comments />
      </div>
      <div id="faq">
        <FAQ />
      </div>
      <div id="download">
        <Download />
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
