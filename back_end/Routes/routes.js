//routes.js

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const linkController = require('../controllers/linkController');
const pageController = require('../controllers/pageController');
const textController = require('../controllers/textController');
const imageController = require('../controllers/imageController');
const sectionController = require('../controllers/sectionController');

// Menu Routes
router.get('/api/menus', menuController.getAllMenus);

// Menu Items Routes
router.get('/api/menuitems/:menuId', menuController.getAllMenuItemsForMenu);
router.post('/api/menuitems/:menuId', menuController.addMenuItemToMenu);
router.delete('/api/menuitems/label/:label', menuController.deleteMenuItem);
router.put('/api/menuitems/label/:label', menuController.updateMenuItem);

// Link Routes
router.get('/api/links', linkController.getAllLinks);
router.get('/api/links/:menuId', linkController.getLinksByMenuId);
router.get('/api/links/id/:id', linkController.getLinkById);
router.post('/api/links', linkController.addLink);
router.delete('/api/links/label/:label', linkController.deleteLink);
router.put('/api/links/:id', linkController.updateLink);

// Page Routes
router.get('/api/pages', pageController.getPages);
router.get('/api/pages/id/:id', pageController.getPageById);
router.get('/api/pages/url/*', pageController.getPageByUrl);
router.put('/api/:pageId', pageController.updatePage);

// Section Routes
router.get('/api/sections', sectionController.getAllSections);
router.get('/api/sections/:id', sectionController.getSectionById);

// Text Routes
router.get('/api/text', textController.getAllTexts);
router.get('/api/text/id/:id', textController.getTextById);
router.get('/api/text/page/:pageId', textController.getTextByPageId);
router.get('/api/text/page/:pageId/section/:section', textController.getTextByPageAndSection);
router.get('/api/text/section/:sectionId', textController.getTextBySection);
router.put('/api/text/:pageId', textController.updateTextByPageId);

// Image Routes
router.get('/api/images', imageController.getAllImages);
router.get('/api/images/id/:id', imageController.getImageById);
router.get('/api/images/name/:name', imageController.getImageByName);
router.get('/api/images/section/:sectionId', imageController.getImagesBySection);
router.get('/api/images/page/:pageId', imageController.getImagesByPage);

module.exports = router;
