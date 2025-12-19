import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Physical AI and Humanoid Robotics',
  tagline: 'Empowering the next generation of intelligent machines: A comprehensive guide to Physical AI and Humanoid Robotics, covering everything from foundational concepts to real-world deployment.',
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/mesumali-dev/Physical-AI-Humanoid-Robotics-TextBook',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/mesumali-dev/Physical-AI-Humanoid-Robotics-TextBook',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html'],
        redirects: [
          {
            to: '/auth/signup',
            from: ['/signup', '/register'],
          },
          {
            to: '/auth/signin',
            from: ['/signin', '/login'],
          },
        ],
      },
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI Humanoid Robotics',
      logo: {
        alt: 'Square Box Logo',
        src: 'img/square-box-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Textbook',
        },
        {
          to: '/auth/signup',
          label: 'Sign Up',
          position: 'right',
        },
        {
          to: '/auth/signin',
          label: 'Sign In',
          position: 'right',
        },
        {
          href: 'https://github.com/mesumali-dev/Physical-AI-Humanoid-Robotics-TextBook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Resources',
          items: [
            {
              label: 'Textbook Overview',
              to: '/docs/intro',
            },
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
          title: 'Community',
          items: [
            {
              label: 'GitHub (Textbook)',
              href: 'https://github.com/mesumali-dev/Physical-AI-Humanoid-Robotics-TextBook',
            },
            {
              label: 'Author\'s GitHub',
              href: 'https://github.com/mesumali-dev',
            },
            {
              label: 'Author\'s LinkedIn',
              href: 'https://www.linkedin.com/in/mesumali-dev/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Author\'s Portfolio',
              href: 'https://mesumdev.vercel.app/',
            },
            {
              label: 'Contact (Email)',
              href: 'mailto:s.mesumali99@gmail.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built by Syed Mesum Ali Shah with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
