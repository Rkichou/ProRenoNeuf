import { browserSessionPersistence, initializeAuth, type Auth } from 'firebase/auth';
import { getFirebaseApp } from '../lib/firebase';

let auth: Auth | undefined;
export function getAdminAuth() {
  const app = getFirebaseApp();
  if (!app) return null;
  auth ??= initializeAuth(app, { persistence: browserSessionPersistence });
  return auth;
}
