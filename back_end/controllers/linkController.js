//linkController.js

const linkService = require('../services/service');

// Get all links
exports.getAllLinks = async (req, res) => {
  try {
    const links = await linkService.getAllLinks();
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching links', error });
  }
};

exports.addLink = async (req, res) => {
  try {
    const { label, menuId } = req.body; // Accept menuId along with label

    if (!label || !menuId) {
      return res.status(400).json({ message: 'Both label and menuId are required' });
    }

    // Call the service to add link, MenuItem, and Page
    const { link, menuItem, page } = await linkService.addLink(menuId, label);

    res.status(201).json({ message: 'Link, MenuItem, and Page created successfully', link, menuItem, page });
  } catch (error) {
    console.error('Error adding link:', error);
    res.status(500).json({ message: 'Error adding link', error: error.message });
  }
};

// Delete a link based on its label
exports.deleteLink = async (req, res) => {
  try {
    const { label } = req.params;  // Using label instead of id
    const result = await linkService.deleteLinkByLabel(label);

    if (!result) {
      return res.status(404).json({ message: 'Link with the specified label not found' });
    }

    res.status(204).send();  // No content response for successful deletion
  } catch (error) {
    res.status(500).json({ message: 'Error deleting link', error });
  }
};

// linkController.js

exports.updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, menuId } = req.body;

    if (!label || !menuId) {
      return res.status(400).json({ message: 'Both label and menuId are required' });
    }

    const { link, menuItem, page } = await linkService.updateLinkAndDependencies(id, label, menuId);

    res.status(200).json({ message: 'Link, MenuItem, and Page updated successfully', link, menuItem, page });
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({ message: 'Error updating link', error: error.message });
  }
};

// Get all links for a specific menu
exports.getLinksByMenuId = async (req, res) => {
  try {
    const { menuId } = req.params;
    const links = await linkService.getLinksByMenuId(menuId);
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching links', error });
  }
};

// Get a single link by its id
exports.getLinkById = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await linkService.getLinkById(id);
    if (!link) return res.status(404).json({ message: 'Link not found' });
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching link by id', error });
  }
};