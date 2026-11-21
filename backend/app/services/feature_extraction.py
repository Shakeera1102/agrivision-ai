import os
import logging
import numpy as np

# Set local KERAS_HOME inside workspace so pretrained weights load offline with zero network requests
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ["KERAS_HOME"] = os.path.join(BASE_DIR, "model", "keras_weights")
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_NUM_INTEROP_THREADS"] = "1"
os.environ["TF_NUM_INTRAOP_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"

import gc
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input as resnet_preprocess
from tensorflow.keras.applications import EfficientNetB0

logger = logging.getLogger(__name__)

class FeatureExtractionService:
    _instance = None

    def __init__(self):
        logger.info("Initializing FeatureExtractionService with TensorFlow Keras (ResNet50 + EfficientNetB0)...")

        # 1. ResNet50: weights='imagenet', include_top=False, pooling='avg' -> 2048 dims
        self.resnet50 = ResNet50(
            weights="imagenet",
            include_top=False,
            pooling="avg",
            input_shape=(224, 224, 3)
        )
        self.resnet50.trainable = False

        # 2. EfficientNetB0: weights='imagenet', include_top=False, pooling='avg' -> 1280 dims
        self.efficientnet = EfficientNetB0(
            weights="imagenet",
            include_top=False,
            pooling="avg",
            input_shape=(224, 224, 3)
        )
        self.efficientnet.trainable = False

        gc.collect()
        logger.info("TensorFlow ResNet50 (2048-dim) and EfficientNetB0 (1280-dim) loaded successfully.")

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = FeatureExtractionService()
        return cls._instance

    def extract_features(self, pil_image) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Extract features exactly following the research notebook:
        - ResNet50: RGB -> resized 224x224 -> resnet_preprocess (BGR + ImageNet mean subtraction) -> predict -> (1, 2048)
        - EfficientNetB0: RGB -> resized 224x224 -> raw float32 [0, 255] -> predict -> (1, 1280)
        - Concatenation: [ResNet50, EfficientNetB0] -> (1, 3328)
        """
        # Resize to 224x224
        img = pil_image.resize((224, 224))
        img_array = np.asarray(img, dtype=np.float32)

        # 1. ResNet50 extraction
        resnet_input = np.expand_dims(img_array.copy(), axis=0)
        resnet_input = resnet_preprocess(resnet_input)
        f_resnet = self.resnet50.predict(resnet_input, verbose=0).astype(np.float32)

        # 2. EfficientNetB0 extraction (expects raw [0, 255] array)
        eff_input = np.expand_dims(img_array.copy(), axis=0)
        f_eff = self.efficientnet.predict(eff_input, verbose=0).astype(np.float32)

        # 3. Hybrid concatenation: 2048 + 1280 = 3328
        hybrid_features = np.concatenate([f_resnet, f_eff], axis=1)

        return f_resnet, f_eff, hybrid_features
