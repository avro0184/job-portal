"use client";
import React, { useState } from "react";
import axios from "axios";
import { IoMdChatbubbles, IoMdClose } from "react-icons/io";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("http://127.0.0.1:8000/chatbot/qa/", {
        query: input,
      });
      const botMsg = { sender: "bot", text: res.data.answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Try again." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="relative flex flex-col items-end">
      {/* Toggle Button */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        >
          <IoMdChatbubbles size={28} />
        </button>
      ) : (
        <div className="w-80 h-[500px] bg-white dark:bg-gray-900 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <span className="font-semibold text-sm tracking-wide">
              AmarProsno AI 🤖
            </span>
            <button
              onClick={() => setOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition"
            >
              <IoMdClose size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-gray-50 dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            {messages.length === 0 && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 ">
                👋 Start a conversation with AmarProsno AI
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t dark:border-gray-700 bg-gray-100 dark:bg-gray-900 flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask AmarProsno AI..."
            />
            <button
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm hover:scale-105 transition-transform"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
