from dotenv import load_dotenv
import os
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_recommendation(predicted_score, performance_level):
    prompt = f"""
A student scored {predicted_score:.2f} marks.

Performance Level: {performance_level}

Respond exactly in this format:

Motivation:
<one motivational sentence>

Study Tips:
• Tip 1
• Tip 2
• Tip 3

Daily Habit:
<one daily habit>

Keep the response under 120 words.
Do not add any extra headings or explanations.
"""

    response = client.chat.completions.c
    +reate(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content