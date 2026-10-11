# AgriVision AI 🌱
*Plateforme AgTech d'Intelligence Agronomique et de Monitoring.*

## 📖 Description
AgriVision AI est un MVP (Minimum Viable Product) conçu pour révolutionner la prise de décision en agriculture grâce à l'IA. 
L'application propose deux fonctionnalités principales reposant sur le Machine Learning :
1. **Simulateur de Culture** : Recommande la meilleure culture à planter (parmi plusieurs variétés) selon les caractéristiques chimiques du sol (Azote, Phosphore, Potassium, pH) et le climat (Température, Précipitations, Humidité).
2. **Diagnostic de Santé** : Prédit un statut de santé (Normal ou Alerte Danger) basé sur la plante, son stade de croissance et les relevés de capteurs simulés (Humidité du sol, Température ambiante).

## ⚙️ Architecture Technique
- **Backend (API)** : Python, FastAPI
- **Machine Learning** : Scikit-Learn (Random Forest), Pandas
- **Frontend (UI)** : React.js, Vite, Tailwind CSS v4, Lucide-React

## 🚀 Installation & Démarrage Rapide

### 1. Prérequis
- Python 3.9+
- Node.js 18+

### 2. Lancer le Backend (API & Modèles ML)
Ouvrez un terminal à la racine du projet :
```bash
cd backend
python -m venv venv
# Activer l'environnement virtuel (Windows)
.\venv\Scripts\Activate.ps1
# Installer les dépendances
pip install -r requirements.txt
# Démarrer le serveur
uvicorn main:app --reload --port 8000
```
Le serveur s'exécutera sur `http://localhost:8000`. Lors du démarrage, l'API ingère les datasets (`.csv`) et entraîne automatiquement les modèles d'IA.

### 3. Lancer le Frontend (Dashboard React)
Ouvrez un second terminal à la racine du projet :
```bash
cd frontend
npm install
npm run dev
```
Le dashboard sera accessible via votre navigateur sur `http://localhost:5173`.

## 📊 Performances des Modèles
Grâce aux algorithmes de *Random Forest Classifier*, l'IA atteint des scores exceptionnels sur les données de test :
- **Modèle de Recommandation de Culture** : Précision (Accuracy) de **99.32%**
- **Modèle de Diagnostic de Santé** : Précision (Accuracy) de **98.99%**

Des graphes d'Analyses Exploratoires des Données (EDA) sont disponibles dans `backend/plots/` pour analyser l'importance des variables (feature importance).

---
*Projet développé dans le cadre d'un concours d'innovation AgTech.*
