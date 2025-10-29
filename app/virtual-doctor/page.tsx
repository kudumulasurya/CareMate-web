"use client";

import React, { useState, useEffect, useRef } from "react";
import { sendMessage, getHistory, startNewChat, clearChat } from "@/lib/chat";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHistory().then((data) => {
      if (data && data.messages) setMessages(data.messages);
    });
  }, []);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const res = await sendMessage(input);
    if (res && res.response) {
      setMessages((prev) => [...prev, { role: "assistant", content: res.response }]);
      setInput("");
    }
    setLoading(false);
  }

  async function handleNewChat() {
    await startNewChat();
    setMessages([]);
    setInput("");
  }

  async function handleClear() {
    await clearChat();
    setMessages([]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-pink-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-full glass-effect p-4">
        <div className="mb-8 flex flex-col items-center">
          <div className="text-6xl text-blue-500 mb-2 animate-pulse">
            <i className="fas fa-heartbeat"></i>
          </div>
          <h1 className="font-bold text-xl text-center">MediGenius</h1>
          <span className="text-xs text-gray-400">AI Assistant v3.0</span>
          <button
            onClick={handleNewChat}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center gap-2"
          >
            <i className="fas fa-plus"></i> New Chat
          </button>
        </div>
        {/* Chat history, social links, etc. can be added here */}
      </aside>
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col items-center px-3 py-6">
        {/* Header */}
        <header className="w-full max-w-2xl mb-3 flex items-center justify-between glass-header px-5 py-3 rounded-lg">
          <h2 className="font-bold text-2xl text-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Medical AI Assistant
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              title="Clear conversation"
            >
              <i className="fas fa-trash"></i>
            </button>
            <button
              title="Theme (stub)"
              className="bg-gray-200 px-2 py-1 rounded shadow"
            >
              <i className="fas fa-moon"></i>
            </button>
          </div>
        </header>
        {/* Messages */}
        <div className="flex-1 w-full max-w-2xl overflow-y-auto mb-5 bg-white rounded-lg shadow-lg p-5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center py-10 opacity-60">
              <i className="fas fa-stethoscope text-4xl mb-2"></i>
              <div className="font-bold text-lg mb-2">Welcome to CareMate</div>
              <div className="text-gray-500">Your AI-powered medical assistant is ready to help</div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-3 rounded-lg max-w-xs ${msg.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white text-right"
                    : "bg-gray-100 text-left"
                    }`}
                >
                  <strong>{msg.role === "user" ? "You" : "Bot"}: </strong>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={endRef}></div>
        </div>
        {/* Input */}
        <div className="w-full max-w-2xl flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your medical question..."
            className="border border-gray-400 px-3 py-2 rounded-lg flex-1"
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Sending..." : <i className="fas fa-paper-plane"></i>}
          </button>
        </div>
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <i className="fas fa-info-circle mr-1"></i>
          AI can make mistakes. Always consult healthcare professionals for medical advice.
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
