import { db } from '../lib/Firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export async function fetchServerTime(): Promise<Date> {
  const ref = doc(db, '_meta', 'serverTime');
  await setDoc(ref, { ts: serverTimestamp() }, { merge: true });
  const snap = await getDoc(ref);
  const ts = snap.data()?.ts;
  return ts?.toDate ? ts.toDate() : new Date();
}

