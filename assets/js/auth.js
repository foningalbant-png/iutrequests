/* ============================================
   IUTRequests - Authentification & Donnees
   Version Supabase (donnees en ligne)
   ============================================ */

/* --- Client Supabase --- */
const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_KEY = CONFIG.SUPABASE_ANON_KEY;

const SB = {
  async query(table, method, options) {
    let url = SUPABASE_URL + '/rest/v1/' + table;
    const headers = {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : 'return=representation'
    };

    if (method === 'GET') {
      if (options?.filter) url += '?' + options.filter;
      else url += '?select=*';
      if (options?.order) url += '&order=' + options.order;
      if (options?.limit) url += '&limit=' + options.limit;
    }

    if (method === 'DELETE') {
      url += '?' + (options?.filter || '');
    }

    if (method === 'PATCH') {
      url += '?' + (options?.filter || '');
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: headers,
        body: (method === 'POST' || method === 'PATCH') ? JSON.stringify(options?.body) : undefined
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('Supabase error:', err);
        return null;
      }
      if (method === 'DELETE') return true;
      return await res.json();
    } catch (e) {
      console.error('Supabase fetch error:', e);
      return null;
    }
  },

  async select(table, filter, order) { return await this.query(table, 'GET', { filter: filter ? 'select=*&' + filter : 'select=*', order: order || 'created_at.desc' }) || []; },
  async insert(table, data) { const r = await this.query(table, 'POST', { body: data }); return r ? (Array.isArray(r) ? r[0] : r) : null; },
  async update(table, filter, data) { return await this.query(table, 'PATCH', { filter, body: data }); },
  async delete(table, filter) { return await this.query(table, 'DELETE', { filter }); },
};

/* --- Cache local pour performance --- */
let _currentUser = JSON.parse(localStorage.getItem('iut-user') || 'null');

const Auth = {
  getUser() { return _currentUser; },
  isLoggedIn() { return !!_currentUser; },

  async login(email, password) {
    const users = await SB.select('profiles', 'email=eq.' + encodeURIComponent(email) + '&password=eq.' + encodeURIComponent(password) + '&role=eq.STUDENT');
    if (!users || users.length === 0) return { success: false, message: 'Identifiants incorrects' };
    const user = users[0];
    if (!user.is_active) return { success: false, message: 'Compte desactive' };
    _currentUser = user;
    localStorage.setItem('iut-user', JSON.stringify(user));
    this.addAudit('CONNEXION', 'Etudiant: ' + user.first_name + ' ' + user.last_name);
    return { success: true, user };
  },

  async loginAdmin(email, password) {
    const users = await SB.select('profiles', 'email=eq.' + encodeURIComponent(email) + '&password=eq.' + encodeURIComponent(password) + '&role=eq.ADMIN&is_active=eq.true');
    if (!users || users.length === 0) return { success: false, message: 'Identifiants administrateur incorrects.' };
    _currentUser = users[0];
    localStorage.setItem('iut-user', JSON.stringify(users[0]));
    this.addAudit('CONNEXION', 'Admin: ' + users[0].first_name + ' ' + users[0].last_name);
    return { success: true, user: users[0] };
  },

  async loginSuperAdmin(email, password) {
    const users = await SB.select('profiles', 'email=eq.' + encodeURIComponent(email) + '&password=eq.' + encodeURIComponent(password) + '&role=eq.SUPER_ADMIN');
    if (!users || users.length === 0) return { success: false, message: 'Identifiants Super Administrateur incorrects' };
    _currentUser = users[0];
    localStorage.setItem('iut-user', JSON.stringify(users[0]));
    this.addAudit('CONNEXION', 'Super Admin: ' + users[0].first_name);
    return { success: true, user: users[0] };
  },

  async register(data) {
    const existing = await SB.select('profiles', 'email=eq.' + encodeURIComponent(data.email));
    if (existing && existing.length > 0) return { success: false, message: 'Cette adresse e-mail est deja utilisee.' };
    if (data.matricule) {
      const existMat = await SB.select('profiles', 'matricule=eq.' + encodeURIComponent(data.matricule));
      if (existMat && existMat.length > 0) return { success: false, message: 'Ce matricule est deja enregistre.' };
    }
    const user = await SB.insert('profiles', {
      email: data.email, password: data.password,
      first_name: data.firstName, last_name: data.lastName,
      phone: data.phone, matricule: data.matricule,
      department: data.department, program: data.program,
      level: data.level, role: 'STUDENT', is_active: true
    });
    if (!user) return { success: false, message: 'Erreur lors de l\'inscription.' };
    _currentUser = user;
    localStorage.setItem('iut-user', JSON.stringify(user));
    this.addAudit('INSCRIPTION', 'Etudiant: ' + data.firstName + ' ' + data.lastName);
    return { success: true, user };
  },

  logout() { _currentUser = null; localStorage.removeItem('iut-user'); },

  async generateResetCode(email) {
    const users = await SB.select('profiles', 'email=eq.' + encodeURIComponent(email));
    if (!users || users.length === 0) return { success: false, message: 'Aucun compte associe a cette adresse.' };
    const code = String(Math.floor(100000 + Math.random() * 900000));
    return { success: true, code: code, userName: users[0].first_name, userId: users[0].id };
  },

  async resetPassword(email, newPassword) {
    await SB.update('profiles', 'email=eq.' + encodeURIComponent(email), { password: newPassword });
    this.addAudit('REINITIALISATION_MDP', 'Pour: ' + email);
    return { success: true };
  },

  async updateProfile(updates) {
    if (!_currentUser) return;
    await SB.update('profiles', 'id=eq.' + _currentUser.id, updates);
    _currentUser = { ..._currentUser, ...updates };
    localStorage.setItem('iut-user', JSON.stringify(_currentUser));
    return _currentUser;
  },

  async getAllUsers() {
    return await SB.select('profiles', null, 'created_at.desc') || [];
  },

  async getAdmins() {
    return await SB.select('profiles', 'role=eq.ADMIN&is_active=eq.true') || [];
  },

  async createAdmin(data) {
    const existing = await SB.select('profiles', 'email=eq.' + encodeURIComponent(data.email));
    if (existing && existing.length > 0) return { success: false, message: 'Cette adresse e-mail est deja utilisee' };
    if (!data.password || data.password.length < 6) return { success: false, message: 'Mot de passe requis (min. 6 caracteres)' };
    const admin = await SB.insert('profiles', {
      email: data.email, password: data.password,
      first_name: data.firstName, last_name: data.lastName,
      phone: data.phone, role: 'ADMIN', is_active: true
    });
    if (!admin) return { success: false, message: 'Erreur lors de la creation.' };
    this.addAudit('CREATION_ADMIN', 'Admin: ' + data.firstName + ' ' + data.lastName);
    return { success: true, user: admin };
  },

  async updateUser(id, updates) {
    const dbUpdates = {};
    if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
    if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.password !== undefined) dbUpdates.password = updates.password;
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.is_active !== undefined) dbUpdates.is_active = updates.is_active;
    if (updates.department !== undefined) dbUpdates.department = updates.department;
    if (updates.program !== undefined) dbUpdates.program = updates.program;
    await SB.update('profiles', 'id=eq.' + id, dbUpdates);
    if (_currentUser && _currentUser.id === id) {
      _currentUser = { ..._currentUser, ...dbUpdates };
      localStorage.setItem('iut-user', JSON.stringify(_currentUser));
    }
  },

  async deleteUser(id) {
    await SB.delete('profiles', 'id=eq.' + id);
  },

  async addAudit(action, details) {
    const u = this.getUser();
    await SB.insert('audit_logs', {
      user_name: u ? u.first_name + ' ' + u.last_name : 'Systeme',
      user_email: u?.email || '', action: action, details: details
    });
  },
};

/* --- Requetes --- */
const RequestStore = {
  async getAll() { return await SB.select('requests', null, 'created_at.desc') || []; },
  async getById(id) { const r = await SB.select('requests', 'id=eq.' + id); return r && r.length > 0 ? r[0] : null; },
  async getByStudent(sid) { return await SB.select('requests', 'student_id=eq.' + sid, 'created_at.desc') || []; },

  async create(data) {
    const all = await this.getAll();
    const deptCode = (data.department || 'TCO').match(/\(([A-Z]+)\)/)?.[1] || (data.department || 'TCO').substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const prefix = 'IUT-' + year + '-' + deptCode;
    const count = all.filter(r => r.reference_number && r.reference_number.startsWith(prefix)).length + 1;
    const ref = prefix + '-' + String(count).padStart(4, '0');

    const req = await SB.insert('requests', {
      reference_number: ref, title: data.title, description: data.description,
      status: data.isDraft ? 'DRAFT' : 'SUBMITTED', student_id: data.studentId,
      student_name: data.studentName, student_email: data.studentEmail,
      student_phone: data.studentPhone, student_matricule: data.studentMatricule,
      department: data.department, program: data.program,
      category_name: data.categoryName, priority: 'NORMALE',
      file_names: data.fileNames || []
    });
    if (!req) return null;

    await SB.insert('request_status_history', {
      request_id: req.id, status: data.isDraft ? 'DRAFT' : 'SUBMITTED',
      changed_by: data.studentName || 'Etudiant', reason: 'Creation de la requete'
    });

    if (!data.isDraft && data.studentId) {
      await NotifStore.create({ user_id: data.studentId, type: 'REQUEST_CREATED', title: 'Requete soumise', message: 'Votre requete ' + ref + ' a ete soumise.', request_id: req.id, request_ref: ref });
    }
    Auth.addAudit('REQUETE_CREEE', ref + ' - ' + data.title);
    return req;
  },

  async update(id, updates) {
    await SB.update('requests', 'id=eq.' + id, { ...updates, updated_at: new Date().toISOString() });
    return await this.getById(id);
  },

  async updateStatus(id, newStatus, reason, changedBy) {
    const req = await this.getById(id);
    if (!req) return null;
    const updates = { status: newStatus, updated_at: new Date().toISOString() };
    if (newStatus === 'VALIDATED') updates.resolved_at = new Date().toISOString();
    if (newStatus === 'CLOSED') updates.closed_at = new Date().toISOString();
    if (newStatus === 'REOPENED') updates.reopened_count = (req.reopened_count || 0) + 1;
    await SB.update('requests', 'id=eq.' + id, updates);

    await SB.insert('request_status_history', { request_id: id, status: newStatus, old_status: req.status, changed_by: changedBy, reason: reason });

    if (req.student_id) {
      await NotifStore.create({ user_id: req.student_id, type: 'STATUS_CHANGED', title: 'Requete ' + (CONFIG.STATUSES[newStatus]?.fr || newStatus), message: 'Statut de ' + req.reference_number + ' : ' + (CONFIG.STATUSES[newStatus]?.fr || newStatus) + (reason ? '. Motif : ' + reason : ''), request_id: id, request_ref: req.reference_number });
    }
    Auth.addAudit('STATUT_MODIFIE', req.reference_number + ' -> ' + newStatus);
    return await this.getById(id);
  },

  async delete(id) {
    const req = await this.getById(id);
    await SB.delete('request_status_history', 'request_id=eq.' + id);
    await SB.delete('request_messages', 'request_id=eq.' + id);
    await SB.delete('notifications', 'request_id=eq.' + id);
    await SB.delete('requests', 'id=eq.' + id);
    if (req) Auth.addAudit('REQUETE_SUPPRIMEE', req.reference_number);
  },

  async getHistory(requestId) {
    return await SB.select('request_status_history', 'request_id=eq.' + requestId, 'created_at.desc') || [];
  },

  async getMessages(requestId) {
    return await SB.select('request_messages', 'request_id=eq.' + requestId, 'created_at.asc') || [];
  },

  async addMessage(reqId, senderId, senderName, senderRole, content) {
    await SB.insert('request_messages', { request_id: reqId, sender_id: senderId, sender_name: senderName, sender_role: senderRole, content: content });
    await SB.update('requests', 'id=eq.' + reqId, { updated_at: new Date().toISOString() });

    if (senderRole === 'ADMIN') {
      const req = await this.getById(reqId);
      if (req && req.student_id) {
        await NotifStore.create({ user_id: req.student_id, type: 'ADMIN_RESPONSE', title: 'Message de l\'administration', message: 'Nouveau message sur ' + req.reference_number, request_id: reqId, request_ref: req.reference_number });
      }
    }
  },

  async remind(reqId) {
    const req = await this.getById(reqId);
    if (!req) return;
    await SB.update('requests', 'id=eq.' + reqId, { reminder_count: (req.reminder_count || 0) + 1, updated_at: new Date().toISOString() });
    await SB.insert('request_status_history', { request_id: reqId, status: 'RELANCE', changed_by: req.student_name, reason: 'Relance par l\'etudiant (n.' + ((req.reminder_count || 0) + 1) + ')' });
    Auth.addAudit('RELANCE', req.reference_number);
  },

  async setSatisfaction(reqId, score, comment) {
    await SB.update('requests', 'id=eq.' + reqId, { satisfaction_score: score, satisfaction_comment: comment });
  },
};

/* --- Notifications --- */
const NotifStore = {
  async getAll(userId) {
    if (userId) return await SB.select('notifications', 'user_id=eq.' + userId, 'created_at.desc') || [];
    return await SB.select('notifications', null, 'created_at.desc') || [];
  },
  async getUnreadCount(userId) {
    const notifs = await this.getAll(userId);
    return notifs.filter(n => !n.is_read).length;
  },
  async create(data) {
    await SB.insert('notifications', { ...data, is_read: false });
  },
  async markAsRead(id) {
    await SB.update('notifications', 'id=eq.' + id, { is_read: true });
  },
  async markAllAsRead(userId) {
    await SB.update('notifications', 'user_id=eq.' + userId + '&is_read=eq.false', { is_read: true });
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
