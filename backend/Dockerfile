# Image de base
FROM node:24

# Dossier de travail dans le container
WORKDIR /usr/src/app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code
COPY . .

# Build de l'application NestJS
RUN npm run build

# Port exposé
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "run", "start:prod"]