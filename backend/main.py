from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import os

app = FastAPI(title="AgriVision AI Backend")

# Configuration CORS pour autoriser le frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En production, remplacer par l'URL du frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation des variables globales
crop_model = None
health_model = None
le_crop = LabelEncoder()
le_soil = LabelEncoder()
le_stage = LabelEncoder()

# Change directory to where the CSVs are located since main.py is in backend folder
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

@app.on_event("startup")
def load_and_train_models():
    global crop_model, health_model
    global le_crop, le_soil, le_stage
    
    crop_csv_path = os.path.join(DATA_DIR, "Crop_recommendation.csv")
    health_csv_path = os.path.join(DATA_DIR, "cropdata_updated.csv")
    
    # 1. Modèle 1 : Recommandation de culture (Crop_recommendation.csv)
    if os.path.exists(crop_csv_path):
        print("Entraînement du modèle de recommandation de culture...")
        df_crop = pd.read_csv(crop_csv_path)
        X_crop = df_crop[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
        y_crop = df_crop['label']
        
        crop_model = RandomForestClassifier(n_estimators=100, random_state=42)
        crop_model.fit(X_crop, y_crop)
        print("[OK] Modele de culture pret !")
    else:
        print(f"Fichier {crop_csv_path} introuvable.")
        
    # 2. Modèle 2 : Monitoring de santé (cropdata_updated.csv)
    if os.path.exists(health_csv_path):
        print("Entraînement du modèle de santé de la parcelle...")
        df_health = pd.read_csv(health_csv_path)
        
        # Encodage des variables catégorielles
        df_health['crop ID'] = le_crop.fit_transform(df_health['crop ID'])
        df_health['soil_type'] = le_soil.fit_transform(df_health['soil_type'])
        df_health['Seedling Stage'] = le_stage.fit_transform(df_health['Seedling Stage'])
        
        X_health = df_health[['crop ID', 'soil_type', 'Seedling Stage', 'MOI', 'temp', 'humidity']]
        y_health = df_health['result']
        
        health_model = RandomForestClassifier(n_estimators=100, random_state=42)
        health_model.fit(X_health, y_health)
        print("[OK] Modele de sante pret !")
    else:
        print(f"Fichier {health_csv_path} introuvable.")

# Schémas de données Pydantic
class CropRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class HealthRequest(BaseModel):
    crop_id: str
    soil_type: str
    seedling_stage: str
    MOI: float
    temp: float
    humidity: float

@app.post("/api/predict-crop")
def predict_crop(data: CropRequest):
    if not crop_model:
        return {"error": "Modèle non chargé"}
    
    features = np.array([[data.N, data.P, data.K, data.temperature, data.humidity, data.ph, data.rainfall]])
    prediction = crop_model.predict(features)[0]
    return {"recommended_crop": prediction}

@app.post("/api/monitor-health")
def monitor_health(data: HealthRequest):
    if not health_model:
        return {"error": "Modèle non chargé"}
        
    # Transformation robuste avec fallback en cas de classe inconnue
    c_id = le_crop.transform([data.crop_id])[0] if data.crop_id in le_crop.classes_ else 0
    s_type = le_soil.transform([data.soil_type])[0] if data.soil_type in le_soil.classes_ else 0
    s_stage = le_stage.transform([data.seedling_stage])[0] if data.seedling_stage in le_stage.classes_ else 0
        
    features = np.array([[c_id, s_type, s_stage, data.MOI, data.temp, data.humidity]])
    prediction = health_model.predict(features)[0]
    return {"health_status": int(prediction)}
