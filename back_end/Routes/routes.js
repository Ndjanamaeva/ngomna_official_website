//routes.js

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const linkController = require('../controllers/linkController');
const pageController = require('../controllers/pageController');
const textController = require('../controllers/textController'); // Import the text controller
const imageController = require('../controllers/imageController');

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
router.get('/api/links/id/:id', linkController.getLinkById);
router.post('/api/links', linkController.addLink);
router.delete('/api/links/label/:label', linkController.deleteLink);
router.put('/api/links/:id', linkController.updateLink);

// Page Routes
router.get('/api/pages', pageController.getPages);
router.put('/api/:pageId', pageController.updatePage);

// Text Routes
router.get('/api/text/:pageId', textController.getTextByPageId); // Add this route
router.get('/api/text/page/:pageId/section/:section', textController.getTextByPageAndSection); // Get text by page and section
router.get('/api/text/id/:id', textController.getTextById); // Get text by id
router.put('/api/text/:pageId', textController.updateTextByPageId); // Add this route for updating text

// Image Routes
router.get('/api/images/name/:name', imageController.getImageByName);
router.get('/api/images/:id', imageController.getImageById);

module.exports = router;
