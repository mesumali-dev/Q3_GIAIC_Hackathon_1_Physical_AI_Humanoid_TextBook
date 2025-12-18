// Frontend configuration for Docusaurus
// This file would typically be docusaurus.config.js or docusaurus.config.ts
// For now, we'll create a basic config structure

module.exports = {
  // Site configuration
  title: 'Physical AI Textbook',
  tagline: 'Interactive documentation with AI-powered search and Q&A',
  url: 'https://yourusername.github.io',
  baseUrl: '/',
  organizationName: 'your-organization',
  projectName: 'book-docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  // Themes and presets
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/your-username/book-docs/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themes: [
    // Additional themes can be added here
  ],

  plugins: [
    // Add any additional plugins needed for the chatbot integration
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      favicon: 'img/favicon.svg',
      navbar: {
        title: 'Physical AI Textbook',
        logo: {
          alt: 'Physical AI Textbook Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Content',
          },
          {
            type: 'dropdown',
            label: 'Modules',
            position: 'left',
            items: [
              {
                label: 'Module 1: Foundational Robotics',
                to: '/docs/module1/chapter1',
              },
              {
                label: 'Module 2: Advanced Simulation & Perception',
                to: '/docs/module2/chapter1',
              },
              {
                label: 'Module 3: Embodied Intelligence & Learning',
                to: '/docs/module3/chapter1',
              },
              {
                label: 'Module 4: Real-World Integration & Deployment',
                to: '/docs/module4/chapter1',
              },
            ],
          },
          {
            href: 'https://github.com/your-username/book-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: require('prism-react-renderer').themes.github,
        darkTheme: require('prism-react-renderer').themes.dracula,
      },
    }),
};