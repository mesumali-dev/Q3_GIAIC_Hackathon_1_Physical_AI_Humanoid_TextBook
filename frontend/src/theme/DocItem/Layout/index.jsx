import React from 'react';
import { useLocation } from '@docusaurus/router';
import DocItem from '@theme-original/DocItem/Layout';
import Chatbot from '../../../components/Chatbot';

export default function DocItemLayout(props) {
  // Check if we're on a docs page that might have sidebar data
  const location = useLocation();
  const isDocsPage = location.pathname.startsWith('/docs/');

  return (
    <>
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