import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.routes import prediction, metrics, model_info
from app.services.feature_extraction import FeatureExtractionService
from app.services.prediction_service import PredictionService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("agrivision_app")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Preload models and extractors on startup once."""
    logger.info("==================================================")
    logger.info("Initializing AgriVision AI Application Services...")
    logger.info("Selected Pipeline: ResNet50 + EfficientNetB0 + PCA + SVM")
    logger.info("==================================================")
    try:
        import gc
        FeatureExtractionService.get_instance()
        gc.collect()
        PredictionService.get_instance()
        gc.collect()
        logger.info("All AgriVision AI models loaded successfully and ready for inference.")
    except Exception as exc:
        logger.error(f"Error during startup model loading: {exc}")
        raise exc
    yield
    logger.info("Shutting down AgriVision AI application.")

app = FastAPI(
    title="AgriVision AI Backend API",
    description="Intelligent Crop Disease and Pest Detection Using Hybrid Deep Learning and Machine Learning",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for ReactJS frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes with prefix /api
app.include_router(prediction.router, prefix="/api", tags=["Prediction"])
app.include_router(metrics.router, prefix="/api", tags=["Model Performance & Metrics"])
app.include_router(model_info.router, prefix="/api", tags=["Model Specifications"])

def get_health_data():
    try:
        predictor = PredictionService.get_instance()
        return {
            "status": "healthy",
            "model_loaded": True,
            "pipeline": "Hybrid (ResNet50 + EfficientNetB0) + PCA (95%) + SVM",
            "svm_classes": len(predictor.svm.classes_),
            "pca_components": predictor.pca.n_components_,
            "feature_dim": predictor.svm.n_features_in_
        }
    except Exception as exc:
        return {
            "status": "degraded",
            "model_loaded": False,
            "error": str(exc)
        }

# Support both /health and /api/health
@app.get("/health", tags=["Health"])
def health_root():
    """Root health check endpoint."""
    return get_health_data()

@app.get("/api/health", tags=["Health"])
def health_api():
    """API health check endpoint."""
    return get_health_data()

# Frontend distribution directory
DEFAULT_FRONTEND_DIST = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
)
FRONTEND_DIST = os.getenv("FRONTEND_DIST", DEFAULT_FRONTEND_DIST)

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    icon_path = os.path.join(FRONTEND_DIST, "leaf.svg")
    if os.path.exists(icon_path):
        return FileResponse(icon_path, media_type="image/svg+xml")
    return Response(status_code=204)

# Mount static asset folders if frontend has been built
if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    samples_dir = os.path.join(FRONTEND_DIST, "samples")
    if os.path.exists(samples_dir):
        app.mount("/samples", StaticFiles(directory=samples_dir), name="samples")

@app.get("/", tags=["Root"])
def root():
    index_file = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {
        "message": "Welcome to AgriVision AI API",
        "docs_url": "/docs",
        "health_url": "/health",
        "api_health_url": "/api/health"
    }
