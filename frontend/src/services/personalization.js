/**
 * Service for handling chapter content personalization
 */

class PersonalizationService {
  constructor() {
    // Get API base URL from environment or use default
    // For Docusaurus, we need to make sure the API URL is correctly set
    // Check if running in browser environment to avoid SSR issues
    let envApiBaseUrl;

    // Try to get from environment variables (works in both server and client)
    try {
      // In Docusaurus, environment variables are typically accessed differently
      // Check for process.env first, but handle if it's not available
      if (typeof process !== 'undefined' && process.env) {
        envApiBaseUrl = process.env.REACT_APP_API_BASE_URL;
      }
    } catch (e) {
      // If process is not defined, envApiBaseUrl remains undefined
      envApiBaseUrl = undefined;
    }

    if (typeof window !== 'undefined') {
      // Browser environment
      this.apiBaseUrl = envApiBaseUrl ||
                       (window.location.hostname === 'localhost'
                        ? 'http://localhost:8000'
                        : window.location.origin);
    } else {
      // Server environment
      this.apiBaseUrl = envApiBaseUrl || 'http://localhost:8000';
    }
    this.personalizationEndpoint = `${this.apiBaseUrl}/api/personalization/chapter`;
  }

  /**
   * Extract content from a chapter page
   * @param {HTMLElement} chapterElement - The chapter container element
   * @returns {Object} Structure containing chapter content with preserved formatting
   */
  extractChapterContent(chapterElement) {
    if (!chapterElement) {
      throw new Error('Chapter element is required for content extraction');
    }

    const contentStructure = {
      title: '',
      headings: [],
      paragraphs: [],
      lists: [],
      codeBlocks: [],
      otherElements: []
    };

    // Extract title (first h1 or page title)
    const titleElement = chapterElement.querySelector('h1') || document.querySelector('title');
    if (titleElement) {
      contentStructure.title = titleElement.textContent || titleElement.innerText;
    }

    // Extract all headings with hierarchy
    const headingSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    headingSelectors.forEach(selector => {
      const headings = chapterElement.querySelectorAll(selector);
      headings.forEach(heading => {
        contentStructure.headings.push({
          level: selector.replace('h', ''),
          text: heading.textContent,
          id: heading.id || ''
        });
      });
    });

    // Extract paragraphs
    const paragraphs = chapterElement.querySelectorAll('p');
    paragraphs.forEach(p => {
      contentStructure.paragraphs.push(p.textContent);
    });

    // Extract lists
    const lists = chapterElement.querySelectorAll('ul, ol');
    lists.forEach(list => {
      const items = Array.from(list.querySelectorAll('li')).map(li => li.textContent);
      contentStructure.lists.push({
        type: list.tagName.toLowerCase(),
        items: items
      });
    });

    // Extract code blocks
    const codeBlocks = chapterElement.querySelectorAll('pre code');
    codeBlocks.forEach(code => {
      contentStructure.codeBlocks.push({
        language: code.className || '',
        content: code.textContent
      });
    });

    // Store other content elements separately
    const otherElements = chapterElement.querySelectorAll('div, section, article');
    otherElements.forEach(el => {
      if (el.children.length > 0) {
        // Only store elements that have children and aren't already captured
        contentStructure.otherElements.push({
          tag: el.tagName.toLowerCase(),
          content: el.innerHTML,
          className: el.className
        });
      }
    });

    return contentStructure;
  }

  /**
   * Personalize chapter content using the backend API
   * @param {string} chapterContent - The chapter content to personalize
   * @param {string} chapterTitle - Title of the chapter
   * @param {Object} userProfile - User's profile information
   * @returns {Promise<Object>} Personalized content response
   */
  async personalizeChapter(chapterContent, chapterTitle, userProfile) {
    // Check if running in browser environment to avoid SSR issues
    if (typeof window === 'undefined') {
      throw new Error('Personalization is only available in browser environment');
    }

    try {
      const response = await fetch(this.personalizationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request for Better Auth
        body: JSON.stringify({
          chapter_content: chapterContent,
          chapter_title: chapterTitle,
          user_profile: userProfile
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error personalizing chapter:', error);
      throw error;
    }
  }

  /**
   * Toggle between original and personalized content
   * @param {string} originalContent - Original chapter content
   * @param {string} personalizedContent - Personalized chapter content
   * @param {boolean} showPersonalized - Whether to show personalized content
   * @returns {string} The content to display
   */
  toggleContent(originalContent, personalizedContent, showPersonalized) {
    return showPersonalized ? personalizedContent : originalContent;
  }

  /**
   * Get authentication token from storage
   * @returns {string|null} Auth token or null if not available
   */
  getAuthToken() {
    // Check if running in browser environment to avoid SSR issues
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return null;
    }

    // Better Auth typically stores session information in cookies
    // Try to get the session token from cookies first
    // Better Auth may use different cookie names depending on configuration
    const cookies = document.cookie.split(';');
    const possibleCookieNames = [
      'better-auth.session_token',
      'better-auth.session',
      'authjs.session-token',
      'session',
      '__Secure-authjs.session-token'
    ];

    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      for (const possibleName of possibleCookieNames) {
        if (name === possibleName && value) {
          return value;
        }
      }
    }
    // Fallback to localStorage for compatibility
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Whether user is authenticated
   */
  isAuthenticated() {
    // Check if running in browser environment to avoid SSR issues
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }

    // Check for Better Auth session cookie
    // Better Auth may use different cookie names depending on configuration
    const cookies = document.cookie.split(';');
    const possibleCookieNames = [
      'better-auth.session_token',
      'better-auth.session',
      'authjs.session-token',
      'session',
      '__Secure-authjs.session-token'
    ];

    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      for (const possibleName of possibleCookieNames) {
        if (name === possibleName && value) {
          return true;
        }
      }
    }
    // Fallback to checking stored auth token
    return !!this.getAuthToken();
  }

  /**
   * Cache personalized content in session storage
   * @param {string} chapterId - Unique identifier for the chapter
   * @param {Object} content - Personalized content to cache
   */
  cachePersonalizedContent(chapterId, content) {
    if (typeof Storage !== 'undefined') {
      const cacheKey = `personalized_content_${chapterId}`;
      sessionStorage.setItem(cacheKey, JSON.stringify({
        content: content,
        timestamp: Date.now()
      }));
    }
  }

  /**
   * Get cached personalized content
   * @param {string} chapterId - Unique identifier for the chapter
   * @returns {Object|null} Cached content or null if not available/cached
   */
  getCachedPersonalizedContent(chapterId) {
    if (typeof Storage !== 'undefined') {
      const cacheKey = `personalized_content_${chapterId}`;
      const cachedData = sessionStorage.getItem(cacheKey);

      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        // Check if cache is still valid (e.g., less than 1 hour old)
        const cacheDuration = 60 * 60 * 1000; // 1 hour in milliseconds
        if (Date.now() - parsed.timestamp < cacheDuration) {
          return parsed.content;
        } else {
          // Clear expired cache
          sessionStorage.removeItem(cacheKey);
        }
      }
    }
    return null;
  }

  /**
   * Clear cached personalized content for a chapter
   * @param {string} chapterId - Unique identifier for the chapter
   */
  clearCachedContent(chapterId) {
    if (typeof Storage !== 'undefined') {
      const cacheKey = `personalized_content_${chapterId}`;
      sessionStorage.removeItem(cacheKey);
    }
  }
}

// Export singleton instance
export const personalizationService = new PersonalizationService();
export default PersonalizationService;