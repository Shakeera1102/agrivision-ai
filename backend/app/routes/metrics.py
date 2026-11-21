from fastapi import APIRouter
from app.services.prediction_service import CLASS_CATALOG

router = APIRouter()

@router.get("/model-metrics")
def get_model_metrics():
    """
    Return the verified evaluation metrics for the selected
    Hybrid (ResNet50 + EfficientNetB0) + PCA + SVM model.
    """
    return {
        "model": {
            "name": "Hybrid (ResNet50 + EfficientNetB0) + PCA + SVM",
            "accuracy": 91.21,
            "precision": 90.66,
            "recall": 89.81,
            "f1_score": 90.12,
            "feature_dimensions": 3328,
            "reduced_dimensions": 1649,
            "pca_variance": "95.0%"
        },
        "crops": ["Cashew", "Cassava", "Maize", "Tomato"],
        "total_classes": len(CLASS_CATALOG),
        "classes": CLASS_CATALOG
    }
