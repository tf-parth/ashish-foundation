// ============================================================
// Auth Utilities — localStorage-based authentication
// For demo/prototype purposes only. Replace with a proper
// auth solution (NextAuth, Firebase Auth, etc.) for production.
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In production, NEVER store plain passwords
  role: "admin" | "user";
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

const USERS_KEY = "af_users";
const SESSION_KEY = "af_session";

// Default admin account
const DEFAULT_ADMIN: User = {
  id: "admin-001",
  name: "Admin",
  email: "admin@ashishfoundation.org",
  password: "admin123",
  role: "admin",
  createdAt: new Date().toISOString(),
};

function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setUsers(users: User[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Seed default admin account if no users exist */
export function seedAdmin(): void {
  const users = getUsers();
  if (!users.find((u) => u.email === DEFAULT_ADMIN.email)) {
    users.push(DEFAULT_ADMIN);
    setUsers(users);
  }
}

/** Sign up a new user */
export function signup(data: {
  name: string;
  email: string;
  password: string;
}): { success: boolean; error?: string; user?: AuthSession } {
  seedAdmin();
  const users = getUsers();

  if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: "An account with this email already exists." };
  }

  if (data.password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  const newUser: User = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: data.name,
    email: data.email.toLowerCase(),
    password: data.password,
    role: "user",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  setUsers(users);

  const session: AuthSession = {
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, user: session };
}

/** Log in an existing user */
export function login(email: string, password: string): {
  success: boolean;
  error?: string;
  user?: AuthSession;
} {
  seedAdmin();
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, user: session };
}

/** Log out */
export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/** Get current session */
export function getCurrentUser(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Check if authenticated */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/** Check if current user is admin */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "admin";
}
