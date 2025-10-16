//service.js

const { MenuItem, Link, Page, Menu, Image, Text } = require('../config/Database');


// Get all menus
exports.getAllMenus = async () => {
  try {
    return await Menu.findAll();
  } catch (error) {
    console.error('Error fetching menus:', error);
    throw new Error('Failed to fetch menus');
  }
};

// Get all menu items for a specific menu
exports.getAllMenuItemsForMenu = async (menuId) => {
  try {
    const menuItems = await MenuItem.findAll({ where: { menuId } });
    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items', error);
    throw new Error('Error fetching menu items');
  }
};

// Add a new menu item to a specific menu and create corresponding link and page
exports.addMenuItemToMenu = async (menuId, label) => {
  try {
    const url = `/${label.toLowerCase().replace(/\s+/g, '-')}`;
    const page = await Page.create({ name: label, url });
    console.log('Page created:', page);

    // Include menuId when creating the link
    const link = await Link.create({ label, url: page.url, pageId: page.id, menuId }); 
    console.log('Link created:', link);

    const menuItem = await MenuItem.create({ menuId, label, url, pageId: page.id });
    console.log('Menu item created:', menuItem);

    return { menuItem, page, link };
  } catch (error) {
    console.error('Error adding menu item, link, and page:', error);
    throw new Error('Failed to add menu item');
  }
};


// Delete a menu item based on its label
exports.deleteMenuItemByLabel = async (label) => {
  try {
    const menuItem = await MenuItem.findOne({ where: { label }, include: [{ model: Page, as: 'page' }] });

    if (!menuItem) return null;

    const link = await Link.findOne({ where: { pageId: menuItem.pageId } });
    if (link) await link.destroy();

    const page = menuItem.page;
    if (page) await page.destroy();

    await menuItem.destroy();
    return true;
  } catch (error) {
    console.error('Error deleting menu item', error);
    throw new Error('Failed to delete menu item');
  }
};

// Update a menu item, link, and page
exports.updateMenuItemAndDependencies = async (oldLabel, newLabel) => {
  try {
    const menuItem = await MenuItem.findOne({ where: { label: oldLabel }, include: [{ model: Page, as: 'page' }] });

    if (!menuItem) return null;

    const page = menuItem.page;
    if (page) {
      page.name = newLabel;
      page.url = `/${newLabel.toLowerCase().replace(/\s+/g, '-')}`;
      await page.save();
    }

    const link = await Link.findOne({ where: { pageId: page.id } });
    if (link) {
      link.label = newLabel;
      link.url = page.url;
      await link.save();
    }

    menuItem.label = newLabel;
    await menuItem.save();

    return { menuItem, page, link };
  } catch (error) {
    console.error('Error updating menu item, link, and page:', error);
    throw new Error('Failed to update menu item');
  }
};


exports.addLink = async (menuId, label) => {
  try {
    const url = `/${label.toLowerCase().replace(/\s+/g, '-')}`;  // Auto-generate URL

    // Create page
    const page = await Page.create({ name: label, url });

    // Create link associated with the page and menu
    const link = await Link.create({ label, menuId, url: page.url, pageId: page.id });

    // Create MenuItem associated with the link and menu, including the url
    const menuItem = await MenuItem.create({ label, menuId, pageId: page.id, url: link.url }); // Include url here

    return { link, menuItem, page };
  } catch (error) {
    console.error('Error adding link, menu item, and page:', error);
    throw new Error('Failed to add link');
  }
};


// Service function to get all links
exports.getAllLinks = async () => {
  try {
    return await Link.findAll(); // Assuming Link is the Sequelize model
  } catch (error) {
    console.error('Error fetching links:', error);
    throw new Error('Failed to fetch links');
  }
};

// Delete a link based on its label
exports.deleteLinkByLabel = async (label) => {
  try {
    const link = await Link.findOne({ where: { label }, include: [{ model: Page, as: 'page' }] });

    if (!link) return null;

    const menuItem = await Link.findOne({ where: { pageId: link.pageId } });
    if (menuItem) await link.destroy();

    const page = link.page;
    if (page) await page.destroy();

    await link.destroy();
    return true;
  } catch (error) {
    console.error('Error deleting link', error);
    throw new Error('Failed to delete link');
  }
};

// service.js

exports.updateLinkAndDependencies = async (id, newLabel, menuId) => {
  try {
    // Find the link associated with the given id
    const link = await Link.findOne({
      where: { id },
      include: [{ model: Page, as: 'page' }]
    });

    if (!link) throw new Error('Link not found');

    // Update the page associated with the link
    const page = link.page;
    page.name = newLabel;
    page.url = `/${newLabel.toLowerCase().replace(/\s+/g, '-')}`; // Re-generate the URL
    await page.save();

    // Update the link associated with the page
    link.label = newLabel;
    link.url = page.url; // Update the link's URL
    await link.save();

    // Optionally update the menu item if required
    const menuItem = await MenuItem.findOne({ where: { pageId: page.id } });
    if (menuItem) {
      menuItem.label = newLabel;
      menuItem.menuId = menuId; // Update the menuId if necessary
      await menuItem.save();
    }

    return { link, menuItem, page };
  } catch (error) {
    console.error('Error updating link, menu item, and page:', error);
    throw new Error('Failed to update link');
  }
};

// Get all links for a specific menuId
exports.getLinksByMenuId = async (menuId) => {
  try {
    // Fetch links based on menuId
    const links = await Link.findAll({
      where: { menuId }
    });
    return links;
  } catch (error) {
    console.error('Error fetching links by menuId:', error);
    throw new Error('Failed to fetch links');
  }
};

// Get a single link by its primary key id
exports.getLinkById = async (id) => {
  try {
    const link = await Link.findByPk(id);
    return link;
  } catch (error) {
    console.error('Error fetching link by id:', error);
    throw new Error('Failed to fetch link');
  }
};

exports.getAllPages = async () => {
  return await Page.findAll();
};

// Get page by id
exports.getPageById = async (id) => {
  try {
    const page = await Page.findByPk(id);
    return page;
  } catch (error) {
    console.error('Error fetching page by id:', error);
    throw new Error('Failed to fetch page');
  }
};

// Get page by URL
exports.getPageByUrl = async (url) => {
  try {
    const page = await Page.findOne({ where: { url } });
    return page;
  } catch (error) {
    console.error('Error fetching page by URL:', error);
    throw new Error('Failed to fetch page');
  }
};

// Get all sections
exports.getAllSections = async () => {
  try {
    const sections = await Page.sequelize.models.Section.findAll();
    return sections;
  } catch (error) {
    console.error('Error fetching sections:', error);
    throw new Error('Failed to fetch sections');
  }
};

// Get section by id
exports.getSectionById = async (id) => {
  try {
    const section = await Page.sequelize.models.Section.findByPk(id);
    return section;
  } catch (error) {
    console.error('Error fetching section by id:', error);
    throw new Error('Failed to fetch section');
  }
};

// Get image by name
exports.getImageByName = async (name) => {
  try {
    const image = await Image.findOne({ where: { name } });
    return image;
  } catch (error) {
    console.error('Error fetching image by name:', error);
    throw new Error('Failed to fetch image');
  }
};

// Get image by id
exports.getImageById = async (id) => {
  try {
    const image = await Image.findByPk(id);
    return image;
  } catch (error) {
    console.error('Error fetching image by id:', error);
    throw new Error('Failed to fetch image');
  }
};

// Get all images
exports.getAllImages = async () => {
  try {
    const images = await Image.findAll();
    return images;
  } catch (error) {
    console.error('Error fetching all images:', error);
    throw new Error('Failed to fetch images');
  }
};

// Get images by section
exports.getImagesBySection = async (sectionId) => {
  try {
    const images = await Image.findAll({ where: { sectionid: sectionId } });
    return images;
  } catch (error) {
    console.error('Error fetching images by section:', error);
    throw new Error('Failed to fetch images');
  }
};

// Get images by page
exports.getImagesByPage = async (pageId) => {
  try {
    const images = await Image.findAll({ where: { pageId } });
    return images;
  } catch (error) {
    console.error('Error fetching images by page:', error);
    throw new Error('Failed to fetch images');
  }
};

// Get text by primary key id
exports.getTextById = async (id) => {
  try {
    const text = await Text.findByPk(id);
    return text;
  } catch (error) {
    console.error('Error fetching text by id:', error);
    throw new Error('Failed to fetch text');
  }
};

exports.updatePage = async (id, data) => {
  const page = await Page.findByPk(id);
  if (page) {
    return await page.update(data);
  }
  return null; // Page not found
};