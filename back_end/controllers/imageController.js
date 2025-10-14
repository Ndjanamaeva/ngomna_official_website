const service = require('../services/service');

exports.getImageByName = async (req, res) => {
  try {
    const { name } = req.params;
    const image = await service.getImageByName(name);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching image', error });
  }
};

exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await service.getImageById(id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching image by id', error });
  }
};
