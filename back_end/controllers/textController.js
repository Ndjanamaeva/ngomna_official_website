const { Text } = require('../config/Database');

// Fetch all text entries by pageId (body content without section)
exports.getTextByPageId = async (req, res) => {
  try {
    const { pageId } = req.params;
    const texts = await Text.findAll({ where: { pageId, section: null } });

    if (!texts || texts.length === 0) {
      return res.status(404).json({ message: 'Text not found' });
    }

    res.json(texts);
  } catch (error) {
    console.error('Error fetching text:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update text by pageId
exports.updateTextByPageId = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { title, content } = req.body;
    const text = await Text.findOne({ where: { pageId } });
    if (!text) {
      return res.status(404).json({ message: 'Text not found' });
    }
    text.title = title;
    text.content = content;
    await text.save();
    res.json(text);
  } catch (error) {
    console.error('Error updating text:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch text by its primary key id
exports.getTextById = async (req, res) => {
  try {
    const { id } = req.params;
    const text = await Text.findByPk(id);

    if (!text) {
      return res.status(404).json({ message: 'Text not found' });
    }

    res.json(text);
  } catch (error) {
    console.error('Error fetching text by id:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch text by pageId and section
exports.getTextByPageAndSection = async (req, res) => {
  try {
    const { pageId, section } = req.params;
    const text = await Text.findOne({ where: { pageId, section } });

    if (!text) {
      return res.status(404).json({ message: 'Text not found for that page/section' });
    }

    res.json(text);
  } catch (error) {
    console.error('Error fetching text by page and section:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all text entries by section only (for shared content like header)
exports.getTextBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const texts = await Text.findAll({ where: { section: sectionId } });

    if (!texts || texts.length === 0) {
      return res.status(404).json({ message: 'Text not found for that section' });
    }

    res.json(texts);
  } catch (error) {
    console.error('Error fetching text by section:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all text entries
exports.getAllTexts = async (req, res) => {
  try {
    const texts = await Text.findAll();
    res.json(texts);
  } catch (error) {
    console.error('Error fetching all texts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};