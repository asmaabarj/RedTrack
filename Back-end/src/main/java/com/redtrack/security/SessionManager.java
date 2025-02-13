package com.redtrack.security;

import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Set;

@Component
public class SessionManager {
    private Set<String> activeSessions = new HashSet<>();

    public void addSession(String email) {
        activeSessions.add(email);
    }

    public void removeSession(String email) {
        activeSessions.remove(email);
    }

    public boolean isSessionActive(String email) {
        return activeSessions.contains(email);
    }
} 