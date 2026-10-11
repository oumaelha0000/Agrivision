import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder
import os

ARTIFACT_DIR = r"d:\crop\backend\plots"
os.makedirs(ARTIFACT_DIR, exist_ok=True)

def perform_eda():
    crop_csv_path = r"d:\crop\Crop_recommendation.csv"
    health_csv_path = r"d:\crop\cropdata_updated.csv"
    
    # ---------------------------------------------------------
    # 1. Modèle 1 : Recommandation de Culture
    # ---------------------------------------------------------
    df_crop = pd.read_csv(crop_csv_path)
    print("=== MODEL 1: CROP RECOMMENDATION ===")
    
    X_crop = df_crop[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y_crop = df_crop['label']
    
    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_crop, y_crop, test_size=0.2, random_state=42)
    
    crop_model = RandomForestClassifier(n_estimators=100, random_state=42)
    crop_model.fit(X_train_c, y_train_c)
    y_pred_c = crop_model.predict(X_test_c)
    
    acc_c = accuracy_score(y_test_c, y_pred_c)
    print(f"Accuracy: {acc_c:.4f}")
    
    # Feature Importance Plot for Crop Model
    plt.figure(figsize=(10, 6))
    importances_c = crop_model.feature_importances_
    sns.barplot(x=importances_c, y=X_crop.columns, palette="viridis", hue=X_crop.columns, legend=False)
    plt.title("Importance des Variables (Modèle Culture)")
    plt.savefig(os.path.join(ARTIFACT_DIR, "crop_feature_importance.png"))
    plt.close()
    
    # Correlation matrix for Crop Model
    plt.figure(figsize=(10, 8))
    sns.heatmap(X_crop.corr(), annot=True, cmap="coolwarm", fmt=".2f")
    plt.title("Matrice de Corrélation (Sols & Climat)")
    plt.savefig(os.path.join(ARTIFACT_DIR, "crop_correlation.png"))
    plt.close()

    # ---------------------------------------------------------
    # 2. Modèle 2 : Monitoring de Santé
    # ---------------------------------------------------------
    df_health = pd.read_csv(health_csv_path)
    print("\n=== MODEL 2: HEALTH MONITORING ===")
    
    le_crop = LabelEncoder()
    le_soil = LabelEncoder()
    le_stage = LabelEncoder()
    
    df_health['crop ID'] = le_crop.fit_transform(df_health['crop ID'])
    df_health['soil_type'] = le_soil.fit_transform(df_health['soil_type'])
    df_health['Seedling Stage'] = le_stage.fit_transform(df_health['Seedling Stage'])
    
    X_health = df_health[['crop ID', 'soil_type', 'Seedling Stage', 'MOI', 'temp', 'humidity']]
    y_health = df_health['result']
    
    X_train_h, X_test_h, y_train_h, y_test_h = train_test_split(X_health, y_health, test_size=0.2, random_state=42)
    
    health_model = RandomForestClassifier(n_estimators=100, random_state=42)
    health_model.fit(X_train_h, y_train_h)
    y_pred_h = health_model.predict(X_test_h)
    
    acc_h = accuracy_score(y_test_h, y_pred_h)
    print(f"Accuracy: {acc_h:.4f}")
    
    # Feature Importance Plot for Health Model
    plt.figure(figsize=(10, 6))
    importances_h = health_model.feature_importances_
    sns.barplot(x=importances_h, y=X_health.columns, palette="mako", hue=X_health.columns, legend=False)
    plt.title("Importance des Variables (Modèle Santé)")
    plt.savefig(os.path.join(ARTIFACT_DIR, "health_feature_importance.png"))
    plt.close()
    
    # Target distribution
    plt.figure(figsize=(6, 6))
    sns.countplot(x='result', data=df_health, palette="Set2", hue='result', legend=False)
    plt.title("Distribution de la Santé (0=Alerte, 1=Normal)")
    plt.savefig(os.path.join(ARTIFACT_DIR, "health_distribution.png"))
    plt.close()
    
    print("\nEDA Completed successfully.")

if __name__ == "__main__":
    perform_eda()
