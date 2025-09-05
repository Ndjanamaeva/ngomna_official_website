//routes.js

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const linkController = require('../controllers/linkController');
const pageController = require('../controllers/pageController');
const mediaController = require('../controllers/mediaController');
const contentController = require('../controllers/contentController');

// Route to get all menus
router.get('/api/menus', menuController.getAllMenus);

// Routes for managing menu items
router.get('/api/menuitems/:menuId', menuController.getAllMenuItemsForMenu);
router.post('/api/menuitems/:menuId', menuController.addMenuItemToMenu);
router.delete('/api/menuitems/label/:label', menuController.deleteMenuItem);
router.put('/api/menuitems/label/:label', menuController.updateMenuItem);

// Link Routes
router.get('/api/links', linkController.getAllLinks);
router.get('/api/links/:menuId', linkController.getLinksByMenuId);
router.post('/api/links', linkController.addLink);
router.delete('/api/links/label/:label', linkController.deleteLink);
router.put('/api/links/:id', linkController.updateLink);

// Page Routes
router.get('/api/pages', pageController.getPages);
router.put('/api/:pageId', pageController.updatePage);

// Text Routes (backward compatibility)
router.get('/api/text/:pageId', mediaController.getTextByPageId);
router.put('/api/text/:pageId', mediaController.updateTextByPageId);

// New Content Management Routes
router.get('/api/pages-with-content', contentController.getAllPagesWithContent);
router.get('/api/pages/:pageId/content', contentController.getPageWithContent);
router.get('/api/sections/:sectionId/content', contentController.getContentBySection);

// Content CRUD
router.post('/api/content', contentController.createContent);
router.put('/api/content/:contentId', contentController.updateContent);
router.delete('/api/content/:contentId', contentController.deleteContent);

// Section CRUD
router.post('/api/sections', contentController.createSection);
router.put('/api/sections/:sectionId', contentController.updateSection);
router.delete('/api/sections/:sectionId', contentController.deleteSection);

// News Routes
router.get('/api/news', contentController.getAllNews);
router.post('/api/news', contentController.createNews);
router.put('/api/news/:newsId', contentController.updateNews);
router.delete('/api/news/:newsId', contentController.deleteNews);

// Comments Routes
router.get('/api/comments', contentController.getAllComments);
router.post('/api/comments', contentController.createComment);
router.put('/api/comments/:commentId', contentController.updateComment);
router.delete('/api/comments/:commentId', contentController.deleteComment);

module.exports = router;