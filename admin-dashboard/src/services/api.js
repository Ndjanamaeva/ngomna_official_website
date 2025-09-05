const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  // Content Management endpoints
  async getAllPagesWithContent() {
    return this.request('/pages-with-content');
  }

  async getPageWithContent(pageId) {
    return this.request(`/pages/${pageId}/content`);
  }

  async getContentBySection(sectionId) {
    return this.request(`/sections/${sectionId}/content`);
  }

  async createContent(contentData) {
    return this.request('/content', {
      method: 'POST',
      body: JSON.stringify(contentData),
    });
  }

  async updateContent(contentId, contentData) {
    return this.request(`/content/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
  }

  async deleteContent(contentId) {
    return this.request(`/content/${contentId}`, {
      method: 'DELETE',
    });
  }

  async createSection(sectionData) {
    return this.request('/sections', {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
  }

  async updateSection(sectionId, sectionData) {
    return this.request(`/sections/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify(sectionData),
    });
  }

  async deleteSection(sectionId) {
    return this.request(`/sections/${sectionId}`, {
      method: 'DELETE',
    });
  }

  // News endpoints
  async getAllNews() {
    return this.request('/news');
  }

  async createNews(newsData) {
    return this.request('/news', {
      method: 'POST',
      body: JSON.stringify(newsData),
    });
  }

  async updateNews(newsId, newsData) {
    return this.request(`/news/${newsId}`, {
      method: 'PUT',
      body: JSON.stringify(newsData),
    });
  }

  async deleteNews(newsId) {
    return this.request(`/news/${newsId}`, {
      method: 'DELETE',
    });
  }

  // Comments endpoints
  async getAllComments() {
    return this.request('/comments');
  }

  async createComment(commentData) {
    return this.request('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async updateComment(commentId, commentData) {
    return this.request(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(commentData),
    });
  }

  async deleteComment(commentId) {
    return this.request(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Menu endpoints (existing)
  async getMenus() {
    return this.request('/menus');
  }

  async getMenuItems(menuId) {
    return this.request(`/menuitems/${menuId}`);
  }

  async addMenuItem(menuId, label) {
    return this.request(`/menuitems/${menuId}`, {
      method: 'POST',
      body: JSON.stringify({ label }),
    });
  }

  async updateMenuItem(label, newLabel) {
    return this.request(`/menuitems/label/${label}`, {
      method: 'PUT',
      body: JSON.stringify({ label: newLabel }),
    });
  }

  async deleteMenuItem(label) {
    return this.request(`/menuitems/label/${label}`, {
      method: 'DELETE',
    });
  }

  // Page endpoints (existing)
  async getPages() {
    return this.request('/pages');
  }

  async updatePage(pageId, data) {
    return this.request(`/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Text content endpoints (existing - backward compatibility)
  async getTextByPageId(pageId) {
    return this.request(`/text/${pageId}`);
  }

  async updateTextByPageId(pageId, data) {
    return this.request(`/text/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Link endpoints (existing)
  async getLinks() {
    return this.request('/links');
  }

  async getLinksByMenuId(menuId) {
    return this.request(`/links/${menuId}`);
  }

  async addLink(data) {
    return this.request('/links', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLink(id, data) {
    return this.request(`/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLink(label) {
    return this.request(`/links/label/${label}`, {
      method: 'DELETE',
    });
  }
}

const apiService = new ApiService();
export default apiService;