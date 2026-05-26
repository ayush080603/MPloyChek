const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'mploychek-secret-2024';
const API_DELAY_MS = parseInt(process.env.API_DELAY || '0');

app.use(cors());
app.use(express.json());

// ─── In-memory "database" ───────────────────────────────────────────────────
const users = [
  {
    id: uuidv4(),
    userId: 'admin@mploychek.com',
    password: bcrypt.hashSync('Admin@123', 10),
    role: 'Admin',
    name: 'Arvind R A',
    department: 'Management',
    joinedAt: '2023-01-10',
    avatar: 'AR',
  },
  {
    id: uuidv4(),
    userId: 'ayush@mploychek.com',
    password: bcrypt.hashSync('User@123', 10),
    role: 'General User',
    name: 'Ayush Sinha',
    department: 'Engineering',
    joinedAt: '2024-03-15',
    avatar: 'AS',
  },
  {
    id: uuidv4(),
    userId: 'priya@mploychek.com',
    password: bcrypt.hashSync('User@123', 10),
    role: 'General User',
    name: 'Priya Nair',
    department: 'Operations',
    joinedAt: '2024-05-01',
    avatar: 'PN',
  },
];

// Background verification records
const allRecords = [
  { id: uuidv4(), candidateName: 'Rahul Sharma', position: 'Senior Dev', status: 'Verified', riskLevel: 'Low', verifiedDate: '2024-11-10', checks: 5, assignedTo: 'ayush@mploychek.com' },
  { id: uuidv4(), candidateName: 'Sneha Patel', position: 'UX Designer', status: 'Pending', riskLevel: 'Medium', verifiedDate: null, checks: 2, assignedTo: 'ayush@mploychek.com' },
  { id: uuidv4(), candidateName: 'Vikram Menon', position: 'Product Manager', status: 'In Progress', riskLevel: 'Low', verifiedDate: null, checks: 3, assignedTo: 'priya@mploychek.com' },
  { id: uuidv4(), candidateName: 'Ananya Singh', position: 'Data Analyst', status: 'Verified', riskLevel: 'Low', verifiedDate: '2024-11-20', checks: 4, assignedTo: 'priya@mploychek.com' },
  { id: uuidv4(), candidateName: 'Karan Joshi', position: 'Backend Dev', status: 'Failed', riskLevel: 'High', verifiedDate: '2024-11-15', checks: 5, assignedTo: 'ayush@mploychek.com' },
  { id: uuidv4(), candidateName: 'Meera Iyer', position: 'QA Engineer', status: 'Verified', riskLevel: 'Low', verifiedDate: '2024-12-01', checks: 4, assignedTo: 'priya@mploychek.com' },
  { id: uuidv4(), candidateName: 'Arjun Reddy', position: 'DevOps Engineer', status: 'In Progress', riskLevel: 'Medium', verifiedDate: null, checks: 3, assignedTo: 'ayush@mploychek.com' },
  { id: uuidv4(), candidateName: 'Kavya Mishra', position: 'Frontend Dev', status: 'Pending', riskLevel: 'Low', verifiedDate: null, checks: 1, assignedTo: 'priya@mploychek.com' },
];

// ─── Delay middleware (simulates async processing) ───────────────────────────
function withDelay(req, res, next) {
  const delay = parseInt(req.query.delay || API_DELAY_MS);
  if (delay > 0) {
    setTimeout(next, delay);
  } else {
    next();
  }
}

// ─── Auth middleware ─────────────────────────────────────────────────────────
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin only' });
  next();
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /api/auth/login
app.post('/api/auth/login', withDelay, (req, res) => {
  const { userId, password } = req.body;
  const user = users.find(u => u.userId === userId);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, userId: user.userId, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, userId: user.userId, name: user.name, role: user.role, department: user.department, joinedAt: user.joinedAt, avatar: user.avatar } });
});

// GET /api/auth/me
app.get('/api/auth/me', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({ id: user.id, userId: user.userId, name: user.name, role: user.role, department: user.department, joinedAt: user.joinedAt, avatar: user.avatar });
});

// GET /api/records?delay=ms
app.get('/api/records', authenticate, withDelay, (req, res) => {
  if (req.user.role === 'Admin') {
    return res.json(allRecords);
  }
  // General users see only their records
  const myRecords = allRecords.filter(r => r.assignedTo === req.user.userId);
  res.json(myRecords);
});

// GET /api/users (Admin only)
app.get('/api/users', authenticate, requireAdmin, withDelay, (req, res) => {
  res.json(users.map(u => ({ id: u.id, userId: u.userId, name: u.name, role: u.role, department: u.department, joinedAt: u.joinedAt, avatar: u.avatar })));
});

// POST /api/users (Admin only)
app.post('/api/users', authenticate, requireAdmin, (req, res) => {
  const { userId, password, name, role, department } = req.body;
  if (users.find(u => u.userId === userId)) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const newUser = {
    id: uuidv4(),
    userId,
    password: bcrypt.hashSync(password, 10),
    name,
    role: role || 'General User',
    department: department || 'General',
    joinedAt: new Date().toISOString().split('T')[0],
    avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
  };
  users.push(newUser);
  const { password: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

// DELETE /api/users/:id (Admin only)
app.delete('/api/users/:id', authenticate, requireAdmin, (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  if (users[idx].role === 'Admin') return res.status(403).json({ message: 'Cannot delete admin' });
  users.splice(idx, 1);
  res.json({ message: 'Deleted' });
});

// GET /api/stats (Admin only)
app.get('/api/stats', authenticate, requireAdmin, (req, res) => {
  const stats = {
    totalRecords: allRecords.length,
    verified: allRecords.filter(r => r.status === 'Verified').length,
    pending: allRecords.filter(r => r.status === 'Pending').length,
    inProgress: allRecords.filter(r => r.status === 'In Progress').length,
    failed: allRecords.filter(r => r.status === 'Failed').length,
    totalUsers: users.length,
  };
  res.json(stats);
});

app.listen(PORT, () => console.log(`MPloyChek API running on http://localhost:${PORT}`));
