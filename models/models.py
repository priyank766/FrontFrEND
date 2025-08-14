from pydantic import BaseModel


class LLMConfig(BaseModel):
    model_name: str = "gemini/gemini-2.5-flash"
    temperature: float = 0.7
