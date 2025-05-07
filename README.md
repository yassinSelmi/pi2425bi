🩺 BI1 Healthcare - Projet Fullstack Angular + Flask + IA

Ce projet combine une interface Angular pour les utilisateurs, un backend Flask pour la logique métier et les appels aux modèles IA, et une base de données MySQL via XAMPP. L’objectif est de prédire des maladies (ex. AVC) à partir d'inputs utilisateurs ou de fichiers audio/image.

🔧 Étapes de mise en place :

Structure du projet :

frontend/ : application Angular (ng serve)

backend/ : API Flask avec plusieurs fichiers .py (chacun exécute un modèle .h5)

models/ : modèles Keras sauvegardés (.h5)

requirements.txt : dépendances Python

README.md : documentation (facultatif)

Dossiers à ne pas oublier : .gitignore, .env (non poussé)

Lancer l’interface Angular :

Aller dans frontend/

Exécuter ng serve

Accéder à l’application sur http://localhost:4200

Lancer une API Flask :

Aller dans backend/

Exécuter le fichier de ton choix (ex : python brain_stroke.py)

API disponible sur http://127.0.0.1:5000

Installer les dépendances : pip install -r requirements.txt

Configurer XAMPP pour la base de données (si utilisée) :

Démarrer XAMPP

Activer Apache + MySQL

Créer une base dans phpMyAdmin

Lier la base depuis Flask (via mysql.connector ou SQLAlchemy)

Installer les dépendances backend :

Python ≥ 3.8

Flask, Flask-CORS

Keras / TensorFlow

librosa (analyse audio)

Pillow (images)

Twilio (SMS)

Installer avec : pip install -r requirements.txt

Dépendances Angular :

Angular CLI v16.2+

Modules selon besoin (Angular Material, Forms, etc.)

Lancer avec ng serve

Chargement des modèles IA :

Les modèles .h5 sont chargés avec keras.models.load_model()

Placer tous les modèles dans le dossier models/

Tests disponibles :

ng test pour tester Angular

Chaque .py Flask doit avoir un endpoint testable (/predict, /status, etc.)

Courbes, confusion matrix, ou F1-score à intégrer dans des notebooks (optionnel)

Exécution séparée :

Angular et Flask tournent séparément (frontend → backend via HTTP)

Assure-toi que les ports ne sont pas bloqués (CORS activé dans Flask)
