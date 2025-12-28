import React, { useState, useEffect, useRef } from 'react';
import { personalizationService } from '../services/personalization';

/**
 * PersonalizationButton Component
 * Allows users to personalize chapter content based on their knowledge level
 */
const PersonalizationButton = ({ chapterId, chapterElement, userProfile }) => {
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [originalContent, setOriginalContent] = useState(null);
  const [personalizedContent, setPersonalizedContent] = useState(null);
  const [error, setError] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [viewMode, setViewMode] = useState('original'); // 'original' or 'personalized'
  const chapterRef = useRef(null);

  // Always show the button - no authentication required
  useEffect(() => {
    setShowButton(true);
  }, []);

  // Handle personalization request
  const handlePersonalize = async () => {
    let targetElement = chapterElement;

    // If no chapterElement was passed in, try to find it dynamically
    if (!targetElement) {
      targetElement = document.querySelector('article');
      if (!targetElement) {
        setError('Unable to find chapter content to personalize');
        return;
      }
    }

    // Use effective user profile (either provided or default)
    if (!effectiveUserProfile) {
      setError('User profile is required for personalization');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Extract current content from the chapter
      const contentStructure = personalizationService.extractChapterContent(targetElement);
      const chapterContent = JSON.stringify(contentStructure);

      // Check if we have cached content
      const cachedContent = personalizationService.getCachedPersonalizedContent(chapterId);
      if (cachedContent) {
        setPersonalizedContent(cachedContent.personalized_content);
        setViewMode('personalized');
        setIsPersonalized(true);
        setIsLoading(false);
        // Update the DOM with cached content
        updateChapterContent(targetElement, cachedContent.personalized_content);
        return;
      }

      // Call the personalization API
      const response = await personalizationService.personalizeChapter(
        chapterContent,
        contentStructure.title,
        effectiveUserProfile
      );

      // Cache the personalized content
      personalizationService.cachePersonalizedContent(chapterId, response);

      setPersonalizedContent(response.personalized_content);
      setViewMode('personalized');
      setIsPersonalized(true);

      // Update the DOM with personalized content
      updateChapterContent(targetElement, response.personalized_content);
    } catch (err) {
      console.error('Personalization error:', err);
      setError(`Failed to personalize content: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Update chapter content in the DOM
  const updateChapterContent = (targetElement, newContent) => {
    if (targetElement && newContent) {
      try {
        // For a more sophisticated implementation, we would parse the structured content
        // and rebuild the DOM while preserving the original structure
        targetElement.innerHTML = newContent;
      } catch (err) {
        console.error('Error updating chapter content:', err);
      }
    }
  };

  // Handle toggling between original and personalized content
  const handleToggle = () => {
    let targetElement = chapterElement;
    if (!targetElement) {
      targetElement = document.querySelector('article');
      if (!targetElement) {
        setError('Unable to find chapter content to toggle');
        return;
      }
    }

    if (!originalContent) {
      // Save original content if not already saved
      setOriginalContent(targetElement.innerHTML);
    }

    const newViewMode = viewMode === 'original' ? 'personalized' : 'original';
    setViewMode(newViewMode);
    setIsPersonalized(newViewMode === 'personalized');

    if (newViewMode === 'personalized' && personalizedContent) {
      updateChapterContent(targetElement, personalizedContent);
    } else if (originalContent) {
      updateChapterContent(targetElement, originalContent);
    }
  };

  // Reset personalization and clear cache
  const handleReset = () => {
    let targetElement = chapterElement;
    if (!targetElement) {
      targetElement = document.querySelector('article');
      if (!targetElement) {
        setError('Unable to find chapter content to reset');
        return;
      }
    }

    if (originalContent) {
      updateChapterContent(targetElement, originalContent);
      setViewMode('original');
      setIsPersonalized(false);
      setPersonalizedContent(null);
      personalizationService.clearCachedContent(chapterId);
    }
  };

  // Always show personalization controls - no authentication required
  // Use default user profile if none provided
  const hasUserProfile = !!userProfile;
  const effectiveUserProfile = userProfile || {
    id: 'guest',
    knowledge_level: 'intermediate',
    software_background: 'General software development',
    hardware_background: 'General hardware knowledge',
    profile_complete: true
  };

  return (
    <div className="personalization-controls">
      {error && (
        <div className="personalization-error" style={{
          color: 'red',
          marginBottom: '10px',
          padding: '8px',
          backgroundColor: '#ffe6e6',
          border: '1px solid #ffcccc',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {/* Show personalization controls - works for all users */}
      <>
        {isLoading ? (
          <button className="personalize-btn loading" disabled style={{
            backgroundColor: '#ccc',
            cursor: 'not-allowed'
          }}>
            Personalizing...
          </button>
        ) : viewMode === 'personalized' ? (
          <button
            className="personalize-btn toggle"
            onClick={handleToggle}
            title="Switch back to original content"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '14px',
              margin: '4px 2px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Show Original Content
          </button>
        ) : (
          <button
            className="personalize-btn"
            onClick={handlePersonalize}
            title="Personalize this chapter based on your profile"
            style={{
              backgroundColor: '#008CBA',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '14px',
              margin: '4px 2px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Personalize This Chapter
          </button>
        )}

        {viewMode === 'personalized' && (
          <button
            className="reset-btn"
            onClick={handleReset}
            title="Reset to original content"
            style={{
              marginLeft: '10px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '12px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Reset
          </button>
        )}

        {viewMode === 'personalized' && (
          <div className="personalization-status" style={{
            fontSize: '0.8em',
            color: '#666',
            marginTop: '5px',
            fontStyle: 'italic',
            marginLeft: '10px'
          }}>
            Content adapted for {hasUserProfile ? effectiveUserProfile?.knowledge_level || 'your' : 'intermediate'} level
          </div>
        )}

        {/* Add toggle button for easier switching */}
        {isPersonalized && (
          <button
            className="toggle-btn"
            onClick={handleToggle}
            title="Toggle between original and personalized content"
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              fontSize: '0.9em',
              backgroundColor: '#e7e7e7',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {viewMode === 'original' ? 'Show Personalized' : 'Show Original'}
          </button>
        )}
      </>
    </div>
  );
};

export default PersonalizationButton;