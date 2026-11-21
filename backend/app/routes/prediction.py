from fastapi import APIRouter, UploadFile, File, HTTPException
import logging
from app.utils.image_preprocessing import validate_image_file, load_and_preprocess_image
from app.services.feature_extraction import FeatureExtractionService
from app.services.prediction_service import PredictionService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/predict")
async def predict_crop_disease(file: UploadFile = File(...)):
    """
    Accept an uploaded crop leaf image, extract hybrid ResNet50 + EfficientNetB0 features,
    apply StandardScaler and PCA (95% variance -> 1649 features), and classify with the
    trained SVM model.
    """
    try:
        content = await file.read()
        validate_image_file(file, content)

        # 1. Preprocess image to PIL RGB Image
        pil_image = load_and_preprocess_image(content)

        # 2. Extract deep visual features via Keras ResNet50 (2048) + EfficientNetB0 (1280)
        feature_extractor = FeatureExtractionService.get_instance()
        _, _, hybrid_features = feature_extractor.extract_features(pil_image)

        # 3. Predict via Scaler + PCA + SVM pipeline
        predictor = PredictionService.get_instance()
        result = predictor.predict(hybrid_features, filename=file.filename or "uploaded_image.jpg")

        return result

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Prediction failed with error: %s", exc)
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(exc)}")
