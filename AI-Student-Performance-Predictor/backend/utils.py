import pandas as pd
from model_loader import feature_columns

def preprocess_input(data: dict):
    """
    Convert user input into the same format used during training.
    """

    df = pd.DataFrame([data])

    # One-hot encode categorical variables
    df = pd.get_dummies(df)

    # Add any missing columns
    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0

    # Ensure correct column order
    df = df[feature_columns]

    return df