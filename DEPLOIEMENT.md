# IUTRequests - Guide de Deploiement

## Structure du Projet

```
iutrequests/
  index.html                 Point d'entree principal
  assets/
    css/style.css            Styles (palette IUT, responsive, dark mode)
    js/config.js             Configuration et donnees de reference
    js/i18n.js               Traductions francais/anglais
    js/auth.js               Authentification et gestion des donnees
    js/pages.js              Rendu de toutes les pages
    js/app.js                Routeur et logique principale
    images/logo.png          Logo IUT (a remplacer par le vrai)
  supabase/schema.sql        Schema de base de donnees
```

## Mode Demo (actuel)

Le site fonctionne en mode demo avec localStorage.
Ouvrez `index.html` dans un navigateur pour voir l'interface.

**Comptes de demonstration :**
- Super Admin : admin@iutrequests.cm / Admin@2026!
- Admin TCO : admin.tco@iutrequests.cm / Admin@2026!
- Ou creez un compte etudiant via l'inscription

## Deploiement en Production avec Supabase

### 1. Creer un projet Supabase (gratuit)
- Allez sur https://supabase.com
- Creez un compte et un nouveau projet
- Notez l'URL du projet et la cle anon (API Key)

### 2. Creer la base de donnees
- Dans Supabase, allez dans SQL Editor
- Copiez et executez le contenu de `supabase/schema.sql`

### 3. Configurer l'application
- Dans `assets/js/config.js`, remplacez :
  - SUPABASE_URL par votre URL
  - SUPABASE_ANON_KEY par votre cle
  - DEMO_MODE par false

### 4. Deployer les fichiers

**Option A : Vercel (recommande)**
- Installez Vercel CLI : npm i -g vercel
- Dans le dossier du projet : vercel
- Suivez les instructions

**Option B : cPanel**
- Connectez-vous a votre cPanel
- Allez dans le Gestionnaire de fichiers
- Uploadez tous les fichiers dans public_html/iutrequests/
- Accedez via votre-domaine.com/iutrequests/

**Option C : Netlify**
- Allez sur https://app.netlify.com
- Glissez-deposez le dossier du projet

## Logo

Remplacez `assets/images/logo.png` par le vrai logo de l'IUT de Douala.

## Palette de Couleurs

- Vert Institutionnel : #0F9D58
- Rouge Dynamique : #E53935
- Jaune Energie : #F4B400
- Noir : #222222
- Blanc : #FFFFFF
- Gris clair : #F5F7FA

## Polices

- Titres : Poppins (700, 600)
- Corps de texte : Inter (400, 500)
