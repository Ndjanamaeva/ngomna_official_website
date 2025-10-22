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
  }
});

// Define the MenuItem model (menuitem table)
const MenuItem = sequelize.define('MenuItem', {
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: { // New url column
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

// Define the Text model (text table)
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
  // section column to indicate which section of the page this text belongs to
  section: {
    type: DataTypes.INTEGER,
    allowNull: true
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

// Define the Image model (images table)
const Image = sequelize.define('Image', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // sectionid links the image to a Section (nullable)
  sectionid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // pageId links the image to a Page (nullable)
  pageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Page,
      key: 'id'
    }
  }
});

// Image associations with Section and Page are declared after Section is defined below

// Define the Section model (sections table) - previously named sectiontemplate
const Section = sequelize.define('Section', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'sections'
});

// Now that Section is defined, associate Image with Section and Page
Image.belongsTo(Section, {
  foreignKey: 'sectionid',
  as: 'section',
  onDelete: 'SET NULL'
});
Section.hasMany(Image, {
  foreignKey: 'sectionid',
  as: 'images'
});

Image.belongsTo(Page, {
  foreignKey: 'pageId',
  as: 'page',
  onDelete: 'CASCADE'
});
Page.hasMany(Image, {
  foreignKey: 'pageId',
  as: 'images',
  onDelete: 'CASCADE'
});

// Define the relationships with cascading behavior
Menu.hasMany(MenuItem, {
  foreignKey: 'menuId',
  as: 'menuItems',
  onDelete: 'CASCADE', // Cascade delete for MenuItem when Menu is deleted
});
MenuItem.belongsTo(Menu, {
  foreignKey: 'menuId',
  as: 'menu',
});
Menu.hasMany(Link, {
  foreignKey: 'menuId',
  as: 'link',
  onDelete: 'CASCADE', // Cascade delete for Link when Menu is deleted
});
Link.belongsTo(Menu, {
  foreignKey: 'menuId',
  as: 'menu',
});
MenuItem.belongsTo(Page, {
  foreignKey: 'pageId',
  as: 'page',
  onDelete: 'CASCADE' // Cascade delete for Page when MenuItem is deleted
});
Page.hasMany(MenuItem, {
  foreignKey: 'pageId',
  as: 'menuItems',
  onDelete: 'CASCADE' // Ensure deletion of MenuItems when Page is deleted
});

Link.belongsTo(Page, {
  foreignKey: 'pageId',
  as: 'page',
  onDelete: 'CASCADE' // Cascade delete for Link when Page is deleted
});
Page.hasMany(Link, {
  foreignKey: 'pageId',
  as: 'links',
  onDelete: 'CASCADE' // Cascade delete for Links when Page is deleted
});

// Define the relationship between Text and Page
Text.belongsTo(Page, {
  foreignKey: 'pageId',
  as: 'page',
  onDelete: 'CASCADE' // Cascade delete for Text when Page is deleted
});
Page.hasMany(Text, {
  foreignKey: 'pageId',
  as: 'texts',
  onDelete: 'CASCADE' // Ensure deletion of Texts when Page is deleted
});

// Define the relationship between Text and Section
Text.belongsTo(Section, {
  foreignKey: 'section',
  as: 'sectionData',
  onDelete: 'SET NULL'
});
Section.hasMany(Text, {
  foreignKey: 'section',
  as: 'texts'
});

// Sync the models with the database and insert sample data
sequelize.sync({ force: true }) // This will recreate the tables
  .then(async () => {
    console.log('Database & tables created!');

    // Create pages
    const pages = await Page.bulkCreate([
      { name: 'Payslips', url: '/payslips' },
      { name: 'Information', url: '/information' },
      { name: 'Notifications', url: '/notifications' },
      { name: 'Census', url: '/census' },
      { name: 'Messaging', url: '/messaging' },
      { name: 'Children', url: '/children' },
      { name: 'Security', url: '/security' },
      { name: 'OTP', url: '/otp' },
      { name: 'DGI', url: '/dgi' },
      { name: 'GOV-AI', url: '/gov-ai' },
      { name: 'Mission', url: '/mission' },
      { name: 'Vision', url: '/vision' },
      { name: 'Perspectives', url: '/perspectives' },
      { name: 'WhatsApp', url: '/whatsapp' },
      { name: 'Email', url: '/email' },
      { name: 'Facebook', url: '/facebook' }
    ]);

    console.log('Pages created:', pages);

    // Add default text entries for all pages
    // create sections so hero can reference section id 2
    const sections = await Section.bulkCreate([
      { name: 'header' },
      { name: 'hero' },
      { name: 'about_ngomna' }
    ]);

    const texts = await Text.bulkCreate([
      // Shared header text (not tied to any specific page, only to header section)
      { title: 'nGomna', content: 'Bringing citizens closer to government', section: sections[0].id },

      // Hero section texts for each page (associated with both page and hero section)
      { title: 'nGomna', content: 'the citizens closer to the government', pageId: 1, section: sections[1].id },
      { title: 'Payslips', content: 'Manage and view your payslips securely', pageId: pages[0].id, section: sections[1].id },
      { title: 'Information', content: 'Access all the information you need', pageId: pages[1].id, section: sections[1].id },
      { title: 'Notifications', content: 'Stay updated with the latest alerts', pageId: pages[2].id, section: sections[1].id },
      { title: 'Census', content: 'Manage census data efficiently', pageId: pages[3].id, section: sections[1].id },
      { title: 'Messaging', content: 'Secure messaging for government services', pageId: pages[4].id, section: sections[1].id },
      { title: 'Children', content: 'Manage children information safely', pageId: pages[5].id, section: sections[1].id },
      { title: 'Security', content: 'Your security is our priority', pageId: pages[6].id, section: sections[1].id },
      { title: 'OTP', content: 'Secure one-time password generation', pageId: pages[7].id, section: sections[1].id },
      { title: 'DGI', content: 'Tax information and services', pageId: pages[8].id, section: sections[1].id },
      { title: 'GOV-AI', content: 'AI-powered government assistance', pageId: pages[9].id, section: sections[1].id },
      { title: 'Mission', content: 'Our commitment to serving you', pageId: pages[10].id, section: sections[1].id },
      { title: 'Vision', content: 'Building the future of digital governance', pageId: pages[11].id, section: sections[1].id },
      { title: 'Perspectives', content: 'Insights and future outlook', pageId: pages[12].id, section: sections[1].id },
      { title: 'WhatsApp', content: 'Connect with us on WhatsApp', pageId: pages[13].id, section: sections[1].id },
      { title: 'Email', content: 'Reach us via email', pageId: pages[14].id, section: sections[1].id },
      { title: 'Facebook', content: 'Follow us on Facebook', pageId: pages[15].id, section: sections[1].id },

      // Page body content (main content sections - no section ID, just pageId)
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
  ,
  // About nGomna section texts (section: about_ngomna -> sections[2].id)
  { title: 'about.description', content: 'nGomna is a cutting-edge mobile application developed in partnership with government institutions to provide citizens with seamless access to essential services. From payslips to official documents, we\'re transforming how you interact with government services.', section: sections[2].id },
  { title: 'vision.point1', content: 'Bring Cameroonian public servants closer to government services', section: sections[2].id },
  { title: 'vision.point2', content: 'Bring ordinary citizens closer to government services', section: sections[2].id },
  { title: 'vision.point3', content: 'Foundational building block of e-citizenship', section: sections[2].id },
  { title: 'vision.point4', content: 'Protection of the identity and data of public servants', section: sections[2].id },
  { title: 'mission.point1', content: 'Download payslips via account using internet-connected phone', section: sections[2].id },
  { title: 'mission.point2', content: 'Display real-time notifications and payslip status updates', section: sections[2].id },
  { title: 'mission.point3', content: 'Protect data of every user registered in the system', section: sections[2].id },
  { title: 'mission.point4', content: 'Support for account reset, installation assistance, and bug tracking', section: sections[2].id },
  { title: 'future.description', content: 'Expanding our platform with new services to enhance digital sovereignty and secure communications', section: sections[2].id },
  { title: 'future.service1.title', content: 'Government Messaging', section: sections[2].id },
  { title: 'future.service1.description', content: 'Secure communications between public servants, reducing reliance on external platforms', section: sections[2].id },
  { title: 'future.service2.title', content: 'E-Services Integration', section: sections[2].id },
  { title: 'future.service2.description', content: 'Comprehensive digital services platform for all government interactions', section: sections[2].id },
  { title: 'future.service3.title', content: 'Data Sovereignty', section: sections[2].id },
  { title: 'future.service3.description', content: 'State control over citizen data with advanced security measures', section: sections[2].id }
    ]);

    console.log('Text entries created:', texts);

    // Create menu 'features'
    const featuresMenu = await Menu.create({
      title: 'features'
    });

    console.log('Menu created:', featuresMenu);

    // Create links for features menu only
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
      { label: 'GOV-AI', menuId: featuresMenu.id, url: '/gov-ai', pageId: pages[9].id }
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
      { label: 'GOV-AI', menuId: featuresMenu.id, url: '/gov-ai', pageId: pages[9].id }
    ]);

    console.log('Menu with menu items created:', featuresMenu.toJSON());
    console.log('Menu items created:', menuItems);
    // Create image entries with sectionid and pageId
    const images = await Image.bulkCreate([
      { name: 'ngomna_logo', url: '/ngomna_logo.png', sectionid: 1, pageId: 1 },
      { name: 'phone_image', url: '/phone_image.png', sectionid: 2, pageId: 1 }
    ]);

    console.log('Images created:', images);
  })
  .catch(err => {
    console.error('Unable to create tables:', err);
  });

module.exports = { sequelize, Menu, MenuItem, Page, Link, Text, Image, Section };
