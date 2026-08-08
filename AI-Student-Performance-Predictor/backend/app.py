from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from predict import router

from groq_ai import generate_recommendation 
app = FastAPI(title="AI Student Performance Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
def home():
    return {
        "message": "AI Student Performance Predictor API is Running"
    }