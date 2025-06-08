# ScheduleApp - Application de Gestion d'Emploi du Temps

Une application fullstack moderne pour la gestion d'emploi du temps et de rendez-vous, construite avec Next.js, Prisma, PostgreSQL et JWT.

## 🚀 Fonctionnalités

- **Authentification sécurisée** avec JWT
- **Gestion des rendez-vous** (CRUD complet)
- **Calendrier interactif** avec vue mensuelle
- **Gestion des horaires disponibles** par jour de la semaine
- **Interface utilisateur moderne** avec Tailwind CSS et shadcn/ui
- **API REST complète** avec Next.js App Router
- **Base de données PostgreSQL** avec Prisma ORM

## 🛠️ Technologies utilisées

### Backend
- **Next.js 14** avec App Router
- **Prisma ORM** pour la gestion de base de données
- **PostgreSQL** comme base de données
- **JWT** pour l'authentification
- **bcryptjs** pour le hashage des mots de passe

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants UI
- **Lucide React** pour les icônes

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

## 🔧 Installation

1. **Cloner le projet**
\`\`\`bash
git clone <url-du-repo>
cd schedule-app
\`\`\`

2. **Installer les dépendances**
\`\`\`bash
npm install
\`\`\`

3. **Configuration de la base de données**

Créer un fichier \`.env.local\` à la racine du projet :

\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/scheduleapp"
JWT_SECRET="votre-secret-jwt-tres-securise"
\`\`\`

4. **Initialiser la base de données**
\`\`\`bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# (Optionnel) Seed avec des données de test
npx prisma db seed
\`\`\`

5. **Lancer l'application**
\`\`\`bash
npm run dev
\`\`\`

L'application sera accessible sur \`http://localhost:3000\`

## 📊 Structure de la base de données

### Modèles Prisma

- **User** : Utilisateurs de l'application
- **Appointment** : Rendez-vous planifiés
- **Schedule** : Créneaux horaires disponibles par utilisateur

### Relations

- Un utilisateur peut avoir plusieurs rendez-vous
- Un utilisateur peut définir plusieurs créneaux horaires (un par jour de la semaine)

## 🔐 API Endpoints

### Authentification
- \`POST /api/auth/signup\` - Inscription
- \`POST /api/auth/login\` - Connexion

### Rendez-vous
- \`GET /api/appointments\` - Liste des rendez-vous
- \`POST /api/appointments\` - Créer un rendez-vous
- \`GET /api/appointments/[id]\` - Détails d'un rendez-vous
- \`PUT /api/appointments/[id]\` - Modifier un rendez-vous
- \`DELETE /api/appointments/[id]\` - Supprimer un rendez-vous

### Horaires
- \`GET /api/schedules\` - Liste des horaires
- \`POST /api/schedules\` - Créer/Modifier un horaire
- \`DELETE /api/schedules/[id]\` - Supprimer un horaire

## 📱 Pages de l'application

- **/** - Tableau de bord avec les rendez-vous du jour
- **/login** - Page de connexion
- **/signup** - Page d'inscription
- **/calendar** - Vue calendrier mensuel
- **/appointments/new** - Créer un nouveau rendez-vous
- **/appointments/[id]/edit** - Modifier un rendez-vous
- **/schedules** - Gestion des horaires disponibles

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT avec expiration
- Protection des routes API
- Validation des données côté serveur
- Protection CORS

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connecter votre repo GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Docker (Optionnel)

\`\`\`dockerfile
# Dockerfile exemple
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit vos changements (\`git commit -m 'Add some AmazingFeature'\`)
4. Push vers la branche (\`git push origin feature/AmazingFeature\`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier \`LICENSE\` pour plus de détails.

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.
