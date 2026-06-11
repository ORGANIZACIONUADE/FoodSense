import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebase";

export interface Session {
  email: string;
  nombre: string;
  provider: "google" | "password";
}

function toSession(user: FirebaseUser): Session {
  const provider = user.providerData.some((p) => p.providerId === "google.com") ? "google" : "password";
  return { email: user.email!, nombre: user.displayName ?? user.email!, provider };
}

function mapAuthError(code: string | undefined, fallback: string): string {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email o contraseña incorrectos.";
    case "auth/email-already-in-use":
      return "Ya existe una cuenta con ese email.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    default:
      return fallback;
  }
}

export function subscribeToAuth(cb: (session: Session | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => cb(user ? toSession(user) : null));
}

export async function loginUser(
  email: string,
  clave: string
): Promise<{ ok: true; user: Session } | { ok: false; error: string }> {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), clave);
    return { ok: true, user: toSession(user) };
  } catch (e: unknown) {
    return { ok: false, error: mapAuthError((e as { code?: string }).code, "Error al ingresar. Intentá de nuevo.") };
  }
}

export async function registerUser(
  email: string,
  nombre: string,
  clave: string
): Promise<{ ok: true; user: Session } | { ok: false; error: string }> {
  if (!email.trim() || !nombre.trim() || !clave) {
    return { ok: false, error: "Completá todos los campos." };
  }
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), clave);
    await updateProfile(user, { displayName: nombre.trim() });
    return { ok: true, user: { email: user.email!, nombre: nombre.trim() } };
  } catch (e: unknown) {
    return { ok: false, error: mapAuthError((e as { code?: string }).code, "Error al registrarse. Intentá de nuevo.") };
  }
}

export async function updateUser(changes: {
  nombre?: string;
  clave?: string;
  claveActual?: string;
}): Promise<{ ok: true; nombre?: string } | { ok: false; error: string }> {
  const user = auth.currentUser;
  if (!user) return { ok: false, error: "No hay sesión activa." };
  try {
    if (changes.nombre?.trim()) {
      await updateProfile(user, { displayName: changes.nombre.trim() });
    }
    if (changes.clave) {
      if (!changes.claveActual) return { ok: false, error: "Ingresá tu contraseña actual." };
      const credential = EmailAuthProvider.credential(user.email!, changes.claveActual);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, changes.clave);
    }
    return { ok: true, nombre: changes.nombre?.trim() };
  } catch (e: unknown) {
    return { ok: false, error: mapAuthError((e as { code?: string }).code, "Error al actualizar. Intentá de nuevo.") };
  }
}

export async function loginWithGoogle(): Promise<{ ok: true; user: Session } | { ok: false; error: string }> {
  try {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    return { ok: true, user: toSession(user) };
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
      return { ok: false, error: "" };
    }
    return { ok: false, error: "Error al ingresar con Google. Intentá de nuevo." };
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(
  email: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
    return { ok: true };
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === "auth/invalid-email") return { ok: false, error: "El email ingresado no es válido." };
    return { ok: false, error: "No se pudo enviar el correo. Intentá de nuevo." };
  }
}

export async function changeUserEmail(
  newEmail: string,
  claveActual: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = auth.currentUser;
  if (!user || !user.email) return { ok: false, error: "No hay sesión activa." };
  try {
    const credential = EmailAuthProvider.credential(user.email, claveActual);
    await reauthenticateWithCredential(user, credential);
    await verifyBeforeUpdateEmail(user, newEmail.trim().toLowerCase());
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: mapAuthError((e as { code?: string }).code, "Error al cambiar el email. Intentá de nuevo.") };
  }
}
