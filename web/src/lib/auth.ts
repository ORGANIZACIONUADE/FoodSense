export interface User {
  email: string;
  nombre: string;
  clave: string;
}

export interface Session {
  email: string;
  nombre: string;
}

const USERS_KEY = "foodsense-users";
const SESSION_KEY = "foodsense-session";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getUsers(): User[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): Session | null {
  if (!isBrowser()) return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function saveSession(session: Session | null): void {
  if (!isBrowser()) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function registerUser(
  email: string,
  nombre: string,
  clave: string
): { ok: true; user: User } | { ok: false; error: string } {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !nombre.trim() || !clave) {
    return { ok: false, error: "Completá todos los campos." };
  }
  const users = getUsers();
  if (users.some((u) => u.email === normalizedEmail)) {
    return { ok: false, error: "Ya existe una cuenta con ese email." };
  }
  const user: User = { email: normalizedEmail, nombre: nombre.trim(), clave };
  saveUsers([...users, user]);
  return { ok: true, user };
}

export function loginUser(
  email: string,
  clave: string
): { ok: true; user: User } | { ok: false; error: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  const user = users.find((u) => u.email === normalizedEmail && u.clave === clave);
  if (!user) {
    return { ok: false, error: "Email o contraseña incorrectos." };
  }
  return { ok: true, user };
}
