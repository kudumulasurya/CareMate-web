const BASE_URL = "http://localhost:5000";
const MODEL_API = "https://42tbnklm-5000.inc1.devtunnels.ms";

// ==========================================
// Chat API Calls
// ==========================================

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
    const res = await fetch(`${BASE_URL}/api/history`, { 
        credentials: "include" 
    });
    return await res.json();
}

export async function getSessions() {
    const res = await fetch(`${BASE_URL}/api/sessions`, { 
        credentials: "include" 
    });
    return await res.json();
}

export async function loadSession(sessionId) {
    const res = await fetch(`${BASE_URL}/api/session/${sessionId}`, { 
        credentials: "include" 
    });
    return await res.json();
}

export async function deleteSession(sessionId) {
    const res = await fetch(`${BASE_URL}/api/session/${sessionId}`, { 
        method: "DELETE",
        credentials: "include" 
    });
    return await res.json();
}

export async function startNewChat() {
    const res = await fetch(`${BASE_URL}/api/new-chat`, { 
        method: "POST", 
        credentials: "include" 
    });
    return await res.json();
}

export async function clearChat() {
    const res = await fetch(`${BASE_URL}/api/clear`, { 
        method: "POST", 
        credentials: "include" 
    });
    return await res.json();
}

// ==========================================
// Disease Prediction API Calls (Model API)
// ==========================================

export async function predictDisease(userId, symptoms) {
    const res = await fetch(`${MODEL_API}/api/virtual-doctor/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: userId,
            symptoms: symptoms
        }),
        credentials: "include",
    });
    return await res.json();
}

export async function getRecentPredictions() {
    const res = await fetch(`${BASE_URL}/api/dashboard/recent-predictions`, {
        credentials: "include"
    });
    return await res.json();
}

// ==========================================
// Doctor API Calls
// ==========================================

export async function getDoctors() {
    const res = await fetch(`${BASE_URL}/api/doctors`, {
        credentials: "include"
    });
    return await res.json();
}

export async function getRelatedDoctors(symptoms) {
    const res = await fetch(`${MODEL_API}/api/doctors/related`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
        credentials: "include",
    });
    return await res.json();
}

// ==========================================
// User/Auth API Calls
// ==========================================

export async function getCurrentUser() {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
        credentials: "include"
    });
    return await res.json();
}

// ==========================================
// Appointments API Calls
// ==========================================

export async function bookAppointment(appointmentData) {
    const res = await fetch(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
        credentials: "include",
    });
    return await res.json();
}

export async function getAppointments() {
    const res = await fetch(`${BASE_URL}/api/appointments`, {
        credentials: "include"
    });
    return await res.json();
}

// ==========================================
// Health Check
// ==========================================

export async function checkHealth() {
    const res = await fetch(`${MODEL_API}/api/health`);
    return await res.json();
}