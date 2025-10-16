const service = require('../services/service');

// Get all sections
exports.getAllSections = async (req, res) => {
  try {
    const sections = await service.getAllSections();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sections', error });
  }
};

// Get section by ID
exports.getSectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await service.getSectionById(id);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching section', error });
  }
};
