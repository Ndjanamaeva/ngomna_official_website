// database.js

const { Sequelize, DataTypes } = require('sequelize');

// Set up Sequelize and PostgreSQL
const sequelize = new Sequelize('ngomna', 'postgres', '12345', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5433
});

// Define the Menu model (menu table)
const Menu = sequelize.define('Menu', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// Define the Page model (page table)
const Page = sequelize.define('Page', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// Define the Section model (sections within pages)
const Section = sequelize.define('Section', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

// Define the Content model (content within sections)
const Content = sequelize.define('Content', {
  type: {
    type: DataTypes.ENUM('text', 'image', 'video', 'link'),
    allowNull: false,
    defaultValue: 'text'
  },
  title_en: {
    type: DataTypes.STRING,
    allowNull: true
  },
  title_fr: {
    type: DataTypes.STRING,
    allowNull: true
  },
  content_en: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content_fr: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  media_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

// Define the MenuItem model (menuitem table)
const MenuItem = sequelize.define('MenuItem', {
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Define the Link model (links table)
const Link = sequelize.define('Link', {
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Page,
      key: 'id'
    }
  }
});

// Define the Text model (text table) - keeping for backward compatibility
const Text = sequelize.define('Text', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  pageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Page,
      key: 'id'
    }
  }
});

// Define the News model for dynamic news management
const News = sequelize.define('News', {
  title_en: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title_fr: {
    type: DataTypes.STRING,
    allowNull: false
  },
  excerpt_en: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  excerpt_fr: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content_en: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content_fr: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category_en: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category_fr: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  external_link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  publish_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Define the Comment model for dynamic comments management
const Comment = sequelize.define('Comment', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment_en: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  comment_fr: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Define relationships
Menu.hasMany(MenuItem, {
  foreignKey: 'menuId',
  as: 'menuItems',
  onDelete: 'CASCADE',
});
MenuItem.belongsTo(Menu, {
  foreignKey: 'menuId',
  as: 'menu',
});

Menu.hasMany(Link, {
  foreignKey: 'menuId',
  as: 'link',
  onDelete: 'CASCADE',
});
Link.belongsTo(Menu, {
  foreignKey: 'menuId',
  as: 'menu',
});

MenuItem.belongsTo(Page, {
  foreignKey: 'pageId',
  as: 'page',
  onDelete: 'CASCADE'
});
Page.hasMany(MenuItem, {
  foreignKey: 'pageId',
  as: 'menuItems',
  onDelete: 'CASCADE'
});

Link.belongsTo(Page, {
  foreignKey: 'pageId',
  as: 'page',
  onDelete: 'CASCADE'
});
Page.hasMany(Link, {
  foreignKey: 'pageId',
  as: 'links',
  onDelete: 'CASCADE'
});

// New relationships for Page -> Section -> Content
Page.hasMany(Section, {
  foreignKey: 'pageId',
  as: 'sections',
  onDelete: 'CASCADE'
});
Section.belongsTo(Page, {
  foreignKey: 'pageId',
  as: 'page'
});

Section.hasMany(Content, {
  foreignKey: 'sectionId',
  as: 'contents',
  onDelete: 'CASCADE'
});
Content.belongsTo(Section, {
  foreignKey: 'sectionId',
  as: 'section'
});

// Keep existing Text relationships for backward compatibility
Text.belongsTo(Page, {
  foreignKey: 'pageId',
  as: 'page',
  onDelete: 'CASCADE'
});
Page.hasMany(Text, {
  foreignKey: 'pageId',
  as: 'texts',
  onDelete: 'CASCADE'
});

// Sync the models with the database and insert sample data
sequelize.sync({ force: true })
  .then(async () => {
    console.log('Database & tables created!');

    // Create pages with sections and content
    const homePageData = {
      name: 'Home',
      url: '/',
      slug: 'home'
    };

    const homePage = await Page.create(homePageData);

    // Create sections for home page
    const homeSections = [
      { name: 'Hero', slug: 'hero', order: 1, pageId: homePage.id },
      { name: 'About', slug: 'about', order: 2, pageId: homePage.id },
      { name: 'Features', slug: 'features', order: 3, pageId: homePage.id },
      { name: 'Screenshots', slug: 'screenshots', order: 4, pageId: homePage.id },
      { name: 'News', slug: 'news', order: 5, pageId: homePage.id },
      { name: 'Comments', slug: 'comments', order: 6, pageId: homePage.id },
      { name: 'FAQ', slug: 'faq', order: 7, pageId: homePage.id },
      { name: 'Download', slug: 'download', order: 8, pageId: homePage.id }
    ];

    const createdHomeSections = await Section.bulkCreate(homeSections);

    // Create other pages
    const pages = await Page.bulkCreate([
      { name: 'Payslips', url: '/payslips', slug: 'payslips' },
      { name: 'Information', url: '/information', slug: 'information' },
      { name: 'Notifications', url: '/notifications', slug: 'notifications' },
      { name: 'Census', url: '/census', slug: 'census' },
      { name: 'Messaging', url: '/messaging', slug: 'messaging' },
      { name: 'Children', url: '/children', slug: 'children' },
      { name: 'Security', url: '/security', slug: 'security' },
      { name: 'OTP', url: '/otp', slug: 'otp' },
      { name: 'DGI', url: '/dgi', slug: 'dgi' },
      { name: 'GOV-AI', url: '/gov-ai', slug: 'gov-ai' },
      { name: 'Mission', url: '/mission', slug: 'mission' },
      { name: 'Vision', url: '/vision', slug: 'vision' },
      { name: 'Perspectives', url: '/perspectives', slug: 'perspectives' },
      { name: 'WhatsApp', url: '/whatsapp', slug: 'whatsapp' },
      { name: 'Email', url: '/email', slug: 'email' },
      { name: 'Facebook', url: '/facebook', slug: 'facebook' }
    ]);

    // Create sections for other pages
    const otherPageSections = [];
    for (const page of pages) {
      const sections = [
        { name: 'Hero', slug: 'hero', order: 1, pageId: page.id },
        { name: 'Features', slug: 'features', order: 2, pageId: page.id },
        { name: 'Benefits', slug: 'benefits', order: 3, pageId: page.id },
        { name: 'CTA', slug: 'cta', order: 4, pageId: page.id }
      ];
      otherPageSections.push(...sections);
    }

    await Section.bulkCreate(otherPageSections);

    // Create sample content for hero sections
    const heroSection = createdHomeSections.find(s => s.slug === 'hero');
    await Content.create({
      type: 'text',
      title_en: 'nGomna',
      title_fr: 'nGomna',
      content_en: 'The citizens closer to government',
      content_fr: 'Les citoyens plus proches du gouvernement',
      order: 1,
      sectionId: heroSection.id
    });

    // Create sample news
    await News.bulkCreate([
      {
        title_en: 'GOV AI: A REVOLUTION FOR CAMEROONIAN PUBLIC ADMINISTRATION',
        title_fr: 'GOV IA : UNE RÉVOLUTION POUR L\'ADMINISTRATION PUBLIQUE CAMEROUNAISE',
        excerpt_en: 'Discover how artificial intelligence transforms Cameroonian public services with revolutionary innovations.',
        excerpt_fr: 'Découvrez comment l\'intelligence artificielle transforme les services publics camerounais avec des innovations révolutionnaires.',
        category_en: 'Innovation',
        category_fr: 'Innovation',
        image_url: '/GOV AI IMAGE 1.jpg',
        external_link: 'https://impactechosnews.com/sago-2025-le-ministere-des-finances-expose-ses-innovations/',
        featured: true,
        publish_date: new Date('2025-01-15')
      },
      {
        title_en: 'nGomna 3.0: Advanced Security Features',
        title_fr: 'nGomna 3.0 : Nouvelles Fonctionnalités de Sécurité Avancées',
        excerpt_en: 'The latest nGomna update introduces revolutionary security features to protect your personal data.',
        excerpt_fr: 'La dernière mise à jour de nGomna introduit des fonctionnalités de sécurité révolutionnaires pour protéger vos données personnelles.',
        category_en: 'Security',
        category_fr: 'Sécurité',
        image_url: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600',
        featured: false,
        publish_date: new Date('2025-01-10')
      }
    ]);

    // Create sample comments
    await Comment.bulkCreate([
      {
        name: 'Vladimir Cruise',
        username: '@vladimir_cruise',
        avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 5,
        comment_en: 'This application is very useful for users as it facilitates access to their payslip regardless of where they are and thus prevents being extorted 1000F outside MINFI.',
        comment_fr: 'Cette application est très utile pour les usagers car elle facilite l\'accès à son bulletin de solde peu importe l\'endroit où on se trouve et empêche ainsi de se faire extorquer 1000F à l\'extérieur du MINFI.',
        verified: true,
        date: new Date('2025-07-14')
      },
      {
        name: 'Freddy Djilo',
        username: '@freddy_djilo',
        avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 5,
        comment_en: 'Hello, dear developers. Your application is a saving solution for users. We (I) recommend it whenever we have the opportunity.',
        comment_fr: 'Bonjour, chers développeurs. Votre application est une solution salvatrice pour les utilisateurs. Nous (je) la recommandons dès que nous en avons l\'occasion.',
        verified: true,
        date: new Date('2024-03-30')
      }
    ]);

    // Add default text entries for backward compatibility
    const texts = await Text.bulkCreate([
      { title: 'Payslips', content: 'Welcome to the Payslips page. Here you can view and manage your payslips securely.', pageId: pages[0].id },
      { title: 'Information', content: 'This is the Information page. Find all the details you need here.', pageId: pages[1].id },
      { title: 'Notifications', content: 'Stay updated with the latest notifications on this page.', pageId: pages[2].id },
      { title: 'Census', content: 'Welcome to the Census page. Manage census data efficiently.', pageId: pages[3].id },
      { title: 'Messaging', content: 'Send and receive messages securely on the Messaging page.', pageId: pages[4].id },
      { title: 'Children', content: 'Manage information about children on this page.', pageId: pages[5].id },
      { title: 'Security', content: 'Learn about security measures and manage your settings here.', pageId: pages[6].id },
      { title: 'OTP', content: 'Generate and manage OTPs securely on this page.', pageId: pages[7].id },
      { title: 'DGI', content: 'Access DGI-related information and resources here.', pageId: pages[8].id },
      { title: 'GOV-AI', content: 'Experience the power of AI-driven government services with our GOV-AI assistant.', pageId: pages[9].id },
      { title: 'Mission', content: 'Learn about our mission and goals on this page.', pageId: pages[10].id },
      { title: 'Vision', content: 'Discover our vision for the future on this page.', pageId: pages[11].id },
      { title: 'Perspectives', content: 'Explore different perspectives and insights here.', pageId: pages[12].id },
      { title: 'WhatsApp', content: 'Connect with us on WhatsApp through this page.', pageId: pages[13].id },
      { title: 'Email', content: 'Reach out to us via email using the information on this page.', pageId: pages[14].id },
      { title: 'Facebook', content: 'Follow us on Facebook for updates and more.', pageId: pages[15].id }
    ]);

    console.log('Text entries created:', texts);

    // Create menus 'features', 'about', and 'contact'
    const featuresMenu = await Menu.create({
      title: 'features'
    });

    const aboutMenu = await Menu.create({
      title: 'about'
    });

    const contactMenu = await Menu.create({
      title: 'contact'
    });

    console.log('Menus created:', { featuresMenu, aboutMenu, contactMenu });

    // Create links
    const links = await Link.bulkCreate([
      { label: 'payslips', menuId: featuresMenu.id, url: '/payslips', pageId: pages[0].id },
      { label: 'information', menuId: featuresMenu.id, url: '/information', pageId: pages[1].id },
      { label: 'notifications', menuId: featuresMenu.id, url: '/notifications', pageId: pages[2].id },
      { label: 'census', menuId: featuresMenu.id, url: '/census', pageId: pages[3].id },
      { label: 'messaging', menuId: featuresMenu.id, url: '/messaging', pageId: pages[4].id },
      { label: 'children', menuId: featuresMenu.id, url: '/children', pageId: pages[5].id },
      { label: 'security', menuId: featuresMenu.id, url: '/security', pageId: pages[6].id },
      { label: 'OTP', menuId: featuresMenu.id, url: '/otp', pageId: pages[7].id },
      { label: 'DGI', menuId: featuresMenu.id, url: '/dgi', pageId: pages[8].id },
      { label: 'GOV-AI', menuId: featuresMenu.id, url: '/gov-ai', pageId: pages[9].id },
      { label: 'mission', menuId: aboutMenu.id, url: '/mission', pageId: pages[10].id },
      { label: 'vision', menuId: aboutMenu.id, url: '/vision', pageId: pages[11].id },
      { label: 'perspectives', menuId: aboutMenu.id, url: '/perspectives', pageId: pages[12].id },
      { label: 'whatsapp', menuId: contactMenu.id, url: '/whatsapp', pageId: pages[13].id },
      { label: 'email', menuId: contactMenu.id, url: '/email', pageId: pages[14].id },
      { label: 'facebook', menuId: contactMenu.id, url: '/facebook', pageId: pages[15].id }
    ]);

    console.log('Links created:', links);

    // Create menu items for the features menu
    const menuItems = await MenuItem.bulkCreate([
      { label: 'payslips', menuId: featuresMenu.id, url: '/payslips', pageId: pages[0].id },
      { label: 'information', menuId: featuresMenu.id, url: '/information', pageId: pages[1].id },
      { label: 'notifications', menuId: featuresMenu.id, url: '/notifications', pageId: pages[2].id },
      { label: 'census', menuId: featuresMenu.id, url: '/census', pageId: pages[3].id },
      { label: 'messaging', menuId: featuresMenu.id, url: '/messaging', pageId: pages[4].id },
      { label: 'children', menuId: featuresMenu.id, url: '/children', pageId: pages[5].id },
      { label: 'security', menuId: featuresMenu.id, url: '/security', pageId: pages[6].id },
      { label: 'OTP', menuId: featuresMenu.id, url: '/OTP', pageId: pages[7].id },
      { label: 'DGI', menuId: featuresMenu.id, url: '/DGI', pageId: pages[8].id },
      { label: 'GOV-AI', menuId: featuresMenu.id, url: '/gov-ai', pageId: pages[9].id },
      { label: 'mission', menuId: aboutMenu.id, url: '/mission', pageId: pages[10].id },
      { label: 'vision', menuId: aboutMenu.id, url: '/vision', pageId: pages[11].id },
      { label: 'perspectives', menuId: aboutMenu.id, url: '/perspectives', pageId: pages[12].id },
      { label: 'whatsapp', menuId: contactMenu.id, url: '/whatsapp', pageId: pages[13].id },
      { label: 'email', menuId: contactMenu.id, url: '/email', pageId: pages[14].id },
      { label: 'facebook', menuId: contactMenu.id, url: '/facebook', pageId: pages[15].id },
    ]);

    console.log('Menu with menu items created:', featuresMenu.toJSON());
    console.log('Menu items created:', menuItems);
  })
  .catch(err => {
    console.error('Unable to create tables:', err);
  });

module.exports = { sequelize, Menu, MenuItem, Page, Section, Content, Link, Text, News, Comment };