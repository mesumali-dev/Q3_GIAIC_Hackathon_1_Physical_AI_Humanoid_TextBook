/**
 * Service for communicating with the RAG Chatbot backend API
 */

// Base URL for the backend API - this should be configured based on environment
const API_BASE_URL = typeof window !== 'undefined'
  ? (window.ENV?.REACT_APP_API_BASE_URL || 'https://mesum-ali-physical-ai-humanoid-robotics-textbook.hf.space/api/v1')
  : 'http://localhost:8000/api/v1';

class ChatbotService {
  /**
   * Submit a query to the RAG backend
   * @param {string} question - The user's question
   * @param {string} contextMode - Either "full-book" or "selected-text-only"
   * @param {string} [selectedText] - Optional text that the user has selected (required for selected-text-only mode)
   * @returns {Promise<Object>} The response from the backend
   */
  static async submitQuery(question, contextMode = 'full-book', selectedText = null) {
    try {
      // Validate inputs
      if (!question || typeof question !== 'string' || question.trim().length === 0) {
        throw new Error('Question is required and must be a non-empty string');
      }

      const requestBody = {
        question: question,
        contextMode: contextMode,
      };

      // Only include selectedText if contextMode is "selected-text-only" and text is provided
      if (contextMode === 'selected-text-only' && selectedText) {
        requestBody.selectedText = selectedText;
      }

      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting query:', error);
      // Re-throw with a more user-friendly message if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the AI service. Please check your internet connection and try again.');
      }
      throw error;
    }
  }

  /**
   * Get selected text from the current page
   * @returns {string} The currently selected text, or empty string if none
   */
  static getSelectedText() {
    const selection = window.getSelection();
    return selection ? selection.toString().trim() : '';
  }

  /**
   * Check if text is currently selected on the page
   * @returns {boolean} Whether any text is selected
   */
  static isTextSelected() {
    return this.getSelectedText().length > 0;
  }
}

export default ChatbotService;