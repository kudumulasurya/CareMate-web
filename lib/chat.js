const BASE_URL = "http://localhost:5000";

export async function sendMessage(message) {
    const res = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        credentials: "include",
    });
    return await res.json();
}

export async function getHistory() {
    const res = await fetch(`${BASE_URL}/api/history`, { credentials: "include" });
    return await res.json();
}

export async function startNewChat() {
    const res = await fetch(`${BASE_URL}/api/new-chat`, { method: "POST", credentials: "include" });
    return await res.json();
}

export async function clearChat() {
    const res = await fetch(`${BASE_URL}/api/clear`, { method: "POST", credentials: "include" });
    return await res.json();
}
