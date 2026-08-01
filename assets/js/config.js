/* ============================================
   IUTRequests - Configuration
   ============================================ */

const CONFIG = {
  // Supabase - Remplacez par vos propres cles apres creation du projet sur supabase.com
  SUPABASE_URL: 'https://yfnipfjbkkkvldbotvtp.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmbmlwZmpia2trdmxkYm90dnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NzEyOTksImV4cCI6MjA5ODA0NzI5OX0.kfh0xVLiu95uAzzNJIAm6q1HcxlTfrdPUHnPOl_r948',

  // Mode demo (utilise localStorage au lieu de Supabase)
  DEMO_MODE: false,

  // EmailJS - Pour l'envoi d'emails (reinitialisation mot de passe, notifications)
  // Creez un compte sur emailjs.com et remplissez ces valeurs
  EMAILJS_SERVICE_ID: 'service_r7hveqr',
  EMAILJS_TEMPLATE_ID: 'template_o9ns8aq',
  EMAILJS_PUBLIC_KEY: '6A4cLpoA-dp2XZVQA',

  // Application
  APP_NAME: 'IUTRequests',
  INSTITUTION: 'Institut Universitaire de Technologie de Douala',
  INSTITUTION_SHORT: 'IUT de Douala',
  WEBSITE: 'https://iut-dla.cm/',
  ADDRESS: 'BP 8698 Douala, Cameroun',
  EMAIL: 'infos.iut@univ-douala',

  // Statuts
  STATUSES: {
    DRAFT:              { fr: 'Brouillon',               en: 'Draft',               class: 'badge-draft' },
    SUBMITTED:          { fr: 'Soumise',                 en: 'Submitted',           class: 'badge-submitted' },
    RECEIVED:           { fr: 'Reçue',                   en: 'Received',            class: 'badge-received' },
    IN_PROGRESS:        { fr: 'En cours',                en: 'In Progress',         class: 'badge-in-progress' },
    AWAITING_DOCUMENTS: { fr: 'En attente de documents', en: 'Awaiting Documents',  class: 'badge-awaiting' },
    VALIDATED:          { fr: 'Validée',                 en: 'Validated',           class: 'badge-validated' },
    REJECTED:           { fr: 'Rejetée',                 en: 'Rejected',            class: 'badge-rejected' },
    PROCESSED:          { fr: 'Traitée',                 en: 'Processed',           class: 'badge-processed' },
    CLOSED:             { fr: 'Fermée',                  en: 'Closed',              class: 'badge-closed' },
    REOPENED:           { fr: 'Réouverte',               en: 'Reopened',            class: 'badge-reopened' },
  },

  // Départements pré-chargés
  DEPARTMENTS: [
    { code: 'GIFO', name: 'Génie Informatique', active: false },
    { code: 'GEII', name: 'Génie Électrique et Informatique Industrielle', active: false },
    { code: 'GRT',  name: 'Génie des Réseaux et Télécommunications', active: false },
    { code: 'GIM',  name: 'Génie Industriel et Maintenance', active: false },
    { code: 'GMP',  name: 'Génie Mécanique et Productique', active: false },
    { code: 'GCI',  name: 'Génie Civil', active: false },
    { code: 'GTE',  name: 'Génie Thermique et Énergie', active: false },
    { code: 'GMM',  name: 'Génie des Mines et de la Métallurgie', active: false },
    { code: 'GLT',  name: 'Génie Logistique et Transport', active: false },
    { code: 'TCO',  name: 'Techniques Commerciales', active: true },
    { code: 'CFI',  name: 'Comptabilité et Finance', active: false },
    { code: 'ESB',  name: 'Enseignements Scientifiques de Base', active: false },
    { code: 'ESG',  name: 'Enseignements Généraux', active: false },
  ],

  // Filières pré-chargées (département TCO)
  PROGRAMS: {
    TCO: [
      { code: 'GEA',    name: 'Gestion des Entreprises et des Administrations' },
      { code: 'GLT-TCO', name: 'Génie Logistique et Transport' },
      { code: 'OGA',    name: 'Organisation et Gestion Administrative' },
      { code: 'CFI-TCO', name: 'Comptabilité et Finance' },
      { code: 'TCO-F',  name: 'Techniques de Commercialisation' },
      { code: 'MMI',    name: 'Métiers du Multimédia et de l\'Internet' },
    ],
    GIFO: [
      { code: 'GL',  name: 'Génie Logiciel' },
      { code: 'ASR', name: 'Administration et Sécurité des Réseaux' },
      { code: 'IIA', name: 'Informatique Industrielle et Automatisme' },
    ],
    GIM: [
      { code: 'GIM-F',  name: 'Génie Industriel et Maintenance' },
      { code: 'GMP-GIM', name: 'Génie Mécanique et Productique' },
      { code: 'GTE-GIM', name: 'Génie Thermique, Énergie et Environnement' },
      { code: 'MQSE',   name: 'Métrologie, Qualité, Sécurité et Environnement' },
    ],
    GEII: [
      { code: 'GEII-F', name: 'Génie Électrique et Informatique Industrielle' },
      { code: 'GTR',    name: 'Génie des Télécommunications et Réseaux' },
    ],
  },

  // Catégories de requêtes
  CATEGORIES: [
    { id: 'cat-1',  name: 'Réclamation de note',            desc: 'Contestation ou signalement d\'une note erronée, manquante ou non publiée.' },
    { id: 'cat-3',  name: 'Consultation de copie',          desc: 'Demande de consultation d\'une copie d\'examen corrigée.' },
    { id: 'cat-4',  name: 'Attestation de scolarité',       desc: 'Délivrance d\'une attestation de scolarité officielle.' },
    { id: 'cat-5',  name: 'Certificat de présence',         desc: 'Certificat justifiant la présence à l\'établissement.' },
    { id: 'cat-6',  name: 'Erreur de nom',                  desc: 'Correction d\'une erreur sur le nom ou le prénom dans les documents officiels.' },
    { id: 'cat-7',  name: 'Erreur de matricule',            desc: 'Correction d\'une erreur sur le numéro de matricule.' },
    { id: 'cat-8',  name: 'Erreur administrative',          desc: 'Signalement d\'une autre erreur dans un document administratif.' },
    { id: 'cat-9',  name: 'Justification d\'absence',       desc: 'Dépôt d\'un justificatif pour une absence aux cours ou examens.' },
    { id: 'cat-10', name: 'Régularisation d\'absence',      desc: 'Régularisation après une absence non justifiée.' },
    { id: 'cat-11', name: 'Problème de paiement',           desc: 'Paiement de scolarité non enregistré ou erreur sur une quittance.' },
    { id: 'cat-13', name: 'Convention de stage',            desc: 'Établissement d\'une convention de stage en entreprise.' },
    { id: 'cat-14', name: 'Validation de stage',            desc: 'Validation administrative d\'un stage effectué.' },
    { id: 'cat-15', name: 'Lettre d\'introduction',         desc: 'Lettre d\'introduction auprès d\'une entreprise ou organisation.' },
    { id: 'cat-16', name: 'Changement de groupe',           desc: 'Demande de changement de groupe de TD ou de TP.' },
    { id: 'cat-17', name: 'Changement de filière',          desc: 'Demande de changement de filière au sein de l\'établissement.' },
    { id: 'cat-18', name: 'Réclamation d\'emploi du temps', desc: 'Signalement d\'un conflit ou d\'une erreur dans l\'emploi du temps.' },
    { id: 'cat-19', name: 'Reconstitution de dossier',      desc: 'Reconstitution d\'un dossier académique après 10 ans ou en cas de perte.' },
  ],

  // Niveaux
  LEVELS: [
    { value: 'DUT1', label: 'DUT 1ère année' },
    { value: 'DUT2', label: 'DUT 2ème année' },
    { value: 'LP',   label: 'Licence Professionnelle' },
    { value: 'MT',   label: 'Master de Technologie' },
  ],
};
