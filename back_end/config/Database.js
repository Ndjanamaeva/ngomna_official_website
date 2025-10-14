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
  }
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
    // Create image entries
    const images = await Image.bulkCreate([
      { name: 'ngomna_logo', url: '/ngomna_logo.png' }
    ]);

    console.log('Images created:', images);
  })
  .catch(err => {
    console.error('Unable to create tables:', err);
  });

module.exports = { sequelize, Menu, MenuItem, Page, Link, Text, Image };
