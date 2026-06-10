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

const SEED_USERS: User[] = [
  { email: "test@foodsense.com", nombre: "Usuario Test", clave: "1234" },
];

export function getUsers(): User[] {
  if (!isBrowser()) return [];
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
      saveUsers(SEED_USERS);
      return SEED_USERS;
    }
    return JSON.parse(stored);
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

export function updateUser(
  email: string,
  changes: { nombre?: string; clave?: string; claveActual?: string }
): { ok: true; user: User } | { ok: false; error: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email === email);
  if (idx === -1) return { ok: false, error: "Usuario no encontrado." };

  if (changes.clave) {
    if (!changes.claveActual) return { ok: false, error: "Ingresá tu contraseña actual." };
    if (users[idx].clave !== changes.claveActual)
      return { ok: false, error: "La contraseña actual es incorrecta." };
  }

  const updated: User = {
    ...users[idx],
    ...(changes.nombre?.trim() ? { nombre: changes.nombre.trim() } : {}),
    ...(changes.clave ? { clave: changes.clave } : {}),
  };
  users[idx] = updated;
  saveUsers(users);
  return { ok: true, user: updated };
}
