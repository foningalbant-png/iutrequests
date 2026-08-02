/* ============================================
   IUTRequests - Rendu des Pages (Espace Etudiant)
   Version complete selon le cahier des charges
   ============================================ */

const Pages = {

  _sbCache: {},

  async _getCats() {
    if (this._sbCache.cats) return this._sbCache.cats;
    try {
      const rows = await SB.select('request_categories', 'is_active=eq.true', 'sort_order.asc,name.asc');
      if (rows && rows.length) {
        const cats = rows.map(c => ({ id: c.id, name: c.name, desc: c.description || '', instructions: c.instructions || '', bodyTemplate: c.body_template || '', requiredDocuments: c.required_documents || '' }));
        this._sbCache.cats = cats;
        return cats;
      }
    } catch(e) {}
    return CONFIG.CATEGORIES;
  },

  async _getDepts() {
    if (this._sbCache.depts) return this._sbCache.depts;
    try {
      const rows = await SB.select('departments', null, 'sort_order.asc,name.asc');
      if (rows && rows.length) { this._sbCache.depts = rows; return rows; }
    } catch(e) {}
    return CONFIG.DEPARTMENTS;
  },

  async _getProgs() {
    if (this._sbCache.progs) return this._sbCache.progs;
    try {
      const rows = await SB.query('programs', 'GET', { filter: 'select=*,departments(code)', order: 'sort_order.asc,name.asc' });
      if (rows && rows.length) {
        const progs = rows.map(p => ({ id: p.id, name: p.name, code: p.code, dept: p.departments?.code || '', headName: p.head_name || '' }));
        this._sbCache.progs = progs;
        return progs;
      }
    } catch(e) {}
    return Object.entries(CONFIG.PROGRAMS).flatMap(([dept, ps]) => ps.map(p => ({ ...p, dept })));
  },

  // =====================================================
  //  PAGE D'ACCUEIL PUBLIQUE
  // =====================================================
  async home() {
    const t = I18N.t.bind(I18N);

    // Lecture depuis Supabase pour cohérence sur tous les appareils
    let cats, depts;
    try {
      const [sbCats, sbDepts] = await Promise.all([
        SB.select('request_categories', 'is_active=eq.true', 'sort_order.asc'),
        SB.select('departments', null, 'sort_order.asc')
      ]);
      cats = (sbCats && sbCats.length > 0)
        ? sbCats.map(c => ({ id: c.id, name: c.name, desc: c.description || '' }))
        : CONFIG.CATEGORIES;
      depts = (sbDepts && sbDepts.length > 0) ? sbDepts : CONFIG.DEPARTMENTS;
    } catch (e) {
      cats = CONFIG.CATEGORIES;
      depts = CONFIG.DEPARTMENTS;
    }
    return `
    <!-- HERO -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              ${CONFIG.INSTITUTION} - Fondé en 1993
            </div>
            <h1>${t('home.heroTitle')}</h1>
            <p>${t('home.heroSubtitle')}</p>
            <div class="hero-actions">
              <a href="#/register" class="btn btn-white btn-lg">${t('home.startBtn')} <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
              <a href="#features" class="btn btn-white-outline btn-lg">${t('home.learnMore')}</a>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-campus-img">
              <img src="assets/images/campus.jpg" alt="Campus de l'IUT de Douala">
              <div class="hero-campus-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                IUT de Douala — Fondé en 1993
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="hero-stats">
          <div class="hero-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><div class="hero-stat-value">${cats.length}</div><div class="hero-stat-label">Types de requêtes</div></div>
          <div class="hero-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><div class="hero-stat-value">7j/7</div><div class="hero-stat-label">24h/24 – Disponible</div></div>
          <div class="hero-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><div class="hero-stat-value">100%</div><div class="hero-stat-label">Traçabilité</div></div>
          <div class="hero-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg><div class="hero-stat-value">${depts.length}</div><div class="hero-stat-label">Départements</div></div>
        </div>
      </div>
    </section>

    <!-- AVANTAGES VISUELS -->
    <section style="padding:60px 0;background:var(--bg)">
      <div class="container">
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:40px;align-items:center">
          <div>
            <h2 style="margin-bottom:16px">Fini les files d'attente et les dossiers perdus</h2>
            <p style="color:var(--text-secondary);line-height:1.8;margin-bottom:20px"><strong>Avec IUTRequests</strong>, déposez vos demandes administratives depuis votre téléphone ou votre ordinateur. Plus besoin de vous déplacer physiquement au service concerné. Chaque requête est tracée, numérotée et suivie du début à la fin.</p>
            <div style="display:flex;flex-direction:column;gap:12px">
              <div style="display:flex;align-items:center;gap:12px"><div style="width:40px;height:40px;border-radius:50%;background:var(--primary-light);display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div><strong>Numéro unique</strong> pour chaque requête (ex : IUT-2026-TCO-0001)</div></div>
              <div style="display:flex;align-items:center;gap:12px"><div style="width:40px;height:40px;border-radius:50%;background:var(--green-light);display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg></div><div><strong>Notifications en temps réel</strong> à chaque étape du traitement</div></div>
              <div style="display:flex;align-items:center;gap:12px"><div style="width:40px;height:40px;border-radius:50%;background:var(--yellow-light);display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--yellow-dark)" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><div><strong>Messagerie directe</strong> avec l'administration</div></div>
            </div>
          </div>
          <div style="background:var(--bg-alt);border-radius:var(--radius-xl);padding:32px;border:1px solid var(--border)">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px"><div style="width:48px;height:48px;border-radius:12px;background:var(--primary);display:flex;align-items:center;justify-content:center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div><div><div style="font-family:Poppins;font-weight:600;font-size:16px">Certificat de scolarité</div><div style="font-size:13px;color:var(--text-muted)">IUT-2026-TCO-0042</div></div></div>
            <div style="display:flex;gap:8px;margin-bottom:16px"><span class="badge badge-validated">Validée</span><span style="font-size:12px;color:var(--text-muted)">Traitement en 24h</span></div>
            <div style="height:1px;background:var(--border);margin:16px 0"></div>
            <div style="display:flex;align-items:center;gap:8px"><div style="width:32px;height:32px;border-radius:50%;background:var(--primary-light);display:flex;align-items:center;justify-content:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div style="font-size:13px"><strong>Admin. TCO</strong> a validé votre demande</div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CAMPUS BANNER -->
    <section class="campus-banner-section" style="background-image:url('assets/images/campus-banner.jpg')">
      <div class="campus-banner-overlay"></div>
      <div class="container campus-banner-content">
        <p class="campus-banner-eyebrow">Notre établissement</p>
        <h2 class="campus-banner-title">L'excellence technologique<br>au cœur de Douala</h2>
        <p class="campus-banner-sub">Fondé en 1993, l'IUT de Douala forme les ingénieurs et techniciens supérieurs qui façonnent le Cameroun de demain.</p>
      </div>
    </section>

    <!-- FONCTIONNALITES -->
    <section class="features" id="features">
      <div class="container">
        <div class="section-header"><h2>Pourquoi utiliser IUTRequests ?</h2><p>Une plateforme pensée pour simplifier les démarches administratives des étudiants de l'IUT de Douala.</p></div>
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
          <div class="step"><h4>Résolution</h4><p>${t('home.step4')}</p></div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header"><h2>${t('home.categoriesTitle')}</h2><p>Voici les types de demandes que vous pouvez soumettre via la plateforme.</p></div>
        <div class="categories-grid">
          ${cats.map((c,i) => '<div class="category-card"><div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:8px;background:'+(['var(--primary-light)','var(--green-light)','var(--yellow-light)','#F3E5F5','#E3F2FD','#FFF3E0'])[i%6]+';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-size:14px;font-weight:700;color:'+(['var(--primary)','var(--green)','var(--yellow-dark)','#7B1FA2','#1565C0','#E65100'])[i%6]+'">'+(i+1)+'</span></div><div><h4>'+Utils.escapeHtml(c.name)+'</h4><p>'+Utils.escapeHtml(c.desc)+'</p></div></div></div>').join('')}
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section style="padding:60px 0;background:var(--bg)">
      <div class="container">
        <div class="section-header"><h2>Contactez-nous</h2><p>Pour toute question concernant la plateforme ou vos démarches administratives.</p></div>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px">
          <div class="card" style="text-align:center">
            <div style="width:48px;height:48px;border-radius:12px;background:var(--primary-light);display:flex;align-items:center;justify-content:center;margin:0 auto 12px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
            <h4>E-mail</h4>
            <p style="font-size:14px;color:var(--text-secondary)">infos.iut@univ-douala</p>
            <a href="mailto:infos.iut@univ-douala" class="btn btn-outline btn-sm mt-2">Envoyer un e-mail</a>
          </div>
          <div class="card" style="text-align:center">
            <div style="width:48px;height:48px;border-radius:12px;background:#E8F5E9;display:flex;align-items:center;justify-content:center;margin:0 auto 12px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
            <h4>WhatsApp</h4>
            <p style="font-size:14px;color:var(--text-secondary)">+237 655 741 214</p>
            <a href="https://wa.me/237655741214" target="_blank" class="btn btn-outline btn-sm mt-2" style="color:#2E7D32;border-color:#2E7D32">Écrire sur WhatsApp</a>
          </div>
          <div class="card" style="text-align:center">
            <div style="width:48px;height:48px;border-radius:12px;background:var(--yellow-light);display:flex;align-items:center;justify-content:center;margin:0 auto 12px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--yellow-dark)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
            <h4>Adresse</h4>
            <p style="font-size:14px;color:var(--text-secondary)">BP 8698, Ndogbong<br>Douala, Cameroun</p>
            <a href="https://maps.google.com/?q=IUT+Douala" target="_blank" class="btn btn-outline btn-sm mt-2">Voir sur la carte</a>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <h2>${t('home.ctaTitle')}</h2>
        <p>${t('home.ctaDesc')}</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <a href="#/register" class="btn btn-white btn-lg">${t('home.startBtn')}</a>
          <a href="#/faq" class="btn btn-white-outline btn-lg">Consulter la FAQ</a>
        </div>
      </div>
    </section>`;
  },

  // =====================================================
  //  CONNEXION
  // =====================================================
  login() {
    const t = I18N.t.bind(I18N);
    return `
    <div class="auth-split">
      <div class="auth-brand-panel">
        <div class="auth-brand-logo">
          <div class="auth-brand-logo-box">IUT</div>
          <div>
            <div class="auth-brand-name">IUTRequests</div>
            <div class="auth-brand-sub">Institut Univ. de Technologie de Douala</div>
          </div>
        </div>
        <h2 class="auth-brand-title">Gérez vos démarches administratives en toute simplicité</h2>
        <p class="auth-brand-desc">Déposez, suivez et recevez des réponses à vos requêtes académiques depuis votre ordinateur ou téléphone, sans file d'attente.</p>
        <div class="auth-brand-features">
          <div class="auth-brand-feature">
            <div class="auth-brand-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
            <div><strong>17 types de requêtes</strong><span>Attestations, réclamations, stages, absences et bien plus</span></div>
          </div>
          <div class="auth-brand-feature">
            <div class="auth-brand-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
            <div><strong>Suivi en temps réel</strong><span>Notifications à chaque mise à jour de votre dossier</span></div>
          </div>
          <div class="auth-brand-feature">
            <div class="auth-brand-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
            <div><strong>Messagerie directe</strong><span>Échangez avec l'administration sur chaque requête</span></div>
          </div>
        </div>
      </div>
      <div class="auth-form-panel">
        <div class="auth-form-inner">
          <h1 class="auth-form-title">Connexion</h1>
          <p class="auth-form-subtitle">Bienvenue ! Connectez-vous pour accéder à votre espace étudiant.</p>
          <form onsubmit="return Pages.handleLogin(event)">
            <div class="form-group">
              <label class="form-label">${t('auth.email')}</label>
              <div class="form-input-with-icon">
                <span class="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
                <input type="email" class="form-input" id="login-email" required placeholder="votre@email.com">
              </div>
            </div>
            <div class="form-group">
              <div class="auth-password-row">
                <label class="form-label">${t('auth.password')}</label>
                <a href="#/forgot-password" class="auth-forgot-link">${t('auth.forgotPassword')}</a>
              </div>
              <div class="form-input-with-icon">
                <span class="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                <input type="password" class="form-input" id="login-password" required placeholder="Votre mot de passe">
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:8px">
              ${t('auth.loginBtn')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </form>
          <div class="auth-form-divider">ou</div>
          <div class="auth-form-footer">
            Pas encore de compte ? <a href="#/register" style="color:var(--primary);font-weight:600">Créer un compte étudiant</a>
          </div>
        </div>
      </div>
    </div>`;
  },

  async handleLogin(e) {
    e.preventDefault();
    const result = await Auth.login(document.getElementById('login-email').value, document.getElementById('login-password').value);
    if (result.success) { Utils.toast('Connexion réussie', 'success'); location.hash = '#/dashboard'; }
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
          <h1 style="font-size:1.5rem">Réinitialiser le mot de passe</h1>
          <p class="text-secondary">Entrez votre adresse e-mail pour recevoir un code de validation</p>
        </div>
        <div class="auth-card" id="forgot-step1">
          <form onsubmit="return Pages.handleForgotStep1(event)">
            <div class="form-group"><label class="form-label">Adresse e-mail</label><input type="email" class="form-input" id="forgot-email" required placeholder="votre@email.com"></div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Envoyer le code</button>
          </form>
        </div>
        <div class="auth-card hidden" id="forgot-step2">
          <div class="alert alert-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><div><p style="font-size:14px">Un code de validation a été envoyé à votre adresse e-mail.</p><p id="forgot-code-display" style="font-size:13px;margin-top:4px;font-weight:600"></p></div></div>
          <form onsubmit="return Pages.handleForgotStep2(event)">
            <div class="form-group"><label class="form-label">Code de validation (6 chiffres)</label><input type="text" class="form-input" id="forgot-code" required maxlength="6" placeholder="000000" style="font-size:24px;text-align:center;letter-spacing:8px"></div>
            <div class="form-group"><label class="form-label">Nouveau mot de passe</label><input type="password" class="form-input" id="forgot-newpwd" required minlength="8" placeholder="Min. 8 caractères"></div>
            <div class="form-group"><label class="form-label">Confirmer le nouveau mot de passe</label><input type="password" class="form-input" id="forgot-confirmpwd" required></div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Réinitialiser le mot de passe</button>
          </form>
        </div>
        <p class="auth-footer"><a href="#/login">Retour à la connexion</a></p>
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
    if (result.emailSent) {
      document.getElementById('forgot-code-display').textContent = 'Un code de validation a été envoyé à ' + email + '. Vérifiez votre boîte de réception (et vos spams).';
    } else {
      document.getElementById('forgot-code-display').textContent = 'Code de validation : ' + result.code + ' (EmailJS non configuré - le code est affiché ici temporairement)';
    }
    return false;
  },

  async handleForgotStep2(e) {
    e.preventDefault();
    const code = document.getElementById('forgot-code').value;
    const newPwd = document.getElementById('forgot-newpwd').value;
    const confirm = document.getElementById('forgot-confirmpwd').value;
    if (newPwd !== confirm) { Utils.toast('Les mots de passe ne correspondent pas', 'error'); return false; }
    if (newPwd.length < 8) { Utils.toast('Minimum 8 caractères', 'error'); return false; }
    if (code !== this._resetCode) { Utils.toast('Code incorrect', 'error'); return false; }
    const result = await Auth.resetPassword(this._forgotEmail, newPwd);
    if (result.success) { Utils.toast('Mot de passe réinitialisé avec succès ! Connectez-vous.', 'success'); location.hash = '#/login'; }
    else Utils.toast(result.message, 'error');
    return false;
  },

  // =====================================================
  //  INSCRIPTION
  // =====================================================
  async register() {
    const t = I18N.t.bind(I18N);
    const depts = await this._getDepts();
    const allDeptOptions = depts.map(d => '<option value="'+d.name+' ('+d.code+')">').join('');
    const levelOptions = CONFIG.LEVELS.map(l => '<option value="'+l.value+'">'+l.label+'</option>').join('');
    return `
    <div class="auth-split">
      <div class="auth-brand-panel">
        <div class="auth-brand-logo">
          <div class="auth-brand-logo-box">IUT</div>
          <div>
            <div class="auth-brand-name">IUTRequests</div>
            <div class="auth-brand-sub">Institut Univ. de Technologie de Douala</div>
          </div>
        </div>
        <h2 class="auth-brand-title">Rejoignez la plateforme officielle des étudiants de l'IUT</h2>
        <p class="auth-brand-desc">Créez votre compte en moins de 2 minutes et commencez à gérer vos démarches administratives en ligne.</p>
        <div class="auth-brand-features">
          <div class="auth-brand-feature">
            <div class="auth-brand-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
            <div><strong>Inscription rapide</strong><span>Remplissez une seule fois vos informations académiques</span></div>
          </div>
          <div class="auth-brand-feature">
            <div class="auth-brand-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
            <div><strong>Données sécurisées</strong><span>Vos informations sont protégées et confidentielles</span></div>
          </div>
          <div class="auth-brand-feature">
            <div class="auth-brand-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            <div><strong>Accès au tableau de bord</strong><span>Toutes vos requêtes centralisées en un seul endroit</span></div>
          </div>
        </div>
      </div>
      <div class="auth-form-panel">
        <div class="auth-form-inner-wide">
          <h1 class="auth-form-title">${t('auth.registerTitle')}</h1>
          <p class="auth-form-subtitle">Créez votre compte pour accéder à l'espace étudiant. Tous les champs marqués * sont obligatoires.</p>
          <form onsubmit="return Pages.handleRegister(event)">
            <div class="auth-section-label">Informations personnelles</div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">${t('auth.firstName')} *</label><input type="text" class="form-input" id="reg-firstName" required placeholder="Votre prénom"></div>
              <div class="form-group"><label class="form-label">${t('auth.lastName')} *</label><input type="text" class="form-input" id="reg-lastName" required placeholder="Votre nom"></div>
            </div>
            <div class="form-group">
              <label class="form-label">${t('auth.email')} *</label>
              <div class="form-input-with-icon">
                <span class="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
                <input type="email" class="form-input" id="reg-email" required placeholder="votre@email.com">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">${t('auth.phone')} *</label><input type="tel" class="form-input" id="reg-phone" required placeholder="+237 6XX XXX XXX"></div>
              <div class="form-group"><label class="form-label">${t('auth.matricule')} *</label><input type="text" class="form-input" id="reg-matricule" required placeholder="Ex: 22T0001"></div>
            </div>
            <div class="auth-section-label">Informations academiques</div>
            <div class="form-group">
              <label class="form-label">${t('auth.department')} *</label>
              <input type="text" class="form-input" id="reg-department" list="dept-list" required placeholder="${t('auth.deptHint')}" oninput="Pages.updatePrograms()">
              <datalist id="dept-list">${allDeptOptions}</datalist>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">${t('auth.program')} *</label>
                <input type="text" class="form-input" id="reg-program" list="prog-list" required placeholder="${t('auth.progHint')}">
                <datalist id="prog-list"></datalist>
              </div>
              <div class="form-group">
                <label class="form-label">${t('auth.level')}</label>
                <select class="form-select" id="reg-level"><option value="">-- Sélectionnez --</option>${levelOptions}</select>
              </div>
            </div>
            <div class="auth-section-label">Securite</div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">${t('auth.password')} *</label>
                <div class="form-input-with-icon">
                  <span class="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                  <input type="password" class="form-input" id="reg-password" required minlength="8" placeholder="Min. 8 caractères">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">${t('auth.confirmPassword')} *</label>
                <div class="form-input-with-icon">
                  <span class="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                  <input type="password" class="form-input" id="reg-confirmPassword" required placeholder="Répétez le mot de passe">
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg mt-2" style="width:100%">${t('auth.registerBtn')}</button>
          </form>
          <div class="auth-form-divider">Déjà inscrit ?</div>
          <div class="auth-form-footer">
            <a href="#/login" style="color:var(--primary);font-weight:600">Se connecter a mon compte</a>
          </div>
        </div>
      </div>
    </div>`;
  },

  async updatePrograms() {
    const dept = document.getElementById('reg-department')?.value || '';
    const progList = document.getElementById('prog-list');
    if (!progList) return;
    let code = '';
    const depts = await this._getDepts();
    depts.forEach(d => { if (dept.includes(d.code) || dept.includes(d.name)) code = d.code; });
    const progs = (await this._getProgs()).filter(p => p.dept === code);
    progList.innerHTML = progs.map(p => '<option value="'+p.name+' ('+p.code+')">').join('');
  },

  async handleRegister(e) {
    e.preventDefault();
    const pw = document.getElementById('reg-password').value;
    if (pw !== document.getElementById('reg-confirmPassword').value) { Utils.toast('Les mots de passe ne correspondent pas', 'error'); return false; }
    if (pw.length < 8) { Utils.toast('Le mot de passe doit contenir au moins 8 caractères', 'error'); return false; }
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
    if (result.success) {
      const prenom = document.getElementById('reg-firstName').value;
      Auth.logout();
      document.getElementById('app').innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg-alt);padding:20px">
        <div style="width:100%;max-width:480px;text-align:center">
          <div style="width:72px;height:72px;border-radius:50%;background:var(--green-light);display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0F9D58" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1 style="font-family:Poppins,sans-serif;font-size:1.6rem;font-weight:700;margin-bottom:8px">Compte créé avec succès !</h1>
          <p style="color:var(--text-secondary);margin-bottom:8px">Bienvenue <strong>${Utils.escapeHtml(prenom)}</strong> sur IUTRequests.</p>
          <p style="color:var(--text-secondary);margin-bottom:32px">Votre compte a été créé. Connectez-vous maintenant pour accéder à votre espace étudiant.</p>
          <a href="#/login" class="btn btn-primary btn-lg" style="width:100%;max-width:280px;display:inline-flex;justify-content:center">
            Se connecter a mon compte
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:8px"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <p style="margin-top:20px;font-size:13px;color:var(--text-muted)">Utilisez l'email et le mot de passe que vous venez de choisir.</p>
        </div>
      </div><div id="toast-container" class="toast-container"></div>`;
    }
    else Utils.toast(result.message, 'error');
    return false;
  },

  // =====================================================
  //  DASHBOARD ETUDIANT
  // =====================================================
  async dashboard() {
    const user = Auth.getUser();
    if (!user) return '';
    if (user.role === 'ADMIN') return '<div class="empty-state mt-4"><h2>Espace Administrateur</h2><p>Veuillez accéder à votre espace dédié.</p><a href="admin/index.html" class="btn btn-primary mt-2">Accéder à l\'espace Admin</a></div>';
    if (user.role === 'SUPER_ADMIN') return '<div class="empty-state mt-4"><h2>Super Administration</h2><p>Veuillez accéder à votre espace dédié.</p><a href="superadmin/index.html" class="btn btn-primary mt-2">Accéder au Super Admin</a></div>';
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

    const greetHour = new Date().getHours();
    const greet = greetHour < 12 ? 'Bonjour' : greetHour < 18 ? 'Bon après-midi' : 'Bonsoir';
    const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' });

    return `
    <div class="welcome-banner">
      <div class="welcome-banner-left">
        <h2>${greet}, ${Utils.escapeHtml((user.first_name||user.firstName||''))} !</h2>
        <p>${Utils.escapeHtml(user.department || '')}${user.program ? ' &bull; ' + Utils.escapeHtml(user.program) : ''} &bull; ${today}</p>
      </div>
      <a href="#/requests/new" class="welcome-banner-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        ${t('nav.newRequest')}
      </a>
    </div>

    ${counts.awaiting > 0 ? '<div class="alert alert-warning" style="margin-bottom:16px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div><strong>'+counts.awaiting+' requête(s) en attente de documents complémentaires</strong><p style="font-size:13px;margin-top:4px">L\'administration vous a demandé de fournir des documents supplémentaires. <a href="#/requests" style="color:inherit;font-weight:600">Voir mes requêtes &rarr;</a></p></div></div>' : ''}

    <div class="stats-grid mb-3">
      <div class="card stat-card-v2 blue">
        <div class="stat-icon-v2" style="background:var(--primary-light)"><svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
        <div><div class="stat-num">${counts.total}</div><div class="stat-lbl">${t('dash.totalRequests')}</div></div>
      </div>
      <div class="card stat-card-v2 yellow">
        <div class="stat-icon-v2" style="background:var(--yellow-light)"><svg viewBox="0 0 24 24" fill="none" stroke="var(--yellow-dark)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <div><div class="stat-num">${counts.pending}</div><div class="stat-lbl">${t('dash.pending')}</div></div>
      </div>
      <div class="card stat-card-v2 green">
        <div class="stat-icon-v2" style="background:var(--green-light)"><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <div><div class="stat-num">${counts.validated}</div><div class="stat-lbl">${t('dash.validated')}</div></div>
      </div>
      <div class="card stat-card-v2 red">
        <div class="stat-icon-v2" style="background:var(--red-light)"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
        <div><div class="stat-num">${counts.rejected}</div><div class="stat-lbl">${t('dash.rejected')}</div></div>
      </div>
    </div>

    <div class="quick-actions mb-3">
      <a href="#/requests/new" class="quick-action-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>Nouvelle requête</span>
      </a>
      <a href="#/requests" class="quick-action-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
        <span>Mes requêtes</span>
      </a>
      <a href="#/notifications" class="quick-action-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span>Notifications</span>
      </a>
      <a href="#/profile" class="quick-action-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Mon profil</span>
      </a>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">${t('dash.recent')}</span>
        <a href="#/requests" class="btn btn-ghost btn-sm">${t('common.all')} &rarr;</a>
      </div>
      ${recent.length > 0
        ? recent.map(r => `
          <div class="req-card-row" onclick="location.hash='#/requests/${r.id}'">
            <div class="req-card-dot" style="background:${{'SUBMITTED':'var(--primary)','RECEIVED':'#5C6BC0','IN_PROGRESS':'var(--yellow)','AWAITING_DOCUMENTS':'#E65100','VALIDATED':'var(--green)','PROCESSED':'#00695C','REJECTED':'var(--red)','CLOSED':'var(--gray-400)','REOPENED':'#7B1FA2'}[r.status]||'var(--gray-300)'}"></div>
            <div class="req-card-main">
              <div class="req-card-title">${Utils.escapeHtml(r.title)}</div>
              <div class="req-card-meta"><span>${r.category_name||''}</span></div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">
              ${Utils.statusBadge(r.status)}
              <span class="req-card-date">${Utils.formatDate(r.created_at)}</span>
            </div>
          </div>`).join('')
        : '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg><p>Aucune requête pour le moment.</p><a href="#/requests/new" class="btn btn-primary btn-sm mt-2">Soumettre ma première requête</a></div>'}
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

    const statusColors = {'SUBMITTED':'var(--primary)','RECEIVED':'#5C6BC0','IN_PROGRESS':'var(--yellow)','AWAITING_DOCUMENTS':'#E65100','VALIDATED':'var(--green)','PROCESSED':'#00695C','REJECTED':'var(--red)','CLOSED':'var(--gray-400)','REOPENED':'#7B1FA2','DRAFT':'var(--gray-300)'};

    const allReversed = allRequests.slice().reverse();

    return `
    <div class="page-header">
      <h1 class="page-title">${t('req.my')} <span style="font-size:14px;font-weight:500;color:var(--text-muted);margin-left:8px">${allRequests.length} au total</span></h1>
      <div class="flex gap-1">
        <button class="btn btn-outline btn-sm" onclick="Pages.exportRequests('csv')" title="Exporter en CSV"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> CSV</button>
        <button class="btn btn-outline btn-sm" onclick="Pages.exportRequests('pdf')" title="Exporter en PDF"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> PDF</button>
        <a href="#/requests/new" class="btn btn-primary btn-sm"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> ${t('nav.newRequest')}</a>
      </div>
    </div>

    <div class="card">
      <div class="req-filter-bar">
        <div class="search-wrapper" style="flex:1;min-width:200px">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="form-input" id="search-input" placeholder="Rechercher par référence ou objet..." value="${Utils.escapeHtml(searchTerm)}" oninput="Pages.filterRequests()">
        </div>
        <select class="form-select" style="width:auto;min-width:160px" id="status-filter" onchange="Pages.filterRequests()">
          <option value="">Tous les statuts</option>
          ${statusOpts}
        </select>
        <button id="filter-clear-btn" class="btn btn-ghost btn-sm" onclick="Pages.clearFilters()" style="display:${(statusFilter||searchTerm)?'':'none'}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Effacer
        </button>
      </div>

      <p id="req-list-count" style="font-size:12px;color:var(--text-muted);margin-bottom:8px;padding:0 4px;display:${allReversed.length>0?'':'none'}">${allReversed.length} requête(s)</p>

      <div id="req-list-items">
        ${allReversed.map(r => `
          <div class="req-card-row" onclick="location.hash='#/requests/${r.id}'"
               data-search="${((r.reference_number||'')+' '+(r.title||'')+' '+(r.category_name||'')).toLowerCase().replace(/"/g,'')}"
               data-status="${r.status}">
            <div class="req-card-dot" style="background:${statusColors[r.status]||'var(--gray-300)'}"></div>
            <div class="req-card-main">
              <div class="req-card-title">${Utils.escapeHtml(r.title)}</div>
              <div class="req-card-meta">
                <span class="req-card-ref">${r.reference_number}</span>
                <span>${r.category_name||''}</span>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0">
              ${Utils.statusBadge(r.status)}
              <span class="req-card-date">${Utils.formatDate(r.created_at)}</span>
            </div>
          </div>`).join('')}
      </div>

      <div id="req-list-empty" class="empty-state" style="display:${allReversed.length===0?'':'none'}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>Aucune requête pour le moment.</p>
        <a href="#/requests/new" class="btn btn-primary btn-sm mt-2">Soumettre ma première requête</a>
      </div>
    </div>`;
  },

  filterRequests() {
    const search = (document.getElementById('search-input')?.value || '').toLowerCase();
    const status = document.getElementById('status-filter')?.value || '';
    localStorage.setItem('iut-filter-search', search);
    localStorage.setItem('iut-filter-status', status);
    const cards = document.querySelectorAll('#req-list-items [data-search]');
    let visible = 0;
    cards.forEach(card => {
      const match = (!search || card.dataset.search.includes(search)) && (!status || card.dataset.status === status);
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    const counter = document.getElementById('req-list-count');
    const empty = document.getElementById('req-list-empty');
    const clearBtn = document.getElementById('filter-clear-btn');
    if (counter) { counter.textContent = visible + ' requête(s)'; counter.style.display = visible > 0 ? '' : 'none'; }
    if (empty) empty.style.display = visible === 0 ? '' : 'none';
    if (clearBtn) clearBtn.style.display = (search || status) ? '' : 'none';
  },

  clearFilters() {
    localStorage.removeItem('iut-filter-search');
    localStorage.removeItem('iut-filter-status');
    const si = document.getElementById('search-input');
    const sf = document.getElementById('status-filter');
    if (si) si.value = '';
    if (sf) sf.value = '';
    this.filterRequests();
  },

  // =====================================================
  //  CREATION DE REQUETE
  // =====================================================
  async createRequest() {
    const user = Auth.getUser();
    const t = I18N.t.bind(I18N);
    const [cats, depts] = await Promise.all([this._getCats(), this._getDepts()]);
    const catOptions = cats.map(c => '<option value="'+c.id+'">'+Utils.escapeHtml(c.name)+'</option>').join('');

    return `
    <div class="page-header"><h1 class="page-title">${t('req.create')}</h1><a href="#/requests" class="btn btn-ghost btn-sm">${t('common.back')}</a></div>
    <div style="max-width:720px">
      <div class="card mb-3">
        <form id="request-form" onsubmit="return Pages.handleCreateRequest(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('auth.department')}</label>
              <input type="text" class="form-input" id="req-dept" value="${Utils.escapeHtml(user.department||'')}" placeholder="Votre département" list="req-dept-list">
              <datalist id="req-dept-list">${depts.map(d=>'<option value="'+d.name+' ('+d.code+')">').join('')}</datalist>
            </div>
            <div class="form-group">
              <label class="form-label">${t('auth.program')}</label>
              <input type="text" class="form-input" id="req-prog" value="${Utils.escapeHtml(user.program||'')}" placeholder="Votre filière">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('req.selectCategory')} *</label>
              <select class="form-select" id="req-category" required onchange="Pages.onCategoryChange(this.value)">
                <option value="">-- ${t('req.selectCategory')} --</option>
                ${catOptions}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Priorité</label>
              <select class="form-select" id="req-priority">
                <option value="NORMALE">Normale</option>
                <option value="BASSE">Basse</option>
                <option value="HAUTE">Haute</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>
          </div>
          <div id="category-info"></div>
          <div class="form-group">
            <label class="form-label">${t('req.title')} *</label>
            <input type="text" class="form-input" id="req-title" required placeholder="Objet de votre requête">
          </div>
          <div class="form-group">
            <label class="form-label">${t('req.description')} *</label>
            <textarea class="form-textarea" id="req-description" required placeholder="Décrivez votre demande en détail..." rows="8"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">${t('req.attachments')}</label>
            <div class="file-upload" onclick="document.getElementById('req-files').click()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p class="file-upload-text">${t('req.addFiles')}</p>
              <p class="form-hint">Tous formats acceptés - Cliquez pour parcourir</p>
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

  async onCategoryChange(catId) {
    const cats = await this._getCats();
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
    const cats = await this._getCats();
    const cat = cats.find(c => c.id === catId);
    const dept = document.getElementById('req-dept').value || user.department || '';
    const prog = document.getElementById('req-prog').value || user.program || '';
    const title = document.getElementById('req-title').value;
    const desc = document.getElementById('req-description').value;
    const priority = document.getElementById('req-priority')?.value || 'NORMALE';
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
      isDraft: isDraft, fileNames: fileNames, fileUrls: fileUrls, priority: priority,
    });
    if (!request) { Utils.toast('Erreur lors de la soumission', 'error'); return; }
    Utils.toast(isDraft ? 'Brouillon enregistré' : 'Requête '+(request.reference_number||'')+' soumise avec succès !', 'success');
    location.hash = '#/requests/'+request.id;
  },

  // =====================================================
  //  DETAIL D'UNE REQUETE (vue etudiant)
  // =====================================================
  async requestDetail(id) {
    const user = Auth.getUser();
    const t = I18N.t.bind(I18N);
    const req = await RequestStore.getById(id);
    if (!req) return '<div class="empty-state mt-4"><h2>Requête non trouvée</h2><a href="#/requests" class="btn btn-primary mt-2">Retour</a></div>';
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
          ${(req.file_names||[]).length > 0 ? '<h4 style="margin-top:16px;font-size:13px;color:var(--text-muted)">Pièces jointes ('+(req.file_names||[]).length+') :</h4><div class="file-list">'+(req.file_names||[]).map((name, i) => { const url = req.file_urls && req.file_urls[i] ? (typeof req.file_urls[i] === 'string' ? req.file_urls[i] : req.file_urls[i].url) : null; return '<div class="file-item"><div class="file-item-info"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> '+Utils.escapeHtml(name)+'</div>'+(url ? '<a href="'+url+'" target="_blank" class="btn btn-sm btn-outline" style="font-size:11px">Télécharger</a>' : '')+'</div>'; }).join('')+'</div>' : ''}
        </div>

        <div class="card mb-3">
          <h3 class="card-title mb-2">${t('req.messages')}</h3>
          <div class="messages-container" id="messages-container">
            ${(req.messages||[]).length > 0 ? req.messages.map(m => '<div class="message '+(m.senderId===user.id?'message-sent':'message-received')+'"><div class="message-bubble"><div class="message-sender">'+Utils.escapeHtml(m.senderName)+(m.senderRole==='ADMIN'?' (Admin)':'')+'</div>'+Utils.escapeHtml(m.content)+'<div class="message-meta">'+Utils.formatDateTime(m.createdAt)+'</div></div></div>').join('') : '<p class="text-center text-muted" style="padding:20px;font-size:14px">Aucun message. Envoyez un message à l\'administration ci-dessous.</p>'}
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
            <div class="flex justify-between mb-1"><span class="text-muted">Référence</span><span class="font-mono fw-600 text-primary">${req.reference_number}</span></div>
            <div class="flex justify-between mb-1"><span class="text-muted">Catégorie</span><span>${Utils.escapeHtml(req.category_name||'-')}</span></div>
            <div class="flex justify-between mb-1"><span class="text-muted">Département</span><span>${Utils.escapeHtml(req.department||'-')}</span></div>
            ${req.program ? '<div class="flex justify-between mb-1"><span class="text-muted">Filière</span><span>'+Utils.escapeHtml(req.program)+'</span></div>' : ''}
            <div class="flex justify-between mb-1"><span class="text-muted">Priorité</span><span class="badge ${req.priority==='URGENTE'?'badge-rejected':req.priority==='HAUTE'?'badge-in-progress':req.priority==='BASSE'?'badge-closed':'badge-submitted'}">${req.priority||'NORMALE'}</span></div>
            <div class="flex justify-between mb-1"><span class="text-muted">Créée le</span><span style="font-size:12px">${Utils.formatDateTime(req.created_at)}</span></div>
            <div class="flex justify-between mb-1"><span class="text-muted">Consultée</span><span style="font-size:12px">${req.first_viewed_at ? Utils.formatDateTime(req.first_viewed_at) : '<span style="color:var(--yellow-dark)">Pas encore</span>'}</span></div>
            <div class="flex justify-between mb-1"><span class="text-muted">Relances</span><span>${req.reminder_count||0}</span></div>
          </div>
        </div>

        <div class="card mb-3">
          <h4 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:12px">Actions</h4>
          <div class="flex flex-col gap-1">
            ${['SUBMITTED','RECEIVED','IN_PROGRESS','AWAITING_DOCUMENTS'].includes(req.status) ? '<button class="btn btn-outline btn-sm" style="justify-content:flex-start" onclick="Pages.remindRequest(\''+id+'\')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Relancer la requête</button>' : ''}
            ${['CLOSED','REJECTED'].includes(req.status) ? '<button class="btn btn-outline btn-sm" style="justify-content:flex-start" onclick="Pages.reopenRequest(\''+id+'\')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Rouvrir cette requête</button>' : ''}
            ${['PROCESSED','CLOSED'].includes(req.status) && !req.satisfaction_score ? '<hr style="border:none;border-top:1px solid var(--border);margin:8px 0"><p style="font-size:13px;font-weight:600;margin-bottom:8px">Êtes-vous satisfait(e) du traitement ?</p><div class="flex gap-1">'+[1,2,3,4,5].map(n=>'<button class="btn btn-outline btn-sm" onclick="Pages.rateSatisfaction(\''+id+'\','+n+')" style="min-width:36px">'+n+'</button>').join('')+'</div><p class="form-hint">1 = Pas du tout satisfait, 5 = Très satisfait</p>' : ''}
            ${req.satisfaction_score ? '<div class="alert alert-success" style="margin-top:8px"><div><p style="font-size:13px">Satisfaction : <strong>'+req.satisfaction_score+'/5</strong></p>'+(req.satisfaction_comment?'<p style="font-size:12px;margin-top:4px">'+Utils.escapeHtml(req.satisfaction_comment)+'</p>':'')+'</div></div>' : ''}
            <hr style="border:none;border-top:1px solid var(--border);margin:8px 0">
            <button class="btn btn-outline btn-sm" style="justify-content:flex-start;color:var(--red);border-color:var(--red)" onclick="Pages.deleteRequest('${id}')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Supprimer cette requête</button>
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
    Utils.toast('Relance envoyée avec succès', 'success');
    App.route();
  },

  async reopenRequest(id) {
    const user = Auth.getUser();
    await RequestStore.updateStatus(id, 'REOPENED', 'Réouverture demandée par l\'étudiant', (user.first_name||'')+' '+(user.last_name||''));
    Utils.toast('Requête réouverte', 'success');
    App.route();
  },

  async rateSatisfaction(id, score) {
    const comment = prompt('Un commentaire sur le traitement de votre requête ? (facultatif)') || '';
    await RequestStore.setSatisfaction(id, score, comment);
    Utils.toast('Merci pour votre evaluation !', 'success');
    App.route();
  },

  async deleteRequest(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette requête ? Cette action est irréversible.')) return;
    await RequestStore.delete(id);
    Utils.toast('Requête supprimée', 'success');
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
      ${notifs.length > 0 ? notifs.map(n => '<div style="display:flex;align-items:flex-start;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border);'+(n.is_read?'':'background:rgba(21,101,192,0.04)')+';cursor:pointer" onclick="Pages.readNotif(\''+n.id+'\',\''+((n.request_id||n.requestId||'')||'')+'\')"><div style="width:8px;height:8px;border-radius:50%;margin-top:6px;flex-shrink:0;background:'+(n.is_read?'transparent':'var(--primary)')+'"></div><div style="flex:1;min-width:0"><p class="fw-600" style="font-size:14px">'+Utils.escapeHtml(n.title)+'</p><p class="text-secondary" style="font-size:13px;margin-top:2px">'+Utils.escapeHtml(n.message)+'</p>'+((n.request_ref||n.requestRef||'')?'<span class="font-mono text-primary" style="font-size:12px">'+(n.request_ref||n.requestRef||'')+'</span>':'')+'<p class="text-muted" style="font-size:12px;margin-top:4px">'+Utils.timeAgo((n.created_at||n.createdAt))+'</p></div></div>').join('') : '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg><p>'+t('notif.none')+'</p></div>'}
    </div>`;
  },

  readNotif(id, requestId) { NotifStore.markAsRead(id); if (requestId && requestId !== 'undefined') location.hash = '#/requests/'+requestId; else App.route(); },
  markAllNotifRead() { const u = Auth.getUser(); NotifStore.markAllAsRead(u.id); App.route(); },

  // =====================================================
  //  PROFIL + MOT DE PASSE + SUPPRESSION COMPTE
  // =====================================================
  async profile() {
    const user = Auth.getUser();
    const t = I18N.t.bind(I18N);
    const fn = Utils.escapeHtml(user.first_name||user.firstName||'');
    const ln = Utils.escapeHtml(user.last_name||user.lastName||'');
    const initials = ((user.first_name||user.firstName||'?')[0]||'') + ((user.last_name||user.lastName||'?')[0]||'');
    const depts = await this._getDepts();
    return `
    <div style="max-width:680px">
      <h1 class="page-title mb-3">${t('profile.title')}</h1>

      <!-- Carte identite -->
      <div class="card mb-3" style="padding:0;overflow:hidden">
        <div style="background:linear-gradient(120deg,#1565C0 0%,#1976D2 100%);padding:24px 28px;display:flex;align-items:center;gap:20px">
          <div style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-family:Poppins,sans-serif;font-weight:700;font-size:22px;color:white;flex-shrink:0">${initials}</div>
          <div style="flex:1;min-width:0">
            <div style="font-family:Poppins,sans-serif;font-weight:700;font-size:1.15rem;color:white">${fn} ${ln}</div>
            <div style="color:rgba(255,255,255,0.75);font-size:13px;margin-top:2px">${Utils.escapeHtml(user.email)}</div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">
              ${user.matricule ? '<span style="background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.9);font-family:Courier New,monospace;font-size:12px;padding:3px 10px;border-radius:20px">'+ Utils.escapeHtml(user.matricule)+'</span>' : ''}
              ${user.level ? '<span style="background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.9);font-size:12px;padding:3px 10px;border-radius:20px">'+ Utils.escapeHtml(user.level)+'</span>' : ''}
            </div>
          </div>
        </div>
        <div style="padding:8px 28px;background:var(--bg-alt);border-top:1px solid var(--border);font-size:13px;color:var(--text-secondary)">
          ${Utils.escapeHtml(user.department||'Département non renseigné')}${user.program ? ' &bull; ' + Utils.escapeHtml(user.program) : ''}
        </div>
      </div>

      <!-- Informations modifiables -->
      <div class="card mb-3">
        <h3 class="card-title mb-3">Informations personnelles</h3>
        <form onsubmit="return Pages.handleUpdateProfile(event)">
          <div class="form-row">
            <div class="form-group"><label class="form-label">${t('auth.firstName')}</label><input type="text" class="form-input" id="prof-fn" value="${fn}"></div>
            <div class="form-group"><label class="form-label">${t('auth.lastName')}</label><input type="text" class="form-input" id="prof-ln" value="${ln}"></div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('auth.email')} <span style="color:var(--text-muted);font-weight:400">(lecture seule)</span></label>
            <input type="email" class="form-input" value="${Utils.escapeHtml(user.email)}" disabled style="opacity:0.6;cursor:not-allowed">
          </div>
          <div class="form-group"><label class="form-label">${t('auth.phone')}</label><input type="tel" class="form-input" id="prof-phone" value="${Utils.escapeHtml(user.phone||'')}" placeholder="+237 6XX XXX XXX"></div>
          <div class="auth-section-label" style="margin-top:16px">Informations academiques</div>
          <div class="form-group"><label class="form-label">${t('auth.department')}</label><input type="text" class="form-input" id="prof-dept" value="${Utils.escapeHtml(user.department||'')}" list="prof-dept-list"><datalist id="prof-dept-list">${depts.map(d=>'<option value="'+d.name+' ('+d.code+')">').join('')}</datalist></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">${t('auth.program')}</label><input type="text" class="form-input" id="prof-prog" value="${Utils.escapeHtml(user.program||'')}" placeholder="Votre filière"></div>
            <div class="form-group"><label class="form-label">${t('auth.matricule')} <span style="color:var(--text-muted);font-weight:400">(lecture seule)</span></label><input type="text" class="form-input" value="${Utils.escapeHtml(user.matricule||'')}" disabled style="opacity:0.6;cursor:not-allowed;font-family:Courier New,monospace"></div>
          </div>
          <button type="submit" class="btn btn-primary">${t('common.save')}</button>
        </form>
      </div>

      <!-- Changer mot de passe -->
      <div class="card mb-3">
        <h3 class="card-title mb-3">${t('profile.changePassword')}</h3>
        <form onsubmit="return Pages.handleChangePassword(event)">
          <div class="form-group">
            <label class="form-label">${t('profile.currentPassword')}</label>
            <div class="form-input-with-icon">
              <span class="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
              <input type="password" class="form-input" id="pwd-current" required placeholder="Mot de passe actuel">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('profile.newPassword')}</label>
              <input type="password" class="form-input" id="pwd-new" required minlength="8" placeholder="Min. 8 caractères">
            </div>
            <div class="form-group">
              <label class="form-label">${t('auth.confirmPassword')}</label>
              <input type="password" class="form-input" id="pwd-confirm" required placeholder="Répétez le nouveau mot de passe">
            </div>
          </div>
          <button type="submit" class="btn btn-primary">${t('profile.changePassword')}</button>
        </form>
      </div>

      <!-- Zone danger -->
      <div class="card" style="border-color:var(--red)">
        <h3 class="card-title mb-1" style="color:var(--red)">Zone dangereuse</h3>
        <p class="text-secondary" style="font-size:13px;margin-bottom:16px">${t('profile.deleteWarning')} Toutes vos requêtes et données seront définitivement supprimées. Cette action est irréversible.</p>
        <button class="btn btn-danger btn-sm" onclick="Pages.handleDeleteAccount()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          ${t('profile.deleteAccount')}
        </button>
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
    Utils.toast('Profil mis à jour avec succès', 'success');
    App.route();
    return false;
  },

  async handleChangePassword(e) {
    e.preventDefault();
    const current = document.getElementById('pwd-current').value;
    const newPwd = document.getElementById('pwd-new').value;
    const confirm = document.getElementById('pwd-confirm').value;
    if (newPwd !== confirm) { Utils.toast('Les mots de passe ne correspondent pas', 'error'); return false; }
    if (newPwd.length < 8) { Utils.toast('Le mot de passe doit contenir au moins 8 caractères', 'error'); return false; }
    const user = Auth.getUser();
    const users = await Auth.getAllUsers();
    const u = users.find(x => x.id === user.id);
    if (!u || u.password !== current) { Utils.toast('Mot de passe actuel incorrect', 'error'); return false; }
    await Auth.updateUser(user.id, { password: newPwd });
    Utils.toast('Mot de passe modifié avec succès', 'success');
    document.getElementById('pwd-current').value = '';
    document.getElementById('pwd-new').value = '';
    document.getElementById('pwd-confirm').value = '';
    return false;
  },

  async handleDeleteAccount() {
    const pw = prompt('Entrez votre mot de passe pour confirmer la suppression définitive de votre compte :');
    if (!pw) return;
    const user = Auth.getUser();
    const users = await Auth.getAllUsers();
    const u = users.find(x => x.id === user.id);
    if (!u || u.password !== pw) { Utils.toast('Mot de passe incorrect', 'error'); return; }
    await Auth.deleteUser(user.id);
    Auth.logout();
    Utils.toast('Votre compte a été supprimé', 'success');
    location.hash = '#/';
  },

  // =====================================================
  //  EXPORT EXCEL / PDF
  // =====================================================
  async exportRequests(format) {
    const user = Auth.getUser();
    const requests = await RequestStore.getByStudent(user.id);
    if (requests.length === 0) { Utils.toast('Aucune requête à exporter', 'error'); return; }

    if (format === 'csv') {
      let csv = 'Référence;Objet;Catégorie;Statut;Priorité;Département;Filière;Date\n';
      requests.forEach(r => {
        csv += (r.reference_number||'')+';'+(r.title||'').replace(/;/g,',')+';'+(r.category_name||'')+';'+(CONFIG.STATUSES[r.status]?.fr||r.status)+';'+(r.priority||'NORMALE')+';'+(r.department||'')+';'+(r.program||'')+';'+Utils.formatDate(r.created_at)+'\n';
      });
      const blob = new Blob(['﻿'+csv], {type:'text/csv;charset=utf-8;'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'IUTRequests_export_'+new Date().toISOString().split('T')[0]+'.csv';
      link.click();
      Utils.toast('Export CSV téléchargé', 'success');
    }

    if (format === 'pdf') {
      const win = window.open('','_blank');
      win.document.write('<html><head><title>IUTRequests - Export</title><style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:12px}th{background:#1565C0;color:white}h1{color:#1565C0;font-size:18px}p{color:#666;font-size:13px}</style></head><body>');
      win.document.write('<h1>IUTRequests - Mes Requêtes</h1>');
      win.document.write('<p>Étudiant : '+(user.first_name||'')+' '+(user.last_name||'')+' | Matricule : '+(user.matricule||'')+' | Export du '+new Date().toLocaleDateString('fr-FR')+'</p>');
      win.document.write('<table><tr><th>Référence</th><th>Objet</th><th>Catégorie</th><th>Statut</th><th>Priorité</th><th>Date</th></tr>');
      requests.forEach(r => {
        win.document.write('<tr><td>'+(r.reference_number||'')+'</td><td>'+(r.title||'')+'</td><td>'+(r.category_name||'')+'</td><td>'+(CONFIG.STATUSES[r.status]?.fr||r.status)+'</td><td>'+(r.priority||'NORMALE')+'</td><td>'+Utils.formatDate(r.created_at)+'</td></tr>');
      });
      win.document.write('</table><p style="margin-top:20px;font-size:11px">Institut Universitaire de Technologie de Douala - IUTRequests</p></body></html>');
      win.document.close();
      win.print();
      Utils.toast('Export PDF généré', 'success');
    }
  },

  // =====================================================
  //  FAQ
  // =====================================================
  faq() {
    const customFaqs = JSON.parse(localStorage.getItem('iut-faqs') || '[]');
    const faqs = customFaqs.length > 0 ? customFaqs : [
      { q: 'Comment créer un compte sur IUTRequests ?', a: 'Cliquez sur "Inscription" dans le menu, renseignez vos informations personnelles (nom, prénom, matricule, département, filière) et définissez un mot de passe. Votre compte sera immédiatement actif.' },
      { q: 'Quels types de requêtes puis-je soumettre ?', a: 'La plateforme accepte 18 types de requêtes : réclamation de note, attestation de scolarité, convention de stage, justification d\'absence, et bien d\'autres. Consultez la liste complète sur la page d\'accueil.' },
      { q: 'Comment suivre l\'avancement de ma requête ?', a: 'Après connexion, accédez à votre tableau de bord. Chaque requête affiche son statut actuel. Vous recevez également une notification à chaque changement de statut.' },
      { q: 'Puis-je joindre des documents à ma requête ?', a: 'Oui, vous pouvez joindre autant de documents que nécessaire, dans tous les formats. Il est recommandé de joindre les pièces justificatives demandées pour accélérer le traitement.' },
      { q: 'Que faire si ma requête reste sans réponse ?', a: 'Vous pouvez relancer votre requête depuis la page de détail. L\'administrateur en charge recevra une notification de relance.' },
      { q: 'Comment savoir si ma requête a été lue ?', a: 'Lorsque l\'administrateur consulte votre requête pour la première fois, vous recevez automatiquement une notification "Requête consultée".' },
      { q: 'Puis-je supprimer une requête ?', a: 'Oui, vous pouvez supprimer une requête à tout moment depuis la page de détail de celle-ci.' },
      { q: 'Comment contacter l\'administration après validation ?', a: 'Une fois votre requête validée, l\'administrateur peut vous contacter par téléphone, WhatsApp, e-mail ou vous proposer un rendez-vous.' },
      { q: 'La plateforme est-elle disponible en anglais ?', a: 'Oui, IUTRequests est disponible en français et en anglais. Utilisez le bouton de changement de langue dans le menu pour basculer.' },
      { q: 'Comment réinitialiser mon mot de passe ?', a: 'Connectez-vous à votre compte et allez dans "Profil" pour changer votre mot de passe.' },
    ];
    return `
    <div style="max-width:800px;margin:0 auto;padding:40px 20px">
      <div class="text-center mb-4"><h1>Questions fréquentes</h1><p class="text-secondary mt-1">Trouvez des réponses aux questions les plus courantes sur IUTRequests.</p></div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${faqs.map(f => '<div class="card" style="cursor:pointer" onclick="this.querySelector(\'.faq-answer\').classList.toggle(\'hidden\');this.querySelector(\'.faq-chevron\').classList.toggle(\'faq-open\')"><div class="flex items-center justify-between"><h4 style="font-size:15px;flex:1">'+f.q+'</h4><svg class="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;transition:transform 0.2s"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-answer hidden" style="margin-top:12px;font-size:14px;color:var(--text-secondary);line-height:1.7">'+f.a+'</div></div>').join('')}
      </div>
      <div class="text-center mt-4"><p class="text-secondary">Vous ne trouvez pas la réponse à votre question ?</p><a href="#/register" class="btn btn-primary mt-2">Créer un compte et soumettre votre requête</a></div>
    </div>`;
  },
};
