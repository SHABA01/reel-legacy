/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Drawer } from '../ui/Drawer';
import { useOverlay } from '../../context/OverlayContext';
import { Sparkles, Send, Brain, Bot, HelpCircle, ArrowRight } from 'lucide-react';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export function AIAssistantOverlay() {
  const { activeOverlay, closeOverlay } = useOverlay();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! I'm your ReelLegacy Documentary Assistant. I can help you outline biography chapters, write narrator script cards, structure your chronological timeline, or analyze raw media files for visual narrative gaps. What story are we capturing today?",
      time: '12:30 PM',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isOpen = activeOverlay === 'ai';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const quickPrompts = [
    'Help outline Grandpa’s childhood chapter',
    'Draft narration script for the wedding scene',
    'Review my media library for gaps',
    'List cinematic templates fitting a memoir theme',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    if (!textToSend) {
      setInputVal('');
    }

    const newMsg: Message = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    // Mock response after 1.5s
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That's an incredible story angle. Based on our design standards, I'd recommend matching this childhood chapter with the 'Nostalgic Super-8 Film' cinematic layout style.",
        "Beautiful script draft. I have mapped out a voice narration timeline spanning 38 seconds. I've flagged a visual gap during the middle 10 seconds: consider uploading a photo from this period.",
        "Excellent context. I've updated the draft metadata of 'The Silver Lining of 1972'. It is ready to be loaded into the Narration Studio for active voice recording.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: randomResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  return (
    <Drawer
      id="ai-assistant-drawer"
      isOpen={isOpen}
      onClose={closeOverlay}
      title="ReelLegacy AI Storyteller"
      position="right"
      size="md"
    >
      <div id="ai-assistant-wrapper" className="flex flex-col h-full -mx-6 -my-4 text-foreground">
        {/* Helper Top Bar */}
        <div id="ai-topbar" className="bg-gradient-to-r from-cinema-ai/10 via-purple-500/10 to-transparent p-4 border-b border-border shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2" id="ai-topbar-info">
            <Brain className="w-5 h-5 text-cinema-ai animate-pulse shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Intelligent Director Active</p>
              <p className="text-[10px] text-muted-foreground">Preserving memories with cinematic structure</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold text-cinema-ai tracking-widest bg-cinema-ai/10 dark:bg-cinema-ai/20 px-2 py-0.5 rounded">
            Gemini 2.5
          </span>
        </div>

        {/* Chat Thread */}
        <div ref={scrollRef} id="ai-chat-thread" className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              id={`ai-message-${idx}`}
              className={`flex flex-col max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div className="flex items-center gap-1 mb-1" id={`ai-message-${idx}-meta`}>
                {msg.sender === 'assistant' && <Bot className="w-3.5 h-3.5 text-cinema-ai shrink-0" />}
                <span className="text-[10px] text-muted-foreground font-mono">{msg.time}</span>
              </div>
              <div
                id={`ai-message-${idx}-bubble`}
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none shadow-sm'
                    : 'bg-muted text-foreground rounded-tl-none border border-border'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div id="ai-typing-indicator" className="mr-auto items-start max-w-[85%] flex flex-col">
              <div className="flex items-center gap-1 mb-1">
                <Bot className="w-3.5 h-3.5 text-cinema-ai shrink-0" />
                <span className="text-[10px] text-muted-foreground font-mono">Writing...</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-muted border border-border rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-cinema-ai rounded-full animate-bounce shrink-0" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-cinema-ai rounded-full animate-bounce shrink-0" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-cinema-ai rounded-full animate-bounce shrink-0" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick Action prompts */}
        <div id="ai-prompts" className="p-4 border-t border-border shrink-0 bg-muted/30">
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-2.5 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Prompt Guidelines
          </p>
          <div className="flex flex-wrap gap-1.5" id="ai-prompt-chips">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                id={`ai-prompt-${idx}`}
                onClick={() => handleSend(prompt)}
                className="text-[11px] text-foreground/80 bg-muted hover:bg-muted/80 px-2.5 py-1.5 rounded-lg transition-colors border border-border/40 font-medium cursor-pointer flex items-center"
              >
                {prompt}
                <ArrowRight className="w-3 h-3 ml-1 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Footer */}
        <div id="ai-input-wrapper" className="p-4 border-t border-border shrink-0 flex items-center gap-2 bg-card">
          <input
            id="ai-text-input"
            type="text"
            placeholder="Ask the Director..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-cinema-ai rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground"
          />
          <button
            id="ai-submit-btn"
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
            className="w-11 h-11 rounded-xl bg-cinema-ai hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white cursor-pointer shadow-md shadow-indigo-500/10"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Drawer>
  );
}
