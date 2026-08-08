from fastapi import APIRouter
from model_loader import model
from schemas import StudentData
from utils import preprocess_input
from groq_ai import generate_recommendation
router = APIRouter()


@router.post("/predict")
def predict(data: StudentData):

    # Convert request to dictionary
    input_data = data.model_dump()

    # Preprocess input
    processed_data = preprocess_input(input_data)

    # Predict
    prediction = model.predict(processed_data)[0]

    # Grade
    if prediction >= 90:
        grade = "A+"
        level = "Excellent"
    elif prediction >= 80:
        grade = "A"
        level = "Very Good"
    elif prediction >= 70:
        grade = "B"
        level = "Good"
    elif prediction >= 60:
        grade = "C"
        level = "Average"
    else:
        grade = "D"
        level = "Needs Improvement"

    recommendation = generate_recommendation(
        prediction,
        level
    )  

    print("Recommendation:", recommendation)  

    return {
    "predicted_score": float(round(prediction, 2)),
    "grade": str(grade),
    "pass": bool(prediction >= 35),
    "performance_level": str(level),
    "recommendation": recommendation
}