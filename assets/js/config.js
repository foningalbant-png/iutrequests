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
    DRAFT: { fr: 'Brouillon', en: 'Draft', class: 'badge-draft' },
    SUBMITTED: { fr: 'Soumise', en: 'Submitted', class: 'badge-submitted' },
    RECEIVED: { fr: 'Recue', en: 'Received', class: 'badge-received' },
    IN_PROGRESS: { fr: 'En cours', en: 'In Progress', class: 'badge-in-progress' },
    AWAITING_DOCUMENTS: { fr: 'En attente de documents', en: 'Awaiting Documents', class: 'badge-awaiting' },
    VALIDATED: { fr: 'Validee', en: 'Validated', class: 'badge-validated' },
    REJECTED: { fr: 'Rejetee', en: 'Rejected', class: 'badge-rejected' },
    PROCESSED: { fr: 'Traitee', en: 'Processed', class: 'badge-processed' },
    CLOSED: { fr: 'Fermee', en: 'Closed', class: 'badge-closed' },
    REOPENED: { fr: 'Reouverte', en: 'Reopened', class: 'badge-reopened' },
  },

  // Departements pre-charges
  DEPARTMENTS: [
    { code: 'GIFO', name: 'Genie Informatique', active: false },
    { code: 'GEII', name: 'Genie Electrique et Informatique Industrielle', active: false },
    { code: 'GRT', name: 'Genie des Reseaux et Telecommunications', active: false },
    { code: 'GIM', name: 'Genie Industriel et Maintenance', active: false },
    { code: 'GMP', name: 'Genie Mecanique et Productique', active: false },
    { code: 'GCI', name: 'Genie Civil', active: false },
    { code: 'GTE', name: 'Genie Thermique et Energie', active: false },
    { code: 'GMM', name: 'Genie des Mines et de la Metallurgie', active: false },
    { code: 'GLT', name: 'Genie Logistique et Transport', active: false },
    { code: 'TCO', name: 'Techniques Commerciales', active: true },
    { code: 'CFI', name: 'Comptabilite et Finance', active: false },
    { code: 'ESB', name: 'Enseignements Scientifiques de Base', active: false },
    { code: 'ESG', name: 'Enseignements Generaux', active: false },
  ],

  // Filieres pre-chargees (departement TCO)
  PROGRAMS: {
    TCO: [
      { code: 'GEA', name: 'Gestion des Entreprises et des Administrations' },
      { code: 'GLT-TCO', name: 'Genie Logistique et Transport' },
      { code: 'OGA', name: 'Organisation et Gestion Administrative' },
      { code: 'CFI-TCO', name: 'Comptabilite et Finance' },
      { code: 'TCO-F', name: 'Techniques de Commercialisation' },
      { code: 'MMI', name: 'Metiers du Multimedia et de l\'Internet' },
    ],
    GIFO: [
      { code: 'GL', name: 'Genie Logiciel' },
      { code: 'ASR', name: 'Administration et Securite des Reseaux' },
      { code: 'IIA', name: 'Informatique Industrielle et Automatisme' },
    ],
    GIM: [
      { code: 'GIM-F', name: 'Genie Industriel et Maintenance' },
      { code: 'GMP-GIM', name: 'Genie Mecanique et Productique' },
      { code: 'GTE-GIM', name: 'Genie Thermique, Energie et Environnement' },
      { code: 'MQSE', name: 'Metrologie, Qualite, Securite et Environnement' },
    ],
    GEII: [
      { code: 'GEII-F', name: 'Genie Electrique et Informatique Industrielle' },
      { code: 'GTR', name: 'Genie des Telecommunications et Reseaux' },
    ],
  },

  // Categories de requetes
  CATEGORIES: [
    { id: 'cat-1', name: 'Reclamation de note', desc: 'Contestation d\'une note jugee erronee.' },
    { id: 'cat-2', name: 'Note manquante', desc: 'Note non publiee ou absente du releve.' },
    { id: 'cat-3', name: 'Consultation de copie', desc: 'Consultation d\'une copie d\'examen corrigee.' },
    { id: 'cat-4', name: 'Attestation de scolarite', desc: 'Delivrance d\'une attestation de scolarite.' },
    { id: 'cat-5', name: 'Certificat de presence', desc: 'Certificat justifiant la presence a l\'etablissement.' },
    { id: 'cat-6', name: 'Erreur de nom', desc: 'Erreur sur le nom ou prenom dans les documents officiels.' },
    { id: 'cat-7', name: 'Erreur de matricule', desc: 'Erreur sur le numero de matricule.' },
    { id: 'cat-8', name: 'Erreur administrative', desc: 'Autre erreur dans un document administratif.' },
    { id: 'cat-9', name: 'Justification d\'absence', desc: 'Depot d\'un justificatif pour une absence.' },
    { id: 'cat-10', name: 'Regularisation d\'absence', desc: 'Regularisation apres une absence non justifiee.' },
    { id: 'cat-11', name: 'Paiement non pris en compte', desc: 'Paiement de frais de scolarite non enregistre.' },
    { id: 'cat-12', name: 'Probleme de quittance', desc: 'Erreur sur une quittance de paiement.' },
    { id: 'cat-13', name: 'Convention de stage', desc: 'Etablissement d\'une convention de stage.' },
    { id: 'cat-14', name: 'Validation de stage', desc: 'Validation administrative d\'un stage effectue.' },
    { id: 'cat-15', name: 'Lettre d\'introduction', desc: 'Lettre d\'introduction aupres d\'une entreprise.' },
    { id: 'cat-16', name: 'Changement de groupe', desc: 'Changement de groupe de TD ou TP.' },
    { id: 'cat-17', name: 'Changement de filiere', desc: 'Changement de filiere au sein de l\'etablissement.' },
    { id: 'cat-18', name: 'Reclamation d\'emploi du temps', desc: 'Conflit ou erreur dans l\'emploi du temps.' },
  ],

  // Niveaux
  LEVELS: [
    { value: 'DUT1', label: 'DUT 1ere annee' },
    { value: 'DUT2', label: 'DUT 2eme annee' },
    { value: 'LP', label: 'Licence Professionnelle' },
  ],
};
