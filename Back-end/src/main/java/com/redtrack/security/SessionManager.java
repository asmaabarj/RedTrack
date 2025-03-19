package com.redtrack.security;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class SessionManager {
    private Map<String, String> activeSessions = new ConcurrentHashMap<>();

    public void addSession(String email) {
        activeSessions.put(email, email);
    }

    public void removeSession(String email) {
        activeSessions.remove(email);
    }

    public boolean isSessionActive(String email) {
        return email != null && activeSessions.containsKey(email);
    }

    public void clearAllSessions() {
        activeSessions.clear();
    }
} 