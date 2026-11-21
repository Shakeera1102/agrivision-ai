import os
import time
import logging
import joblib
import numpy as np

logger = logging.getLogger(__name__)

# Base directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SVM_MODEL_PATH = os.path.join(BASE_DIR, "model", "svm_model", "SVM_Hybrid_Res_Eff_PCA.joblib")
SCALER_PATH = os.path.join(BASE_DIR, "model", "preprocessing_artifacts", "Hybrid_Res_Eff_scaler.joblib")
PCA_PATH = os.path.join(BASE_DIR, "model", "preprocessing_artifacts", "Hybrid_Res_Eff_PCA_95.joblib")

# 22-class catalog according to notebook Sections 07, 08, 40
CLASS_CATALOG = [
    {
        "index": 0,
        "class_name": "Cashew anthracnose",
        "crop": "Cashew",
        "condition_type": "Fungal Disease",
        "disease_name": "Anthracnose",
        "severity": "High",
        "symptoms": "Dark, sunken necrotic lesions on leaves, young shoots, and nuts. Premature leaf drop and dieback.",
        "treatment": "Prune infected twigs; apply copper-based fungicides or azoxystrobin before flowering and nut development."
    },
    {
        "index": 1,
        "class_name": "Cashew gumosis",
        "crop": "Cashew",
        "condition_type": "Fungal/Bacterial Disease",
        "disease_name": "Gummosis",
        "severity": "Moderate to High",
        "symptoms": "Amber-colored resin/gum exudation on trunk and branches, cracking bark, wilting canopy.",
        "treatment": "Scrape affected bark and apply Bordeaux paste or copper oxychloride; improve orchard drainage."
    },
    {
        "index": 2,
        "class_name": "Cashew healthy",
        "crop": "Cashew",
        "condition_type": "Healthy",
        "disease_name": "Healthy Plant Tissue",
        "severity": "None",
        "symptoms": "Vibrant green, uniform leaf lamina without lesions, blotches, or pest chewing damage.",
        "treatment": "Maintain regular agronomic management, balanced NPK fertilization, and preventive monitoring."
    },
    {
        "index": 3,
        "class_name": "Cashew leaf miner",
        "crop": "Cashew",
        "condition_type": "Pest Infestation",
        "disease_name": "Leaf Miner (Acrocercops syngramma)",
        "severity": "Moderate",
        "symptoms": "Serpentine translucent silvery mines or blisters on fresh flushes, causing curling and crinkling.",
        "treatment": "Spray neem oil (azadirachtin) or lambda-cyhalothrin at new flush emergence; preserve natural parasitic wasps."
    },
    {
        "index": 4,
        "class_name": "Cashew red rust",
        "crop": "Cashew",
        "condition_type": "Algal Disease",
        "disease_name": "Red Rust (Cephaleuros virescens)",
        "severity": "Low to Moderate",
        "symptoms": "Velvety reddish-brown or rusty circular spots on upper leaf surfaces, reduced photosynthetic area.",
        "treatment": "Spray copper oxychloride (0.2%); thin crowded canopies to increase sunlight penetration and air circulation."
    },
    {
        "index": 5,
        "class_name": "Cassava bacterial blight",
        "crop": "Cassava",
        "condition_type": "Bacterial Disease",
        "disease_name": "Bacterial Blight (Xanthomonas axonopodis)",
        "severity": "High",
        "symptoms": "Angular water-soaked leaf spots, gum exudation on petioles, systemic wilting and 'candle-flame' tip dieback.",
        "treatment": "Use disease-free stem cuttings; rogue infected plants; sterilize farm tools; plant resistant varieties."
    },
    {
        "index": 6,
        "class_name": "Cassava brown spot",
        "crop": "Cassava",
        "condition_type": "Fungal Disease",
        "disease_name": "Brown Leaf Spot (Passalora henningsii)",
        "severity": "Moderate",
        "symptoms": "Circular to angular brown spots with dark purplish-brown borders, yellow halos, and defoliation of lower canopy.",
        "treatment": "Ensure adequate plant spacing; apply mancozeb or benomyl if severe; crop rotation."
    },
    {
        "index": 7,
        "class_name": "Cassava green mite",
        "crop": "Cassava",
        "condition_type": "Pest Infestation",
        "disease_name": "Green Mite (Mononychellus tanajoa)",
        "severity": "High",
        "symptoms": "Yellow speckling/chlorosis on young leaves, stunted terminal shoots, 'candle-stick' shoot appearance in dry seasons.",
        "treatment": "Introduce predatory phytoseiid mites (Typhlodromalus aripo); spray wettable sulfur or acaricides in acute outbreaks."
    },
    {
        "index": 8,
        "class_name": "Cassava healthy",
        "crop": "Cassava",
        "condition_type": "Healthy",
        "disease_name": "Healthy Plant Tissue",
        "severity": "None",
        "symptoms": "Deep green palmate foliage with smooth margins, sturdy stems, and robust vigor.",
        "treatment": "Continue balanced soil nutrient supply, weed control, and sanitary farm hygiene."
    },
    {
        "index": 9,
        "class_name": "Cassava mosaic",
        "crop": "Cassava",
        "condition_type": "Viral Disease",
        "disease_name": "Cassava Mosaic Disease (CMD)",
        "severity": "Critical",
        "symptoms": "Severe leaf distortion, asymmetric curling, mottled yellow-green mosaics, severe root yield reduction.",
        "treatment": "Plant certified CMD-resistant cuttings; manage whitefly (Bemisia tabaci) vectors using yellow sticky traps."
    },
    {
        "index": 10,
        "class_name": "Maize fall armyworm",
        "crop": "Maize",
        "condition_type": "Pest Infestation",
        "disease_name": "Fall Armyworm (Spodoptera frugiperda)",
        "severity": "Critical",
        "symptoms": "Ragged shot-hole feeding damage in the whorl, sawdust-like larval frass accumulation, destroyed tassels and ears.",
        "treatment": "Apply Bacillus thuringiensis (Bt), spinosad, or emamectin benzoate directly into the whorl; intercrop with Desmodium."
    },
    {
        "index": 11,
        "class_name": "Maize grasshoper",
        "crop": "Maize",
        "condition_type": "Pest Infestation",
        "disease_name": "Grasshopper Defoliation",
        "severity": "Moderate",
        "symptoms": "Irregular chewed leaf margins, skeletonized foliage, stripped leaf blades leaving only midribs.",
        "treatment": "Deploy perimeter biopesticide barriers (Metarhizium acridum); handpick in smallholder plots or apply pyrethroids."
    },
    {
        "index": 12,
        "class_name": "Maize healthy",
        "crop": "Maize",
        "condition_type": "Healthy",
        "disease_name": "Healthy Plant Tissue",
        "severity": "None",
        "symptoms": "Erect, broad linear green leaf blades with clear veins and strong stalk development.",
        "treatment": "Maintain optimal nitrogen top-dressing, timely weeding, and soil moisture management."
    },
    {
        "index": 13,
        "class_name": "Maize leaf beetle",
        "crop": "Maize",
        "condition_type": "Pest Infestation",
        "disease_name": "Leaf Beetle (Chrysomelidae)",
        "severity": "Moderate",
        "symptoms": "Windowpaning and longitudinal strip feeding on upper foliage, weakened seedlings.",
        "treatment": "Spray contact insecticides or azadirachtin; encourage beneficial predatory ground beetles."
    },
    {
        "index": 14,
        "class_name": "Maize leaf blight",
        "crop": "Maize",
        "condition_type": "Fungal Disease",
        "disease_name": "Northern Corn Leaf Blight (Exserohilum turcicum)",
        "severity": "High",
        "symptoms": "Long, elliptical, cigar-shaped grayish-green to tan lesions on lower leaves progressing upwards.",
        "treatment": "Use blight-resistant hybrid cultivars; apply azoxystrobin or propiconazole at silking if threshold exceeded."
    },
    {
        "index": 15,
        "class_name": "Maize leaf spot",
        "crop": "Maize",
        "condition_type": "Fungal Disease",
        "disease_name": "Gray Leaf Spot (Cercospora zeae-maydis)",
        "severity": "High",
        "symptoms": "Small rectangular tan lesions delimited by leaf veins, coalescing to cause extensive foliar blighting.",
        "treatment": "Adopt minimum 1-year crop rotation with non-host crops; deep-till residues; apply triazole fungicides."
    },
    {
        "index": 16,
        "class_name": "Maize streak virus",
        "crop": "Maize",
        "condition_type": "Viral Disease",
        "disease_name": "Maize Streak Virus (MSV)",
        "severity": "Critical",
        "symptoms": "Narrow, chlorotic yellow-white broken streaks along veins, stunting, malformed small cobs.",
        "treatment": "Plant streak-resistant seed; manage leafhopper (Cicadulina spp.) vectors with imidacloprid seed treatment."
    },
    {
        "index": 17,
        "class_name": "Tomato healthy",
        "crop": "Tomato",
        "condition_type": "Healthy",
        "disease_name": "Healthy Plant Tissue",
        "severity": "None",
        "symptoms": "Vibrant emerald compound leaves, robust stems, no spotting or curling.",
        "treatment": "Provide steady drip irrigation, trellising, balanced calcium and potassium fertilization."
    },
    {
        "index": 18,
        "class_name": "Tomato leaf blight",
        "crop": "Tomato",
        "condition_type": "Fungal/Oomycete Disease",
        "disease_name": "Early/Late Blight (Phytophthora/Alternaria)",
        "severity": "Critical",
        "symptoms": "Large, irregular dark water-soaked greasy patches turning brown/black with pale halos, rapid foliar collapse.",
        "treatment": "Spray chlorothalonil, mancozeb, or metalaxyl; avoid overhead irrigation; destroy infected crop debris."
    },
    {
        "index": 19,
        "class_name": "Tomato leaf curl",
        "crop": "Tomato",
        "condition_type": "Viral Disease",
        "disease_name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "severity": "Critical",
        "symptoms": "Upward curling and cupping of leaflets, marked yellowing/chlorosis along margins, bushy stunted habit.",
        "treatment": "Install 50-mesh insect-proof netting; spray insecticidal soap for whitefly vector suppression; rogue diseased plants."
    },
    {
        "index": 20,
        "class_name": "Tomato septoria leaf spot",
        "crop": "Tomato",
        "condition_type": "Fungal Disease",
        "disease_name": "Septoria Leaf Spot (Septoria lycopersici)",
        "severity": "High",
        "symptoms": "Numerous circular spots (1-3mm) with light gray centers, dark brown borders, and tiny black fruiting pycnidia.",
        "treatment": "Mulch soil surface to prevent soil splash; remove bottom 12 inches of foliage; spray copper or chlorothalonil."
    },
    {
        "index": 21,
        "class_name": "Tomato verticulium wilt",
        "crop": "Tomato",
        "condition_type": "Fungal Disease",
        "disease_name": "Verticillium Wilt (Verticillium dahliae)",
        "severity": "High",
        "symptoms": "V-shaped yellow lesions broadening toward leaf margins, one-sided wilting, brown discoloration of stem vascular ring.",
        "treatment": "Plant resistant (V-gene) varieties; perform soil solarization; maintain 4-year rotation with non-solanaceous crops."
    }
]

CLASS_NAME_MAP = {c["index"]: c for c in CLASS_CATALOG}

class PredictionService:
    _instance = None

    def __init__(self):
        logger.info("Initializing PredictionService and loading trained models...")

        if not os.path.exists(SVM_MODEL_PATH):
            raise FileNotFoundError(f"Trained SVM model not found at: {SVM_MODEL_PATH}")
        if not os.path.exists(SCALER_PATH):
            raise FileNotFoundError(f"StandardScaler artifact not found at: {SCALER_PATH}")
        if not os.path.exists(PCA_PATH):
            raise FileNotFoundError(f"PCA artifact not found at: {PCA_PATH}")

        # Load models once
        self.svm = joblib.load(SVM_MODEL_PATH)
        self.scaler = joblib.load(SCALER_PATH)
        self.pca = joblib.load(PCA_PATH)

        logger.info(
            f"Loaded SVM (classes: {len(self.svm.classes_)}, expected features: {self.svm.n_features_in_})"
        )
        logger.info(
            f"Loaded PCA (components: {self.pca.n_components_}, variance: 95%)"
        )
        logger.info("PredictionService initialized successfully.")

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = PredictionService()
        return cls._instance

    def predict(self, hybrid_features: np.ndarray, filename: str = "") -> dict:
        """
        Execute prediction pipeline:
        3328 hybrid features -> StandardScaler -> PCA (1649 features) -> SVM.
        """
        start_time = time.perf_counter()

        # Step 1: Standard scaling
        scaled_features = self.scaler.transform(hybrid_features)

        # Step 2: PCA transformation (retaining 95% variance -> 1649 features)
        pca_features = self.pca.transform(scaled_features)

        # Confirm dimensions
        original_dim = hybrid_features.shape[1]
        reduced_dim = pca_features.shape[1]

        if reduced_dim != 1649:
            logger.warning(f"PCA output dimension is {reduced_dim}, expected 1649.")

        # Step 3: SVM inference
        pred_label_index = int(self.svm.predict(pca_features)[0])

        elapsed_seconds = time.perf_counter() - start_time
        processing_time_ms = round(elapsed_seconds * 1000, 2)

        # Step 4: Map to class details
        class_info = CLASS_NAME_MAP.get(pred_label_index, {
            "index": pred_label_index,
            "class_name": f"Class {pred_label_index}",
            "crop": "Unknown",
            "condition_type": "Unknown",
            "disease_name": f"Class {pred_label_index}",
            "severity": "Unknown",
            "symptoms": "N/A",
            "treatment": "N/A"
        })

        return {
            "status": "success",
            "filename": filename,
            "prediction": {
                "class_index": pred_label_index,
                "class_name": class_info["class_name"],
                "crop": class_info["crop"],
                "condition_type": class_info["condition_type"],
                "disease_name": class_info["disease_name"],
                "severity": class_info["severity"],
                "symptoms": class_info["symptoms"],
                "treatment": class_info["treatment"]
            },
            "pipeline": {
                "model_name": "Hybrid (ResNet50 + EfficientNetB0) + PCA (95%) + SVM",
                "classifier": "Support Vector Machine (SVC, RBF Kernel)",
                "feature_extractors": ["ResNet50 (2048 dims)", "EfficientNetB0 (1280 dims)"],
                "original_dimensions": original_dim,
                "reduced_dimensions": reduced_dim,
                "pca_variance_retained": "95.0%",
                "processing_time_ms": processing_time_ms,
                "processing_time_seconds": round(elapsed_seconds, 4)
            }
        }
