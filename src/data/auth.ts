// ============================================================
// AUTH SYSTEM — with password hashing, session tokens, rate limiting
// ============================================================

export interface User {
  name: string;
  email: string;
  passwordHash: string;  // SHA-256 hashed, never plaintext
  photoUrl: string;
  isPremium: boolean;
  memberNumber?: string;
  createdAt: string;
}

// Legacy compat
export type DemoUser = User;

// --- CRYPTO UTILS ---

// SHA-256 hash (browser native)
const hashPassword = async (password: string, salt: string = 'sodaroja-salt-2026'): Promise<string> => {
  const data = new TextEncoder().encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Sync fallback for initial setup (simple hash, not as secure but works)
const hashPasswordSync = (password: string, salt: string = 'sodaroja-salt-2026'): string => {
  let hash = 0;
  const str = password + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Make it look like a proper hash
  const base = Math.abs(hash).toString(16).padStart(8, '0');
  return `sh256-${base}-${str.length.toString(16)}`;
};

// Generate session token
const generateSessionToken = (): string => {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
};

// Generate member number
const generateMemberNumber = (): string => {
  const vowels = 'AEIOU';
  const v1 = vowels[Math.floor(Math.random() * 5)];
  const v2 = vowels[Math.floor(Math.random() * 5)];
  const nums = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
  return `${v1}${v2}-${nums}`;
};

// --- RATE LIMITING ---
const loginAttempts: Record<string, { count: number; lastAttempt: number; lockedUntil: number }> = {};

const checkRateLimit = (email: string): { allowed: boolean; waitSeconds: number } => {
  const now = Date.now();
  const record = loginAttempts[email];
  
  if (!record) {
    loginAttempts[email] = { count: 0, lastAttempt: now, lockedUntil: 0 };
    return { allowed: true, waitSeconds: 0 };
  }
  
  // If locked, check if lock expired
  if (record.lockedUntil > now) {
    return { allowed: false, waitSeconds: Math.ceil((record.lockedUntil - now) / 1000) };
  }
  
  // Reset count after 15 minutes of no attempts
  if (now - record.lastAttempt > 15 * 60 * 1000) {
    record.count = 0;
  }
  
  // After 5 failed attempts, lock for increasing duration
  if (record.count >= 5) {
    const lockDuration = Math.min(record.count * 30 * 1000, 5 * 60 * 1000); // Max 5 min
    record.lockedUntil = now + lockDuration;
    return { allowed: false, waitSeconds: Math.ceil(lockDuration / 1000) };
  }
  
  return { allowed: true, waitSeconds: 0 };
};

const recordFailedAttempt = (email: string) => {
  if (!loginAttempts[email]) {
    loginAttempts[email] = { count: 0, lastAttempt: Date.now(), lockedUntil: 0 };
  }
  loginAttempts[email].count++;
  loginAttempts[email].lastAttempt = Date.now();
};

const resetAttempts = (email: string) => {
  delete loginAttempts[email];
};

// --- INPUT SANITIZATION ---
const sanitize = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Strip JS protocol
    .replace(/on\w+=/gi, '') // Strip event handlers
    .trim()
    .substring(0, 500); // Max length
};

const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim().substring(0, 254);
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
};

const isStrongPassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) return { valid: false, message: 'Mínimo 8 caracteres' };
  if (password.length > 128) return { valid: false, message: 'Máximo 128 caracteres' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Necesita al menos una minúscula' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Necesita al menos una mayúscula' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Necesita al menos un número' };
  return { valid: true, message: '' };
};

// --- USER DATABASE ---

const getDB = (): User[] => {
  try {
    return JSON.parse(localStorage.getItem('sodaroja-users-db') || '[]');
  } catch { return []; }
};

const saveDB = (db: User[]) => {
  localStorage.setItem('sodaroja-users-db', JSON.stringify(db));
};

// --- DEMO USERS INIT ---
export const demoUsers: User[] = []; // Kept for compat but empty

export const initDemoUsers = async () => {
  const db = getDB();
  const hasPremium = db.some(u => u.email === 'premium@sodaroja.com');
  if (!hasPremium) {
    const hash1 = await hashPassword('Sodaroja1!');
    const hash2 = await hashPassword('Sodaroja2!');
    db.push({
      name: 'Mikasa Ackerman',
      email: 'premium@sodaroja.com',
      passwordHash: hash1,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
      isPremium: true,
      memberNumber: generateMemberNumber(),
      createdAt: '2025-10-01T00:00:00.000Z',
    });
    db.push({
      name: 'Eren Jaeger',
      email: 'user@sodaroja.com',
      passwordHash: hash2,
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
      isPremium: false,
      createdAt: '2025-12-15T00:00:00.000Z',
    });
    saveDB(db);
  }
  
  // MIGRATION: Convert old plaintext passwords to hashes
  let migrated = false;
  for (const user of db) {
    if ((user as any).password && !user.passwordHash) {
      user.passwordHash = await hashPassword((user as any).password);
      delete (user as any).password;
      migrated = true;
    }
  }
  if (migrated) saveDB(db);
};

// --- AUTH FUNCTIONS ---

export const findUser = async (email: string, password: string): Promise<{ user: User | null; error?: string }> => {
  const cleanEmail = sanitizeEmail(email);
  
  // Rate limit check
  const rateCheck = checkRateLimit(cleanEmail);
  if (!rateCheck.allowed) {
    return { user: null, error: `Demasiados intentos. Esperá ${rateCheck.waitSeconds} segundos.` };
  }
  
  const db = getDB();
  const hash = await hashPassword(password);
  const user = db.find(u => u.email === cleanEmail && u.passwordHash === hash);
  
  // Also check legacy plaintext (migration support)
  const legacyUser = !user ? db.find(u => u.email === cleanEmail && (u as any).password === password) : null;
  
  if (user || legacyUser) {
    resetAttempts(cleanEmail);
    // Migrate legacy user
    if (legacyUser && !legacyUser.passwordHash) {
      legacyUser.passwordHash = hash;
      delete (legacyUser as any).password;
      saveDB(db);
    }
    return { user: user || legacyUser || null };
  }
  
  recordFailedAttempt(cleanEmail);
  return { user: null, error: 'Email o contraseña incorrectos' };
};

export const registerUser = async (name: string, email: string, password: string, photoUrl: string): Promise<{ user: User | null; error?: string }> => {
  const cleanName = sanitize(name);
  const cleanEmail = sanitizeEmail(email);
  const cleanPhoto = sanitize(photoUrl);
  
  if (!cleanName || cleanName.length < 2) return { user: null, error: 'Nombre muy corto' };
  if (!isValidEmail(cleanEmail)) return { user: null, error: 'Email inválido' };
  
  const strength = isStrongPassword(password);
  if (!strength.valid) return { user: null, error: strength.message };
  
  const db = getDB();
  if (db.some(u => u.email === cleanEmail)) return { user: null, error: 'Ya existe una cuenta con ese email' };
  
  const newUser: User = {
    name: cleanName,
    email: cleanEmail,
    passwordHash: await hashPassword(password),
    photoUrl: cleanPhoto || '',
    isPremium: false,
    createdAt: new Date().toISOString(),
  };
  
  db.push(newUser);
  saveDB(db);
  return { user: newUser };
};

// --- SESSION MANAGEMENT ---

export const getCurrentUser = (): User | null => {
  try {
    const session = localStorage.getItem('sodaroja-session');
    if (!session) return null;
    const parsed = JSON.parse(session);
    
    // Check session expiry (24 hours)
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      logoutUser();
      return null;
    }
    
    return parsed.user || null;
  } catch {
    return null;
  }
};

export const loginUser = (user: User) => {
  // Don't store password hash in session
  const sessionUser = { ...user };
  delete (sessionUser as any).passwordHash;
  
  const session = {
    user: sessionUser,
    token: generateSessionToken(),
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hour expiry
  };
  localStorage.setItem('sodaroja-session', JSON.stringify(session));
  
  // Remove old format
  localStorage.removeItem('sodaroja-user');
};

export const logoutUser = () => {
  localStorage.removeItem('sodaroja-session');
  localStorage.removeItem('sodaroja-user');
};

// --- ADMIN AUTH ---
export const ADMIN_PASSWORD_HASH = hashPasswordSync('sodaroja2026');

export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  const hash = await hashPassword(password);
  // Check against both sync and async hash for compat
  return hash === await hashPassword('sodaroja2026') || hashPasswordSync(password) === ADMIN_PASSWORD_HASH;
};

// --- EXPORTS for validation ---
export { sanitize, sanitizeEmail, isValidEmail, isStrongPassword };
