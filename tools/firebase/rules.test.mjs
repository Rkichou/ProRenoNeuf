import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { before, after, beforeEach, test } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { collection, deleteDoc, doc, documentId, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, startAfter, Timestamp, updateDoc, writeBatch } from 'firebase/firestore';

let env;
const valid = () => ({ name: 'Test local', contact: 'test@example.com', service: 'Maçonnerie', message: 'Demande fictive pour un test local.', status: 'new', source: 'website', createdAt: serverTimestamp() });
before(async () => {
  if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Tests autorisés uniquement avec l’émulateur Firestore.');
  env = await initializeTestEnvironment({ projectId: 'demo-prorenoneuf', firestore: { rules: await readFile(new URL('../../firestore.rules', import.meta.url), 'utf8') } });
});
beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), 'contactRequests/existing'), { ...valid(), createdAt: Timestamp.now() });
    await setDoc(doc(context.firestore(), 'testimonials/public'), { published: true });
    await setDoc(doc(context.firestore(), 'testimonials/private'), { published: false });
  });
});
after(async () => { await env?.cleanup(); });
test('visiteur et utilisateur sans rôle : lecture et liste refusées', async () => {
  for (const context of [env.unauthenticatedContext(), env.authenticatedContext('regular')]) {
    await assertFails(getDoc(doc(context.firestore(), 'contactRequests/existing')));
    await assertFails(getDocs(collection(context.firestore(), 'contactRequests')));
  }
});
test('seule la claim booléenne admin donne accès', async () => {
  await assertSucceeds(getDocs(query(collection(env.authenticatedContext('admin', { admin: true }).firestore(), 'contactRequests'), orderBy('createdAt', 'desc'), limit(21))));
  await assertFails(getDocs(collection(env.authenticatedContext('fake', { admin: 'true' }).firestore(), 'contactRequests')));
});
test('création publique valide autorisée', async () => {
  await assertSucceeds(setDoc(doc(env.unauthenticatedContext().firestore(), 'contactRequests/new'), valid()));
});
test('champs invalides, supplémentaires ou manquants refusés', async () => {
  const db = env.unauthenticatedContext().firestore();
  for (const patch of [{ name: '' }, { message: 'court' }, { message: 'x'.repeat(3001) }, { service: 12 }, { status: 'done' }, { source: 'other' }, { extra: true }, { createdAt: Timestamp.fromMillis(0) }]) {
    await assertFails(setDoc(doc(db, 'contactRequests/invalid'), { ...valid(), ...patch }));
  }
  const data = valid(); delete data.contact;
  await assertFails(setDoc(doc(db, 'contactRequests/missing'), data));
});
test('mise à jour et suppression refusées même aux administrateurs', async () => {
  for (const context of [env.unauthenticatedContext(), env.authenticatedContext('admin', { admin: true })]) {
    const ref = doc(context.firestore(), 'contactRequests/existing');
    await assertFails(updateDoc(ref, { status: 'done' }));
    await assertFails(deleteDoc(ref));
  }
});
test('avis : lecture publique seulement pour les documents publiés', async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(db, 'testimonials/public')));
  await assertFails(getDoc(doc(db, 'testimonials/private')));
  await assertFails(setDoc(doc(db, 'testimonials/new'), { published: true }));
});
test('pagination de 20 demandes sans doublon même à date identique', async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    const batch = writeBatch(db);
    for (let i = 0; i < 25; i++) batch.set(doc(db, `contactRequests/page-${String(i).padStart(2, '0')}`), { ...valid(), createdAt: Timestamp.fromMillis(1000) });
    await batch.commit();
  });
  const db = env.authenticatedContext('admin', { admin: true }).firestore();
  const ref = collection(db, 'contactRequests');
  const first = await assertSucceeds(getDocs(query(ref, orderBy('createdAt', 'desc'), orderBy(documentId(), 'desc'), limit(21))));
  const firstPage = first.docs.slice(0, 20);
  const second = await assertSucceeds(getDocs(query(ref, orderBy('createdAt', 'desc'), orderBy(documentId(), 'desc'), startAfter(firstPage[19]), limit(21))));
  assert.equal(firstPage.length, 20);
  assert.equal(second.docs.length, 5);
  assert.equal(new Set([...firstPage, ...second.docs].map(doc => doc.id)).size, 25);
});
