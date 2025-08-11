"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getUIText } from "@/libs/uiTranslations";
import ChatMessage from "./ChatMessage";


export default function AIAssistant({ menuData, currentLanguage = 'bg' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [typingMessage, setTypingMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { restaurant } = menuData;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Simple, fast typewriter effect
  const typeMessage = useCallback((fullText, messageId, isWelcome = false) => {
    setTypingMessage({ id: messageId, content: '', timestamp: new Date() });
    
    let currentIndex = 0;
    const typingSpeed = 15; // Fast, consistent speed
    
    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypingMessage(prev => ({
          ...prev,
          content: fullText.substring(0, currentIndex + 1)
        }));
        currentIndex++;
        scrollToBottom();
      } else {
        // Typing complete
        clearInterval(typeInterval);
        
        const finalMessage = {
          id: messageId,
          type: 'ai',
          content: fullText,
          timestamp: new Date()
        };
        
        if (isWelcome) {
          setMessages([finalMessage]);
        } else {
          setMessages(prev => [...prev, finalMessage]);
        }
        
        setTypingMessage(null);
      }
    }, typingSpeed);
  }, [scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize with welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0 && !typingMessage) {
      const welcomeText = getUIText('aiWelcome', currentLanguage).replace('{restaurantName}', restaurant.name);
      typeMessage(welcomeText, Date.now(), true);
    }
  }, [isOpen, messages.length, currentLanguage, restaurant.name, typingMessage, typeMessage]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          menuData,
          currentLanguage
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Use typing animation for AI response
        typeMessage(data.response, Date.now() + 1);
        setRecommendations(data.recommendations || []);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Use typing animation for error message too
      typeMessage(getUIText('aiError', currentLanguage), Date.now() + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setRecommendations([]);
    setTypingMessage(null);
    // Re-add welcome message with typing animation
    const welcomeText = getUIText('aiWelcome', currentLanguage).replace('{restaurantName}', restaurant.name);
    setTimeout(() => typeMessage(welcomeText, Date.now(), true), 100);
  };

  const suggestedQuestions = [
    getUIText('aiSuggestion1', currentLanguage),
    getUIText('aiSuggestion2', currentLanguage),
    getUIText('aiSuggestion3', currentLanguage),
    getUIText('aiSuggestion4', currentLanguage),
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary btn-circle btn-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
          title={getUIText('aiAssistant', currentLanguage)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 group-hover:scale-110 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden transform transition-all duration-200 ease-out">
        {/* Header */}
        <div className="bg-primary text-primary-content p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-content/20 rounded-full flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">{getUIText('aiAssistant', currentLanguage)}</h3>
              <p className="text-xs opacity-80">{getUIText('aiSubtitle', currentLanguage)}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={clearChat}
              className="btn btn-ghost btn-xs text-primary-content/80 hover:text-primary-content"
              title={getUIText('clearChat', currentLanguage)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-xs text-primary-content/80 hover:text-primary-content"
              title={getUIText('close', currentLanguage)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              currentLanguage={currentLanguage}
            />
          ))}
          
          {/* Typing Animation */}
          {typingMessage && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 bg-base-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-primary" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                  </svg>
                </div>
                <div className="bg-base-200 rounded-2xl px-4 py-3 flex-1">
                  <p className="text-sm whitespace-pre-wrap text-base-content">
                    {typingMessage.content}
                    <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse"></span>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isLoading && !typingMessage && (
            <div className="flex justify-start">
              <div className="bg-base-200 rounded-2xl px-4 py-3 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <div className="loading loading-dots loading-sm"></div>
                  <span className="text-sm text-base-content/70">
                    {getUIText('aiThinking', currentLanguage)}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="border-t border-base-300 p-4 max-h-48 overflow-y-auto">
            <h4 className="font-semibold text-sm mb-3 text-base-content/80">
              {getUIText('recommendations', currentLanguage)}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {recommendations.map((product) => (
                <div key={product._id} className="bg-base-50 rounded-lg p-3 border border-base-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{product.name}</h5>
                      {product.description && (
                        <p className="text-xs text-base-content/60 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        {product.isVegetarian && (
                          <span className="badge badge-success badge-xs">🌱</span>
                        )}
                        {product.isVegan && (
                          <span className="badge badge-success badge-xs">🌿</span>
                        )}
                        {product.isSpicy && (
                          <span className="badge badge-warning badge-xs">🌶️</span>
                        )}
                      </div>
                    </div>
                    <div className="text-primary font-semibold text-sm ml-2">
                      {product.priceBGN.toFixed(2)} лв
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Questions (show when no messages except welcome) */}
        {messages.length <= 1 && !typingMessage && (
          <div className="border-t border-base-300 p-4">
            <p className="text-xs text-base-content/60 mb-3">
              {getUIText('aiSuggestedQuestions', currentLanguage)}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="text-left text-xs bg-base-200 hover:bg-base-300 rounded-lg p-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-base-300 p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getUIText('aiPlaceholder', currentLanguage)}
              className="input input-bordered input-sm flex-1 transition-all duration-200"
              disabled={isLoading || !!typingMessage}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || !!typingMessage}
              className="btn btn-primary btn-sm transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
