from pydantic import BaseModel
# "http://localhost:11434"


class LLMConfig(BaseModel):
    model_name: str = "gemini/gemini-2.5-pro"
    temperature: float = 0.7
    base_url: str = None
