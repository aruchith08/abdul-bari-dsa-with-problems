import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface UserCloudData {
  completed: Record<number, boolean>;
  timestamps: Record<number, string>;
  revisions: Record<number, boolean>;
  notes: Record<number, string>;
  updatedAt?: any;
}

const DEFAULT_CLOUD_DATA: UserCloudData = {
  completed: {},
  timestamps: {},
  revisions: {},
  notes: {},
};

/**
 * Fetch a user's DSA progress from Firestore
 */
export async function getUserData(userId: string): Promise<UserCloudData | null> {
  try {
    if (!db) return null;
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        completed: data.completed || {},
        timestamps: data.timestamps || {},
        revisions: data.revisions || {},
        notes: data.notes || {},
        updatedAt: data.updatedAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    return null;
  }
}

let syncErrorListener: ((err: any) => void) | null = null;

export function setSyncErrorListener(cb: ((err: any) => void) | null) {
  syncErrorListener = cb;
}

/**
 * Save user data to Firestore (merges fields)
 */
export async function saveUserData(
  userId: string,
  data: Partial<UserCloudData>
): Promise<boolean> {
  try {
    if (!db) return false;
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error: any) {
    console.error('🔥 FIRESTORE WRITE ERROR:', error);
    if (syncErrorListener) syncErrorListener(error);
    return false;
  }
}

function sanitizeRecord<T>(val: any, validateFn: (v: any) => boolean): Record<number, T> {
  if (!val || typeof val !== 'object' || Array.isArray(val)) return {};
  const result: Record<number, T> = {};
  for (const [k, v] of Object.entries(val)) {
    const numKey = Number(k);
    if (!isNaN(numKey) && validateFn(v)) {
      result[numKey] = v as T;
    }
  }
  return result;
}

export function sanitizeCloudData(data: any): UserCloudData {
  if (!data || typeof data !== 'object') return DEFAULT_CLOUD_DATA;
  return {
    completed: sanitizeRecord<boolean>(data.completed, (v) => typeof v === 'boolean'),
    timestamps: sanitizeRecord<string>(data.timestamps, (v) => typeof v === 'string'),
    revisions: sanitizeRecord<boolean>(data.revisions, (v) => typeof v === 'boolean'),
    notes: sanitizeRecord<string>(data.notes, (v) => typeof v === 'string'),
    updatedAt: data.updatedAt,
  };
}

/**
 * Merge local guest progress with existing cloud progress upon login
 */
export async function mergeLocalWithCloud(
  userId: string,
  localData: UserCloudData
): Promise<UserCloudData> {
  const existing = await getUserData(userId);
  const cloud = existing ? sanitizeCloudData(existing) : DEFAULT_CLOUD_DATA;
  const local = sanitizeCloudData(localData);

  // Merge completed and timestamps intelligently:
  // If both exist, keep the earlier/valid timestamp or latest note
  const mergedTimestamps: Record<number, string> = { ...cloud.timestamps, ...local.timestamps };
  const mergedCompleted: Record<number, boolean> = { ...cloud.completed, ...local.completed };

  // For notes, if local note is non-empty and cloud is empty (or vice versa), keep the non-empty one
  const mergedNotes: Record<number, string> = { ...cloud.notes };
  for (const [idStr, note] of Object.entries(local.notes)) {
    const id = Number(idStr);
    if (note && note.trim().length > 0) {
      mergedNotes[id] = note;
    }
  }

  const mergedRevisions: Record<number, boolean> = { ...cloud.revisions, ...local.revisions };

  const merged: UserCloudData = {
    completed: mergedCompleted,
    timestamps: mergedTimestamps,
    revisions: mergedRevisions,
    notes: mergedNotes,
  };

  const saved = await saveUserData(userId, merged);
  if (!saved) {
    throw new Error('Failed to save merged data to Firestore.');
  }

  return merged;
}

/**
 * Real-time listener for user document changes
 */
export function subscribeToUserData(
  userId: string,
  onUpdate: (data: UserCloudData) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  if (!db) {
    return () => {};
  }
  const userDocRef = doc(db, 'users', userId);
  return onSnapshot(
    userDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        onUpdate(sanitizeCloudData(data));
      } else {
        onUpdate(DEFAULT_CLOUD_DATA);
      }
    },
    (err) => {
      console.warn('Firestore subscription error:', err);
      if (onError) onError(err);
    }
  );
}
