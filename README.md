# AgriVision AI

**Intelligent Crop Disease and Pest Detection Using Hybrid Deep Feature Extraction and PCA-Based SVM Framework**

AgriVision AI is a full-stack agricultural AI technology platform converting cutting-edge machine learning research into an interactive, real-time diagnostic system for agronomists, farmers, and researchers.

---

## 1. Selected Machine Learning Architecture

As specified by the research benchmark, the application implements **strictly and exclusively** the yellow-highlighted optimal configuration:

$$\text{Image } (224 \times 224) \longrightarrow \text{ResNet50 } (2048) \oplus \text{EfficientNetB0 } (1280) \longrightarrow \text{StandardScaler } (3328) \longrightarrow \text{PCA } (95\% \text{ Var} \rightarrow 1649) \longrightarrow \text{SVM } (\text{RBF Kernel}) \longrightarrow 22 \text{ Classes}$$

### Key Specifications:
* **Deep Visual Extractors**:
  * **ResNet50**: 2,048 dimensions (`GlobalAveragePooling2D`)
  * **EfficientNetB0**: 1,280 dimensions (`GlobalAveragePooling2D`)
  * **Concatenated Hybrid Representation**: $2048 + 1280 = \mathbf{3328}$ dimensions
* **Dimensionality Reduction**:
  * **StandardScaler**: Centers features to zero mean and scales to unit variance
  * **PCA ($95\%$ variance)**: `PCA(n_components=0.95, svd_solver="full", random_state=42)` reduces dimensions from **$3328 \rightarrow 1649$** ($50.45\%$ compression)
* **Final Classifier**:
  * **Support Vector Machine (SVC)**: Radial Basis Function (RBF) kernel with penalty $C=10.0$ and $\gamma=\text{scale}$
* **Supported Scope**:
  * **4 Crops**: Cashew, Cassava, Maize, Tomato
  * **22 Classes**: Specific fungal diseases, bacterial blights, viral streaks, pest infestations, and healthy controls

### Verified Evaluation Benchmark:
* **Reported Accuracy (Highlighted Row)**: **$91.21\%$**
* **Experimental Log Accuracy (Cell 52 & Discussion)**: **$90.89\%$**
* **Macro Precision**: **$90.66\%$**
* **Macro Recall**: **$89.81\%$**
* **Macro F1-Score**: **$90.12\%$**
* **SVM Training Time**: $191.81$ seconds

---

## 2. Project Directory Structure

```
AgriVision-AI/
├── backend/
│   ├── app/
│   │   ├── main.py                          # FastAPI initialization & CORS
│   │   ├── routes/
│   │   │   ├── prediction.py                # POST /api/predict
│   │   │   ├── metrics.py                   # GET /api/model-metrics
│   │   │   └── model_info.py                # GET /api/model-info
│   │   ├── services/
│   │   │   ├── feature_extraction.py        # ResNet50 + EfficientNetB0 (3328d)
│   │   │   └── prediction_service.py        # StandardScaler + PCA (1649d) + SVM
│   │   └── utils/
│   │       └── image_preprocessing.py       # Validation, 224x224 resize & tensor
│   ├── model/
│   │   ├── svm_model/
│   │   │   └── SVM_Hybrid_Res_Eff_PCA.joblib # Original trained SVM model
│   │   └── preprocessing_artifacts/
│   │       ├── Hybrid_Res_Eff_scaler.joblib # Fitted StandardScaler
│   │       └── Hybrid_Res_Eff_PCA_95.joblib # Fitted PCA (1649 components)
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── leaf.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx                  # Dark green navigation sidebar
│   │   │   ├── Navbar.jsx                   # Sticky header with active badges
│   │   │   ├── MetricCard.jsx               # Reusable metrics card
│   │   │   ├── ImageUploader.jsx            # Drag-and-drop & preview
│   │   │   ├── PredictionResult.jsx         # Diagnostic details & symptoms
│   │   │   └── WorkflowDiagram.jsx          # Pipeline visualization
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx                # Landing page & quick actions
│   │   │   ├── DetectDisease.jsx            # Real-time image inference
│   │   │   ├── PredictionHistory.jsx        # Local storage session logs
│   │   │   ├── ModelPerformance.jsx        # Recharts visualizations & metrics
│   │   │   └── AboutModel.jsx               # Deep architectural explanation
│   │   ├── services/
│   │   │   └── api.js                       # Axios backend client
│   │   ├── App.jsx                          # React router integration
│   │   ├── main.jsx                         # Application entrypoint
│   │   └── index.css                        # Professional agricultural CSS theme
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 3. Quick Start Guide (Windows)

### Prerequisites
* **Python 3.10+ / 3.11+ / 3.14** installed.
* **Node.js (v18+)** and **npm** installed.

---

### Step 1: Start the Python FastAPI Backend

Open a PowerShell terminal and navigate to the backend directory:

```powershell
cd "AgriVision-AI\backend"
```

*(Optional) Create and activate a Python virtual environment:*
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install backend dependencies:
```powershell
pip install -r requirements.txt
```

Launch the FastAPI server using Uvicorn:
```powershell
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend is now running at:
* **API Base URL**: `http://localhost:8000/api`
* **Health Check**: `http://localhost:8000/api/health`
* **Interactive Swagger Documentation**: `http://localhost:8000/docs`

---

### Step 2: Start the ReactJS Frontend

Open a second PowerShell terminal and navigate to the frontend directory:

```powershell
cd "AgriVision-AI\frontend"
```

Install frontend packages (already configured):
```powershell
npm.cmd install
```

Start the Vite development server:
```powershell
npm.cmd run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 4. REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Verifies backend health and model loading status. |
| `POST` | `/api/predict` | Accepts multipart crop leaf image, runs ResNet50 + EfficientNetB0 feature extraction, applies StandardScaler and PCA (1649 components), and returns SVM prediction. |
| `GET` | `/api/model-metrics` | Returns research paper benchmarks, comparative model evaluations, and crop class distributions. |
| `GET` | `/api/model-info` | Returns complete architectural specifications of each stage. |

---

## 5. 22 Supported Crop Disease and Pest Classes

| Crop | Class Label | Type | Severity |
| :--- | :--- | :--- | :--- |
| **Cashew** | Cashew anthracnose | Fungal Disease | High |
| **Cashew** | Cashew gumosis | Fungal/Bacterial | Moderate |
| **Cashew** | Cashew healthy | Healthy Tissue | None |
| **Cashew** | Cashew leaf miner | Pest Infestation | Moderate |
| **Cashew** | Cashew red rust | Algal Disease | Low to Moderate |
| **Cassava** | Cassava bacterial blight | Bacterial Disease | High |
| **Cassava** | Cassava brown spot | Fungal Disease | Moderate |
| **Cassava** | Cassava green mite | Pest Infestation | High |
| **Cassava** | Cassava healthy | Healthy Tissue | None |
| **Cassava** | Cassava mosaic | Viral Disease (CMD) | Critical |
| **Maize** | Maize fall armyworm | Pest Infestation | Critical |
| **Maize** | Maize grasshoper | Pest Defoliation | Moderate |
| **Maize** | Maize healthy | Healthy Tissue | None |
| **Maize** | Maize leaf beetle | Pest Infestation | Moderate |
| **Maize** | Maize leaf blight | Fungal Disease (NCLB)| High |
| **Maize** | Maize leaf spot | Fungal Disease (GLS) | High |
| **Maize** | Maize streak virus | Viral Disease (MSV) | Critical |
| **Tomato** | Tomato healthy | Healthy Tissue | None |
| **Tomato** | Tomato leaf blight | Early/Late Blight | Critical |
| **Tomato** | Tomato leaf curl | Viral Disease (TYLCV)| Critical |
| **Tomato** | Tomato septoria leaf spot | Fungal Disease | High |
| **Tomato** | Tomato verticulium wilt | Fungal Disease | High |
