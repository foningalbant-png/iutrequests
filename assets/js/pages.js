/* ============================================
   IUTRequests - Rendu des Pages (Espace Etudiant)
   Version complete selon le cahier des charges
   ============================================ */

const Pages = {

  _getCats() {
    return JSON.parse(localStorage.getItem('iut-cats') || 'null') || CONFIG.CATEGORIES;
  },

  // =====================================================
  //  PAGE D'ACCUEIL PUBLIQUE
  // =====================================================
  home() {
    const t = I18N.t.bind(I18N);
    const cats = this._getCats();
    return `
    <!-- HERO -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              ${CONFIG.INSTITUTION}
            </div>
            <h1>${t('home.heroTitle')}</h1>
            <p>${t('home.heroSubtitle')}</p>
            <div class="hero-actions">
              <a href="#/register" class="btn btn-white btn-lg">${t('home.startBtn')} <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
              <a href="#features" class="btn btn-white-outline btn-lg">${t('home.learnMore')}</a>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-illustration">
              <div class="hero-mock-card"><div class="hero-mock-dot" style="background:#42A5F5"></div><div style="flex:1"><div class="hero-mock-line" style="width:70%"></div><div class="hero-mock-line mt-1" style="width:40%;opacity:0.5"></div></div><span class="hero-mock-badge" style="background:rgba(66,165,245,0.3)">Validee</span></div>
              <div class="hero-mock-card"><div class="hero-mock-dot" style="background:#F4B400"></div><div style="flex:1"><div class="hero-mock-line" style="width:60%"></div><div class="hero-mock-line mt-1" style="width:50%;opacity:0.5"></div></div><span class="hero-mock-badge" style="background:rgba(244,180,0,0.3)">En cours</span></div>
              <div class="hero-mock-card"><div class="hero-mock-dot" style="background:#2196F3"></div><div style="flex:1"><div class="hero-mock-line" style="width:80%"></div><div class="hero-mock-line mt-1" style="width:35%;opacity:0.5"></div></div><span class="hero-mock-badge" style="background:rgba(33,150,243,0.3)">Soumise</span></div>
              <div class="hero-mock-card" style="opacity:0.7"><div class="hero-mock-dot" style="background:#9C27B0"></div><div style="flex:1"><div class="hero-mock-line" style="width:55%"></div><div class="hero-mock-line mt-1" style="width:45%;opacity:0.5"></div></div><span class="hero-mock-badge" style="background:rgba(156,39,176,0.3)">Recue</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="hero-stats">
          <div class="hero-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg><div class="hero-stat-value">18</div><div class="hero-stat-label">Types de requetes</div></div>
          <div class="hero-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><div class="hero-stat-value">24/7</div><div class="hero-stat-label">Disponibilite</div></div>
          <div class="hero-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><div class="hero-stat-value">100%</div><div class="hero-stat-label">Tracabilite</div></div>
          <div class="hero-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg><div class="hero-stat-value">13</div><div class="hero-stat-label">Departements</div></div>
        </div>
      </div>
    </section>

    <!-- FONCTIONNALITES -->
    <section class="features" id="features">
      <div class="container">
        <div class="section-header"><h2>Pourquoi utiliser IUTRequests ?</h2><p>Une plateforme pensee pour simplifier les demarches administratives des etudiants de l'IUT de Douala.</p></div>
        <div class="features-grid">
          <div class="feature-card"><div class="feature-icon feature-icon-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div><h3>${t('home.feature1.title')}</h3><p>${t('home.feature1.desc')}</p></div>
          <div class="feature-card"><div class="feature-icon feature-icon-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div><h3>${t('home.feature2.title')}</h3><p>${t('home.feature2.desc')}</p></div>
          <div class="feature-card"><div class="feature-icon feature-icon-yellow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><h3>${t('home.feature3.title')}</h3><p>${t('home.feature3.desc')}</p></div>
          <div class="feature-card"><div class="feature-icon feature-icon-purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div><h3>${t('home.feature4.title')}</h3><p>${t('home.feature4.desc')}</p></div>
        </div>
      </div>
    </section>

    <!-- COMMENT CA FONCTIONNE -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header"><h2>${t('home.howTitle')}</h2></div>
        <div class="steps-grid">
          <div class="step"><h4>Inscription</h4><p>${t('home.step1')}</p></div>
          <div class="step"><h4>Soumission</h4><p>${t('home.step2')}</p></div>
          <div class="step"><h4>Suivi</h4><p>${t('home.step3')}</p></div>
          <div class="step"><h4>Resolution</h4><p>${t('home.step4')}</p></div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header"><h2>${t('home.categoriesTitle')}</h2></div>
        <div class="categories-grid">
          ${cats.map(c => '<div class="category-card"><h4>'+Utils.escapeHtml(c.name)+'</h4><p>'+Utils.escapeHtml(c.desc)+'</p></div>').join('')}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <h2>${t('home.ctaTitle')}</h2>
        <p>${t('home.ctaDesc')}</p>
        <a href="#/register" class="btn btn-white btn-lg">${t('home.startBtn')}</a>
      </div>
    </section>`;
  },

  // =====================================================
  //  CONNEXION
  // =====================================================
  login() {
    const t = I18N.t.bind(I18N);
    return `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-header">
          <div class="auth-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg></div>
          <h1 style="font-size:1.5rem">${t('auth.loginTitle')}</h1>
          <p class="text-secondary">${t('auth.loginSubtitle')}</p>
        </div>
        <div class="auth-card">
          <form onsubmit="return Pages.handleLogin(event)">
            <div class="form-group"><label class="form-label">${t('auth.email')}</label><input type="email" class="form-input" id="login-email" required placeholder="votre@email.com"></div>
            <div class="form-group"><label class="form-label">${t('auth.password')}</label><input type="password" class="form-input" id="login-password" required placeholder="Votre mot de passe"></div>
            <div style="text-align:right;margin-bottom:16px"><a href="#/forgot-password" class="text-primary" style="font-size:13px">${t('auth.forgotPassword')}</a></div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%">${t('auth.loginBtn')}</button>
          </form>
        </div>
        <p class="auth-footer">${t('auth.noAccount')} <a href="#/register">${t('nav.register')}</a></p>
      </div>
    </div>`;
  },

  async handleLogin(e) {
    e.preventDefault();
    const result = await Auth.login(document.getElementById('login-email').value, document.getElementById('login-password').value);
    if (result.success) { Utils.toast('Connexion reussie', 'success'); location.hash = '#/dashboard'; }
    else Utils.toast(result.message, 'error');
    return false;
  },

  // =====================================================
  //  MOT DE PASSE OUBLIE
  // =====================================================
  forgotPassword() {
    return `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-header">
          <div class="auth-icon" style="background:var(--yellow)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
          <h1 style="font-size:1.5rem">Reinitialiser le mot de passe</h1>
          <p class="text-secondary">Entrez votre adresse e-mail pour recevoir un code de validation</p>
        </div>
        <div class="auth-card" id="forgot-step1">
          <form onsubmit="return Pages.handleForgotStep1(event)">
            <div class="form-group"><label class="form-label">Adresse e-mail</label><input type="email" class="form-input" id="forgot-email" required placeholder="votre@email.com"></div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Envoyer le code</button>
          </form>
        </div>
        <div class="auth-card hidden" id="forgot-step2">
          <div class="alert alert-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><div><p style="font-size:14px">Un code de validation a ete envoye a votre adresse e-mail.</p><p id="forgot-code-display" style="font-size:13px;margin-top:4px;font-weight:600"></p></div></div>
          <form onsubmit="return Pages.handleForgotStep2(event)">
            <div class="form-group"><label class="form-label">Code de validation (6 chiffres)</label><input type="text" class="form-input" id="forgot-code" required maxlength="6" placeholder="000000" style="font-size:24px;text-align:center;letter-spacing:8px"></div>
            <div class="form-group"><label class="form-label">Nouveau mot de passe</label><input type="password" class="form-input" id="forgot-newpwd" required minlength="8" placeholder="Min. 8 caracteres"></div>
            <div class="form-group"><label class="form-label">Confirmer le nouveau mot de passe</label><input type="password" class="form-input" id="forgot-confirmpwd" required></div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Reinitialiser le mot de passe</button>
          </form>
        </div>
        <p class="auth-footer"><a href="#/login">Retour a la connexion</a></p>
      </div>
    </div>`;
  },

  _forgotEmail: '',
  _resetCode: '',

  async handleForgotStep1(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    const result = await Auth.generateResetCode(email);
    if (!result.success) { Utils.toast(result.message, 'error'); return false; }
    this._forgotEmail = email;
    this._resetCode = result.code;
    document.getElementById('forgot-step1').classList.add('hidden');
    document.getElementById('forgot-step2').classList.remove('hidden');
    document.getElementById('forgot-code-display').textContent = 'Code envoye a ' + email + ' : ' + result.code + ' (valable 10 minutes)';
    return false;
  },

  async handleForgotStep2(e) {
    e.preventDefault();
    const code = document.getElementById('forgot-code').value;
    const newPwd = document.getElementById('forgot-newpwd').value;
    const confirm = document.getElementById('forgot-confirmpwd').value;
    if (newPwd !== confirm) { Utils.toast('Les mots de passe ne correspondent pas', 'error'); return false; }
    if (newPwd.length < 8) { Utils.toast('Minimum 8 caracteres', 'error'); return false; }
    if (code !== this._resetCode) { Utils.toast('Code incorrect', 'error'); return false; }
    const result = await Auth.resetPassword(this._forgotEmail, newPwd);
    if (result.success) { Utils.toast('Mot de passe reinitialise avec succes ! Connectez-vous.', 'success'); location.hash = '#/login'; }
    else Utils.toast(result.message, 'error');
    return false;
  },

  // =====================================================
  //  INSCRIPTION
  // =====================================================
  register() {
    const t = I18N.t.bind(I18N);
    const allDeptOptions = CONFIG.DEPARTMENTS.map(d => '<option value="'+d.name+' ('+d.code+')">').join('');
    const levelOptions = CONFIG.LEVELS.map(l => '<option value="'+l.value+'">'+l.label+'</option>').join('');
    return `
    <div class="auth-page">
      <div class="auth-container auth-register">
        <div class="auth-header">
          <div class="auth-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg></div>
          <h1 style="font-size:1.5rem">${t('auth.registerTitle')}</h1>
          <p class="text-secondary">${t('auth.registerSubtitle')}</p>
        </div>
        <div class="auth-card">
          <form onsubmit="return Pages.handleRegister(event)">
            <div class="form-row">
              <div class="form-group"><label class="form-label">${t('auth.firstName')} *</label><input type="text" class="form-input" id="reg-firstName" required></div>
              <div class="form-group"><label class="form-label">${t('auth.lastName')} *</label><input type="text" class="form-input" id="reg-lastName" required></div>
            </div>
            <div class="form-group"><label class="form-label">${t('auth.email')} *</label><input type="email" class="form-input" id="reg-email" required placeholder="votre@email.com"></div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">${t('auth.phone')} *</label><input type="tel" class="form-input" id="reg-phone" required placeholder="+237 6XX XXX XXX"></div>
              <div class="form-group"><label class="form-label">${t('auth.matricule')} *</label><input type="text" class="form-input" id="reg-matricule" required></div>
            </div>
            <div class="form-group">
              <label class="form-label">${t('auth.department')} *</label>
              <input type="text" class="form-input" id="reg-department" list="dept-list" required placeholder="${t('auth.deptHint')}" oninput="Pages.updatePrograms()">
              <datalist id="dept-list">${allDeptOptions}</datalist>
            </div>
            <div class="form-group">
              <label class="form-label">${t('auth.program')} *</label>
              <input type="text" class="form-input" id="reg-program" list="prog-list" required placeholder="${t('auth.progHint')}">
              <datalist id="prog-list"></datalist>
            </div>
            <div class="form-group"><label class="form-label">${t('auth.level')}</label><select class="form-select" id="reg-level"><option value="">-- Selectionnez --</option>${levelOptions}</select></div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">${t('auth.password')} *</label><input type="password" class="form-input" id="reg-password" required minlength="8" placeholder="Min. 8 caracteres"></div>
              <div class="form-group"><label class="form-label">${t('auth.confirmPassword')} *</label><input type="password" class="form-input" id="reg-confirmPassword" required></div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg mt-2" style="width:100%">${t('auth.registerBtn')}</button>
          </form>
        </div>
        <p class="auth-footer">${t('auth.hasAccount')} <a href="#/login">${t('nav.login')}</a></p>
      </div>
    </div>`;
  },

  updatePrograms() {
    const dept = document.getElementById('reg-department')?.value || '';
    const progList = document.getElementById('prog-list');
    if (!progList) return;
    let code = '';
    CONFIG.DEPARTMENTS.forEach(d => { if (dept.includes(d.code) || dept.includes(d.name)) code = d.code; });
    const progs = CONFIG.PROGRAMS[code] || [];
    progList.innerHTML = progs.map(p => '<option value="'+p.name+' ('+p.code+')">').join('');
  },

  async handleRegister(e) {
    e.preventDefault();
    const pw = document.getElementById('reg-password').value;
    if (pw !== document.getElementById('reg-confirmPassword').value) { Utils.toast('Les mots de passe ne correspondent pas', 'error'); return false; }
    if (pw.length < 8) { Utils.toast('Le mot de passe doit contenir au moins 8 caracteres', 'error'); return false; }
    const result = await Auth.register({
      firstName: document.getElementById('reg-firstName').value,
      lastName: document.getElementById('reg-lastName').value,
      email: document.getElementById('reg-email').value,
      phone: document.getElementById('reg-phone').value,
      matricule: document.getElementById('reg-matricule').value,
      department: document.getElementById('reg-department').value,
      program: document.getElementById('reg-program').value,
      level: document.getElementById('reg-level').value,
      password: pw,
    });
    if (result.success) { Utils.toast('Compte cree avec succes !', 'success'); location.hash = '#/dashboard'; }
    else Utils.toast(result.message, 'error');
    return false;
  },

  // =====================================================
  //  DASHBOARD ETUDIANT
  // =====================================================
  async dashboard() {
    const user = Auth.getUser();
    if (!user) return '';
    if (user.role === 'ADMIN') return '<div class="empty-state mt-4"><h2>Espace Administrateur</h2><p>Veuillez acceder a votre espace dedie.</p><a href="admin/index.html" class="btn btn-primary mt-2">Acceder a l\'espace Admin</a></div>';
    if (user.role === 'SUPER_ADMIN') return '<div class="empty-state mt-4"><h2>Super Administration</h2><p>Veuillez acceder a votre espace dedie.</p><a href="superadmin/index.html" class="btn btn-primary mt-2">Acceder au Super Admin</a></div>';
    const t = I18N.t.bind(I18N);
    const requests = await RequestStore.getByStudent(user.id);
    const counts = { total: requests.length, pending: 0, validated: 0, rejected: 0, awaiting: 0 };
    requests.forEach(r => {
      if (['SUBMITTED','RECEIVED','IN_PROGRESS'].includes(r.status)) counts.pending++;
      if (['VALIDATED','PROCESSED'].includes(r.status)) counts.validated++;
      if (r.status === 'REJECTED') counts.rejected++;
      if (r.status === 'AWAITING_DOCUMENTS') counts.awaiting++;
    });
    const recent = requests.slice(-5).reverse();

    return `
    <div class="page-header">
      <div><h1 class="page-title">${t('dash.welcome')}, ${Utils.escapeHtml((user.first_name||user.firstName||''))}</h1><p class="page-subtitle">${Utils.escapeHtml(user.department || '')} ${user.program ? '- ' + Utils.escapeHtml(user.program) : ''}</p></div>
      <a href="#/requests/new" class="btn btn-primary"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> ${t('nav.newRequest')}</a>
    </div>

    ${counts.awaiting > 0 ? '<div class="alert alert-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div><strong>'+counts.awaiting+' requete(s) en attente de documents complementaires.</strong><p style="font-size:13px;margin-top:4px">L\'administration vous a demande de fournir des documents supplementaires.</p></div></div>' : ''}

    <div class="stats-grid mb-3">
      <div class="card stat-card"><div class="stat-icon" style="background:var(--primary-light);color:var(--primary)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></div><div><div class="stat-value">${counts.total}</div><div class="stat-label">${t('dash.totalRequests')}</div></div></div>
      <div class="card stat-card"><div class="stat-icon" style="background:var(--yellow-light);color:var(--yellow-dark)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div><div class="stat-value">${counts.pending}</div><div class="stat-label">${t('dash.pending')}</div></div></div>
      <div class="card stat-card"><div class="stat-icon" style="background:var(--green-light);color:var(--green)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div><div class="stat-value">${counts.validated}</div><div class="stat-label">${t('dash.validated')}</div></div></div>
      <div class="card stat-card"><div class="stat-icon" style="background:var(--red-light);color:var(--red)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div><div><div class="stat-value">${counts.rejected}</div><div class="stat-label">${t('dash.rejected')}</div></div></div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">${t('dash.recent')}</span><a href="#/requests" class="btn btn-ghost btn-sm">${t('common.all')}</a></div>
      ${recent.length > 0 ? '<div class="table-container"><table><thead><tr><th>Reference</th><th>Objet</th><th>Categorie</th><th>Statut</th><th>Date</th></tr></thead><tbody>'+recent.map(r => '<tr style="cursor:pointer" onclick="location.hash=\'#/requests/'+r.id+'\'"><td><span class="font-mono text-primary" style="font-size:13px">'+r.reference_number+'</span></td><td>'+Utils.escapeHtml(r.title)+'</td><td class="text-secondary" style="font-size:13px">'+(r.category_name||'')+'</td><td>'+Utils.statusBadge(r.status)+'</td><td class="text-muted" style="font-size:13px">'+Utils.formatDate(r.created_at)+'</td></tr>').join('')+'</tbody></table></div>' : '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg><p>Aucune requete pour le moment.</p><a href="#/requests/new" class="btn btn-primary btn-sm mt-2">Soumettre ma premiere requete</a></div>'}
    </div>`;
  },

  // =====================================================
  //  LISTE DES REQUETES + RECHERCHE + FILTRES
  // =====================================================
  async requestList() {
    const user = Auth.getUser();
    const t = I18N.t.bind(I18N);
    const allRequests = await RequestStore.getByStudent(user.id);
    const statusFilter = localStorage.getItem('iut-filter-status') || '';
    const searchTerm = localStorage.getItem('iut-filter-search') || '';
    let requests = allRequests;
    if (statusFilter) requests = requests.filter(r => r.status === statusFilter);
    if (searchTerm) requests = requests.filter(r => r.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) || r.title.toLowerCase().includes(searchTerm.toLowerCase()));
    requests = requests.slice().reverse();
    const perPage = 15;
    const page = parseInt(localStorage.getItem('iut-page') || '1');
    const totalPages = Math.ceil(requests.length / perPage) || 1;
    const paged = requests.slice((page-1)*perPage, page*perPage);

    const statusOpts = Object.keys(CONFIG.STATUSES).map(s => '<option value="'+s+'" '+(statusFilter===s?'selected':'')+'>'+CONFIG.STATUSES[s].fr+'</option>').join('');

    return `
    <div class="page-header">
      <h1 class="page-title">${t('req.my')}</h1>
      <a href="#/requests/new" class="btn btn-primary"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> ${t('nav.newRequest')}</a>
    </div>

    <div class="card">
      <div class="filters">
        <div class="search-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="form-input" id="search-input" placeholder="${t('req.searchPlaceholder')}" value="${Utils.escapeHtml(searchTerm)}" oninput="Pages.filterRequests()">
        </div>
        <select class="form-select filter-select" id="status-filter" onchange="Pages.filterRequests()">
          <option value="">Tous les statuts</option>
          ${statusOpts}
        </select>
        ${(statusFilter||searchTerm) ? '<button class="btn btn-ghost btn-sm" onclick="Pages.clearFilters()">Reinitialiser</button>' : ''}
      </div>

      <p class="text-muted mb-2" style="font-size:13px">${requests.length} requete(s) ${statusFilter ? '- Filtre: '+CONFIG.STATUSES[statusFilter]?.fr : ''} ${searchTerm ? '- Recherche: "'+Utils.escapeHtml(searchTerm)+'"' : ''}</p>

      ${paged.length > 0 ? '<div class="table-container"><table><thead><tr><th>Reference</th><th>Objet</th><th>Categorie</th><th>Statut</th><th>Date</th></tr></thead><tbody>'+paged.map(r => '<tr style="cursor:pointer" onclick="location.hash=\'#/requests/'+r.id+'\'"><td><span class="font-mono text-primary" style="font-size:13px">'+r.reference_number+'</span></td><td>'+Utils.escapeHtml(r.title)+'</td><td class="text-secondary" style="font-size:13px">'+(r.category_name||'')+'</td><td>'+Utils.statusBadge(r.status)+'</td><td class="text-muted" style="font-size:13px">'+Utils.formatDate(r.created_at)+'</td></tr>').join('')+'</tbody></table></div>' : '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg><p>Aucune requete trouvee.</p></div>'}
      ${totalPages > 1 ? '<div class="pagination"><span class="pagination-info">Page '+page+'/'+totalPages+' ('+requests.length+' requetes)</span><div class="flex gap-1">'+(page>1?'<button class="btn btn-outline btn-sm" onclick="localStorage.setItem(\'iut-page\',\''+(page-1)+'\');App.route()">Precedent</button>':'')+(page<totalPages?'<button class="btn btn-outline btn-sm" onclick="localStorage.setItem(\'iut-page\',\''+(page+1)+'\');App.route()">Suivant</button>':'')+'</div></div>' : ''}
    </div>`;
  },

  filterRequests() {
    const search = document.getElementById('search-input')?.value || '';
    const status = document.getElementById('status-filter')?.value || '';
    localStorage.setItem('iut-filter-search', search);
    localStorage.setItem('iut-filter-status', status);
    App.route();
  },

  clearFilters() {
    localStorage.removeItem('iut-filter-search');
    localStorage.removeItem('iut-filter-status');
    App.route();
  },

  // =====================================================
  //  CREATION DE REQUETE
  // =====================================================
  createRequest() {
    const user = Auth.getUser();
    const t = I18N.t.bind(I18N);
    const cats = this._getCats();
    const catOptions = cats.map(c => '<option value="'+c.id+'">'+Utils.escapeHtml(c.name)+'</option>').join('');

    return `
    <div class="page-header"><h1 class="page-title">${t('req.create')}</h1><a href="#/requests" class="btn btn-ghost btn-sm">${t('common.back')}</a></div>
    <div style="max-width:720px">
      <div class="card mb-3">
        <form id="request-form" onsubmit="return Pages.handleCreateRequest(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('auth.department')}</label>
              <input type="text" class="form-input" id="req-dept" value="${Utils.escapeHtml(user.department||'')}" placeholder="Votre departement" list="req-dept-list">
              <datalist id="req-dept-list">${CONFIG.DEPARTMENTS.map(d=>'<option value="'+d.name+' ('+d.code+')">').join('')}</datalist>
            </div>
            <div class="form-group">
              <label class="form-label">${t('auth.program')}</label>
              <input type="text" class="form-input" id="req-prog" value="${Utils.escapeHtml(user.program||'')}" placeholder="Votre filiere">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('req.selectCategory')} *</label>
            <select class="form-select" id="req-category" required onchange="Pages.onCategoryChange(this.value)">
              <option value="">-- ${t('req.selectCategory')} --</option>
              ${catOptions}
            </select>
          </div>
          <div id="category-info"></div>
          <div class="form-group">
            <label class="form-label">${t('req.title')} *</label>
            <input type="text" class="form-input" id="req-title" required placeholder="Objet de votre requete">
          </div>
          <div class="form-group">
            <label class="form-label">${t('req.description')} *</label>
            <textarea class="form-textarea" id="req-description" required placeholder="Decrivez votre demande en detail..." rows="8"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">${t('req.attachments')}</label>
            <div class="file-upload" onclick="document.getElementById('req-files').click()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p class="file-upload-text">${t('req.addFiles')}</p>
              <p class="form-hint">Tous formats acceptes - Cliquez pour parcourir</p>
            </div>
            <input type="file" id="req-files" multiple style="display:none" onchange="Pages.onFilesSelected(this)">
            <div id="file-list" class="file-list"></div>
          </div>
          <div class="flex gap-2" style="justify-content:flex-end">
            <button type="button" class="btn btn-outline" onclick="Pages.submitRequest(true)">${t('req.saveDraft')}</button>
            <button type="submit" class="btn btn-primary btn-lg">${t('req.submit')}</button>
          </div>
        </form>
      </div>
    </div>`;
  },

  onCategoryChange(catId) {
    const cats = this._getCats();
    const cat = cats.find(c => c.id === catId);
    const infoEl = document.getElementById('category-info');
    const titleEl = document.getElementById('req-title');
    const descEl = document.getElementById('req-description');
    if (!infoEl || !titleEl) return;
    if (cat) {
      titleEl.value = cat.name;
      let html = '<div class="alert alert-info mb-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><div style="flex:1"><strong>'+Utils.escapeHtml(cat.name)+'</strong><p style="font-size:13px;margin-top:4px">'+Utils.escapeHtml(cat.desc)+'</p>';
      if (cat.instructions) html += '<hr style="border:none;border-top:1px solid #90CAF9;margin:10px 0"><p style="font-size:12px;font-weight:600">Instructions :</p><p style="font-size:13px">'+Utils.escapeHtml(cat.instructions)+'</p>';
      if (cat.requiredDocuments) html += '<p style="font-size:12px;font-weight:600;margin-top:8px">Documents requis :</p><p style="font-size:13px">'+Utils.escapeHtml(cat.requiredDocuments)+'</p>';
      html += '</div></div>';
      infoEl.innerHTML = html;
      if (cat.bodyTemplate && descEl) descEl.value = cat.bodyTemplate;
    } else { infoEl.innerHTML = ''; }
  },

  onFilesSelected(input) {
    const list = document.getElementById('file-list');
    if (!list) return;
    list.innerHTML = Array.from(input.files).map(f => '<div class="file-item"><div class="file-item-info"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> '+Utils.escapeHtml(f.name)+' <span class="file-item-size">('+( f.size < 1024*1024 ? (f.size/1024).toFixed(1)+' KB' : (f.size/1024/1024).toFixed(1)+' MB')+')</span></div></div>').join('');
  },

  handleCreateRequest(e) { e.preventDefault(); this.submitRequest(false); return false; },

  async submitRequest(isDraft) {
    const user = Auth.getUser();
    const catId = document.getElementById('req-category').value;
    const cats = this._getCats();
    const cat = cats.find(c => c.id === catId);
    const dept = document.getElementById('req-dept').value || user.department || '';
    const prog = document.getElementById('req-prog').value || user.program || '';
    const title = document.getElementById('req-title').value;
    const desc = document.getElementById('req-description').value;
    if (!isDraft && (!catId || !title)) { Utils.toast('Veuillez remplir tous les champs obligatoires', 'error'); return; }
    const filesInput = document.getElementById('req-files');
    const files = filesInput && filesInput.files ? Array.from(filesInput.files) : [];
    const fileNames = files.map(f => f.name);

    // Upload des fichiers dans Supabase Storage
    const fileUrls = [];
    if (files.length > 0) {
      Utils.toast('Upload des fichiers en cours...', 'info');
      const timestamp = Date.now();
      for (const file of files) {
        const path = timestamp + '/' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const url = await SB.uploadFile(file, path);
        if (url) fileUrls.push({ name: file.name, url: url, size: file.size });
      }
    }

    const request = await RequestStore.create({
      title: title, description: desc, categoryId: catId, categoryName: cat?.name || '',
      department: dept, program: prog, studentId: user.id,
      studentName: ((user.first_name||user.firstName||'')||'')+' '+((user.last_name||user.lastName||'')||''),
      studentEmail: user.email||'', studentPhone: user.phone||'', studentMatricule: user.matricule||'',
      isDraft: isDraft, fileNames: fileNames, fileUrls: fileUrls,
    });
    if (!request) { Utils.toast('Erreur lors de la soumission', 'error'); return; }
    Utils.toast(isDraft ? 'Brouillon enregistre' : 'Requete '+(request.reference_number||'')+' soumise avec succes !', 'success');
    location.hash = '#/requests/'+request.id;
  },

  // =====================================================
  //  DETAIL D'UNE REQUETE (vue etudiant)
  // =====================================================
  async requestDetail(id) {
    const user = Auth.getUser();
    const t = I18N.t.bind(I18N);
    const req = await RequestStore.getById(id);
    if (!req) return '<div class="empty-state mt-4"><h2>Requete non trouvee</h2><a href="#/requests" class="btn btn-primary mt-2">Retour</a></div>';
    const messages = await RequestStore.getMessages(id);
    const history = await RequestStore.getHistory(id);
    req.messages = messages;
    req.statusHistory = history;
    try { req.file_urls = typeof req.file_urls === 'string' ? JSON.parse(req.file_urls) : (req.file_urls || []); } catch(e) { req.file_urls = []; }

    return `
    <div class="flex items-center gap-2 mb-3">
      <a href="#/requests" class="btn btn-ghost btn-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg></a>
      <div class="flex-1"><h1 class="page-title" style="font-size:1.25rem">${Utils.escapeHtml(req.title)}</h1><p class="text-muted font-mono" style="font-size:13px">${req.reference_number}</p></div>
      ${Utils.statusBadge(req.status)}
      <button class="btn btn-ghost btn-sm" onclick="window.print()" title="Imprimer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></button>
    </div>

    <div class="grid" style="grid-template-columns:2fr 1fr;gap:24px">
      <div>
        <div class="card mb-3">
          <h3 class="card-title mb-2">${t('req.description')}</h3>
          <p style="white-space:pre-wrap;font-size:14px;color:var(--text-secondary)">${Utils.escapeHtml(req.description)}</p>
          ${(req.file_names||[]).length > 0 ? '<h4 style="margin-top:16px;font-size:13px;color:var(--text-muted)">Pieces jointes ('+(req.file_names||[]).length+') :</h4><div class="file-list">'+(req.file_names||[]).map((name, i) => { const url = req.file_urls && req.file_urls[i] ? (typeof req.file_urls[i] === 'string' ? req.file_urls[i] : req.file_urls[i].url) : null; return '<div class="file-item"><div class="file-item-info"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> '+Utils.escapeHtml(name)+'</div>'+(url ? '<a href="'+url+'" target="_blank" class="btn btn-sm btn-outline" style="font-size:11px">Telecharger</a>' : '')+'</div>'; }).join('')+'</div>' : ''}
        </div>

        <div class="card mb-3">
          <h3 class="card-title mb-2">${t('req.messages')}</h3>
          <div class="messages-container" id="messages-container">
            ${(req.messages||[]).length > 0 ? req.messages.map(m => '<div class="message '+(m.senderId===user.id?'message-sent':'message-received')+'"><div class="message-bubble"><div class="message-sender">'+Utils.escapeHtml(m.senderName)+(m.senderRole==='ADMIN'?' (Admin)':'')+'</div>'+Utils.escapeHtml(m.content)+'<div class="message-meta">'+Utils.formatDateTime(m.createdAt)+'</div></div></div>').join('') : '<p class="text-center text-muted" style="padding:20px;font-size:14px">Aucun message. Envoyez un message a l\'administration ci-dessous.</p>'}
          </div>
          <div class="message-input-bar">
            <input type="text" class="form-input" id="message-input" placeholder="${t('req.typePlaceholder')}" onkeydown="if(event.key==='Enter')Pages.sendMessage('${id}')">
            <button class="btn btn-primary" onclick="Pages.sendMessage('${id}')">${t('req.sendMessage')}</button>
          </div>
        </div>
      </div>

      <div>
        <div class="card mb-3">
          <h4 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:12px">Informations</h4>
          <div style="font-size:14px">
            <div class="flex justify-between mb-1"><span class="text-muted">Reference</span><span class="font-mono fw-600 text-primary">${req.reference_number}</span></div>
            <div class="flex justify-between mb-1"><span class="text-muted">Categorie</span><span>${Utils.escapeHtml(req.category_name||'-')}</span></div>
            <div class="flex justify-between mb-1"><span class="text-muted">Departement</span><span>${Utils.escapeHtml(req.department||'-')}</span></div>
            ${req.program ? '<div class="flex justify-between mb-1"><span class="text-muted">Filiere</span><span>'+Utils.escapeHtml(req.program)+'</span></div>' : ''}
            <div class="flex justify-between mb-1"><span class="text-muted">Creee le</span><span style="font-size:12px">${Utils.formatDateTime(req.created_at)}</span></div>
            <div class="flex justify-between mb-1"><span class="text-muted">Consultee</span><span style="font-size:12px">${req.first_viewed_at ? Utils.formatDateTime(req.first_viewed_at) : '<span style="color:var(--yellow-dark)">Pas encore</span>'}</span></div>
            <div class="flex justify-between mb-1"><span class="text-muted">Relances</span><span>${req.reminder_count||0}</span></div>
          </div>
        </div>

        <div class="card mb-3">
          <h4 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:12px">Actions</h4>
          <div class="flex flex-col gap-1">
            ${['SUBMITTED','RECEIVED','IN_PROGRESS','AWAITING_DOCUMENTS'].includes(req.status) ? '<button class="btn btn-outline btn-sm" style="justify-content:flex-start" onclick="Pages.remindRequest(\''+id+'\')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Relancer la requete</button>' : ''}
            ${['CLOSED','REJECTED'].includes(req.status) ? '<button class="btn btn-outline btn-sm" style="justify-content:flex-start" onclick="Pages.reopenRequest(\''+id+'\')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Rouvrir cette requete</button>' : ''}
            ${['PROCESSED','CLOSED'].includes(req.status) && !req.satisfaction_score ? '<hr style="border:none;border-top:1px solid var(--border);margin:8px 0"><p style="font-size:13px;font-weight:600;margin-bottom:8px">Etes-vous satisfait(e) du traitement ?</p><div class="flex gap-1">'+[1,2,3,4,5].map(n=>'<button class="btn btn-outline btn-sm" onclick="Pages.rateSatisfaction(\''+id+'\','+n+')" style="min-width:36px">'+n+'</button>').join('')+'</div><p class="form-hint">1 = Pas du tout satisfait, 5 = Tres satisfait</p>' : ''}
            ${req.satisfaction_score ? '<div class="alert alert-success" style="margin-top:8px"><div><p style="font-size:13px">Satisfaction : <strong>'+req.satisfaction_score+'/5</strong></p>'+(req.satisfaction_comment?'<p style="font-size:12px;margin-top:4px">'+Utils.escapeHtml(req.satisfaction_comment)+'</p>':'')+'</div></div>' : ''}
            <hr style="border:none;border-top:1px solid var(--border);margin:8px 0">
            <button class="btn btn-outline btn-sm" style="justify-content:flex-start;color:var(--red);border-color:var(--red)" onclick="Pages.deleteRequest('${id}')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Supprimer cette requete</button>
          </div>
        </div>

        ${(req.statusHistory||[]).length > 0 ? '<div class="card"><h4 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:12px">Historique des statuts</h4><div class="timeline">'+(req.statusHistory||[]).map(sh => '<div class="timeline-item"><div class="timeline-content">'+Utils.statusBadge(sh.status)+(sh.reason?'<p style="font-size:12px;color:var(--text-muted);margin-top:4px">'+Utils.escapeHtml(sh.reason)+'</p>':'')+'<p class="timeline-date">'+Utils.escapeHtml(sh.changed_by||sh.changedBy||'')+' - '+Utils.formatDateTime(sh.created_at||sh.date)+'</p></div></div>').join('')+'</div></div>' : ''}
      </div>
    </div>`;
  },

  async sendMessage(requestId) {
    const input = document.getElementById('message-input');
    if (!input || !input.value.trim()) return;
    const user = Auth.getUser();
    await RequestStore.addMessage(requestId, user.id, (user.first_name||(user.first_name||user.firstName||'')||'')+' '+(user.last_name||(user.last_name||user.lastName||'')||''), user.role||'STUDENT', input.value.trim());
    App.route();
  },

  async remindRequest(id) {
    await RequestStore.remind(id);
    Utils.toast('Relance envoyee avec succes', 'success');
    App.route();
  },

  async reopenRequest(id) {
    const user = Auth.getUser();
    await RequestStore.updateStatus(id, 'REOPENED', 'Reouverture demandee par l\'etudiant', (user.first_name||'')+' '+(user.last_name||''));
    Utils.toast('Requete reouverte', 'success');
    App.route();
  },

  async rateSatisfaction(id, score) {
    const comment = prompt('Un commentaire sur le traitement de votre requete ? (facultatif)') || '';
    await RequestStore.setSatisfaction(id, score, comment);
    Utils.toast('Merci pour votre evaluation !', 'success');
    App.route();
  },

  async deleteRequest(id) {
    if (!confirm('Etes-vous sur de vouloir supprimer cette requete ? Cette action est irreversible.')) return;
    await RequestStore.delete(id);
    Utils.toast('Requete supprimee', 'success');
    location.hash = '#/requests';
  },

  // =====================================================
  //  NOTIFICATIONS
  // =====================================================
  async notifications() {
    const user = Auth.getUser();
    const t = I18N.t.bind(I18N);
    const notifs = await NotifStore.getAll(user.id);
    const unread = notifs.filter(n => !n.is_read).length;
    return `
    <div class="page-header">
      <div><h1 class="page-title">${t('notif.title')}</h1>${unread > 0 ? '<p class="page-subtitle">'+unread+' '+t('notif.unread')+'</p>' : ''}</div>
      ${unread > 0 ? '<button class="btn btn-outline btn-sm" onclick="Pages.markAllNotifRead()">'+t('notif.markAllRead')+'</button>' : ''}
    </div>
    <div class="card" style="padding:0">
      ${notifs.length > 0 ? notifs.map(n => '<div style="display:flex;align-items:flex-start;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border);'+(n.is_read?'':'background:rgba(21,101,192,0.04)')+';cursor:pointer" onclick="Pages.readNotif(\''+n.id+'\',\''+(n.requestId||'')+'\')"><div style="width:8px;height:8px;border-radius:50%;margin-top:6px;flex-shrink:0;background:'+(n.is_read?'transparent':'var(--primary)')+'"></div><div style="flex:1;min-width:0"><p class="fw-600" style="font-size:14px">'+Utils.escapeHtml(n.title)+'</p><p class="text-secondary" style="font-size:13px;margin-top:2px">'+Utils.escapeHtml(n.message)+'</p>'+(n.requestRef?'<span class="font-mono text-primary" style="font-size:12px">'+n.requestRef+'</span>':'')+'<p class="text-muted" style="font-size:12px;margin-top:4px">'+Utils.timeAgo(n.createdAt)+'</p></div></div>').join('') : '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg><p>'+t('notif.none')+'</p></div>'}
    </div>`;
  },

  readNotif(id, requestId) { NotifStore.markAsRead(id); if (requestId) location.hash = '#/requests/'+requestId; else App.route(); },
  markAllNotifRead() { const u = Auth.getUser(); NotifStore.markAllAsRead(u.id); App.route(); },

  // =====================================================
  //  PROFIL + MOT DE PASSE + SUPPRESSION COMPTE
  // =====================================================
  profile() {
    const user = Auth.getUser();
    const t = I18N.t.bind(I18N);
    return `
    <div style="max-width:640px">
      <h1 class="page-title mb-3">${t('profile.title')}</h1>

      <div class="card mb-3">
        <div class="flex items-center gap-3 mb-3">
          <div class="user-avatar" style="width:56px;height:56px;font-size:20px">${((user.first_name||user.firstName||'')||'?')[0]}${((user.last_name||user.lastName||'')||'?')[0]}</div>
          <div>
            <p class="fw-600" style="font-size:18px">${Utils.escapeHtml((user.first_name||user.firstName||''))} ${Utils.escapeHtml((user.last_name||user.lastName||''))}</p>
            <p class="text-muted" style="font-size:13px">${Utils.escapeHtml(user.email)}</p>
            <p class="text-muted" style="font-size:13px">${Utils.escapeHtml(user.matricule||'')} ${user.department ? '- '+Utils.escapeHtml(user.department) : ''}</p>
          </div>
        </div>
        <form onsubmit="return Pages.handleUpdateProfile(event)">
          <div class="form-row">
            <div class="form-group"><label class="form-label">${t('auth.firstName')}</label><input type="text" class="form-input" id="prof-fn" value="${Utils.escapeHtml((user.first_name||user.firstName||'')||'')}"></div>
            <div class="form-group"><label class="form-label">${t('auth.lastName')}</label><input type="text" class="form-input" id="prof-ln" value="${Utils.escapeHtml((user.last_name||user.lastName||'')||'')}"></div>
          </div>
          <div class="form-group"><label class="form-label">${t('auth.phone')}</label><input type="tel" class="form-input" id="prof-phone" value="${Utils.escapeHtml(user.phone||'')}"></div>
          <div class="form-group"><label class="form-label">${t('auth.department')}</label><input type="text" class="form-input" id="prof-dept" value="${Utils.escapeHtml(user.department||'')}" list="prof-dept-list"><datalist id="prof-dept-list">${CONFIG.DEPARTMENTS.map(d=>'<option value="'+d.name+' ('+d.code+')">').join('')}</datalist></div>
          <div class="form-group"><label class="form-label">${t('auth.program')}</label><input type="text" class="form-input" id="prof-prog" value="${Utils.escapeHtml(user.program||'')}"></div>
          <button type="submit" class="btn btn-primary">${t('common.save')}</button>
        </form>
      </div>

      <div class="card mb-3">
        <h3 class="card-title mb-2">${t('profile.changePassword')}</h3>
        <form onsubmit="return Pages.handleChangePassword(event)">
          <div class="form-group"><label class="form-label">${t('profile.currentPassword')}</label><input type="password" class="form-input" id="pwd-current" required></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">${t('profile.newPassword')}</label><input type="password" class="form-input" id="pwd-new" required minlength="8"></div>
            <div class="form-group"><label class="form-label">${t('auth.confirmPassword')}</label><input type="password" class="form-input" id="pwd-confirm" required></div>
          </div>
          <button type="submit" class="btn btn-primary">${t('profile.changePassword')}</button>
        </form>
      </div>

      <div class="card" style="border-color:var(--red)">
        <h3 class="card-title mb-2" style="color:var(--red)">${t('profile.deleteAccount')}</h3>
        <p class="text-secondary" style="font-size:14px;margin-bottom:16px">${t('profile.deleteWarning')} Toutes vos requetes et donnees seront definitivement supprimees.</p>
        <button class="btn btn-danger" onclick="Pages.handleDeleteAccount()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> ${t('profile.deleteAccount')}</button>
      </div>
    </div>`;
  },

  async handleUpdateProfile(e) {
    e.preventDefault();
    await Auth.updateProfile({
      first_name: document.getElementById('prof-fn').value,
      last_name: document.getElementById('prof-ln').value,
      phone: document.getElementById('prof-phone').value,
      department: document.getElementById('prof-dept').value,
      program: document.getElementById('prof-prog').value,
    });
    Utils.toast('Profil mis a jour avec succes', 'success');
    App.route();
    return false;
  },

  async handleChangePassword(e) {
    e.preventDefault();
    const current = document.getElementById('pwd-current').value;
    const newPwd = document.getElementById('pwd-new').value;
    const confirm = document.getElementById('pwd-confirm').value;
    if (newPwd !== confirm) { Utils.toast('Les mots de passe ne correspondent pas', 'error'); return false; }
    if (newPwd.length < 8) { Utils.toast('Le mot de passe doit contenir au moins 8 caracteres', 'error'); return false; }
    const user = Auth.getUser();
    const users = await Auth.getAllUsers();
    const u = users.find(x => x.id === user.id);
    if (!u || u.password !== current) { Utils.toast('Mot de passe actuel incorrect', 'error'); return false; }
    await Auth.updateUser(user.id, { password: newPwd });
    Utils.toast('Mot de passe modifie avec succes', 'success');
    document.getElementById('pwd-current').value = '';
    document.getElementById('pwd-new').value = '';
    document.getElementById('pwd-confirm').value = '';
    return false;
  },

  async handleDeleteAccount() {
    const pw = prompt('Entrez votre mot de passe pour confirmer la suppression definitive de votre compte :');
    if (!pw) return;
    const user = Auth.getUser();
    const users = await Auth.getAllUsers();
    const u = users.find(x => x.id === user.id);
    if (!u || u.password !== pw) { Utils.toast('Mot de passe incorrect', 'error'); return; }
    await Auth.deleteUser(user.id);
    Auth.logout();
    Utils.toast('Votre compte a ete supprime', 'success');
    location.hash = '#/';
  },

  // =====================================================
  //  FAQ
  // =====================================================
  faq() {
    const faqs = [
      { q: 'Comment creer un compte sur IUTRequests ?', a: 'Cliquez sur "Inscription" dans le menu, renseignez vos informations personnelles (nom, prenom, matricule, departement, filiere) et definissez un mot de passe. Votre compte sera immediatement actif.' },
      { q: 'Quels types de requetes puis-je soumettre ?', a: 'La plateforme accepte 18 types de requetes : reclamation de note, attestation de scolarite, convention de stage, justification d\'absence, et bien d\'autres. Consultez la liste complete sur la page d\'accueil.' },
      { q: 'Comment suivre l\'avancement de ma requete ?', a: 'Apres connexion, accedez a votre tableau de bord. Chaque requete affiche son statut actuel. Vous recevez egalement une notification a chaque changement de statut.' },
      { q: 'Puis-je joindre des documents a ma requete ?', a: 'Oui, vous pouvez joindre autant de documents que necessaire, dans tous les formats. Il est recommande de joindre les pieces justificatives demandees pour accelerer le traitement.' },
      { q: 'Que faire si ma requete reste sans reponse ?', a: 'Vous pouvez relancer votre requete depuis la page de detail. L\'administrateur en charge recevra une notification de relance.' },
      { q: 'Comment savoir si ma requete a ete lue ?', a: 'Lorsque l\'administrateur consulte votre requete pour la premiere fois, vous recevez automatiquement une notification "Requete consultee".' },
      { q: 'Puis-je supprimer une requete ?', a: 'Oui, vous pouvez supprimer une requete a tout moment depuis la page de detail de celle-ci.' },
      { q: 'Comment contacter l\'administration apres validation ?', a: 'Une fois votre requete validee, l\'administrateur peut vous contacter par telephone, WhatsApp, e-mail ou vous proposer un rendez-vous.' },
      { q: 'La plateforme est-elle disponible en anglais ?', a: 'Oui, IUTRequests est disponible en francais et en anglais. Utilisez le bouton de changement de langue dans le menu pour basculer.' },
      { q: 'Comment reinitialiser mon mot de passe ?', a: 'Connectez-vous a votre compte et allez dans "Profil" pour changer votre mot de passe.' },
    ];
    return `
    <div style="max-width:800px;margin:0 auto;padding:40px 20px">
      <div class="text-center mb-4"><h1>Questions frequentes</h1><p class="text-secondary mt-1">Trouvez des reponses aux questions les plus courantes sur IUTRequests.</p></div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${faqs.map(f => '<div class="card" style="cursor:pointer" onclick="this.querySelector(\'.faq-answer\').classList.toggle(\'hidden\');this.querySelector(\'.faq-chevron\').classList.toggle(\'faq-open\')"><div class="flex items-center justify-between"><h4 style="font-size:15px;flex:1">'+f.q+'</h4><svg class="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;transition:transform 0.2s"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-answer hidden" style="margin-top:12px;font-size:14px;color:var(--text-secondary);line-height:1.7">'+f.a+'</div></div>').join('')}
      </div>
      <div class="text-center mt-4"><p class="text-secondary">Vous ne trouvez pas la reponse a votre question ?</p><a href="#/register" class="btn btn-primary mt-2">Creer un compte et soumettre votre requete</a></div>
    </div>`;
  },
};
