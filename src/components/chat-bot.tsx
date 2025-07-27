import React, { useEffect, useRef, useState } from "react";
import { FaCircleQuestion, FaXmark } from "react-icons/fa6";
import { FaArrowRight, FaMicrophone } from "react-icons/fa";
import { apiProxyRequest } from "../lib/api-client-proxy";
import type { Language, LanguageData } from "../types/chapter-contents";
import { useChatPanelStore } from "../store/chatStore";

import ModeSelect from "./select-dropdown/chat-mode-select";
import LanguageSelect from "./select-dropdown/langauage-select";

interface ChatMessage {
  question?: string;
  answer?: string;
}


export default function Chatbot() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { queryInput, toggle, isOpen, setQueryInput, clearInput } =
    useChatPanelStore();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const payload = {};
        const response = await apiProxyRequest<LanguageData, typeof payload>(
          "POST",
          "Content/getLanguages",
          payload
        );
        if (response?.languages) {
          setLanguages(response.languages);
          console.log(languages);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchLanguages();
  }, []);

  // Handle #chatbot route + back navigation
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== "#chatbot" && isOpen) {
        toggle(); // Close chatbot if hash is removed
      }
    };

    if (isOpen) {
      if (window.location.hash !== "#chatbot") {
        window.history.pushState(null, "", "#chatbot");
      }
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, toggle]);

  const handleToggle = () => {
    if (isOpen) {
      // Going from open → close
      if (window.location.hash === "#chatbot") {
        window.history.back(); // Remove #chatbot from URL
      } else {
        toggle(); // Just close if no hash
      }
    } else {
      toggle(); // Open and handled in useEffect
    }
  };
  const handleSend = async () => {
    if (!queryInput.trim()) return;

    setChatHistory((prev) => [...prev, { question: queryInput }]);
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);

    setLoading(true);
    setHasStarted(true);

    const payload = { prompt: queryInput };

    try {
      const response = await apiProxyRequest<string[], typeof payload>(
        "POST",
        "ChatGPT/SendPromptQuery",
        payload
      );

      setChatHistory((prev) => [
        ...prev,
        {
          answer: response.join("\n") ?? "No answer received.",
        },
      ]);

      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 100);

      clearInput();
    } catch (error) {
      console.error("Chat request failed:", error);
    } finally {
      setLoading(false);
    }
  };


  return (

    <div className="chatbot-wrapper" id="chatbot">
      <div
        className={`chat-box transition-all duration-300 bg-white shadow-lg ${isOpen ? "!visible" : "invisible"
          }`}
      >
        <div className="chat-box-header py-2 px-4 flex justify-between items-center border-b">
          <div className="flex gap-2 items-center">
            <img
              src="/ai-tutor-1.webp"
              alt=""
              width={30}
              height={20}
            />
            <h3 className="text-lg font-semibold">
              Ask <span style={{ color: "rgb(237 129 51)" }}>Pad</span>
              <span style={{ color: "rgb(33 140 118)" }}>AI</span>
            </h3>
          </div>

          <div className="flex gap-2 mt-4 items-center justify-end">
            <div className="flex items-center justify-end" style={{zoom:0.75}}>
              <LanguageSelect />
              <span className="mr-2"></span>
              <ModeSelect />
            </div>

            <button
              onClick={handleToggle}
              className="close-chat-btn"
            >
              <FaXmark />
            </button>
          </div>
        </div>

        <div className="chat-content" ref={chatRef}>
          {!hasStarted && <>{/* You can add default example Q&A here */}</>}

          {chatHistory.map((msg, i) => (
            <React.Fragment key={i}>
              {msg.question && (
                <div className="question-bubble">
                  <div className="question-header">
                    <div className="question-icon">
                      <FaCircleQuestion />
                    </div>
                    <div className="question-label">You</div>
                  </div>
                  <div className="question-text">{msg.question}</div>
                </div>
              )}
              {msg.answer && (
                <div className="answer-bubble">
                  <div className="answer-content">
                    <div className="answer-icon">
                      <img src="/assets/svg/ai-white.svg" className="w-75" alt="AI" width={24} height={24} />
                    </div>
                    <div className="answer-text">{msg.answer}</div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {loading && (
            <div className="typing-indicator">
              <span className="me-2 text-[#646363]">AI Buddy is typing</span>
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          )}
        </div>
        <div className="chat-input-area">
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              value={queryInput}
              placeholder="Ask a question..."
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
              style={{ paddingRight: "90px" }}
            />
            <div className="sidebar-icon micro-adjust">
              <FaMicrophone />
            </div>
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={loading}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
