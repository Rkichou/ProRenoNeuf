import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const [projectId, uid, operation] = process.argv.slice(2);
if (!projectId || !uid || !['grant', 'revoke'].includes(operation)) {
  console.error('Usage : npm run admin-role -- <projectId> <UID> <grant|revoke>');
  process.exit(1);
}
if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  throw new Error('Retirez FIREBASE_AUTH_EMULATOR_HOST pour gérer les rôles du projet explicitement choisi.');
}
const app = initializeApp({ credential: applicationDefault(), projectId });
const auth = getAuth(app);
try {
  const user = await auth.getUser(uid);
  const claims = { ...user.customClaims };
  if (operation === 'grant') claims.admin = true;
  else delete claims.admin;
  await auth.setCustomUserClaims(uid, claims);
  if (operation === 'revoke') await auth.revokeRefreshTokens(uid);
  console.log(operation === 'grant' ? 'Rôle administrateur attribué. Reconnexion nécessaire.' : 'Rôle administrateur retiré ; jetons de renouvellement révoqués.');
} catch {
  console.error('Opération impossible. Vérifiez le projet, l’UID et les droits du compte de service.');
  process.exitCode = 1;
}
