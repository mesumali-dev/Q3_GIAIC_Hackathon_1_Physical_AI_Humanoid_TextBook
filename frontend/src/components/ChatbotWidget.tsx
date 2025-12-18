import React, { useState, useRef, useEffect } from 'react';
import ChatbotService from '../services/ChatbotService';
import '../css/chatbot-stylish.css';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contextMode, setContextMode] = useState('full-book');
  const [selectedText, setSelectedText] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, loading]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessageText = input.trim();
    const userMessage = {
      id: Date.now(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      let finalSelectedText = selectedText;
      if (contextMode === 'selected-text-only' && !selectedText) {
        finalSelectedText = ChatbotService.getSelectedText();
        if (!finalSelectedText) {
          throw new Error('Please select text on the page first, or switch to "Full Book" mode.');
        }
        setSelectedText(finalSelectedText);
      }

      const result = await ChatbotService.submitQuery(
        userMessageText,
        contextMode,
        finalSelectedText
      );

      const botMessage = {
        id: Date.now() + 1,
        text: result.answer || 'Sorry, I could not find an answer.',
        sender: 'bot',
        timestamp: new Date(),
        sources: result.sourceCitations || []
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        text: err.message || 'An error occurred.',
        sender: 'bot',
        timestamp: new Date(),
        error: true
      };
      setMessages((prev) => [...prev, errorMsg]);
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(null);
    }
  };

  const captureSelectedText = () => {
    if (contextMode === 'selected-text-only') {
      const text = ChatbotService.getSelectedText();
      if (text) setSelectedText(text);
    }
  };
  
  useEffect(() => {
    const handleSelection = () => setTimeout(captureSelectedText, 10);
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, [contextMode]);
  
  const clearChat = () => setMessages([]);
  const handleContextModeChange = (mode) => setContextMode(mode);
  const toggleChatbot = () => setIsOpen(!isOpen);

  return (
    <div className="chatbot-container">
      <div className={`chatbot-window ${isOpen ? 'open' : 'closed'}`}>
        <div className="chatbot-header">
          <h3>AI Book Assistant</h3>
          <div className="header-buttons">
            <button className="clear-chat-btn" onClick={clearChat} title="Clear Chat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
            <button className="chatbot-close-btn" onClick={toggleChatbot}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="chatbot-messages">
          {messages.length === 0 && (
            <div className="welcome-message">
                <h4>Hi! I'm your AI Book Assistant.</h4>
                <p>Ask me anything about the book content.</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender} ${msg.error ? 'error' : ''}`}>
              <div className="message-content">
                {msg.text}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="message-sources">
                    <details>
                      <summary>Sources ({msg.sources.length})</summary>
                      <ul>
                        {msg.sources.map((source, index) => (
                          <li key={index}>
                            <a href={source.url} target="_blank" rel="noopener noreferrer">{source.section}</a>
                            <p>"{source.excerpt}"</p>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-message bot">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-footer">
            <div className="context-mode-selector">
                <button 
                    className={`context-btn ${contextMode === 'full-book' ? 'active' : ''}`}
                    onClick={() => handleContextModeChange('full-book')}>
                    Full Book
                </button>
                <button 
                    className={`context-btn ${contextMode === 'selected-text-only' ? 'active' : ''}`}
                    onClick={() => handleContextModeChange('selected-text-only')}>
                    Selected Text
                </button>
            </div>

            <div className="chatbot-input-area">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                rows={1}
                disabled={loading}
              />
              <button onClick={handleSubmit} className="chatbot-send-btn" title="Send" disabled={loading || !input.trim()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      <button className="chatbot-toggler" onClick={toggleChatbot}>
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatbotWidget;