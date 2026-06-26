-- ============================================
-- IUTRequests - Schema Base de Donnees Supabase
-- A executer dans l'editeur SQL de Supabase
-- ============================================

-- Types enumeres
CREATE TYPE user_role AS ENUM ('STUDENT', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE request_status AS ENUM (
  'DRAFT', 'SUBMITTED', 'RECEIVED', 'IN_PROGRESS',
  'AWAITING_DOCUMENTS', 'VALIDATED', 'REJECTED',
  'PROCESSED', 'CLOSED', 'REOPENED'
);

-- Departements
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  head_name TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Filieres
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  head_name TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(code, department_id)
);

-- Profils utilisateurs (extension de auth.users de Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  matricule TEXT UNIQUE,
  photo_url TEXT,
  role user_role DEFAULT 'STUDENT',
  is_active BOOLEAN DEFAULT true,
  department_id UUID REFERENCES departments(id),
  program_id UUID REFERENCES programs(id),
  level TEXT,
  preferred_language TEXT DEFAULT 'fr',
  preferred_theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

-- Categories de requetes
CREATE TABLE request_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  department_id UUID REFERENCES departments(id),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Modeles de requetes
CREATE TABLE request_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID UNIQUE REFERENCES request_categories(id) ON DELETE CASCADE,
  instructions TEXT NOT NULL DEFAULT '',
  body_template TEXT NOT NULL DEFAULT '',
  required_documents TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Requetes
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status request_status DEFAULT 'DRAFT',
  student_id UUID NOT NULL REFERENCES profiles(id),
  department_id UUID NOT NULL REFERENCES departments(id),
  program_id UUID REFERENCES programs(id),
  category_id UUID NOT NULL REFERENCES request_categories(id),
  priority INT DEFAULT 0,
  first_viewed_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  reopened_count INT DEFAULT 0,
  reminder_count INT DEFAULT 0,
  last_reminder_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assignations admin-requete
CREATE TABLE request_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  assigned_by UUID,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(request_id, admin_id)
);

-- Historique des statuts
CREATE TABLE request_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  old_status request_status,
  new_status request_status NOT NULL,
  changed_by_id UUID NOT NULL REFERENCES profiles(id),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pieces jointes
CREATE TABLE request_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  message_id UUID,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INT NOT NULL,
  checksum TEXT,
  uploaded_by_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages
CREATE TABLE request_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Assignations admin-departement
CREATE TABLE admin_department_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, department_id)
);

-- Assignations admin-categorie
CREATE TABLE admin_category_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES request_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, category_id)
);

-- Journal d'audit
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  details TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX idx_requests_student ON requests(student_id);
CREATE INDEX idx_requests_department ON requests(department_id);
CREATE INDEX idx_requests_category ON requests(category_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_ref ON requests(reference_number);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- ============================================
-- DONNEES INITIALES
-- ============================================

-- 13 Departements
INSERT INTO departments (name, code, is_active, sort_order) VALUES
  ('Genie Informatique', 'GIFO', false, 1),
  ('Genie Electrique et Informatique Industrielle', 'GEII', false, 2),
  ('Genie des Reseaux et Telecommunications', 'GRT', false, 3),
  ('Genie Industriel et Maintenance', 'GIM', false, 4),
  ('Genie Mecanique et Productique', 'GMP', false, 5),
  ('Genie Civil', 'GCI', false, 6),
  ('Genie Thermique et Energie', 'GTE', false, 7),
  ('Genie des Mines et de la Metallurgie', 'GMM', false, 8),
  ('Genie Logistique et Transport', 'GLT', false, 9),
  ('Techniques Commerciales', 'TCO', true, 10),
  ('Comptabilite et Finance', 'CFI', false, 11),
  ('Enseignements Scientifiques de Base', 'ESB', false, 12),
  ('Enseignements Generaux', 'ESG', false, 13);

-- Filieres TCO
INSERT INTO programs (name, code, department_id) VALUES
  ('Gestion des Entreprises et des Administrations', 'GEA', (SELECT id FROM departments WHERE code = 'TCO')),
  ('Genie Logistique et Transport', 'GLT-TCO', (SELECT id FROM departments WHERE code = 'TCO')),
  ('Organisation et Gestion Administrative', 'OGA', (SELECT id FROM departments WHERE code = 'TCO')),
  ('Comptabilite et Finance', 'CFI-TCO', (SELECT id FROM departments WHERE code = 'TCO')),
  ('Techniques de Commercialisation', 'TCO-F', (SELECT id FROM departments WHERE code = 'TCO')),
  ('Metiers du Multimedia et de l''Internet', 'MMI', (SELECT id FROM departments WHERE code = 'TCO'));

-- 18 Categories de requetes
INSERT INTO request_categories (name, description) VALUES
  ('Reclamation de note', 'Contestation d''une note jugee erronee par l''etudiant.'),
  ('Note manquante', 'Note d''une evaluation non publiee ou absente du releve.'),
  ('Consultation de copie', 'Demande de consultation d''une copie d''examen corrigee.'),
  ('Attestation de scolarite', 'Demande de delivrance d''une attestation de scolarite.'),
  ('Certificat de presence', 'Demande de certificat justifiant la presence a l''etablissement.'),
  ('Erreur de nom', 'Signalement d''une erreur sur le nom ou le prenom dans les documents officiels.'),
  ('Erreur de matricule', 'Signalement d''une erreur sur le numero de matricule de l''etudiant.'),
  ('Erreur administrative', 'Toute autre erreur constatee dans un document administratif.'),
  ('Justification d''absence', 'Depot d''un justificatif pour une absence en cours ou en examen.'),
  ('Regularisation d''absence', 'Demande de regularisation apres une absence non justifiee a temps.'),
  ('Paiement non pris en compte', 'Signalement d''un paiement de frais de scolarite non enregistre.'),
  ('Probleme de quittance', 'Erreur ou anomalie constatee sur une quittance de paiement.'),
  ('Convention de stage', 'Demande d''etablissement d''une convention de stage.'),
  ('Validation de stage', 'Demande de validation administrative d''un stage effectue.'),
  ('Lettre d''introduction', 'Demande de lettre d''introduction aupres d''une entreprise ou d''un organisme.'),
  ('Changement de groupe', 'Demande de changement de groupe de travaux diriges ou pratiques.'),
  ('Changement de filiere', 'Demande de changement de filiere au sein du departement ou de l''etablissement.'),
  ('Reclamation d''emploi du temps', 'Signalement d''un conflit ou d''une erreur dans l''emploi du temps.');
