import React from 'react';
import NavbarItem from '@theme-original/NavbarItem';
import AuthLinksNavbarItem from './NavbarItemAuthLinks';

const CustomNavbarItem = (props) => {
  // Handle our custom auth links type
  if (props.type === 'custom-auth-links') {
    return <AuthLinksNavbarItem user={props.user} onSignOut={props.onSignOut} />;
  }

  return <NavbarItem {...props} />;
};

export default CustomNavbarItem;