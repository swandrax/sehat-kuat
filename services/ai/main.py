import os
from fastapi import FastAPI
from pydantic import BaseModel
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException, Security, Depends
from fastapi.security.api_key import APIKeyHeader
from pydantic import BaseModel
from openai import AsyncOpenAI
import httpx

load_dotenv()

app = FastAPI(title="KlinikSehat AI Service")

# Hardening: Require API Key for internal microservice communication
API_KEY = os.getenv("INTERNAL_AI_SECRET", "default_kliniksehat_internal_secret")
api_key_header = APIKeyHeader(name="X-Internal-Token", auto_error=True)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Could not validate credentials")
    return api_key

# Initialize OpenRouter Client with Timeout
timeout = httpx.Timeout(30.0, connect=10.0)
client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    http_client=httpx.AsyncClient(timeout=timeout),
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

@app.post("/ai/chat", dependencies=[Depends(get_api_key)])
async def ai_chat(req: ChatRequest):
    try:
        response = await client.chat.completions.create(
            model=os.getenv("OPENROUTER_MODEL", "anthropic/claude-3.5-sonnet"),
            messages=[
                {
                    "role": "system", 
                    "content": (
                        "Anda adalah Asisten AI KlinikSehat. Anda BUKAN seorang dokter. "
                        "PENTING: Jangan pernah memberikan diagnosis medis definitif. "
                        "Berikan penjelasan kesehatan yang sederhana, mudah dipahami, tidak menakut-nakuti. "
                        "Selalu tambahkan disclaimer di akhir pesan bahwa saran ini bukan pengganti konsultasi dokter."
                    )
                },
                {"role": "user", "content": req.message}
            ]
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        # Fallback behavior
        print(f"AI Service Error: {str(e)}")
        raise HTTPException(status_code=503, detail="AI Service is currently unavailable. Please try again later.")

@app.post("/ai/lab-analysis", dependencies=[Depends(get_api_key)])
async def lab_analysis(req: MedicalTestRequest):
    # This is a placeholder for Phase 14 Medical Test Analyzer (OCR -> Extraction -> AI)
    return {"response": f"Analyzing {req.test_type} test results..."}

@app.post("/ai/doctor-summary", dependencies=[Depends(get_api_key)])
def doctor_summary():
    return {"response": "Doctor Summary endpoint placeholder"}
