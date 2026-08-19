interface Attempt {
  count: number;
  lockedUntil: number;
}

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

const store = new Map<string, Attempt>();

let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000;

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (entry.lockedUntil > 0 && entry.lockedUntil < now) {
      store.delete(key);
    }
  }
}

export function isLocked(email: string): boolean {
  cleanup();
  const entry = store.get(email);
  if (!entry) return false;
  const now = Date.now();
  if (entry.lockedUntil > 0 && entry.lockedUntil > now) return true;
  return false;
}

export function recordFailure(email: string): { remaining: number; locked: boolean } {
  cleanup();
  const now = Date.now();
  let entry = store.get(email);

  if (!entry) {
    entry = { count: 1, lockedUntil: 0 };
    store.set(email, entry);
    return { remaining: MAX_ATTEMPTS - 1, locked: false };
  }

  if (entry.lockedUntil > 0 && entry.lockedUntil < now) {
    entry.count = 0;
    entry.lockedUntil = 0;
  }

  entry.count += 1;

  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
    return { remaining: 0, locked: true };
  }

  return { remaining: MAX_ATTEMPTS - entry.count, locked: false };
}

export function recordSuccess(email: string): void {
  store.delete(email);
}

export function lockoutRemaining(email: string): number {
  const entry = store.get(email);
  if (!entry || entry.lockedUntil <= 0) return 0;
  const remaining = Math.ceil((entry.lockedUntil - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}
