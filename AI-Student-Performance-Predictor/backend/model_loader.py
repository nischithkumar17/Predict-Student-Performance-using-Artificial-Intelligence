import os
import joblib

# Get absolute path to model folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")

# Load trained model
model = joblib.load(os.path.join(MODEL_DIR, "student_model.pkl"))

# Load feature column names
feature_columns = joblib.load(
    os.path.join(MODEL_DIR, "feature_columns.pkl")
)
