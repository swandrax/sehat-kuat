import os
from fastapi import FastAPI
from pydantic import BaseModel
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="KlinikSehat AI Service")

# Initialize OpenRouter Client
client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

class ChatRequest(BaseModel):
    message: str
    sessionId: str
    
class MedicalTestRequest(BaseModel):
    extracted_text: str
    test_type: str

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai"}

@app.post("/ai/chat")
async def ai_chat(req: ChatRequest):
    response = await client.chat.completions.create(
        model=os.getenv("OPENROUTER_MODEL", "anthropic/claude-3.5-sonnet"),
        messages=[
            {
                "role": "system", 
                "content": "Anda adalah Asisten AI KlinikSehat. Berikan penjelasan kesehatan yang sederhana, mudah dipahami, tidak menakut-nakuti, dan selalu menyarankan untuk berkonsultasi dengan dokter untuk keputusan medis."
            },
            {"role": "user", "content": req.message}
        ]
    )
    return {"response": response.choices[0].message.content}

@app.post("/ai/lab-analysis")
async def lab_analysis(req: MedicalTestRequest):
    # This is a placeholder for Phase 14 Medical Test Analyzer (OCR -> Extraction -> AI)
    return {"response": f"Analyzing {req.test_type} test results..."}

@app.post("/ai/doctor-summary")
def doctor_summary():
    return {"response": "Doctor Summary endpoint placeholder"}
