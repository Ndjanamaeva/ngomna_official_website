import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ScrollProgress from './components/ScrollProgress';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import Payslips from './pages/PayslipsPage';
import Information from './pages/InformationPage';
import Notifications from './pages/NotificationsPage';
import Messaging from './pages/MessagingPage';
import DGI from './pages/DGIPage';
import GovAI from './pages/GovAIPage';

function App() {
  return (
    <div>
      <ScrollProgress />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/payslips" element={<Payslips />} />
        <Route path="/information" element={<Information />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/dgi" element={<DGI />} />
        <Route path="/gov-ai" element={<GovAI />} />
      </Routes>
    </div>
  );
}

export default App;