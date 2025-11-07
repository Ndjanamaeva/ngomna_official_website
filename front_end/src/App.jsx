import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ScrollProgress from './components/ScrollProgress';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import Payslips from './pages/PayslipsPage';
import Information from './pages/InformationPage';
import Notifications from './pages/NotificationsPage';
import Census from './pages/CensusPage';
import Messaging from './pages/MessagingPage';
import Children from './pages/ChildrenPage';
import Security from './pages/SecurityPage';
import OTP from './pages/OTPPage';
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
        <Route path="/census" element={<Census />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/children" element={<Children />} />
        <Route path="/security" element={<Security />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/dgi" element={<DGI />} />
        <Route path="/gov-ai" element={<GovAI />} />
      </Routes>
    </div>
  );
}

export default App;