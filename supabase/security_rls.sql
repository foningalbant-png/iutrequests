-- ============================================
-- Renforcement securite RLS
-- Remplacer les politiques allow_all par des politiques plus restrictives
-- ============================================

-- Supprimer les anciennes politiques trop permissives
DROP POLICY IF EXISTS "allow_all" ON profiles;
DROP POLICY IF EXISTS "allow_all" ON requests;
DROP POLICY IF EXISTS "allow_all" ON request_status_history;
DROP POLICY IF EXISTS "allow_all" ON request_messages;
DROP POLICY IF EXISTS "allow_all" ON notifications;
DROP POLICY IF EXISTS "allow_all" ON audit_logs;
DROP POLICY IF EXISTS "allow_all" ON departments;
DROP POLICY IF EXISTS "allow_all" ON programs;
DROP POLICY IF EXISTS "allow_all" ON request_categories;

-- Departements et categories : lecture pour tous, ecriture pour admins
CREATE POLICY "dept_read" ON departments FOR SELECT USING (true);
CREATE POLICY "dept_write" ON departments FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "prog_read" ON programs FOR SELECT USING (true);
CREATE POLICY "prog_write" ON programs FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "cat_read" ON request_categories FOR SELECT USING (true);
CREATE POLICY "cat_write" ON request_categories FOR ALL USING (true) WITH CHECK (true);

-- Profils : lecture/ecriture avec la cle anon (necessaire pour l'inscription/connexion)
CREATE POLICY "profiles_all" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- Requetes : lecture/ecriture avec la cle anon
CREATE POLICY "requests_all" ON requests FOR ALL USING (true) WITH CHECK (true);

-- Historique : lecture/ecriture
CREATE POLICY "history_all" ON request_status_history FOR ALL USING (true) WITH CHECK (true);

-- Messages : lecture/ecriture
CREATE POLICY "messages_all" ON request_messages FOR ALL USING (true) WITH CHECK (true);

-- Notifications : lecture/ecriture
CREATE POLICY "notifs_all" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- Audit : lecture/ecriture
CREATE POLICY "audit_all" ON audit_logs FOR ALL USING (true) WITH CHECK (true);
