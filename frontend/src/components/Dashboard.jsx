import React, { useState } from 'react';
import { Leaf, Thermometer, Droplets, Activity, AlertTriangle, CheckCircle, Settings2, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('health');
  
  // État du simulateur (Modèle 1 : Recommandation)
  const [cropForm, setCropForm] = useState({
    N: 90, P: 42, K: 43, temperature: 20.8, humidity: 82, ph: 6.5, rainfall: 202
  });
  const [recommendation, setRecommendation] = useState(null);

  // État du simulateur (Modèle 2 : Santé)
  const [healthForm, setHealthForm] = useState({
    crop_id: 'Wheat',
    soil_type: 'Black Soil',
    seedling_stage: 'Seedling Stage',
    MOI: 3.5,
    temp: 25.0,
    humidity: 60.0
  });
  const [healthResult, setHealthResult] = useState(null); // 1 for normal, 0 for alert
  
  // Listes de valeurs uniques extraites des données
  const cropsList = ['Wheat', 'Potato', 'Carrot', 'Tomato', 'Chilli'];
  const soilsList = ['Black Soil', 'Alluvial Soil', 'Sandy Soil', 'Red Soil', 'Clay Soil', 'Loam Soil', 'Chalky Soil'];
  const stagesList = ['Germination', 'Seedling Stage', 'Vegetative Growth / Root or Tuber Development', 'Flowering', 'Pollination', 'Fruit/Grain/Bulb Formation', 'Maturation', 'Harvest'];

  // Gestion Modèle 1
  const handlePredictCrop = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/predict-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cropForm)
      });
      const data = await res.json();
      setRecommendation(data.recommended_crop);
    } catch (err) {
      console.error("Erreur API Recommandation:", err);
    }
  };

  // Gestion Modèle 2
  const handlePredictHealth = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/monitor-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(healthForm)
      });
      const data = await res.json();
      setHealthResult(data.health_status);
    } catch (err) {
      console.error("Erreur API Santé:", err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar de l'Application */}
      <div className="w-64 bg-emerald-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 text-2xl font-bold flex items-center gap-3 border-b border-emerald-800/50">
          <Leaf className="text-emerald-400" size={28} /> AgriVision
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setActiveTab('health')}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${activeTab === 'health' ? 'bg-emerald-700/80 shadow-md text-emerald-50' : 'text-emerald-200 hover:bg-emerald-800/50 hover:text-white'}`}
          >
            <ShieldCheck size={20} /> Diagnostic Santé
          </button>
          <button 
            onClick={() => setActiveTab('simulator')}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${activeTab === 'simulator' ? 'bg-emerald-700/80 shadow-md text-emerald-50' : 'text-emerald-200 hover:bg-emerald-800/50 hover:text-white'}`}
          >
            <Leaf size={20} /> Simulateur Culture
          </button>
        </nav>
      </div>

      {/* Contenu Principal */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {activeTab === 'health' ? 'Diagnostic de Santé (Modèle 2)' : 'Simulateur IA (Modèle 1)'}
          </h1>
          <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-sm font-medium text-slate-600">Système En Ligne</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'health' ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <form onSubmit={handlePredictHealth} className="flex-1 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Paramètres de la Parcelle</h2>
                  <p className="text-slate-500">Saisissez manuellement toutes les caractéristiques et les valeurs des capteurs pour le modèle 2.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-600">Culture</label>
                    <input 
                      type="text" 
                      list="crops-list"
                      value={healthForm.crop_id} 
                      onChange={e => setHealthForm({...healthForm, crop_id: e.target.value})}
                      placeholder="Ex: Wheat"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <datalist id="crops-list">
                      {cropsList.map(item => <option key={item} value={item} />)}
                    </datalist>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-600">Type de Sol</label>
                    <input 
                      type="text" 
                      list="soils-list"
                      value={healthForm.soil_type} 
                      onChange={e => setHealthForm({...healthForm, soil_type: e.target.value})}
                      placeholder="Ex: Black Soil"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <datalist id="soils-list">
                      {soilsList.map(item => <option key={item} value={item} />)}
                    </datalist>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-600">Stade de Croissance</label>
                    <input 
                      type="text" 
                      list="stages-list"
                      value={healthForm.seedling_stage} 
                      onChange={e => setHealthForm({...healthForm, seedling_stage: e.target.value})}
                      placeholder="Ex: Seedling Stage"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <datalist id="stages-list">
                      {stagesList.map(item => <option key={item} value={item} />)}
                    </datalist>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-600">Humidité du Sol (MOI)</label>
                    <input 
                      type="number" step="0.01"
                      value={healthForm.MOI}
                      onChange={e => setHealthForm({...healthForm, MOI: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-600">Température (°C)</label>
                    <input 
                      type="number" step="0.1"
                      value={healthForm.temp}
                      onChange={e => setHealthForm({...healthForm, temp: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-600">Humidité Ambiante (%)</label>
                    <input 
                      type="number" step="0.1"
                      value={healthForm.humidity}
                      onChange={e => setHealthForm({...healthForm, humidity: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transform hover:-translate-y-0.5">
                  Diagnostiquer avec l'IA
                </button>
              </form>
              
              {/* Carte de Résultat Santé */}
              <div className="lg:w-1/3 flex flex-col">
                <div className={`flex-1 flex flex-col items-center justify-center rounded-3xl p-8 border transition-all duration-700 ${healthResult === 1 ? 'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200' : healthResult === 0 ? 'bg-gradient-to-br from-red-50 to-orange-100 border-red-200 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'bg-slate-50 border-slate-100 border-dashed'}`}>
                  {healthResult !== null ? (
                    <div className="text-center animate-in zoom-in duration-500">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md mx-auto mb-6">
                        {healthResult === 1 ? <CheckCircle className="text-emerald-500 w-12 h-12" /> : <AlertTriangle className="text-red-500 w-12 h-12 animate-pulse" />}
                      </div>
                      <h3 className={`${healthResult === 1 ? 'text-emerald-800' : 'text-red-800'} font-semibold mb-2 uppercase tracking-wider text-sm`}>Statut Diagnostiqué</h3>
                      <p className={`text-4xl font-extrabold ${healthResult === 1 ? 'text-emerald-950' : 'text-red-950'} capitalize drop-shadow-sm`}>
                        {healthResult === 1 ? 'Normal' : 'Alerte Danger'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400">
                      <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">En attente d'analyse...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <form onSubmit={handlePredictCrop} className="flex-1 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Analyse Sols & Climat</h2>
                  <p className="text-slate-500">Ajustez les paramètres ci-dessous pour obtenir une recommandation d'ensemencement.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {Object.keys(cropForm).map(key => (
                    <div key={key} className="space-y-1.5">
                      <label className="block text-sm font-semibold text-slate-600 capitalize">{key === 'ph' ? 'pH du sol' : key}</label>
                      <input 
                        type="number" step="0.01"
                        value={cropForm[key]}
                        onChange={(e) => setCropForm({...cropForm, [key]: parseFloat(e.target.value)})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transform hover:-translate-y-0.5">
                  Générer la Recommandation IA
                </button>
              </form>
              
              {/* Carte de Résultat Culture */}
              <div className="lg:w-1/3 flex flex-col">
                <div className={`flex-1 flex flex-col items-center justify-center rounded-3xl p-8 border transition-all duration-700 ${recommendation ? 'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200' : 'bg-slate-50 border-slate-100 border-dashed'}`}>
                  {recommendation ? (
                    <div className="text-center animate-in zoom-in duration-500">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md mx-auto mb-6">
                        <Leaf className="text-emerald-600 w-10 h-10" />
                      </div>
                      <h3 className="text-emerald-800/70 font-semibold mb-2 uppercase tracking-wider text-sm">Culture Optimale</h3>
                      <p className="text-5xl font-extrabold text-emerald-950 capitalize drop-shadow-sm">{recommendation}</p>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400">
                      <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">En attente de paramètres...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
