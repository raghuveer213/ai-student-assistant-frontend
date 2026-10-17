import React, { useState, useEffect } from "react";
import { summarizeNotes, generateQuiz, sendChatMessage, fetchHistory } from "./api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Summarizer State
  const [notesText, setNotesText] = useState("");
  const [summaryResult, setSummaryResult] = useState("");

  // Quiz State
  const [quizText, setQuizText] = useState("");
  const [quizResult, setQuizResult] = useState("");

  // Chat State
  const [chatMessage, setChatMessage] = useState("");
  const [chatReply, setChatReply] = useState("");

  // History State
  const [historyData, setHistoryData] = useState({ summaries: [], quizzes: [], chats: [] });

  const loadHistoryData = async () => {
    try {
      const data = await fetchHistory();
      setHistoryData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      loadHistoryData();
    }
  }, [activeTab]);

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!notesText.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await summarizeNotes(notesText);
      setSummaryResult(res.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuiz = async (e) => {
    e.preventDefault();
    if (!quizText.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await generateQuiz(quizText);
      setQuizResult(res.quiz);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await sendChatMessage(chatMessage);
      setChatReply(res.reply);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <nav className="sidebar">
        <h2>📚 AI Study Assistant</h2>
        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>🏠 Dashboard</button>
        <button className={activeTab === "summarizer" ? "active" : ""} onClick={() => setActiveTab("summarizer")}>📝 Notes Summarizer</button>
        <button className={activeTab === "quiz" ? "active" : ""} onClick={() => setActiveTab("quiz")}>❓ Quiz Generator</button>
        <button className={activeTab === "chat" ? "active" : ""} onClick={() => setActiveTab("chat")}>💬 Study Chatbot</button>
        <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>📂 History</button>
      </nav>

      <main className="main-content">
        {error && <div className="card" style={{ background: "#fee2e2", color: "#991b1b" }}>{error}</div>}

        {activeTab === "dashboard" && (
          <div>
            <h1>Welcome back, Student! 👋</h1>
            <p>Select a tool from the sidebar or choose below to accelerate your learning.</p>
            <div className="grid" style={{ marginTop: "2rem" }}>
              <div className="card" onClick={() => setActiveTab("summarizer")} style={{ cursor: "pointer" }}>
                <h3>📝 Summarizer</h3>
                <p>Instantly turn long notes into concise bullet points.</p>
              </div>
              <div className="card" onClick={() => setActiveTab("quiz")} style={{ cursor: "pointer" }}>
                <h3>❓ Quiz Generator</h3>
                <p>Test your knowledge with AI-generated quizzes.</p>
              </div>
              <div className="card" onClick={() => setActiveTab("chat")} style={{ cursor: "pointer" }}>
                <h3>💬 Study Chatbot</h3>
                <p>Ask questions and get expert tutoring instantly.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "summarizer" && (
          <div className="card">
            <h2>AI Notes Summarizer</h2>
            <p>Paste your lengthy study notes below to generate a concise summary.</p>
            <form onSubmit={handleSummarize}>
              <textarea placeholder="Paste study notes here..." value={notesText} onChange={(e) => setNotesText(e.target.value)} />
              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? "Summarizing..." : "Generate Summary"}
              </button>
            </form>
            {summaryResult && <div className="result-box"><strong>Summary:</strong>\n{summaryResult}</div>}
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="card">
            <h2>AI Quiz Generator</h2>
            <p>Enter text or topic to create multiple-choice questions.</p>
            <form onSubmit={handleQuiz}>
              <textarea placeholder="Enter material for quiz generation..." value={quizText} onChange={(e) => setQuizText(e.target.value)} />
              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? "Generating Quiz..." : "Create Quiz"}
              </button>
            </form>
            {quizResult && <div className="result-box"><strong>Quiz:</strong>\n{quizResult}</div>}
          </div>
        )}

        {activeTab === "chat" && (
          <div className="card">
            <h2>AI Study Chatbot</h2>
            <p>Ask your AI tutor anything about your subjects.</p>
            <form onSubmit={handleChat}>
              <input type="text" placeholder="e.g., Explain photosythesis simply..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? "Thinking..." : "Ask Tutor"}
              </button>
            </form>
            {chatReply && <div className="result-box"><strong>Tutor Response:</strong>\n{chatReply}</div>}
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h2>Saved History</h2>
            <div className="card">
              <h3>Recent Summaries</h3>
              {historyData.summaries.length === 0 ? <p>No summaries saved yet.</p> : historyData.summaries.map((item, idx) => (
                <div key={idx} className="history-item"><small>{new Date(item.created_at).toLocaleString()}</small><p>{item.output.substring(0, 150)}...</p></div>
              ))}
            </div>
            <div className="card">
              <h3>Recent Quizzes</h3>
              {historyData.quizzes.length === 0 ? <p>No quizzes saved yet.</p> : historyData.quizzes.map((item, idx) => (
                <div key={idx} className="history-item"><small>{new Date(item.created_at).toLocaleString()}</small><p>{item.output.substring(0, 150)}...</p></div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}