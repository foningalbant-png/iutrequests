-- Ajouter la colonne file_urls a la table requests
ALTER TABLE requests ADD COLUMN IF NOT EXISTS file_urls TEXT DEFAULT '[]';
