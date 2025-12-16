import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Module 1: Foundational Robotics',
      items: [
        'module1/chapter1',
        'module1/chapter2',
        'module1/chapter3',
        'module1/chapter4',
        'module1/chapter5',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Advanced Simulation & Perception',
      items: [
        'module2/chapter1',
        'module2/chapter2',
        'module2/chapter3',
        'module2/chapter4',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: Embodied Intelligence & Learning',
      items: [
        'module3/chapter1',
        'module3/chapter2',
        'module3/chapter3',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Real-World Integration & Deployment',
      items: [
        'module4/chapter1',
        'module4/chapter2',
        'module4/chapter3',
        'module4/chapter4',
      ],
    },
    {
      type: 'category',
      label: 'Capstone Project',
      items: [
        'capstone/autonomous-humanoid',
      ],
    },
    {
      type: 'category',
      label: 'Appendix',
      items: [
        'appendix/glossary',
        'appendix/troubleshooting',
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  textbookSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Textbook',
      items: ['textbook-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
