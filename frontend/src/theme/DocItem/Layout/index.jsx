import React, { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import { useAuth } from '../../../components/auth/AuthContext'; // Import auth context
import PersonalizationButton from '../../../components/PersonalizationButton'; // Import the personalization button
import DocItem from '@theme-original/DocItem/Layout';
import Chatbot from '../../../components/Chatbot';

export default function DocItemLayout(props) {
  // Check if we're on a docs page that might have sidebar data
  const location = useLocation();
  const isDocsPage = location.pathname.startsWith('/docs/');
  const { user, isAuthenticated } = useAuth(); // Get auth status
  const [userProfile, setUserProfile] = useState(null);
  const [chapterElement, setChapterElement] = useState(null);

  // Get the current document content element
  useEffect(() => {
    // Find the main content area of the document
    const contentElement = document.querySelector('article');
    if (contentElement) {
      setChapterElement(contentElement);
    }
  }, [location.pathname]);

  // Prepare user profile when user is available
  useEffect(() => {
    if (isAuthenticated && user) {
      // Create a user profile object based on user's background
      // The AuthContext provides user with background_profile structure
      const profile = {
        id: user.id || user.user_id || 'unknown',
        knowledge_level: user.knowledgeLevel || user.knowledge_level || user.software_level || user.background_profile?.software_level || 'intermediate', // Default to intermediate
        software_background: user.softwareBackground || user.software_background || user.background_profile?.software_level || user.background_profile?.softwareBackground || 'General software development',
        hardware_background: user.hardwareBackground || user.hardware_background || user.background_profile?.hardware_background || user.background_profile?.hardwareBackground || 'General hardware knowledge',
        profile_complete: !!(
          (profile.knowledge_level && profile.knowledge_level !== 'intermediate') || // Only consider complete if not default
          (user.background_profile?.software_level || user.background_profile?.softwareBackground) ||
          (user.background_profile?.hardware_background || user.background_profile?.hardwareBackground)
        )
      };
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }
  }, [isAuthenticated, user]);

  return (
    <>
      {isDocsPage && (
        <div className="doc-personalization-container" style={{
          marginBottom: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--ifm-toc-border-color)'
        }}>
          <PersonalizationButton
            chapterId={location.pathname}
            chapterElement={chapterElement}
            userProfile={userProfile}
          />
        </div>
      )}
      <DocItem {...props} />
      {isDocsPage && (
        <div className="doc-chatbot-container" style={{
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--ifm-toc-border-color)'
        }}>
          <Chatbot />
        </div>
      )}
    </>
  );
}