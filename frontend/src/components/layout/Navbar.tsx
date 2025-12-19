import React, { useContext } from 'react';
import { useAuth } from '../auth/AuthContext';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

const Navbar = () => {
  const { user, loading } = useAuth();

  return (
    <nav className="navbar navbar--primary">
      <div className="navbar__inner">
        <div className="navbar__items">
          <Link className="navbar__brand" to={useBaseUrl('/')}>
            <span className="navbar__title">Physical AI Humanoid Robotics</span>
          </Link>
          <Link className="navbar__item navbar__link" to={useBaseUrl('/docs/intro')}>
            Textbook
          </Link>
        </div>
        <div className="navbar__items navbar__items--right">
          {!loading && !user && (
            <>
              <Link className="navbar__item navbar__link" to={useBaseUrl('/auth/signup')}>
                Sign Up
              </Link>
              <Link className="navbar__item navbar__link" to={useBaseUrl('/auth/signin')}>
                Sign In
              </Link>
            </>
          )}
          {!loading && user && (
            <>
              <Link className="navbar__item navbar__link" to={useBaseUrl('/profile')}>
                Profile
              </Link>
              <Link className="navbar__item navbar__link" to={useBaseUrl('/api/auth/signout')}>
                Sign Out
              </Link>
            </>
          )}
          <Link
            className="navbar__item navbar__link"
            to="https://github.com/mesumali-dev/Physical-AI-Humanoid-Robotics-TextBook"
          >
            GitHub
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;