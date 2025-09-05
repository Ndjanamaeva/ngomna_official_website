import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/api';
import { useMenus, usePages, useTextContent } from '../hooks/useApi';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Shield,
  MessageSquare,
  Calendar,
  ChevronDown,
  Menu,
  X,
  Home,
  LogOut,
  Save,
  Upload,
  Image,
  Video,
  Type,
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  ChevronRight,
  Copy,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedSection, setSelectedSection] = useState('hero');
  const [contentType, setContentType] = useState('text');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState('');
  const [apiError, setApiError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  // API hooks
  const { data: menus, loading: menusLoading, error: menusError } = useMenus();
  const { data: pages, loading: pagesLoading, error: pagesError } = usePages();
  const { data: textContent, loading: textLoading, error: textError, execute: fetchTextContent } = useTextContent();

  // Mock content data structure
  const [websiteContent, setWebsiteContent] = useState({
    home: {
      hero: {
        title: 'Experience the nGomna Revolution',
        subtitle: 'Transform your mobile experience with our cutting-edge application.',
        buttonText: 'Download Now',
        backgroundImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
      },
      features: {
        title: 'Why Choose nGomna?',
        subtitle: 'Discover the powerful features that make nGomna special.',
        items: [
          { title: 'Lightning Fast', description: 'Experience unprecedented speed' },
          { title: 'Secure & Private', description: 'Your data is protected' }
        ]
      },
      news: {
        title: 'Latest News & Updates',
        subtitle: 'Stay up to date with the latest developments'
      }
    },
    payslips: {
      hero: {
        title: 'Payslips Management',
        subtitle: 'Access, download, and manage your monthly payslips with ease.',
        buttonText: 'Access My Payslips'
      }
    },
    header: {
      logo: '/ngomna_logo.png',
      navigation: ['Features', 'News', 'Reviews', 'FAQ', 'Screenshots', 'Contact']
    },
    footer: {
      description: 'Experience the future of mobile applications with nGomna.',
      copyright: '© 2025 nGomna. All rights reserved.'
    }
  });

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'content', label: 'Content Manager', icon: <FileText size={20} /> },
    { id: 'media', label: 'Media Library', icon: <Image size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  // Icon mapping for dynamic pages
  const getPageIcon = (pageName) => {
    const iconMap = {
      'Payslips': <FileText size={16} />,
      'Information': <Globe size={16} />,
      'Notifications': <Bell size={16} />,
      'Census': <Users size={16} />,
      'Messaging': <MessageSquare size={16} />,
      'Children': <Users size={16} />,
      'Security': <Shield size={16} />,
      'OTP': <Shield size={16} />,
      'DGI': <FileText size={16} />,
      'Mission': <Globe size={16} />,
      'Vision': <Globe size={16} />,
      'Perspectives': <Globe size={16} />,
      'WhatsApp': <MessageSquare size={16} />,
      'Email': <MessageSquare size={16} />,
      'Facebook': <MessageSquare size={16} />
    };
    return iconMap[pageName] || <FileText size={16} />;
  };

  // Fallback page list for when API is not available (only actual pages from backend)
  const fallbackPageList = [
    { id: 'home', label: 'Home Page', icon: <Home size={16} /> },
    { id: 'payslips', label: 'Payslips', icon: <FileText size={16} /> },
    { id: 'information', label: 'Information', icon: <Globe size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'census', label: 'Census', icon: <Users size={16} /> },
    { id: 'messaging', label: 'Messaging', icon: <MessageSquare size={16} /> },
    { id: 'children', label: 'Children', icon: <Users size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'otp', label: 'OTP', icon: <Shield size={16} /> },
    { id: 'dgi', label: 'DGI', icon: <FileText size={16} /> },
    { id: 'gov-ai', label: 'GOV-AI', icon: <MessageSquare size={16} /> },
    { id: 'mission', label: 'Mission', icon: <Globe size={16} /> },
    { id: 'vision', label: 'Vision', icon: <Globe size={16} /> },
    { id: 'perspectives', label: 'Perspectives', icon: <Globe size={16} /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare size={16} /> },
    { id: 'email', label: 'Email', icon: <MessageSquare size={16} /> },
    { id: 'facebook', label: 'Facebook', icon: <MessageSquare size={16} /> }
  ];

  // Transform API pages to match the expected format
  const dynamicPages = pages ? pages.map(page => ({
    id: page.id,
    label: page.name,
    icon: getPageIcon(page.name),
    url: page.url
  })) : fallbackPageList;

  const getSectionsForPage = (pageId) => {
    // Map page IDs to their sections (only actual pages, no header/footer)
    const sections = {
      // Home page (special case)
      'home': ['hero', 'features', 'screenshots', 'news', 'comments', 'faq', 'download'],
      // Dynamic pages from API - using page names as keys
      'Payslips': ['hero', 'features', 'benefits', 'cta'],
      'Information': ['hero', 'features', 'types', 'cta'],
      'Notifications': ['hero', 'features', 'types', 'cta'],
      'Census': ['hero', 'features', 'services', 'cta'],
      'Messaging': ['hero', 'features', 'capabilities', 'cta'],
      'Children': ['hero', 'features', 'services', 'cta'],
      'Security': ['hero', 'features', 'protection', 'cta'],
      'OTP': ['hero', 'features', 'security', 'cta'],
      'DGI': ['hero', 'features', 'services', 'cta'],
      'GOV-AI': ['hero', 'features', 'capabilities', 'cta'],
      'Mission': ['hero', 'features', 'content', 'cta'],
      'Vision': ['hero', 'features', 'content', 'cta'],
      'Perspectives': ['hero', 'features', 'content', 'cta'],
      'WhatsApp': ['hero', 'features', 'integration', 'cta'],
      'Email': ['hero', 'features', 'integration', 'cta'],
      'Facebook': ['hero', 'features', 'integration', 'cta'],
      // Legacy support for old IDs
      'payslips': ['hero', 'features', 'benefits', 'cta'],
      'information': ['hero', 'features', 'types', 'cta'],
      'notifications': ['hero', 'features', 'types', 'cta'],
      'census': ['hero', 'features', 'services', 'cta'],
      'messaging': ['hero', 'features', 'capabilities', 'cta'],
      'children': ['hero', 'features', 'services', 'cta'],
      'security': ['hero', 'features', 'protection', 'cta'],
      'otp': ['hero', 'features', 'security', 'cta'],
      'dgi': ['hero', 'features', 'services', 'cta'],
      'gov-ai': ['hero', 'features', 'capabilities', 'cta'],
      'mission': ['hero', 'features', 'content', 'cta'],
      'vision': ['hero', 'features', 'content', 'cta'],
      'perspectives': ['hero', 'features', 'content', 'cta'],
      'whatsapp': ['hero', 'features', 'integration', 'cta'],
      'email': ['hero', 'features', 'integration', 'cta'],
      'facebook': ['hero', 'features', 'integration', 'cta']
    };
    return sections[pageId] || ['hero'];
  };

  const stats = [
    { 
      title: 'Total Pages', 
      value: pages ? pages.length.toString() : fallbackPageList.length.toString(), 
      change: pagesLoading ? 'Loading...' : 'From API', 
      trend: 'up',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Menus', 
      value: menus ? menus.length.toString() : '0', 
      change: menusLoading ? 'Loading...' : 'From API', 
      trend: 'up',
      icon: <Type className="w-6 h-6" />,
      color: 'from-green-500 to-green-600'
    },
    { 
      title: 'Content Items', 
      value: textContent ? '1' : '0', 
      change: textLoading ? 'Loading...' : 'Current page', 
      trend: 'up',
      icon: <Image className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      title: 'API Status', 
      value: apiError ? 'Error' : 'Connected', 
      change: saveStatus || 'Ready', 
      trend: apiError ? 'down' : 'up',
      icon: <RefreshCw className="w-6 h-6" />,
      color: apiError ? 'from-red-500 to-red-600' : 'from-orange-500 to-orange-600'
    },
  ];

  const handleContentSave = async (contentData) => {
    try {
      setSaveStatus('saving');
      setApiError(null);
      
      // Update text content via API
      await apiService.updateTextByPageId(selectedPage, contentData);
      
      setSaveStatus('saved');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setApiError(error.message);
      setSaveStatus('error');
    }
  };

  const handlePageSelect = async (pageId) => {
    setSelectedPage(pageId);
    setSelectedSection(getSectionsForPage(pageId)[0]);
    
    // Fetch content for the selected page
    try {
      await fetchTextContent(pageId);
    } catch (error) {
      console.error('Error fetching page content:', error);
    }
  };

  // Initialize selected page when pages are loaded
  useEffect(() => {
    if (dynamicPages && dynamicPages.length > 0 && selectedPage === null) {
      setSelectedPage(dynamicPages[0].id);
      setSelectedSection(getSectionsForPage(dynamicPages[0].id)[0]);
    }
  }, [dynamicPages, selectedPage]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle image upload logic
      console.log('Uploading image:', file.name);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveTab('content')}
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Edit className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-medium">Edit Content</span>
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <Upload className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-medium">Upload Media</span>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
              <Eye className="w-5 h-5 text-purple-600" />
              <span className="text-purple-600 font-medium">Preview Site</span>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <span className="text-orange-600 font-medium">View Analytics</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Updated Hero Section', page: 'Home Page', time: '2 minutes ago' },
              { action: 'Added new image', page: 'Media Library', time: '15 minutes ago' },
              { action: 'Modified Footer', page: 'Global', time: '1 hour ago' },
              { action: 'Created new page', page: 'Features', time: '2 hours ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.page} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderContentManager = () => (
    <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Content Manager</h2>
        <div className="flex items-center space-x-3">
          {apiError && (
            <div className="text-red-600 text-sm bg-red-50 px-3 py-1 rounded">
              API Error: {apiError}
            </div>
          )}
          {saveStatus === 'saving' && (
            <div className="text-blue-600 text-sm bg-blue-50 px-3 py-1 rounded">
              Saving...
            </div>
          )}
          {saveStatus === 'saved' && (
            <div className="text-green-600 text-sm bg-green-50 px-3 py-1 rounded">
              Saved successfully!
            </div>
          )}
          <button 
            onClick={() => handleContentSave({ title: 'Test Title', content: 'Test Content' })}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
          <button className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye size={16} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Page & Section Selector */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Page</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {pagesLoading ? (
                <div className="text-center py-4 text-gray-500">Loading pages...</div>
              ) : pagesError ? (
                <div className="text-center py-4 text-red-500">Error loading pages: {pagesError}</div>
              ) : dynamicPages && dynamicPages.length > 0 ? (
                dynamicPages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => handlePageSelect(page.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      selectedPage === page.id 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {page.icon}
                    <span className="font-medium">{page.label}</span>
                  </button>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No pages found</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Section</h3>
            <div className="space-y-2">
              {getSectionsForPage(selectedPage).map((section) => (
                <button
                  key={section}
                  onClick={() => setSelectedSection(section)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    selectedSection === section 
                      ? 'bg-green-50 text-green-600 border border-green-200' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="font-medium capitalize">{section}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit {selectedPage || 'Select a page'} - {selectedSection}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setContentType('text')}
                  className={`p-2 rounded-lg ${contentType === 'text' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Type size={16} />
                </button>
                <button
                  onClick={() => setContentType('image')}
                  className={`p-2 rounded-lg ${contentType === 'image' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Image size={16} />
                </button>
                <button
                  onClick={() => setContentType('video')}
                  className={`p-2 rounded-lg ${contentType === 'video' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Video size={16} />
                </button>
              </div>
            </div>

            {contentType === 'text' && (
              <div className="space-y-4">
                {textLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading content...</div>
                ) : textError ? (
                  <div className="text-center py-8 text-red-500">Error loading content: {textError}</div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter title..."
                        defaultValue={textContent?.title || websiteContent[selectedPage]?.[selectedSection]?.title || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <textarea
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter content..."
                        defaultValue={textContent?.content || websiteContent[selectedPage]?.[selectedSection]?.description || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Page ID</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        value={selectedPage || ''}
                        readOnly
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {contentType === 'image' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload or select an image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Choose Image
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter alt text for accessibility..."
                  />
                </div>
              </div>
            )}

            {contentType === 'video' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload video or enter video URL</p>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors mr-3"
                    >
                      Upload Video
                    </label>
                    <span className="text-gray-500">or</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded-md ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Monitor size={16} />
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`p-2 rounded-md ${previewMode === 'tablet' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Tablet size={16} />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded-md ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Smartphone size={16} />
                </button>
              </div>
            </div>
            
            <div className={`border rounded-lg overflow-hidden ${
              previewMode === 'mobile' ? 'max-w-sm mx-auto' : 
              previewMode === 'tablet' ? 'max-w-md mx-auto' : 'w-full'
            }`}>
              <div className="bg-gray-50 p-4 min-h-64">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {textContent?.title || websiteContent[selectedPage]?.[selectedSection]?.title || 'Sample Title'}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {textContent?.content || websiteContent[selectedPage]?.[selectedSection]?.subtitle || 'Sample content text'}
                  </p>
                  <div className="text-xs text-gray-500 mb-2">
                    Page: {selectedPage || 'None'} | Section: {selectedSection}
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                    {websiteContent[selectedPage]?.[selectedSection]?.buttonText || 'Button'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMediaLibrary = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search media..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Upload size={16} />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 truncate">image-{index + 1}.jpg</p>
            <p className="text-xs text-gray-500">2.4 MB</p>
            <div className="flex items-center justify-between mt-3">
              <button className="text-blue-600 hover:text-blue-700">
                <Eye size={14} />
              </button>
              <button className="text-red-600 hover:text-red-700">
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'content':
        return renderContentManager();
      case 'media':
        return renderMediaLibrary();
      case 'users':
        return (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600">Manage website users and permissions.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">View website analytics and performance metrics.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600">Configure system preferences and settings.</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img src="/ngomna_logo.png" alt="nGomna" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-gray-900">nGomna CMS</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="border-t border-gray-200 pt-4">
            <a 
              href="/"
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Home size={20} />
              <span>Back to Website</span>
            </a>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
                <p className="text-sm text-gray-600">Manage your nGomna website content</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Admin"
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@ngomna.com</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {/* Connection Status Banner */}
          {(apiError || menusError || pagesError) && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-medium">Backend Connection Issues</span>
              </div>
              <p className="text-red-600 text-sm mt-1">
                Make sure the backend server is running on port 5000. 
                {apiError && ` Error: ${apiError}`}
                {menusError && ` Menus Error: ${menusError}`}
                {pagesError && ` Pages Error: ${pagesError}`}
              </p>
            </div>
          )}
          
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;