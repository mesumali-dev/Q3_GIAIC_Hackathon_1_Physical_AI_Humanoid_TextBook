import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useThemeConfig } from '@docusaurus/theme-common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faSun, faLightbulb, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

function FooterLink({ to, href, label, prependBaseUrlToHref, ...props }) {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();
  const toUrl = prependBaseUrlToHref && href ? baseUrl + href : href;
  return (
    <a
      className="footer__link-item"
      {...(href
        ? {
            href: toUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
          }
        : {
            to,
          })}
      {...props}>
      {label}
    </a>
  );
}

const Footer = () => {
  const { footer } = useThemeConfig();
  const { copyright } = footer || {};

  if (!footer) {
    return null;
  }

  // Define social links with icons
  const socialLinks = [
    {
      label: 'GitHub Repository',
      href: 'https://github.com/mesumali-dev/Physical-AI-Humanoid-Robotics-TextBook',
      icon: faGithub,
    },
    {
      label: 'Author\'s GitHub',
      href: 'https://github.com/mesumali-dev',
      icon: faGithub,
    },
    {
      label: 'Author\'s LinkedIn',
      href: 'https://www.linkedin.com/in/mesumali-dev/',
      icon: faLinkedin,
    },
    {
      label: 'X (Twitter)',
      href: 'https://twitter.com',
      icon: faXTwitter,
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com',
      icon: faYoutube,
    },
  ];

  // Define quick links
  const quickLinks = [
    {
      title: 'Resources',
      items: [
        { label: 'Documentation', href: '/docs/intro' },
        { label: 'Tutorials', href: '/docs/tutorial-basics/congratulations' },
        { label: 'API Reference', href: '/docs/api' },
        { label: 'Examples', href: '/docs/examples' },
      ],
    },
    {
      title: 'Community',
      items: [
        { label: 'GitHub Discussions', href: 'https://github.com/mesumali-dev/Physical-AI-Humanoid-Robotics-TextBook/discussions' },
        { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/docusaurus' },
        { label: 'Discord', href: '#' },
        { label: 'Twitter', href: 'https://twitter.com' },
      ],
    },
    {
      title: 'More',
      items: [
        { label: 'Blog', href: '/blog' },
        { label: 'GitHub', href: 'https://github.com/mesumali-dev/Physical-AI-Humanoid-Robotics-TextBook' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  ];

  return (
    <footer>
      {/* Main footer content */}
      <div className="footer__main-content">
          <div className="footer__inner">
            {/* Logo and description section */}
            <div className="footer__col footer__col--first">
              <div className="footer__logo-section">
                <div className="footer__logo-icon">
                  <img src="/img/square-box-logo.svg" alt="Square Box Logo" className="footer-logo-img" />
                </div>
                <div className="footer__logo-text">
                  <h3 className="footer__title">AI & Robotics Textbook</h3>
                  <p className="footer__description">
                    Illuminating the future of AI and Robotics
                  </p>
                </div>
              </div>
            </div>

            {/* Quick links sections */}
            <div className="footer__col footer__col--links">
              {quickLinks.map((section, index) => (
                <div key={index} className="footer__item-col">
                  <h4 className="footer__item-title">{section.title}</h4>
                  <ul className="footer__items">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="footer__item">
                        <a
                          href={item.href}
                          className="footer__link-item"
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Contact and social section */}
            <div className="footer__col footer__col--contact">
              <h4 className="footer__item-title">Connect With Us</h4>
              <div className="footer__contact-info">
                <a
                  href="mailto:s.mesumali99@gmail.com"
                  className="footer__contact-link"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="footer__contact-icon" />
                  <span>Email Us</span>
                </a>
              </div>

              <div className="footer__social-section">
                <h5 className="footer__social-title">Follow Us</h5>
                <ul className="footer__social-icons">
                  {socialLinks.map((link, index) => (
                    <li key={index} className="footer__social-item">
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="footer__social-link"
                      >
                        <FontAwesomeIcon icon={link.icon} size="lg" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="footer__divider"></div>

      {/* Bottom section with copyright */}
      <div className="footer__bottom">
          <div className="footer__bottom-content">
            {copyright && (
              <div className="footer__copyright">
                <div dangerouslySetInnerHTML={{ __html: copyright }} />
              </div>
            )}
            <div className="footer__bottom-links">
              <a href="/privacy" className="footer__bottom-link">Privacy Policy</a>
              <a href="/terms" className="footer__bottom-link">Terms of Service</a>
              <a href="/cookies" className="footer__bottom-link">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
