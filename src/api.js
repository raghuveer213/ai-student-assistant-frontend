const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function summarizeNotes(text) {
  const response = await fetch(`${API_BASE_URL}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error("Failed to generate summary");
  return response.json();
}

export async function generateQuiz(text) {
  const response = await fetch(`${API_BASE_URL}/quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error("Failed to generate quiz");
  return response.json();
}

export async function sendChatMessage(message) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) throw new Error("Failed to get chat response");
  return response.json();
}

export async function fetchHistory() {
  const response = await fetch(`${API_BASE_URL}/history`);
  if (!response.ok) throw new Error("Failed to fetch history");
  return response.json();
}