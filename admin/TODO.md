# Persistent Login Implementation Plan

## Goal
Fix the admin login so users stay logged in when the admin app is refreshed or reopened.

## Tasks

- [x] 1. Create AuthContext.jsx - Global authentication context to manage login state
- [x] 2. Update src/main.jsx - Wrap the app with AuthProvider
- [x] 3. Update App.jsx - Use AuthContext for authentication state
- [x] 4. Update RequireAdmin.jsx - Use AuthContext instead of making API calls on every render
- [x] 5. Update Login.jsx - Use AuthContext for login
- [x] 6. Update Navbar.jsx - Use AuthContext for logout

## Solution Overview
- Created an AuthContext that persists login state across app restarts
- Checks localStorage on app startup for existing token
- Verifies token with backend in background (with graceful fallback)
- Stores user info in context for quick access
- No longer makes API calls on every route change
