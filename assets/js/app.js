/* ============================================
   IUTRequests - Application Principale
   Routeur + Rendu des pages
   ============================================ */

const App = {
  init() {
    const savedTheme = localStorage.getItem('iut-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    window.addEventListener('hashchange', () => this.route());
    this.route();
  },

  route() {
    const hash = location.hash.slice(1) || '/';
    const user = Auth.getUser();
    this.closeDropdowns();

    if (!user && ['/','/login','/register','/faq','/forgot-password'].indexOf(hash.split('?')[0]) === -1) {
      location.hash = '#/login';
      return;
    }

    const path = hash.split('?')[0];
    let content = '';

    switch (path) {
      case '/': content = Pages.home(); break;
      case '/login': content = Pages.login(); break;
      case '/register': content = Pages.register(); break;
      case '/faq': content = Pages.faq(); break;
      case '/forgot-password': content = Pages.forgotPassword(); break;
      case '/dashboard':
        if (user && user.role !== 'STUDENT') { Auth.logout(); location.hash = '#/login'; return; }
        content = Pages.dashboard(); break;
      case '/requests': content = Pages.requestList(); break;
      case '/requests/new': content = Pages.createRequest(); break;
      case '/notifications': content = Pages.notifications(); break;
      case '/profile': content = Pages.profile(); break;
      default:
        if (path.startsWith('/requests/')) {
          content = Pages.requestDetail(path.split('/')[2]);
        } else {
          content = '<div class="empty-state mt-4"><h2>Page non trouvee</h2><p><a href="#/">Retour a l\'accueil</a></p></div>';
        }
    }

    document.getElementById('app').innerHTML = this.renderLayout(content, path);
    this.bindEvents();
    window.scrollTo(0, 0);
  },

  renderLayout(content, path) {
    const user = Auth.getUser();
    const isPublic = ['/', '/login', '/register', '/faq', '/forgot-password'].includes(path);
    const isLoggedIn = !!user;

    return `
      ${this.renderHeader(user, isPublic)}
      ${isLoggedIn && !isPublic ? `<div id="sidebar-overlay" class="sidebar-overlay hidden" onclick="App.toggleSidebar()"></div>` : ''}
      ${isLoggedIn && !isPublic ? this.renderSidebar(user, path) : ''}
      <main class="main-content ${isLoggedIn && !isPublic ? 'main-with-sidebar' : ''}">
        ${content}
      </main>
      ${isPublic && path === '/' ? this.renderFooter() : ''}
      <div id="toast-container" class="toast-container"></div>
      <div id="modal-root"></div>
    `;
  },

  renderHeader(user, isPublic) {
    const t = I18N.t.bind(I18N);
    const unreadCount = user ? NotifStore.getUnreadCount(user.id) : 0;

    return `
    <header class="header">
      <div class="header-inner">
        <div class="header-left">
          ${user && !isPublic ? `<button class="header-btn mobile-menu-btn" onclick="App.toggleSidebar()" aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>` : ''}
          <a class="header-logo" href="#/" onclick="return true">
            <img src="assets/images/logo.png" alt="IUT Douala" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div style="display:none;width:40px;height:40px;background:var(--primary);border-radius:8px;align-items:center;justify-content:center;color:#fff;font-family:Poppins;font-weight:700;font-size:13px">IUT</div>
            <span class="header-logo-text">IUTRequests</span>
          </a>
        </div>
        <div class="header-right">
          ${!user ? `
            <nav class="nav-links">
              <a href="#/">${t('nav.home')}</a>
              <a href="#/faq">FAQ</a>
            </nav>
          ` : ''}

          <button class="header-btn" onclick="App.toggleTheme()" title="Theme">
            <svg id="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${document.documentElement.getAttribute('data-theme') === 'dark'
                ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
                : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'}
            </svg>
          </button>

          <div class="user-menu" id="lang-menu">
            <button class="header-btn" onclick="App.toggleDropdown('lang-dropdown')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </button>
            <div id="lang-dropdown" class="dropdown lang-dropdown hidden">
              <button class="dropdown-item lang-option ${I18N.currentLang === 'fr' ? 'active text-primary' : ''}" onclick="App.changeLang('fr')">Francais</button>
              <button class="dropdown-item lang-option ${I18N.currentLang === 'en' ? 'active text-primary' : ''}" onclick="App.changeLang('en')">English</button>
            </div>
          </div>

          ${user ? `
            <a href="#/notifications" class="header-btn" title="${t('nav.notifications')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              ${unreadCount > 0 ? `<span class="header-badge-count">${unreadCount}</span>` : ''}
            </a>
            <div class="user-menu" id="user-menu">
              <button class="user-menu-trigger" onclick="App.toggleDropdown('user-dropdown')">
                <div class="user-avatar">${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}</div>
                <span class="user-name">${user.firstName} ${user.lastName}</span>
              </button>
              <div id="user-dropdown" class="dropdown hidden">
                <div class="dropdown-header">
                  <div class="dropdown-header-name">${user.firstName} ${user.lastName}</div>
                  <div class="dropdown-header-email">${user.email}</div>
                </div>
                <a href="#/profile" class="dropdown-item" onclick="App.closeDropdowns()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  ${t('nav.profile')}
                </a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item dropdown-item-danger" onclick="App.handleLogout()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  ${t('nav.logout')}
                </button>
              </div>
            </div>
          ` : `
            <a href="#/login" class="btn btn-ghost btn-sm">${t('nav.login')}</a>
            <a href="#/register" class="btn btn-primary btn-sm">${t('nav.register')}</a>
          `}
        </div>
      </div>
    </header>`;
  },

  renderSidebar(user, currentPath) {
    const t = I18N.t.bind(I18N);
    const role = user.role;

    const links = [
      { path: '/dashboard', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>', label: t('nav.dashboard') },
      { path: '/requests', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', label: t('req.my') },
      { path: '/requests/new', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', label: t('nav.newRequest') },
      { path: '/notifications', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>', label: t('nav.notifications') },
      { path: '/profile', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: t('nav.profile') },
    ];

    return `
    <aside class="sidebar" id="sidebar">
      <nav class="sidebar-nav">
        ${links.map(l => {
          if (l.section) return `<div class="sidebar-section">${l.section}</div>`;
          const isActive = currentPath === l.path || (l.path !== '/dashboard' && currentPath.startsWith(l.path));
          return `<a href="#${l.path}" class="sidebar-link ${isActive ? 'active' : ''}" onclick="App.closeSidebar()">${l.icon} ${l.label}</a>`;
        }).join('')}
      </nav>
    </aside>`;
  },

  renderFooter() {
    return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">
              <img src="assets/images/logo.png" alt="IUT" onerror="this.style.display='none'">
              <span>IUTRequests</span>
            </div>
            <p class="footer-desc">${CONFIG.INSTITUTION}. Plateforme centralisee de gestion des requetes etudiantes.</p>
          </div>
          <div>
            <h4>Contact</h4>
            <ul class="footer-links">
              <li>${CONFIG.ADDRESS}</li>
              <li>${CONFIG.EMAIL}</li>
            </ul>
          </div>
          <div>
            <h4>Liens</h4>
            <ul class="footer-links">
              <li><a href="${CONFIG.WEBSITE}" target="_blank" rel="noopener noreferrer">Site officiel de l'IUT</a></li>
              <li><a href="#/login">${I18N.t('nav.login')}</a></li>
              <li><a href="#/register">${I18N.t('nav.register')}</a></li>
              <li><a href="#/faq">FAQ</a></li>
              <li style="margin-top:8px"><a href="admin/index.html">Espace Administrateur</a></li>
              <li><a href="superadmin/index.html">Super Administration</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          ${CONFIG.APP_NAME} - ${CONFIG.INSTITUTION} - ${new Date().getFullYear()}
        </div>
      </div>
    </footer>`;
  },

  // --- Actions ---
  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('iut-theme', next);
    this.route();
  },

  changeLang(lang) {
    I18N.setLang(lang);
    this.closeDropdowns();
    this.route();
  },

  toggleDropdown(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const wasHidden = el.classList.contains('hidden');
    this.closeDropdowns();
    if (wasHidden) el.classList.remove('hidden');
  },

  closeDropdowns() {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.add('hidden'));
  },

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('hidden');
  },

  closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.add('hidden');
  },

  handleLogout() {
    Auth.logout();
    location.hash = '#/';
    this.toast(I18N.t('nav.logout'), 'success');
  },

  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success' ? '<path d="M20 6L9 17l-5-5"/>' : type === 'error' ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'}
      </svg>
      ${message}
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-menu') && !e.target.closest('.header-btn')) {
        this.closeDropdowns();
      }
    });
  },

  formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString(I18N.currentLang === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  },

  formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString(I18N.currentLang === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  },

  timeAgo(dateStr) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    const fr = I18N.currentLang === 'fr';
    if (seconds < 60) return fr ? "a l'instant" : 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return fr ? `il y a ${minutes} min` : `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return fr ? `il y a ${hours}h` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return fr ? `il y a ${days}j` : `${days}d ago`;
  },

  statusBadge(status) {
    const s = CONFIG.STATUSES[status];
    return `<span class="badge ${s?.class || 'badge-draft'}">${I18N.getStatusLabel(status)}</span>`;
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
