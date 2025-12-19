import React from 'react';
import Link from '@docusaurus/Link';
import { useNavbarContext } from '@docusaurus/theme-common';

const AuthLinksNavbarItem = ({ user, onSignOut, ...props }) => {
  return (
    <div className="navbar__item navbar__link" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Link to="/profile" className="navbar__link">
        {user.email.split('@')[0]} {/* Show just the username part */}
      </Link>
      <button
        onClick={onSignOut}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          margin: 0,
          color: 'currentColor',
          textDecoration: 'underline',
          fontSize: 'inherit'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default AuthLinksNavbarItem;