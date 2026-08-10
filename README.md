# DAW Consulting RH — Portail web complet (DAWC-HR)

Site vitrine + portail carrières pour **DAW Consulting Human Resources** (cabinet
RH, conformité CNPS, paie et intérim basé à Douala, Cameroun).

- **Front-end** : Angular 17 (standalone components, control flow `@if/@for`, lazy loading, signals)
- **Back-end** : Spring Boot 3.2.5 / Java 17 (API REST, sécurité JWT)
- **Base de données** : MySQL 8

Le site comprend une page d'accueil animée (GSAP + ScrollTrigger), un tableau des
offres d'emploi avec filtres, un formulaire de candidature avec dépôt de CV, et un
**espace administrateur** sécurisé permettant de publier/gérer les offres et de
consulter les candidatures (changement de statut, téléchargement des CV).

---

## 1. Arborescence

```
dawconsulting-rh/
├── backend/        API Spring Boot (Maven)
├── frontend/       Application Angular 17
├── database/       schema.sql (création BD + tables + index)
├── preview.html    Aperçu autonome de la page d'accueil (ouvrable directement)
├── docker-compose.yml
└── README.md
```

---

## 2. Prérequis

| Outil      | Version conseillée |
|------------|--------------------|
| Java JDK   | 17+                |
| Maven      | 3.9+               |
| Node.js    | 18.19+ ou 20+      |
| npm        | 9+                 |
| MySQL      | 8.0+               |
| Angular CLI| 17 (`npm i -g @angular/cli`) — optionnel |

> Astuce : un `docker-compose.yml` est fourni pour démarrer MySQL + le back-end +
> le front-end sans rien installer d'autre que Docker (voir §6).

---

## 3. Base de données

Créez la base et l'utilisateur applicatif :

```bash
mysql -u root -p < database/schema.sql
```

Cela crée la base `dawconsulting_rh`, l'utilisateur `dawconsulting` (mot de passe
`dawconsulting` par défaut — **à changer en production**) et les tables. Hibernate
(`ddl-auto=update`) complète/maintient ensuite le schéma automatiquement.

---

## 4. Back-end (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

L'API démarre sur **http://localhost:8080**.

Au premier lancement, un compte administrateur et 3 offres d'exemple sont créés
automatiquement (voir `DataInitializer`).

**Identifiants admin par défaut :**

```
Email    : admin@dawconsulting.cm
Mot de passe : DawAdmin2026!
```

> ⚠️ Changez ces identifiants et le secret JWT avant toute mise en production.

### Configuration

Tout est surchargeable par variables d'environnement (voir
`backend/src/main/resources/application.properties`) :

| Propriété                    | Variable d'env             | Défaut                          |
|------------------------------|----------------------------|---------------------------------|
| URL JDBC                     | `DB_URL`                   | `jdbc:mysql://localhost:3306/dawconsulting_rh` |
| Utilisateur BD               | `DB_USERNAME`              | `dawconsulting`                 |
| Mot de passe BD              | `DB_PASSWORD`              | `dawconsulting`                 |
| Secret JWT                   | `JWT_SECRET`               | *(valeur de dev — à remplacer)* |
| Durée du token (ms)          | `JWT_EXPIRATION`           | `43200000` (12 h)               |
| Email admin initial          | `ADMIN_EMAIL`              | `admin@dawconsulting.cm`        |
| Mot de passe admin initial   | `ADMIN_PASSWORD`           | `DawAdmin2026!`                 |
| Dossier d'upload des CV      | `UPLOAD_DIR`               | `./uploads`                     |
| Origines CORS autorisées     | `CORS_ALLOWED_ORIGINS`     | `http://localhost:4200`         |

### Principaux endpoints

**Public**

| Méthode | Route                       | Description                          |
|---------|-----------------------------|--------------------------------------|
| `POST`  | `/api/auth/login`           | Connexion admin (renvoie un JWT)     |
| `GET`   | `/api/jobs`                 | Offres publiées (filtres `q`, `department`, `location`) |
| `GET`   | `/api/jobs/{id}`            | Détail d'une offre publiée           |
| `POST`  | `/api/jobs/{id}/apply`      | Candidature (multipart : champs + CV)|
| `POST`  | `/api/contact`              | Message de contact                   |
| `GET`   | `/api/health`               | Vérification de l'état du service    |

**Admin** (en-tête `Authorization: Bearer <token>` requis)

| Méthode  | Route                                   | Description                     |
|----------|-----------------------------------------|---------------------------------|
| `GET`    | `/api/admin/jobs`                       | Toutes les offres               |
| `POST`   | `/api/admin/jobs`                       | Créer une offre                 |
| `PUT`    | `/api/admin/jobs/{id}`                  | Modifier une offre              |
| `DELETE` | `/api/admin/jobs/{id}`                  | Supprimer une offre             |
| `GET`    | `/api/admin/applications?jobId=`        | Candidatures (filtre optionnel) |
| `PATCH`  | `/api/admin/applications/{id}/status`   | Changer le statut               |
| `GET`    | `/api/admin/applications/{id}/cv`       | Télécharger le CV               |
| `DELETE` | `/api/admin/applications/{id}`          | Supprimer une candidature       |

---

## 5. Front-end (Angular)

```bash
cd frontend
npm install
npm start          # ng serve, http://localhost:4200
```

L'environnement de développement (`src/environments/environment.development.ts`)
pointe vers `http://localhost:8080/api`. Lancez donc le back-end en parallèle.

### Build de production

```bash
npm run build      # génère dist/dawconsulting-rh/browser
```

En production, `environment.ts` utilise `apiUrl: '/api'` : servez les fichiers
statiques d'Angular derrière le même domaine que l'API (reverse proxy Nginx, ou
ressources statiques Spring Boot), ou ajustez `apiUrl` selon votre déploiement.

### Pages

| Route                              | Description                                  |
|------------------------------------|----------------------------------------------|
| `/`                                | Page d'accueil animée                        |
| `/emplois`                         | Liste des offres + filtres                    |
| `/emplois/:id`                     | Détail d'une offre                            |
| `/emplois/:id/postuler`            | Formulaire de candidature + dépôt de CV       |
| `/admin/login`                     | Connexion administrateur                       |
| `/admin/dashboard`                 | Gestion des offres (CRUD) + statistiques      |
| `/admin/offres/nouvelle`           | Créer une offre                                |
| `/admin/offres/:id/modifier`       | Modifier une offre                             |
| `/admin/candidatures`              | Candidatures (statut, CV, lettre)             |

---

## 6. Démarrage rapide via Docker (optionnel)

```bash
docker compose up --build
```

- MySQL : port 3306
- Back-end : http://localhost:8080
- Front-end (Nginx) : http://localhost:4200

> Les `Dockerfile` (back-end et front-end), la configuration Nginx
> (`frontend/nginx.conf`, qui sert le SPA et relaie `/api` vers le back-end) et le
> `docker-compose.yml` sont fournis. Pensez à remplacer les secrets par défaut.

---

## 7. Aperçu visuel immédiat

Pas le temps de tout installer ? Ouvrez **`preview.html`** directement dans un
navigateur : c'est la page d'accueil complète (design, animations, contenu), en
autonomie, sans back-end.

---

## 8. Identité de marque

- **Nom** : DAW Consulting Human Resources (DAWC-HR) — « Interim · Services »
- **Adresse** : BP 17596, Douala — Cameroun
- **Téléphone** : +237 659 19 40 18 / +237 677 20 01 46
- **Email** : daw16consulting@gmail.com
- **RCCM** : RC/DLA/2021/B/4825 · **NIU** : MO92116462141R · **ISO 9001:2015**
- **LinkedIn** : linkedin.com/company/daw-consulting-human-ressources
- **Facebook** : facebook.com/profile.php?id=61566193556441

Palette : marine `#0B1340`, bleu royal `#1B2A8F`, vermillon `#E63027`, or `#D8CFA0`.
Typographies : Bricolage Grotesque, Hanken Grotesk, IBM Plex Mono.

---

## 9. Sécurité — à faire avant la mise en production

- [ ] Changer le mot de passe admin (`ADMIN_PASSWORD`) et l'email
- [ ] Définir un `JWT_SECRET` long et aléatoire
- [ ] Changer le mot de passe MySQL
- [ ] Restreindre `CORS_ALLOWED_ORIGINS` au domaine réel
- [ ] Servir le tout en HTTPS
- [ ] Sauvegarder régulièrement le dossier `uploads/` (CV) et la base
