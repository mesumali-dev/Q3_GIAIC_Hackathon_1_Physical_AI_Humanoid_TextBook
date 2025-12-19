import React, { useEffect, useState } from 'react';
import OriginalNavbar from '@theme-original/Navbar';
import { useAuth } from '@site/src/components/auth/AuthContext';
import Link from '@docusaurus/Link';

const Navbar = (props) => {
  const { user, loading, signOut } = useAuth();
  const [localUser, setLocalUser] = useState(user);

  // Update local state when auth context user changes to ensure re-render
  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Refresh the page to update the navbar state
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Create a custom version of the navbar items with auth-aware items
  // Filter out sign up/sign in when user is logged in, add profile/logout
  const customItems = props.items ? [...props.items] // Create a copy to avoid mutating original
    .filter(item => {
      // Hide sign up and sign in when user is logged in
      if (localUser && (item.label === 'Sign Up' || item.label === 'Sign In')) {
        return false;
      }
      return true;
    }) : [];

  // If user is logged in, add profile and logout links
  if (localUser) {
    // Add profile link
    customItems.push({
      type: 'dropdown',
      label: 'Profile',
      position: 'right',
      items: [
        {
          label: 'View Profile',
          to: '/profile',
        },
        {
          label: 'Logout',
          to: '#',
          onClick: (e) => {
            e.preventDefault();
            handleSignOut();
          }
        }
      ]
    });
  } else {
    // Add sign in/up links when not logged in
    customItems.push({
      type: 'dropdown',
      label: 'Account',
      position: 'right',
      items: [
        {
          label: 'Sign In',
          to: '/auth/signin',
        },
        {
          label: 'Sign Up',
          to: '/auth/signup',
        }
      ]
    });
  }

  return <OriginalNavbar {...props} items={customItems} />;
};

export default Navbar;