/* ============================================
   IUTRequests - Authentification & Donnees
   Fichier partage entre les 3 espaces
   ============================================ */

(function() {
  const CURRENT_VERSION = '6';
  if (localStorage.getItem('iut-version') !== CURRENT_VERSION) {
    localStorage.removeItem('iut-users');
    localStorage.removeItem('iut-user');
    localStorage.removeItem('iut-requests');
    localStorage.removeItem('iut-notifications');
    localStorage.removeItem('iut-audit');
    localStorage.removeItem('iut-depts');
    localStorage.removeItem('iut-progs');
    localStorage.removeItem('iut-cats');
    localStorage.setItem('iut-version', CURRENT_VERSION);
  }
})();

const Auth = {
  getUser() {
    const d = localStorage.getItem('iut-user');
    return d ? JSON.parse(d) : null;
  },
  isLoggedIn() { return !!this.getUser(); },

  login(email, password) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password && u.role === 'STUDENT');
    if (!user) return { success: false, message: 'Identifiants incorrects ou compte non etudiant' };
    if (!user.isActive) return { success: false, message: 'Compte desactive' };
    const { password: _, ...safe } = user;
    localStorage.setItem('iut-user', JSON.stringify(safe));
    this.addAudit('CONNEXION', 'Etudiant: ' + user.firstName + ' ' + user.lastName);
    return { success: true, user: safe };
  },

  loginAdmin(email, password) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password && u.role === 'ADMIN' && u.isActive);
    if (!user) return { success: false, message: 'Identifiants administrateur incorrects.' };
    const { password: _, ...safe } = user;
    localStorage.setItem('iut-user', JSON.stringify(safe));
    this.addAudit('CONNEXION', 'Admin: ' + user.firstName + ' ' + user.lastName);
    return { success: true, user: safe };
  },

  loginSuperAdmin(email, password) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password && u.role === 'SUPER_ADMIN');
    if (!user) return { success: false, message: 'Identifiants Super Administrateur incorrects' };
    const { password: _, ...safe } = user;
    localStorage.setItem('iut-user', JSON.stringify(safe));
    this.addAudit('CONNEXION', 'Super Admin: ' + user.firstName + ' ' + user.lastName);
    return { success: true, user: safe };
  },

  register(data) {
    const users = this.getAllUsers();
    if (users.find(u => u.email === data.email))
      return { success: false, message: 'Cette adresse e-mail est deja utilisee. Connectez-vous ou reinitialiser votre mot de passe.' };
    if (data.matricule && users.find(u => u.matricule === data.matricule))
      return { success: false, message: 'Ce matricule est deja enregistre.' };
    const user = {
      id: 'usr-' + Date.now(), ...data, role: 'STUDENT', isActive: true,
      emailVerified: true, photoUrl: null, createdAt: new Date().toISOString(),
    };
    users.push(user);
    localStorage.setItem('iut-users', JSON.stringify(users));
    const { password: _, ...safe } = user;
    localStorage.setItem('iut-user', JSON.stringify(safe));
    this.addAudit('INSCRIPTION', 'Etudiant: ' + data.firstName + ' ' + data.lastName + ' (' + data.matricule + ')');
    return { success: true, user: safe };
  },

  logout() { localStorage.removeItem('iut-user'); },

  // Reinitialisation mot de passe
  generateResetCode(email) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);
    if (!user) return { success: false, message: 'Aucun compte associe a cette adresse.' };
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const idx = users.findIndex(u => u.id === user.id);
    users[idx].resetCode = code;
    users[idx].resetCodeExpiry = Date.now() + 600000; // 10 min
    localStorage.setItem('iut-users', JSON.stringify(users));
    return { success: true, code: code, userName: user.firstName };
  },

  verifyResetCode(email, code) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);
    if (!user || user.resetCode !== code || Date.now() > (user.resetCodeExpiry || 0))
      return { success: false, message: 'Code invalide ou expire.' };
    return { success: true };
  },

  resetPassword(email, code, newPassword) {
    const r = this.verifyResetCode(email, code);
    if (!r.success) return r;
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx < 0) return { success: false, message: 'Utilisateur non trouve.' };
    users[idx].password = newPassword;
    delete users[idx].resetCode;
    delete users[idx].resetCodeExpiry;
    localStorage.setItem('iut-users', JSON.stringify(users));
    this.addAudit('REINITIALISATION_MDP', 'Pour: ' + email);
    return { success: true };
  },

  updateProfile(updates) {
    const user = this.getUser();
    if (!user) return;
    const updated = { ...user, ...updates };
    localStorage.setItem('iut-user', JSON.stringify(updated));
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) { users[idx] = { ...users[idx], ...updates }; localStorage.setItem('iut-users', JSON.stringify(users)); }
    return updated;
  },

  getAllUsers() {
    let users = JSON.parse(localStorage.getItem('iut-users') || '[]');
    const saEmail = 'pepinierecommercialeiut@gmail.com';
    if (!users.find(u => u.email === saEmail && u.role === 'SUPER_ADMIN')) {
      users = users.filter(u => u.role !== 'SUPER_ADMIN' || u.email !== saEmail);
      users.push({
        id: 'usr-sa-1', email: saEmail, password: '@iutrequet2026mmi2',
        firstName: 'Super', lastName: 'Administrateur', phone: '',
        role: 'SUPER_ADMIN', isActive: true, emailVerified: true,
        createdAt: '2026-01-01T00:00:00Z'
      });
      localStorage.setItem('iut-users', JSON.stringify(users));
    }
    return users;
  },

  getAdmins() { return this.getAllUsers().filter(u => u.role === 'ADMIN' && u.isActive); },

  createAdmin(data) {
    const users = this.getAllUsers();
    if (users.find(u => u.email === data.email))
      return { success: false, message: 'Cette adresse e-mail est deja utilisee' };
    if (!data.password || data.password.length < 6)
      return { success: false, message: 'Le mot de passe doit contenir au moins 6 caracteres' };
    const admin = {
      id: 'usr-' + Date.now(), ...data, role: 'ADMIN', isActive: true,
      emailVerified: true, createdAt: new Date().toISOString(),
    };
    users.push(admin);
    localStorage.setItem('iut-users', JSON.stringify(users));
    this.addAudit('CREATION_ADMIN', 'Admin: ' + data.firstName + ' ' + data.lastName + ' (' + data.email + ')');
    return { success: true, user: admin };
  },

  updateUser(id, updates) {
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem('iut-users', JSON.stringify(users));
      const current = this.getUser();
      if (current && current.id === id) {
        const { password: _, ...safe } = users[idx];
        localStorage.setItem('iut-user', JSON.stringify(safe));
      }
      return users[idx];
    }
    return null;
  },

  deleteUser(id) {
    const users = this.getAllUsers().filter(u => u.id !== id);
    localStorage.setItem('iut-users', JSON.stringify(users));
  },

  addAudit(action, details) {
    const logs = JSON.parse(localStorage.getItem('iut-audit') || '[]');
    const u = this.getUser();
    logs.unshift({ id: 'log-' + Date.now(), date: new Date().toISOString(), user: u ? u.firstName + ' ' + u.lastName : 'Systeme', userEmail: u?.email || '', action: action, details: details });
    if (logs.length > 500) logs.length = 500;
    localStorage.setItem('iut-audit', JSON.stringify(logs));
  },
};

/* --- Requetes --- */
const RequestStore = {
  getAll() { return JSON.parse(localStorage.getItem('iut-requests') || '[]'); },
  getById(id) { return this.getAll().find(r => r.id === id); },
  getByStudent(sid) { return this.getAll().filter(r => r.studentId === sid); },

  create(data) {
    const reqs = this.getAll();
    const dept = data.department || 'TCO';
    const deptCode = dept.match(/\(([A-Z]+)\)/)?.[1] || dept.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const prefix = 'IUT-' + year + '-' + deptCode;
    const count = reqs.filter(r => r.referenceNumber && r.referenceNumber.startsWith(prefix)).length + 1;
    const ref = prefix + '-' + String(count).padStart(4, '0');
    const req = {
      id: 'req-' + Date.now(), referenceNumber: ref, ...data,
      status: data.isDraft ? 'DRAFT' : 'SUBMITTED', priority: 'NORMALE',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      firstViewedAt: null, resolvedAt: null, closedAt: null,
      reopenedCount: 0, reminderCount: 0, messages: [], satisfaction: null,
      statusHistory: [{ status: data.isDraft ? 'DRAFT' : 'SUBMITTED', changedBy: data.studentName || 'Etudiant', reason: 'Creation de la requete', date: new Date().toISOString() }],
    };
    reqs.push(req);
    localStorage.setItem('iut-requests', JSON.stringify(reqs));
    if (!data.isDraft) {
      NotifStore.create({ userId: data.studentId, type: 'REQUEST_CREATED', title: 'Requete soumise', message: 'Votre requete ' + ref + ' a ete soumise.', requestId: req.id, requestRef: ref });
    }
    Auth.addAudit('REQUETE_CREEE', ref + ' - ' + data.title);
    return req;
  },

  update(id, updates) {
    const reqs = this.getAll();
    const idx = reqs.findIndex(r => r.id === id);
    if (idx >= 0) { reqs[idx] = { ...reqs[idx], ...updates, updatedAt: new Date().toISOString() }; localStorage.setItem('iut-requests', JSON.stringify(reqs)); return reqs[idx]; }
    return null;
  },

  updateStatus(id, newStatus, reason, changedBy) {
    const reqs = this.getAll();
    const req = reqs.find(r => r.id === id);
    if (!req) return null;
    req.status = newStatus;
    req.updatedAt = new Date().toISOString();
    if (newStatus === 'VALIDATED') req.resolvedAt = new Date().toISOString();
    if (newStatus === 'CLOSED') req.closedAt = new Date().toISOString();
    if (newStatus === 'REOPENED') req.reopenedCount = (req.reopenedCount || 0) + 1;
    req.statusHistory = req.statusHistory || [];
    req.statusHistory.unshift({ status: newStatus, changedBy, reason, date: new Date().toISOString() });
    localStorage.setItem('iut-requests', JSON.stringify(reqs));
    NotifStore.create({ userId: req.studentId, type: 'STATUS_CHANGED', title: 'Requete ' + (CONFIG.STATUSES[newStatus]?.fr || newStatus), message: 'Statut de ' + req.referenceNumber + ' : ' + (CONFIG.STATUSES[newStatus]?.fr || newStatus) + (reason ? '. Motif : ' + reason : ''), requestId: req.id, requestRef: req.referenceNumber });
    Auth.addAudit('STATUT_MODIFIE', req.referenceNumber + ' -> ' + newStatus);
    return req;
  },

  delete(id) {
    const req = this.getById(id);
    const reqs = this.getAll().filter(r => r.id !== id);
    localStorage.setItem('iut-requests', JSON.stringify(reqs));
    if (req) Auth.addAudit('REQUETE_SUPPRIMEE', req.referenceNumber);
  },

  addMessage(reqId, senderId, senderName, senderRole, content) {
    const reqs = this.getAll();
    const req = reqs.find(r => r.id === reqId);
    if (!req) return;
    req.messages = req.messages || [];
    req.messages.push({ id: 'msg-' + Date.now(), senderId, senderName, senderRole, content, createdAt: new Date().toISOString() });
    req.updatedAt = new Date().toISOString();
    localStorage.setItem('iut-requests', JSON.stringify(reqs));
    if (senderRole === 'ADMIN') {
      NotifStore.create({ userId: req.studentId, type: 'ADMIN_RESPONSE', title: 'Message de l\'administration', message: 'Nouveau message sur ' + req.referenceNumber, requestId: req.id, requestRef: req.referenceNumber });
    }
    return req;
  },

  remind(reqId) {
    const reqs = this.getAll();
    const req = reqs.find(r => r.id === reqId);
    if (!req) return;
    req.reminderCount = (req.reminderCount || 0) + 1;
    req.lastReminderAt = new Date().toISOString();
    req.statusHistory = req.statusHistory || [];
    req.statusHistory.unshift({ status: 'RELANCE', changedBy: req.studentName, reason: 'Relance par l\'etudiant (relance n.' + req.reminderCount + ')', date: new Date().toISOString() });
    localStorage.setItem('iut-requests', JSON.stringify(reqs));
    Auth.addAudit('RELANCE', req.referenceNumber);
    return req;
  },

  setSatisfaction(reqId, score, comment) {
    const reqs = this.getAll();
    const req = reqs.find(r => r.id === reqId);
    if (!req) return;
    req.satisfaction = { score, comment, date: new Date().toISOString() };
    localStorage.setItem('iut-requests', JSON.stringify(reqs));
  },
};

/* --- Notifications --- */
const NotifStore = {
  getAll(userId) {
    const all = JSON.parse(localStorage.getItem('iut-notifications') || '[]');
    return userId ? all.filter(n => n.userId === userId) : all;
  },
  getUnreadCount(userId) { return this.getAll(userId).filter(n => !n.isRead).length; },
  create(data) {
    const ns = JSON.parse(localStorage.getItem('iut-notifications') || '[]');
    ns.unshift({ id: 'notif-' + Date.now(), ...data, isRead: false, createdAt: new Date().toISOString() });
    localStorage.setItem('iut-notifications', JSON.stringify(ns));
  },
  markAsRead(id) {
    const ns = JSON.parse(localStorage.getItem('iut-notifications') || '[]');
    const n = ns.find(x => x.id === id);
    if (n) { n.isRead = true; localStorage.setItem('iut-notifications', JSON.stringify(ns)); }
  },
  markAllAsRead(userId) {
    const ns = JSON.parse(localStorage.getItem('iut-notifications') || '[]');
    ns.forEach(n => { if (n.userId === userId && !n.isRead) n.isRead = true; });
    localStorage.setItem('iut-notifications', JSON.stringify(ns));
  },
};

/* --- Utilitaires --- */
const Utils = {
  formatDate(d) { if (!d) return '-'; return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }); },
  formatDateTime(d) { if (!d) return '-'; return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }); },
  timeAgo(d) { const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000); if (s < 60) return "a l'instant"; const m = Math.floor(s / 60); if (m < 60) return 'il y a ' + m + ' min'; const h = Math.floor(m / 60); if (h < 24) return 'il y a ' + h + 'h'; return 'il y a ' + Math.floor(h / 24) + 'j'; },
  statusBadge(status) { const s = CONFIG.STATUSES[status]; return '<span class="badge ' + (s?.class || 'badge-draft') + '">' + (s?.fr || status) + '</span>'; },
  toast(msg, type) { const c = document.getElementById('toast-container'); if (!c) return; const t = document.createElement('div'); t.className = 'toast toast-' + (type || 'info'); t.textContent = msg; c.appendChild(t); setTimeout(() => t.remove(), 4000); },
  escapeHtml(text) { if (!text) return ''; const d = document.createElement('div'); d.textContent = text; return d.innerHTML; },
};
