-- ============================================
-- IUTRequests - Schema Base de Donnees Supabase
-- Version avec nettoyage automatique
-- ============================================

-- Nettoyage (supprimer les tables existantes)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS admin_category_assignments CASCADE;
DROP TABLE IF EXISTS admin_department_assignments CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS request_messages CASCADE;
DROP TABLE IF EXISTS request_attachments CASCADE;
DROP TABLE IF EXISTS request_status_history CASCADE;
DROP TABLE IF EXISTS request_assignments CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS request_templates CASCADE;
DROP TABLE IF EXISTS request_categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TYPE IF EXISTS request_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Types
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

-- Profils utilisateurs
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  matricule TEXT UNIQUE,
  photo_url TEXT,
  role user_role DEFAULT 'STUDENT',
  is_active BOOLEAN DEFAULT true,
  department TEXT,
  program TEXT,
  level TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Categories de requetes
CREATE TABLE request_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  instructions TEXT,
  body_template TEXT,
  required_documents TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Requetes
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status request_status DEFAULT 'DRAFT',
  student_id UUID REFERENCES profiles(id),
  student_name TEXT,
  student_email TEXT,
  student_phone TEXT,
  student_matricule TEXT,
  department TEXT,
  program TEXT,
  category_name TEXT,
  priority TEXT DEFAULT 'NORMALE',
  file_names TEXT[],
  first_viewed_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  reopened_count INT DEFAULT 0,
  reminder_count INT DEFAULT 0,
  satisfaction_score INT,
  satisfaction_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Historique des statuts
CREATE TABLE request_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  old_status TEXT,
  changed_by TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages
CREATE TABLE request_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  sender_id UUID,
  sender_name TEXT,
  sender_role TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
  request_ref TEXT,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Journal d audit
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT,
  user_email TEXT,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_requests_student ON requests(student_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_ref ON requests(reference_number);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- Activer RLS sur toutes les tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (autoriser l acces public pour le moment)
CREATE POLICY "allow_all" ON departments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON programs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON request_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON request_status_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON request_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON audit_logs FOR ALL USING (true) WITH CHECK (true);

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

-- 18 Categories
INSERT INTO request_categories (name, description) VALUES
  ('Reclamation de note', 'Contestation d''une note jugee erronee par l''etudiant.'),
  ('Note manquante', 'Note d''une evaluation non publiee ou absente du releve.'),
  ('Consultation de copie', 'Demande de consultation d''une copie d''examen corrigee.'),
  ('Attestation de scolarite', 'Demande de delivrance d''une attestation de scolarite.'),
  ('Certificat de presence', 'Demande de certificat justifiant la presence a l''etablissement.'),
  ('Erreur de nom', 'Signalement d''une erreur sur le nom ou le prenom.'),
  ('Erreur de matricule', 'Signalement d''une erreur sur le numero de matricule.'),
  ('Erreur administrative', 'Toute autre erreur dans un document administratif.'),
  ('Justification d''absence', 'Depot d''un justificatif pour une absence.'),
  ('Regularisation d''absence', 'Demande de regularisation apres une absence non justifiee.'),
  ('Paiement non pris en compte', 'Signalement d''un paiement non enregistre.'),
  ('Probleme de quittance', 'Erreur sur une quittance de paiement.'),
  ('Convention de stage', 'Demande d''etablissement d''une convention de stage.'),
  ('Validation de stage', 'Demande de validation administrative d''un stage.'),
  ('Lettre d''introduction', 'Demande de lettre d''introduction aupres d''une entreprise.'),
  ('Changement de groupe', 'Demande de changement de groupe de TD ou TP.'),
  ('Changement de filiere', 'Demande de changement de filiere.'),
  ('Reclamation d''emploi du temps', 'Signalement d''un conflit dans l''emploi du temps.');

-- Compte Super Admin
INSERT INTO profiles (email, password, first_name, last_name, role, is_active) VALUES
  ('pepinierecommercialeiut@gmail.com', '@iutrequet2026mmi2', 'Super', 'Administrateur', 'SUPER_ADMIN', true);
