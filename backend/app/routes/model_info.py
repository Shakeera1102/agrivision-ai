from fastapi import APIRouter
from app.services.prediction_service import CLASS_CATALOG

router = APIRouter()

@router.get("/model-info")
def get_model_info():
    """
    Return comprehensive architectural and configuration metadata for
    the selected Hybrid ResNet50 + EfficientNetB0 + PCA + SVM pipeline.
    """
    return {
        "model_name": "AgriVision AI Hybrid Pipeline",
        "configuration": "Hybrid (ResNet50 + EfficientNetB0) + StandardScaler + PCA (95% variance) + SVM",
        "is_selected_configuration": True,
        "input_specifications": {
            "image_size": "224 x 224 pixels",
            "channels": 3,
            "color_space": "RGB",
            "normalization": "ImageNet mean/std standardization"
        },
        "stages": [
            {
                "stage": 1,
                "name": "ResNet50 Feature Extraction",
                "description": "50-layer deep residual network with skip connections extracting rich semantic visual patterns.",
                "output_dimensions": 2048,
                "pooling": "Global Average Pooling"
            },
            {
                "stage": 2,
                "name": "EfficientNetB0 Feature Extraction",
                "description": "Compound scaled convolutional neural network extracting fine-grained edge, texture, and multi-scale visual features.",
                "output_dimensions": 1280,
                "pooling": "Global Average Pooling"
            },
            {
                "stage": 3,
                "name": "Hybrid Feature Concatenation",
                "description": "Horizontally concatenates ResNet50 and EfficientNetB0 feature vectors to form a complementary unified representation.",
                "formula": "2048 + 1280 = 3328",
                "output_dimensions": 3328
            },
            {
                "stage": 4,
                "name": "StandardScaler Feature Normalization",
                "description": "Scales concatenated features to zero mean and unit variance based on training data statistics.",
                "output_dimensions": 3328
            },
            {
                "stage": 5,
                "name": "Principal Component Analysis (PCA)",
                "description": "Linear dimensionality reduction retaining 95% of cumulative explained variance, eliminating multicollinearity and reducing noise.",
                "variance_retained": "95.0%",
                "output_dimensions": 1649,
                "dimensionality_reduction_ratio": "50.45%"
            },
            {
                "stage": 6,
                "name": "Support Vector Machine (SVM) Classification",
                "description": "Non-linear hyperplane classification using Radial Basis Function (RBF) kernel mapping 1649-dimensional vectors to 22 crop disease/pest classes.",
                "kernel": "RBF (Radial Basis Function)",
                "penalty_parameter_C": 10.0,
                "gamma": "scale",
                "classes_count": 22
            }
        ],
        "supported_crops": ["Cashew", "Cassava", "Maize", "Tomato"],
        "total_classes": len(CLASS_CATALOG),
        "classes": [c["class_name"] for c in CLASS_CATALOG]
    }
