import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useThemeConfig } from '@docusaurus/theme-common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'; // For email icon

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
  const { copyright, links } = footer || {};

  if (!footer) {
    return null;
  }

  // Define social links with icons
  const socialLinks = [
    {
      label: 'GitHub (Textbook)',
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
      label: 'Author\'s Portfolio',
      href: 'https://mesumdev.vercel.app/',
      icon: faEnvelope, // Using envelope for portfolio as a generic "contact me"
    },
    {
      label: 'Contact (Email)',
      href: 'mailto:s.mesumali99@gmail.com',
      icon: faEnvelope,
    },
  ];

  return (
    <footer
      className={clsx('footer', {
        'footer--dark': footer.style === 'dark',
      })}>
      <div className="container container-fluid">
        {links && links.length > 0 && (
          <div className="row footer__links">
            {links.map((linkItem, i) => (
              <div key={i} className="col footer__col">
                {linkItem.title != null ? (
                  <div className="footer__title">{linkItem.title}</div>
                ) : null}
                {linkItem.items != null &&
                Array.isArray(linkItem.items) &&
                linkItem.items.length > 0 ? (
                  <ul className="footer__items">
                    {linkItem.items.map((item, key) =>
                      item.html ? (
                        <li
                          key={key}
                          className="footer__item" // Developer provided the HTML, so assume it's safe.
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={{ __html: item.html }}
                        />
                      ) : (
                        <li key={item.href || item.to} className="footer__item">
                          <FooterLink {...item} />
                        </li>
                      ),
                    )}
                  </ul>
                ) : null}
              </div>
            ))}
            {/* Social Media Icons Section */}
            <div className="col footer__col">
              <div className="footer__title">Connect</div>
              <ul className="footer__items social-icons">
                {socialLinks.map((link, i) => (
                  <li key={i} className="footer__item">
                    <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                      <FontAwesomeIcon icon={link.icon} size="lg" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {copyright && (
          <div className="footer__bottom text--center">
            {/* Developer provided the HTML, so assume it's safe. */}
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: copyright }} />
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
