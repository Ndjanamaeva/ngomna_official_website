const { Page, Section, Content, News, Comment } = require('../config/Database');

// Get all pages with their sections and content
exports.getAllPagesWithContent = async (req, res) => {
  try {
    const pages = await Page.findAll({
      include: [
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Content,
              as: 'contents',
              order: [['order', 'ASC']]
            }
          ],
          order: [['order', 'ASC']]
        }
      ],
      order: [['id', 'ASC']]
    });

    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages with content:', error);
    res.status(500).json({ message: 'Error fetching pages with content', error: error.message });
  }
};

// Get a specific page with its sections and content
exports.getPageWithContent = async (req, res) => {
  try {
    const { pageId } = req.params;
    
    const page = await Page.findByPk(pageId, {
      include: [
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Content,
              as: 'contents',
              order: [['order', 'ASC']]
            }
          ],
          order: [['order', 'ASC']]
        }
      ]
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    console.error('Error fetching page with content:', error);
    res.status(500).json({ message: 'Error fetching page with content', error: error.message });
  }
};

// Get content by section
exports.getContentBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    
    const contents = await Content.findAll({
      where: { sectionId },
      order: [['order', 'ASC']]
    });

    res.json(contents);
  } catch (error) {
    console.error('Error fetching content by section:', error);
    res.status(500).json({ message: 'Error fetching content by section', error: error.message });
  }
};

// Create new content
exports.createContent = async (req, res) => {
  try {
    const { sectionId, type, title_en, title_fr, content_en, content_fr, media_url, order } = req.body;

    const content = await Content.create({
      sectionId,
      type,
      title_en,
      title_fr,
      content_en,
      content_fr,
      media_url,
      order: order || 0
    });

    res.status(201).json(content);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ message: 'Error creating content', error: error.message });
  }
};

// Update content
exports.updateContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { type, title_en, title_fr, content_en, content_fr, media_url, order } = req.body;

    const content = await Content.findByPk(contentId);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    await content.update({
      type,
      title_en,
      title_fr,
      content_en,
      content_fr,
      media_url,
      order
    });

    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'Error updating content', error: error.message });
  }
};

// Delete content
exports.deleteContent = async (req, res) => {
  try {
    const { contentId } = req.params;

    const content = await Content.findByPk(contentId);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    await content.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: 'Error deleting content', error: error.message });
  }
};

// Create new section
exports.createSection = async (req, res) => {
  try {
    const { pageId, name, slug, order } = req.body;

    const section = await Section.create({
      pageId,
      name,
      slug,
      order: order || 0
    });

    res.status(201).json(section);
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ message: 'Error creating section', error: error.message });
  }
};

// Update section
exports.updateSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { name, slug, order } = req.body;

    const section = await Section.findByPk(sectionId);
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    await section.update({
      name,
      slug,
      order
    });

    res.json(section);
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ message: 'Error updating section', error: error.message });
  }
};

// Delete section
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const section = await Section.findByPk(sectionId);
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    await section.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ message: 'Error deleting section', error: error.message });
  }
};

// News management
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.findAll({
      where: { published: true },
      order: [['publish_date', 'DESC']]
    });

    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const newsData = req.body;
    const news = await News.create(newsData);
    res.status(201).json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Error creating news', error: error.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const newsData = req.body;

    const news = await News.findByPk(newsId);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    await news.update(newsData);
    res.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Error updating news', error: error.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { newsId } = req.params;

    const news = await News.findByPk(newsId);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    await news.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Error deleting news', error: error.message });
  }
};

// Comments management
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { published: true },
      order: [['date', 'DESC']]
    });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const commentData = req.body;
    const comment = await Comment.create(commentData);
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const commentData = req.body;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.update(commentData);
    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};