// api/login.js
import { v4 as uuidv4 } from 'uuid';

const VALID_CREDENTIALS = [
  { username: "admin", password: "secret123" },
  { username: "user1", password: "pass456" }
];

// Simpan UID per fingerprint (untuk demo)
const deviceRegistry = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password, fingerprint } = req.body;

  if (!username || !password || !fingerprint) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const user = VALID_CREDENTIALS.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  let uid = deviceRegistry.get(fingerprint);
  if (!uid) {
    uid = uuidv4().split('-')[0];
    deviceRegistry.set(fingerprint, uid);
  }

  res.status(200).json({ uid, username });
}