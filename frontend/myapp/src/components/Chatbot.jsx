import { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import { FiX, FiSend } from "react-icons/fi";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
const SESSION_ID = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const QUICK_REPLIES = [
  "Track my order",
  "Return policy",
  "Shipping info",
  "Contact support",
  "Payment methods",
];

const formatWA = (text) =>
  text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );

const ts = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const WA_ICON = (
  <svg viewBox="0 0 32 32" fill="currentColor" width="28" height="28">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 2.83.74 5.49 2.035 7.8L0 32l8.437-2.01A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.3 20.093c-.4-.2-2.366-1.168-2.732-1.3-.366-.133-.633-.2-.9.2-.267.4-1.033 1.3-1.267 1.566-.233.267-.466.3-.866.1-.4-.2-1.688-.622-3.216-1.984-1.188-1.06-1.99-2.37-2.223-2.77-.234-.4-.025-.616.175-.815.18-.18.4-.466.6-.7.2-.233.267-.4.4-.666.133-.267.067-.5-.033-.7-.1-.2-.9-2.166-1.233-2.966-.324-.78-.654-.674-.9-.686-.233-.011-.5-.014-.767-.014s-.7.1-1.066.5c-.366.4-1.4 1.366-1.4 3.332s1.433 3.866 1.633 4.133c.2.267 2.82 4.3 6.832 6.033.955.412 1.7.658 2.282.843.958.305 1.832.262 2.52.159.769-.115 2.366-.966 2.7-1.9.333-.933.333-1.733.233-1.9-.1-.167-.367-.267-.767-.467z"/>
  </svg>
);

export default function Chatbot() {
  const [open, setOpen]         = useState(false);
  const [started, setStarted]   = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [typing, setTyping]     = useState(false);
  const [unread, setUnread]     = useState(0);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) { setUnread(0); if (started) setTimeout(() => inputRef.current?.focus(), 250); }
  }, [open, started]);

  const startChat = () => {
    setStarted(true);
    setMessages([{ from: "bot", text: "Hello! 👋 Welcome to *ShopZone*. How can I help you today?", time: ts() }]);
    setTimeout(() => inputRef.current?.focus(), 250);
  };

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || typing) return;
    setInput("");
    setMessages(p => [...p, { from: "user", text: msg, time: ts() }]);
    setTyping(true);
    try {
      const res  = await fetch(`${BACKEND_ORIGIN}/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId: SESSION_ID }),
      });
      const data = await res.json();
      setMessages(p => [...p, { from: "bot", text: data.reply || "Sorry, I didn't understand that.", time: ts() }]);
      if (!open) setUnread(p => p + 1);
    } catch {
      setMessages(p => [...p, { from: "bot", text: "⚠️ Connection issue. Please try again shortly.", time: ts() }]);
    } finally {
      setTyping(false);
    }
  };

  const handleKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <div className="wa-widget">

      {/* ── Chat popup — above the FAB ────────────── */}
      {open && (
        <div className="wa-popup" role="dialog" aria-label="Chat support">

          {/* Header */}
          <div className="wa-pop-header">
            <div className="wa-pop-avatar">S<span className="wa-pop-dot" /></div>
            <div className="wa-pop-info">
              <div className="wa-pop-name">ShopZone Support</div>
              <div className="wa-pop-status"><span className="wa-green-dot" />Online</div>
            </div>
            <button className="wa-pop-close" onClick={() => setOpen(false)} aria-label="Close"><FiX size={17} /></button>
          </div>

          {/* Body */}
          {!started ? (
            <div className="wa-welcome">
              <div className="wa-wp-bg" />
              <div className="wa-welcome-inner">
                <div className="wa-welcome-icon">{WA_ICON}</div>
                <p className="wa-welcome-title">ShopZone Support</p>
                <p className="wa-welcome-num">+92 317 803 9368</p>
                <p className="wa-welcome-msg">Hi there! 👋<br />How can we help you today?</p>
                <button className="wa-start-btn" onClick={startChat}>
                  {WA_ICON} Start Chat
                </button>
                <p className="wa-powered">Powered by ShopZone AI</p>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="wa-msgs">
                <div className="wa-wp-bg" />
                <div className="wa-msgs-inner">
                  <div className="wa-date-pill">Today</div>
                  {messages.map((m, i) => (
                    <div key={i} className={`wa-row ${m.from}`}>
                      <div className={`wa-bubble ${m.from}`}>
                        <div className="wa-btext">
                          {m.text.split("\n").map((l, j, a) => (
                            <span key={j}>{formatWA(l)}{j < a.length - 1 && <br />}</span>
                          ))}
                        </div>
                        <div className="wa-bmeta">
                          <span className="wa-btime">{m.time}</span>
                          {m.from === "user" && <span className="wa-tick">✓✓</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {typing && (
                    <div className="wa-row bot">
                      <div className="wa-bubble bot wa-typing">
                        <span /><span /><span />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              </div>

              {/* Quick replies */}
              <div className="wa-chips">
                {QUICK_REPLIES.map(q => (
                  <button key={q} className="wa-chip" onClick={() => sendMessage(q)} disabled={typing}>{q}</button>
                ))}
              </div>

              {/* Input */}
              <div className="wa-inputbar">
                <input
                  ref={inputRef}
                  className="wa-input"
                  type="text"
                  placeholder="Type a message"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  maxLength={300}
                  disabled={typing}
                />
                <button className="wa-send" onClick={() => sendMessage()} disabled={!input.trim() || typing} aria-label="Send">
                  <FiSend size={17} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── WhatsApp FAB — only this shows on page ── */}
      <button
        className="wa-fab"
        onClick={() => setOpen(p => !p)}
        aria-label={open ? "Close chat" : "Chat with us"}
      >
        {open ? <FiX size={26} /> : WA_ICON}
        {!open && unread > 0 && <span className="wa-fab-badge">{unread}</span>}
      </button>

    </div>
  );
}
